#!/usr/bin/env python3
"""
DaCowboy Fitness - Journal Ingestion & Publishing CLI

Parses Markdown journal entries with YAML frontmatter & custom block directives (:::video, :::image),
computes Jaccard tag-overlap recommendations or resolves frontmatter links,
and uploads structured blocks & denormalized recommendations directly to Cloud Firestore.
"""

import os
import re
import sys
import glob
import json
import argparse
from datetime import datetime

try:
    import frontmatter
except ImportError:
    try:
        import yaml

        class SimplePost:
            def __init__(self, content, metadata):
                self.content = content
                self.metadata = metadata

        class SimpleFrontmatter:
            @staticmethod
            def load(f):
                raw = f.read() if hasattr(f, 'read') else str(f)
                if raw.startswith("---"):
                    parts = raw.split("---", 2)
                    if len(parts) >= 3:
                        meta = yaml.safe_load(parts[1]) or {}
                        content = parts[2]
                        return SimplePost(content, meta)
                return SimplePost(raw, {})

        frontmatter = SimpleFrontmatter
    except ImportError:
        class BasicPost:
            def __init__(self, content, metadata):
                self.content = content
                self.metadata = metadata

        class BasicFrontmatter:
            @staticmethod
            def load(f):
                raw = f.read() if hasattr(f, 'read') else str(f)
                meta = {}
                content = raw
                if raw.startswith("---"):
                    parts = raw.split("---", 2)
                    if len(parts) >= 3:
                        current_list_key = None
                        for line in parts[1].splitlines():
                            stripped = line.strip()
                            if not stripped or stripped.startswith("#"):
                                continue
                            if stripped.startswith("- ") and current_list_key:
                                item = stripped[2:].strip().strip("'\"")
                                meta[current_list_key].append(item)
                            elif ":" in stripped:
                                k, v = stripped.split(":", 1)
                                k = k.strip()
                                v = v.strip().strip("'\"")
                                if v == "" or v is None:
                                    meta[k] = []
                                    current_list_key = k
                                else:
                                    meta[k] = v
                                    current_list_key = None
                        content = parts[2]
                return BasicPost(content, meta)

        frontmatter = BasicFrontmatter

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except ImportError:
    firebase_admin = None
    firestore = None


def normalize_slug(title_or_slug: str) -> str:
    """Generate a clean URL-friendly slug."""
    s = title_or_slug.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')


def calculate_read_time(text: str, wpm: int = 200) -> int:
    """Estimate read time in minutes based on word count."""
    words = len(re.findall(r'\w+', text))
    minutes = max(1, round(words / wpm))
    return minutes


def parse_blocks(raw_content: str) -> list:
    """
    Splits markdown content around custom block directives (:::video and :::image)
    into an ordered list of typed blocks.
    """
    pattern = r'(:::(video|image)\s+([^\n]+)\n(.*?):::)'
    blocks = []
    last_idx = 0
    block_counter = 1

    for match in re.finditer(pattern, raw_content, re.DOTALL):
        # 1. Capture text preceding this directive
        text_before = raw_content[last_idx:match.start()].strip()
        if text_before:
            blocks.append({
                "id": f"block_{block_counter}",
                "type": "markdown",
                "content": text_before
            })
            block_counter += 1

        # 2. Parse directive parameters
        block_type = match.group(2)  # 'video' or 'image'
        src_url = match.group(3).strip()
        metadata_lines = match.group(4).strip()

        block = {
            "id": f"block_{block_counter}",
            "type": block_type,
            "src": src_url
        }

        if block_type == "video":
            block["provider"] = "youtube" if ("youtube.com" in src_url or "youtu.be" in src_url) else "html5"
            block["aspectRatio"] = "16/9"

        # Parse key-value metadata within directive (e.g. Caption: ..., Alt: ...)
        for line in metadata_lines.splitlines():
            line = line.strip()
            if not line or ":" not in line:
                continue
            key, val = line.split(":", 1)
            key = key.strip().lower()
            val = val.strip()
            if key == "caption":
                block["caption"] = val
            elif key == "alt":
                block["alt"] = val
            elif key == "aspectratio" or key == "aspect_ratio":
                block["aspectRatio"] = val
            elif key == "provider":
                block["provider"] = val

        blocks.append(block)
        block_counter += 1
        last_idx = match.end()

    # 3. Capture any trailing markdown text
    trailing_text = raw_content[last_idx:].strip()
    if trailing_text:
        blocks.append({
            "id": f"block_{block_counter}",
            "type": "markdown",
            "content": trailing_text
        })

    return blocks


def get_existing_journals_index(db) -> dict:
    """Fetch lightweight metadata index from Firestore (saving read quotas)."""
    if not db:
        return {}
    try:
        docs = db.collection("journals").select([
            "slug", "title", "tags", "excerpt", "readTimeMinutes", "date", "coverImage"
        ]).stream()
        index = {}
        for d in docs:
            data = d.to_dict() or {}
            slug = data.get("slug") or d.id
            index[slug] = {
                "id": d.id,
                "slug": slug,
                "title": data.get("title", slug),
                "tags": [t.lower() for t in data.get("tags", [])],
                "excerpt": data.get("excerpt", ""),
                "readTimeMinutes": data.get("readTimeMinutes", 3),
                "date": str(data.get("date", "")),
                "coverImage": data.get("coverImage")
            }
        return index
    except Exception as e:
        print(f"  [Warning] Could not fetch existing journals index from Firestore: {e}")
        return {}


def calculate_jaccard_similarity(tags1: list, tags2: list) -> float:
    """Compute Jaccard similarity between two tag lists."""
    s1 = set(t.lower() for t in tags1)
    s2 = set(t.lower() for t in tags2)
    if not s1 or not s2:
        return 0.0
    intersection = len(s1.intersection(s2))
    union = len(s1.union(s2))
    return intersection / union if union > 0 else 0.0


def resolve_recommendations(
    current_slug: str,
    current_tags: list,
    explicit_related_slugs: list,
    existing_index: dict,
    interactive: bool = False,
    max_recommendations: int = 3
) -> list:
    """
    3-tier recommendation resolver:
    1. Explicit frontmatter links
    2. Tag-similarity overlap ranking
    3. Interactive CLI picker if requested
    """
    resolved = []
    seen_slugs = {current_slug}

    # 1. Add explicit links from frontmatter
    for r_slug in explicit_related_slugs:
        clean_r_slug = normalize_slug(r_slug)
        if clean_r_slug in existing_index and clean_r_slug not in seen_slugs:
            item = existing_index[clean_r_slug]
            resolved.append({
                "id": item["id"],
                "slug": item["slug"],
                "title": item["title"],
                "excerpt": item["excerpt"],
                "tags": item["tags"],
                "readTimeMinutes": item["readTimeMinutes"]
            })
            seen_slugs.add(clean_r_slug)

    # 2. Interactive prompt if enabled
    if interactive and existing_index:
        available_keys = [k for k in existing_index.keys() if k not in seen_slugs]
        if available_keys:
            print("\n  --- Select Related Journals ---")
            for i, k in enumerate(available_keys):
                info = existing_index[k]
                print(f"  [{i + 1}] {info['title']} ({info['slug']}) - Tags: {info['tags']}")
            user_input = input(f"\n  Select up to {max_recommendations - len(resolved)} numbers (space-separated) or Enter to auto-pick: ").strip()
            if user_input:
                for idx_str in user_input.split():
                    if idx_str.isdigit():
                        idx = int(idx_str) - 1
                        if 0 <= idx < len(available_keys):
                            sel_slug = available_keys[idx]
                            if sel_slug not in seen_slugs:
                                item = existing_index[sel_slug]
                                resolved.append({
                                    "id": item["id"],
                                    "slug": item["slug"],
                                    "title": item["title"],
                                    "excerpt": item["excerpt"],
                                    "tags": item["tags"],
                                    "readTimeMinutes": item["readTimeMinutes"]
                                })
                                seen_slugs.add(sel_slug)

    # 3. Tag-overlap auto matching to fill remaining slots
    if len(resolved) < max_recommendations and existing_index:
        candidates = []
        for k, item in existing_index.items():
            if k not in seen_slugs:
                score = calculate_jaccard_similarity(current_tags, item["tags"])
                candidates.append((score, item))

        candidates.sort(key=lambda x: x[0], reverse=True)
        for _, item in candidates:
            if len(resolved) >= max_recommendations:
                break
            resolved.append({
                "id": item["id"],
                "slug": item["slug"],
                "title": item["title"],
                "excerpt": item["excerpt"],
                "tags": item["tags"],
                "readTimeMinutes": item["readTimeMinutes"]
            })
            seen_slugs.add(item["slug"])

    return resolved


def process_journal_file(filepath: str, db=None, dry_run: bool = False, interactive: bool = False):
    """Parses a single markdown file and uploads to Firestore."""
    if not os.path.exists(filepath):
        print(f"[Error] File not found: {filepath}")
        return False

    if frontmatter is None:
        print("[Error] 'python-frontmatter' package is required. Run: pip install python-frontmatter")
        sys.exit(1)

    with open(filepath, "r", encoding="utf-8") as f:
        post = frontmatter.load(f)

    title = post.metadata.get("title", "Untitled Journal Entry")
    slug = post.metadata.get("slug") or normalize_slug(title)
    author = post.metadata.get("author", "Kishore Kaushal")
    date_val = post.metadata.get("date")
    if hasattr(date_val, "isoformat"):
        date_str = date_val.isoformat()
    elif date_val:
        date_str = str(date_val)
    else:
        date_str = datetime.utcnow().strftime("%Y-%m-%d")

    tags = post.metadata.get("tags", ["journal"])
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",")]

    excerpt = post.metadata.get("excerpt", "")
    explicit_related = post.metadata.get("related", [])
    if isinstance(explicit_related, str):
        explicit_related = [r.strip() for r in explicit_related.split(",")]

    cover_image = post.metadata.get("coverImage") or post.metadata.get("cover_image")

    # Parse ordered content blocks
    blocks = parse_blocks(post.content)

    # Calculate read time
    all_text = " ".join([b.get("content", "") for b in blocks if b.get("type") == "markdown"])
    read_time = calculate_read_time(all_text)

    # If excerpt is empty, generate preview from first markdown block
    if not excerpt and all_text:
        excerpt = (all_text[:160] + "...") if len(all_text) > 160 else all_text

    print(f"\n=======================================================")
    print(f" Processing: {os.path.basename(filepath)}")
    print(f" Title:       {title}")
    print(f" Slug:        {slug}")
    print(f" Tags:        {tags}")
    print(f" Read Time:   ~{read_time} min")
    print(f" Blocks:      {len(blocks)} blocks ({[b['type'] for b in blocks]})")

    # Fetch index and resolve recommendations
    existing_index = {}
    if not dry_run and db:
        existing_index = get_existing_journals_index(db)

    related_journals = resolve_recommendations(
        current_slug=slug,
        current_tags=tags,
        explicit_related_slugs=explicit_related,
        existing_index=existing_index,
        interactive=interactive
    )

    doc_payload = {
        "id": slug,
        "slug": slug,
        "title": title,
        "author": author,
        "date": date_str,
        "createdAt": date_str,
        "updatedAt": datetime.utcnow().isoformat() + "Z",
        "published": post.metadata.get("published", True),
        "tags": tags,
        "excerpt": excerpt,
        "readTimeMinutes": read_time,
        "blocks": blocks,
        "relatedJournals": related_journals
    }

    if cover_image:
        doc_payload["coverImage"] = cover_image

    if dry_run:
        print("\n--- [DRY RUN PAYLOAD] ---")
        print(json.dumps(doc_payload, indent=2))
        print("--- [END DRY RUN] ---\n")
        return True

    if not db:
        print("[Error] Firestore client is not initialized. Provide valid serviceAccountKey.json or run with --dry-run.")
        return False

    # Upload document to Firestore
    try:
        doc_ref = db.collection("journals").document(slug)
        doc_ref.set(doc_payload)
        print(f" Successfully published to Firestore: /journals/{slug}")
        if related_journals:
            print(f" Linked {len(related_journals)} recommendations: {[r['title'] for r in related_journals]}")
        return True
    except Exception as e:
        print(f"[Error] Failed to write to Firestore: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(description="DaCowboy Fitness Journal Ingestion & Publishing CLI")
    parser.add_argument("--file", "-f", help="Path to a single markdown journal file")
    parser.add_argument("--dir", "-d", help="Directory containing markdown journal files to bulk upload")
    parser.add_argument("--dry-run", action="store_true", help="Parse and validate without uploading to Firestore")
    parser.add_argument("--interactive", "-i", action="store_true", help="Interactively select related journals")
    parser.add_argument("--env", "-e", choices=["staging", "production"], default="staging", help="Target Firebase environment (default: staging)")
    parser.add_argument("--service-account", "-s", default="", help="Explicit path to Firebase service account JSON key")

    args = parser.parse_args()

    if not args.file and not args.dir:
        parser.print_help()
        sys.exit(1)

    db = None
    if not args.dry_run:
        if firebase_admin is None:
            print("[Warning] 'firebase-admin' is not installed. Defaulting to --dry-run mode.")
            args.dry_run = True
        else:
            sa_path = args.service_account
            target_env = args.env
            expected_keyword = "stage" if target_env == "staging" else "website"

            candidate_paths = []
            if sa_path and os.path.exists(sa_path):
                candidate_paths.append(sa_path)
            else:
                candidate_paths += [
                    os.path.join(".secrets", f"serviceAccountKey.{target_env}.json"),
                    os.path.join(".secrets", f"serviceAccountKey.{target_env}"),
                    os.path.join(".secrets", f"dacowboyfitness-{target_env}.json"),
                ]
                all_json = glob.glob(".secrets/*.json") + glob.glob("*.json") + glob.glob(os.path.join(os.path.dirname(__file__), "..", ".secrets", "*.json"))
                candidate_paths += [p for p in all_json if not p.endswith(("package.json", "tsconfig.json", "firebase.json", "package-lock.json", "skills-lock.json"))]

            selected_key_path = None
            selected_project_id = None

            for p in candidate_paths:
                if os.path.exists(p) and not p.endswith(".js"):
                    try:
                        with open(p, "r", encoding="utf-8") as key_file:
                            key_data = json.load(key_file)
                            pid = key_data.get("project_id", "")
                            if (target_env == "staging" and ("stage" in pid.lower() or "staging" in p.lower())) or \
                               (target_env == "production" and ("website" in pid.lower() or "prod" in pid.lower() or "prod" in p.lower())):
                                selected_key_path = p
                                selected_project_id = pid
                                break
                    except Exception:
                        continue

            if not selected_key_path:
                print(f"\n[Warning] No valid Firebase service account JSON key found matching '{target_env}' environment (expected project containing '{expected_keyword}').")
                print(f"To upload to {target_env}, place a Firebase service account JSON for your {target_env} project in .secrets/ (e.g. .secrets/serviceAccountKey.{target_env}.json).")
                print("Switching to --dry-run mode to prevent accidental writes to wrong environment.\n")
                args.dry_run = True
            else:
                cred = credentials.Certificate(selected_key_path)
                if not firebase_admin._apps:
                    firebase_admin.initialize_app(cred)
                db = firestore.client()
                print(f"[Firebase] Initialized Firestore Admin SDK for [{args.env.upper()}] (Project: {selected_project_id}) using '{selected_key_path}'")

    files_to_process = []
    if args.file:
        files_to_process.append(args.file)
    elif args.dir:
        files_to_process.extend(sorted(glob.glob(os.path.join(args.dir, "*.md"))))

    if not files_to_process:
        print(f"[Info] No markdown files found to process.")
        sys.exit(0)

    success_count = 0
    for fpath in files_to_process:
        if process_journal_file(fpath, db=db, dry_run=args.dry_run, interactive=args.interactive):
            success_count += 1

    print(f"\n Finished processing {success_count}/{len(files_to_process)} journal entries.")


if __name__ == "__main__":
    main()
