"""Build both language editions from the sources in src/.

    python3 build.py

Sources:
  src/page.html        page skeleton with placeholders
  src/styles.css       all styles (Hebrew overrides at the end, under html[lang=he])
  src/markup/ru.html   interface markup, Russian
  src/markup/he.html   interface markup, Hebrew (placed in <template>, swapped in at start)
  src/js/NN-name.js    game script, concatenated in file-name order into one closure
  src/assets/splash.jpg  title screen image, embedded as base64

Writes ru/index.html (Russian) and he/index.html (Hebrew, right-to-left):
single self-contained pages. Only the default language, the page title and
the text direction differ between them.
"""
import base64
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
EDITIONS = {
    "ru": {"title": "Project: End of Terror · Операция Решет", "dir": ""},
    "he": {"title": "Project: End of Terror · מבצע רשת", "dir": ' dir="rtl"'},
}


def read(path):
    text = path.read_text(encoding="utf-8")
    return text[:-1] if text.endswith("\n") else text


def assemble():
    modules = sorted((SRC / "js").glob("*.js"))
    js = "".join(m.read_text(encoding="utf-8") for m in modules)
    js = js[:-1] if js.endswith("\n") else js
    splash = base64.b64encode((SRC / "assets" / "splash.jpg").read_bytes()).decode()
    js = js.replace("__SPLASH_B64__", splash)
    page = (SRC / "page.html").read_text(encoding="utf-8")
    for key, value in (("__CSS__", read(SRC / "styles.css")),
                       ("__MARKUP_RU__", read(SRC / "markup" / "ru.html")),
                       ("__MARKUP_HE__", read(SRC / "markup" / "he.html")),
                       ("__JS__", js)):
        assert page.count(key) == 1, key
        page = page.replace(key, value)
    return page, len(modules)


def main():
    src, n = assemble()
    for lang, ed in EDITIONS.items():
        page = (src.replace("__LANG__", lang)
                   .replace("__TITLE__", ed["title"])
                   .replace("__DIR__", ed["dir"]))
        out = ROOT / lang / "index.html"
        out.parent.mkdir(exist_ok=True)
        out.write_text(page, encoding="utf-8")
        print(f"{out.relative_to(ROOT)}: {len(page):,} chars from {n} script modules")


if __name__ == "__main__":
    main()
