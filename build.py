"""Build both language editions from the single source src/game.html.

    python3 build.py

Writes ru/index.html (Russian) and he/index.html (Hebrew, right-to-left).
Only the default language, the page title and the text direction differ.
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src" / "game.html"
EDITIONS = {
    "ru": {"title": "Project: End of Terror · Операция Решет", "dir": ""},
    "he": {"title": "Project: End of Terror · מבצע רשת", "dir": ' dir="rtl"'},
}


def main():
    src = SRC.read_text(encoding="utf-8")
    for lang, ed in EDITIONS.items():
        page = (src.replace("__LANG__", lang)
                   .replace("__TITLE__", ed["title"])
                   .replace("__DIR__", ed["dir"]))
        out = ROOT / lang / "index.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(page, encoding="utf-8")
        print(f"{out.relative_to(ROOT)}: {len(page):,} chars")


if __name__ == "__main__":
    main()
