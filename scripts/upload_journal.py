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
from datetime import datetime, timezone

from journal_parser import (
    frontmatter,
    normalize_slug,
    calculate_read_time,
    parse_blocks,
    calculate_jaccard_similarity,
    resolve_recommendations,
)

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except ImportError:
    firebase_admin = None
    firestore = None




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
        date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

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
        "updatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
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
