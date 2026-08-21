"""
DaCowboy Fitness - Journal Parser Library

Shared parsing utilities for journal Markdown files with YAML frontmatter
and custom block directives (:::video, :::image). Used by both
upload_journal.py (Firestore uploader) and build_journals.py (static builder).

This module is a pure library: no argparse, no main(), no side effects on import.
"""

import re

# ---------------------------------------------------------------------------
# Frontmatter compatibility shim
# ---------------------------------------------------------------------------
# Provides a `frontmatter.load(f)` interface regardless of which YAML library
# is installed. Returns an object with `.content` (str) and `.metadata` (dict).

try:
    import frontmatter as _frontmatter
    frontmatter = _frontmatter
except ImportError:
    try:
        import yaml

        class _SimplePost:
            def __init__(self, content, metadata):
                self.content = content
                self.metadata = metadata

        class _SimpleFrontmatter:
            @staticmethod
            def load(f):
                raw = f.read() if hasattr(f, 'read') else str(f)
                if raw.startswith("---"):
                    parts = raw.split("---", 2)
                    if len(parts) >= 3:
                        meta = yaml.safe_load(parts[1]) or {}
                        content = parts[2]
                        return _SimplePost(content, meta)
                return _SimplePost(raw, {})

        frontmatter = _SimpleFrontmatter
    except ImportError:
        class _BasicPost:
            def __init__(self, content, metadata):
                self.content = content
                self.metadata = metadata

        class _BasicFrontmatter:
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
                return _BasicPost(content, meta)

        frontmatter = _BasicFrontmatter


# ---------------------------------------------------------------------------
# Slug normalisation
# ---------------------------------------------------------------------------

def normalize_slug(title_or_slug: str) -> str:
    """Generate a clean URL-friendly slug."""
    s = title_or_slug.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')


# ---------------------------------------------------------------------------
# Read-time estimation
# ---------------------------------------------------------------------------

def calculate_read_time(text: str, wpm: int = 200) -> int:
    """Estimate read time in minutes based on word count."""
    words = len(re.findall(r'\w+', text))
    minutes = max(1, round(words / wpm))
    return minutes


# ---------------------------------------------------------------------------
# Block parser
# ---------------------------------------------------------------------------

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


# ---------------------------------------------------------------------------
# Tag similarity
# ---------------------------------------------------------------------------

def calculate_jaccard_similarity(tags1: list, tags2: list) -> float:
    """Compute Jaccard similarity between two tag lists."""
    s1 = set(t.lower() for t in tags1)
    s2 = set(t.lower() for t in tags2)
    if not s1 or not s2:
        return 0.0
    intersection = len(s1.intersection(s2))
    union = len(s1.union(s2))
    return intersection / union if union > 0 else 0.0


# ---------------------------------------------------------------------------
# Recommendation resolver
# ---------------------------------------------------------------------------

def _format_summary_item(item: dict) -> dict:
    summary = {
        "id": item["id"],
        "slug": item["slug"],
        "title": item["title"],
        "excerpt": item.get("excerpt", ""),
        "tags": item.get("tags", []),
        "readTimeMinutes": item.get("readTimeMinutes", 3),
        "date": str(item.get("date", "")),
    }
    if item.get("coverImage"):
        summary["coverImage"] = item["coverImage"]
    return summary


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
            resolved.append(_format_summary_item(item))
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
                                resolved.append(_format_summary_item(item))
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
            resolved.append(_format_summary_item(item))
            seen_slugs.add(item["slug"])

    return resolved

