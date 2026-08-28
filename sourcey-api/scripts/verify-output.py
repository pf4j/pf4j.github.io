#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

EXPECTED_COMMIT = "2ce777013963706c868b79da1483270e2690afab"


class Links(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in {"a", "link", "script", "img"}:
            return
        values = dict(attrs)
        key = "href" if tag in {"a", "link"} else "src"
        if values.get(key):
            self.links.append(values[key] or "")


def main() -> None:
    root = Path(sys.argv[1]).resolve()
    html = sorted(root.rglob("*.html"))
    assert len(html) == 97, len(html)
    assert (root / "search-index.json").is_file()
    assert (root / "llms.txt").is_file()
    assert (root / "llms-full.txt").is_file()

    broken: list[tuple[str, str]] = []
    source_links = 0
    generator_pages = 0
    canonical_pages = 0
    for page in html:
        text = page.read_text(encoding="utf-8")
        generator_pages += int('content="Sourcey 3.6.5"' in text)
        canonical_pages += int('href="https://pf4j.org/api/' in text)
        source_links += text.count(f"https://github.com/pf4j/pf4j/blob/{EXPECTED_COMMIT}/")
        parser = Links()
        parser.feed(text)
        for link in parser.links:
            parsed = urlparse(link)
            if parsed.scheme or link.startswith(("#", "mailto:", "javascript:")):
                continue
            target = (page.parent / parsed.path).resolve()
            if parsed.path.endswith("/"):
                target = target / "index.html"
            if not target.exists():
                broken.append((str(page.relative_to(root)), link))

    assert generator_pages == len(html), generator_pages
    assert canonical_pages == len(html), canonical_pages
    assert source_links >= 900, source_links
    assert not broken, broken[:20]

    summary = {
        "status": "valid",
        "html_pages": len(html),
        "source_links": source_links,
        "generator_pages": generator_pages,
        "canonical_pages": canonical_pages,
        "broken_local_links": len(broken),
        "index_sha256": hashlib.sha256((root / "index.html").read_bytes()).hexdigest(),
        "search_index_entries": len(json.loads((root / "search-index.json").read_text())),
    }
    print(json.dumps(summary, sort_keys=True))


if __name__ == "__main__":
    main()
