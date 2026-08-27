#!/usr/bin/env python3
"""
GlobalExplorer Portal — real image downloader
------------------------------------------------
Downloads the real destination/region photos (from Wikimedia Commons,
all freely licensed CC-BY-SA) into assets/img/ and rewrites every HTML
page to reference the local files instead of the remote URL.

Run this once from the project root, with normal internet access:

    python3 download_images.py

No third-party packages required — uses only the Python standard library.
After it finishes, the site works fully offline (open index.html directly,
or use a Live Server extension in VS Code).
"""

import json
import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
MANIFEST_PATH = os.path.join(ROOT, "image_manifest.json")
IMG_DIR = os.path.join(ROOT, "assets", "img")

HEADERS = {
    # Wikimedia asks for a descriptive User-Agent on direct requests.
    "User-Agent": "GlobalExplorerPortal/1.0 (local image download script; contact: none)"
}


def download(url: str, dest_path: str) -> bool:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp, open(dest_path, "wb") as out:
            out.write(resp.read())
        return True
    except Exception as e:
        print(f"  ! failed: {url}\n    {e}")
        return False


def main():
    with open(MANIFEST_PATH, encoding="utf-8") as f:
        manifest = json.load(f)

    os.makedirs(IMG_DIR, exist_ok=True)

    local_files = {}  # local key -> local filename actually saved (e.g. "hunza-valley.jpg")
    print(f"Downloading {len(manifest)} images into assets/img/ ...")
    for key, url in manifest.items():
        ext = ".png" if url.lower().split("?")[0].endswith(".png") else ".jpg"
        filename = f"{key}{ext}"
        dest = os.path.join(IMG_DIR, filename)
        print(f" - {key} -> assets/img/{filename}")
        if download(url, dest):
            local_files[key] = filename
        else:
            print(f"   (kept remote URL for {key}; try re-running the script later)")

    if not local_files:
        print("No images were downloaded. Check your internet connection and try again.")
        return

    # Rewrite every HTML file: replace the remote Special:FilePath URL with a
    # path to the local file, relative to that HTML file's own location.
    changed_files = 0
    for dirpath, _, filenames in os.walk(ROOT):
        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            fp = os.path.join(dirpath, fn)
            with open(fp, encoding="utf-8") as f:
                content = f.read()
            original = content
            rel_img_dir = os.path.relpath(IMG_DIR, dirpath).replace(os.sep, "/")
            for key, url in manifest.items():
                if key not in local_files:
                    continue
                local_rel = f"{rel_img_dir}/{local_files[key]}"
                # Match the remote URL regardless of the width= query value.
                pattern = re.compile(re.escape(url.split("?")[0]) + r"(\?width=\d+)?")
                content = pattern.sub(local_rel, content)
            if content != original:
                with open(fp, "w", encoding="utf-8") as f:
                    f.write(content)
                changed_files += 1

    print(f"\nDone. Updated {changed_files} HTML file(s) to use local images.")
    print("Open index.html (or use a Live Server) to view the site.")


if __name__ == "__main__":
    main()
