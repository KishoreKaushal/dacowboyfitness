#!/usr/bin/env python3
"""
DaCowboy Fitness - Journal Static Content Builder

Reads journals/*.md, parses with shared helpers from journal_parser.py,
and outputs static JSON to public/content/journals/.

Handles stale cleanup: removes generated JSON for entries that no longer
exist, are unpublished, or have changed slugs.
"""

import os
import sys
import glob
import json
from datetime import datetime, timezone

from journal_parser import (
    frontmatter,
    normalize_slug,
    calculate_read_time,
    parse_blocks,
    resolve_recommendations,
)

# Paths relative to the repository root
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)
JOURNALS_MD_DIR = os.path.join(REPO_ROOT, "journals")
OUTPUT_DIR = os.path.join(REPO_ROOT, "public", "content", "journals")
ENTRIES_DIR = os.path.join(OUTPUT_DIR, "entries")


def build_all_journals():
    """Parse all journal Markdown files and generate static JSON."""
    os.makedirs(ENTRIES_DIR, exist_ok=True)

    md_files = sorted(glob.glob(os.path.join(JOURNALS_MD_DIR, "*.md")))
    if not md_files:
        print("[Info] No markdown files found in journals/. Generating empty index.")
        # Write empty index and clean up any stale entries
        with open(os.path.join(OUTPUT_DIR, "index.json"), "w", encoding="utf-8") as f:
            json.dump({"journals": []}, f, indent=2)
            f.write("\n")
        _cleanup_stale_entries(set())
        return

    # ---------------------------------------------------------------------------
    # First pass: parse all entries, build in-memory index
    # ---------------------------------------------------------------------------
    parsed_entries = []
    index_map = {}  # slug -> summary dict (used for recommendation resolution)

    for fpath in md_files:
        with open(fpath, "r", encoding="utf-8") as f:
            post = frontmatter.load(f)

        meta = post.metadata
        title = meta.get("title", "Untitled Journal Entry")
        slug = meta.get("slug") or normalize_slug(title)

        # Check published status — default True if not specified
        published = meta.get("published", True)
        if isinstance(published, str):
            published = published.lower() not in ("false", "no", "0")
        if not published:
            print(f"  [Skip] {os.path.basename(fpath)} — published: false")
            continue

        author = meta.get("author", "Kishore Kaushal")
        date_val = meta.get("date")
        if hasattr(date_val, "isoformat"):
            date_str = date_val.isoformat()
        elif date_val:
            date_str = str(date_val)
        else:
            date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        tags = meta.get("tags", [])
        if isinstance(tags, str):
            tags = [t.strip() for t in tags.split(",")]
        tags = [t.lower() for t in tags]

        excerpt = meta.get("excerpt", "")
        explicit_related = meta.get("related", [])
        if isinstance(explicit_related, str):
            explicit_related = [r.strip() for r in explicit_related.split(",")]

        cover_image_raw = meta.get("coverImage") or meta.get("cover_image")

        # Parse content blocks
        blocks = parse_blocks(post.content)

        # Calculate read time from markdown content
        all_text = " ".join([b.get("content", "") for b in blocks if b.get("type") == "markdown"])
        read_time = calculate_read_time(all_text)

        # Auto-generate excerpt if missing
        if not excerpt and all_text:
            excerpt = (all_text[:160] + "...") if len(all_text) > 160 else all_text

        # Build cover image in the format expected by the frontend
        if isinstance(cover_image_raw, dict):
            cover_image_full = cover_image_raw
            cover_image_summary = cover_image_raw.get("src")
        elif cover_image_raw:
            cover_image_full = {"src": cover_image_raw}
            cover_image_summary = cover_image_raw
        else:
            cover_image_full = None
            cover_image_summary = None

        entry = {
            "id": slug,
            "slug": slug,
            "title": title,
            "author": author,
            "date": date_str,
            "published": True,
            "tags": tags,
            "excerpt": excerpt,
            "readTimeMinutes": read_time,
            "blocks": blocks,
            "_explicit_related": explicit_related,  # temporary, removed before writing
        }
        if cover_image_full:
            entry["coverImage"] = cover_image_full

        summary = {
            "id": slug,
            "slug": slug,
            "title": title,
            "excerpt": excerpt,
            "tags": tags,
            "readTimeMinutes": read_time,
            "date": date_str,
        }
        if cover_image_summary:
            summary["coverImage"] = cover_image_summary

        parsed_entries.append(entry)
        index_map[slug] = summary

    # ---------------------------------------------------------------------------
    # Second pass: resolve recommendations and write files
    # ---------------------------------------------------------------------------
    generated_slugs = set()
    index_list = []

    for entry in parsed_entries:
        slug = entry["slug"]
        explicit_related = entry.pop("_explicit_related", [])

        # Resolve recommendations using the in-memory index
        related_journals = resolve_recommendations(
            current_slug=slug,
            current_tags=entry["tags"],
            explicit_related_slugs=explicit_related,
            existing_index=index_map,
        )
        entry["relatedJournals"] = related_journals

        # Write individual entry JSON
        entry_path = os.path.join(ENTRIES_DIR, f"{slug}.json")
        with open(entry_path, "w", encoding="utf-8") as f:
            json.dump(entry, f, indent=2)
            f.write("\n")

        generated_slugs.add(slug)
        index_list.append(index_map[slug])

        print(f"  [OK] {slug}.json ({len(entry['blocks'])} blocks, ~{entry['readTimeMinutes']} min read)")

    # Sort index by date descending
    index_list.sort(key=lambda x: x.get("date", ""), reverse=True)

    # Write index.json
    index_path = os.path.join(OUTPUT_DIR, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump({"journals": index_list}, f, indent=2)
        f.write("\n")

    # ---------------------------------------------------------------------------
    # Stale cleanup
    # ---------------------------------------------------------------------------
    _cleanup_stale_entries(generated_slugs)

    print(f"\n  Generated {len(generated_slugs)} journal(s) → public/content/journals/")


def _cleanup_stale_entries(generated_slugs: set):
    """Remove entry JSON files that no longer correspond to published Markdown."""
    if not os.path.isdir(ENTRIES_DIR):
        return

    for existing_file in glob.glob(os.path.join(ENTRIES_DIR, "*.json")):
        basename = os.path.basename(existing_file)
        slug = basename.removesuffix(".json")
        if slug not in generated_slugs:
            os.remove(existing_file)
            print(f"  [Removed] stale entry: {basename}")


if __name__ == "__main__":
    build_all_journals()
