import os
import re
import html as html_mod
import json
import hashlib
from datetime import datetime
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CONTENT_DIR = BASE / "content"
BLOG_DIR = BASE / "blog"
ARTICLES_DIR = BLOG_DIR / "articles"
TEMPLATE_PATH = BLOG_DIR / "template.html"
CACHE_PATH = BLOG_DIR / ".cache.json"
NAV_PATH = BLOG_DIR / "nav.json"
SEARCH_PATH = BLOG_DIR / "search.json"


def strip_md(text):
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`[^`]+`", " ", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"^#{1,6}\s+", " ", text, flags=re.MULTILINE)
    text = re.sub(r"\*{1,2}([^*]+)\*{1,2}", r"\1", text)
    text = re.sub(r"~~([^~]+)~~", r"\1", text)
    text = re.sub(r"^\|.*\|$", " ", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[-*+]\s+", " ", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", " ", text, flags=re.MULTILINE)
    text = re.sub(r"\[TOC\]", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\n{2,}", "\n", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def generate_search_index(articles_meta):
    index = []
    for md_path in sorted(CONTENT_DIR.glob("*.md")):
        slug = md_path.stem
        title, date = get_title_date(md_path)
        raw = md_path.read_text(encoding="utf-8")
        plain = strip_md(raw)
        index.append({"title": title, "slug": slug, "date": date, "text": plain})
    SEARCH_PATH.write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")


def inline_fmt(text):
    text = re.sub(r"`([^`]+?)`", r"<code>\1</code>", text)
    text = re.sub(r'!\[([^\]]*?)\]\(([^)]+?)\)', r'<img src="\2" alt="\1">', text)
    text = re.sub(r'\[([^\]]+?)\]\(([^)]+?)\)', r'<a href="\2">\1</a>', text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"~~(.+?)~~", r"<del>\1</del>", text)
    text = re.sub(r"(?<!\*)\*([^*\n]+?)\*(?!\*)", r"<em>\1</em>", text)
    return text


def slugify(text):
    s = re.sub(r"[^\w\u4e00-\u9fff\- ]", "", text)
    s = re.sub(r"\s+", "-", s.strip())
    return s[:50]


def render_md(text):
    lines = text.split("\n")
    out = []
    i = 0
    n = len(lines)
    in_code = False
    code_buf = []
    lang = ""
    para = []
    in_list = False
    list_type = None
    list_items = []

    def _flush_para():
        nonlocal para
        if para:
            p = " ".join(p for p in para if p)
            if p:
                out.append(f"<p>{inline_fmt(p)}</p>")
            para = []

    def _flush_list():
        nonlocal in_list, list_type, list_items
        if in_list and list_items:
            tag = list_type or "ul"
            items = "".join(f"<li>{inline_fmt(li)}</li>" for li in list_items)
            out.append(f"<{tag}>{items}</{tag}>")
            in_list = False
            list_type = None
            list_items = []

    while i < n:
        line = lines[i]
        stripped = line.strip()

        if stripped == "[TOC]":
            i += 1
            continue

        # code block
        if stripped.startswith("```"):
            if in_code:
                _flush_para()
                _flush_list()
                raw = "\n".join(code_buf)
                out.append(
                    f'<pre><code class="language-{lang}">{html_mod.escape(raw)}</code></pre>'
                )
                code_buf = []
                in_code = False
            else:
                _flush_para()
                _flush_list()
                in_code = True
                lang = stripped[3:].strip()
                code_buf = []
            i += 1
            continue

        if in_code:
            code_buf.append(line)
            i += 1
            continue

        # heading
        hm = re.match(r"^(#{1,6})\s+(.+)$", line)
        if hm:
            _flush_para()
            _flush_list()
            lv = len(hm.group(1))
            txt = hm.group(2).strip()
            sid = slugify(txt)
            out.append(f'<h{lv} id="{sid}">{inline_fmt(txt)}</h{lv}>')
            i += 1
            continue

        # table
        if stripped.startswith("|") and stripped.endswith("|") and stripped.count("|") >= 2:
            _flush_para()
            _flush_list()
            rows = []
            j = i
            while j < n and lines[j].strip().startswith("|") and lines[j].strip().endswith("|"):
                r = lines[j].strip()
                if not re.match(r"^\|[\s\-:|]+\|$", r):
                    cells = [c.strip() for c in r.split("|")[1:-1]]
                    rows.append(cells)
                j += 1
            if rows:
                t = "<table>"
                if rows:
                    t += "<thead><tr>" + "".join(f"<th>{inline_fmt(c)}</th>" for c in rows[0]) + "</tr></thead>"
                if len(rows) > 1:
                    t += "<tbody>" + "".join(
                        "<tr>" + "".join(f"<td>{inline_fmt(c)}</td>" for c in row) + "</tr>"
                        for row in rows[1:]
                    ) + "</tbody>"
                t += "</table>"
                out.append(t)
            i = j
            continue

        # unordered list
        ulm = re.match(r"^(\s*)[\-*+]\s+(.+)$", line)
        if ulm:
            _flush_para()
            if not in_list or list_type != "ul":
                _flush_list()
                in_list = True
                list_type = "ul"
            list_items.append(ulm.group(2))
            i += 1
            continue

        # ordered list
        olm = re.match(r"^\s*(\d+)\.\s+(.+)$", line)
        if olm:
            _flush_para()
            if not in_list or list_type != "ol":
                _flush_list()
                in_list = True
                list_type = "ol"
            list_items.append(olm.group(2))
            i += 1
            continue

        # empty line
        if not stripped:
            _flush_para()
            _flush_list()
            i += 1
            continue

        # regular text
        para.append(stripped)
        i += 1

    _flush_para()
    _flush_list()
    return "\n".join(out)


def get_title_date(md_path):
    name = md_path.stem
    mtime = datetime.fromtimestamp(md_path.stat().st_mtime)
    return name, mtime.strftime("%Y-%m-%d")


def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def generate_index(articles_meta, search_data_json):
    cards = []
    for a in articles_meta:
        cards.append(
            f'<article class="card">\n'
            f'  <a href="articles/{a["slug"]}.html">\n'
            f'    <span class="card-title">{a["title"]}</span>\n'
            f'    <span class="card-date">{a["date"]}</span>\n'
            f'  </a>\n'
            f'</article>'
        )

    html = (
        '<!DOCTYPE html>\n'
        '<html lang="zh-CN">\n'
        '<head>\n'
        '<meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        '<title>Java 学习笔记</title>\n'
        '<link rel="stylesheet" href="style.css">\n'
        '</head>\n'
        '<body>\n'
        '<header class="site-header">\n'
        '  <h1>Java 学习笔记</h1>\n'
        '  <div class="search-wrap">\n'
        '    <input type="search" class="search-input" id="searchInput" placeholder="搜索..." autocomplete="off">\n'
        '    <div class="search-dropdown" id="searchDropdown"></div>\n'
        '  </div>\n'
        f'  <p class="meta">共 {len(articles_meta)} 篇文章</p>\n'
        '  <hr>\n'
        '</header>\n'
        '<main class="card-list">\n'
        + "\n".join(cards) +
        '\n</main>\n'
        '<footer>&copy; 2026</footer>\n'
        f'<script id="search-data" type="application/json">{search_data_json}</script>\n'
        '<script>\n'
        '(function(){\n'
        '  var inp = document.getElementById("searchInput");\n'
        '  var drop = document.getElementById("searchDropdown");\n'
        '  var data = JSON.parse(document.getElementById("search-data").textContent);\n'
        '  inp.addEventListener("input", function(){\n'
        '    var q = this.value.trim().toLowerCase();\n'
        '    if (!q) { drop.innerHTML = ""; drop.classList.remove("show"); return; }\n'
        '    _srch(q);\n'
        '  });\n'
        '  function _srch(q){\n'
        '    var r = data.filter(function(i){ return i.title.toLowerCase().indexOf(q)>-1 || i.text.toLowerCase().indexOf(q)>-1; }).slice(0,10);\n'
        '    if (!r.length) { drop.innerHTML = \'<div class="search-empty">无结果</div>\'; }\n'
        '    else { drop.innerHTML = r.map(function(i){ return \'<a class="search-item" href="articles/\'+i.slug+\'.html"><span>\'+_hl(i.title,q)+\'</span><span class="search-date">\'+i.date+\'</span></a>\'; }).join(""); }\n'
        '    drop.classList.add("show");\n'
        '  }\n'
        '  function _hl(t,q){ var i=t.toLowerCase().indexOf(q); if(i<0)return t; return t.slice(0,i)+"<em>"+t.slice(i,i+q.length)+"</em>"+t.slice(i+q.length); }\n'
        '  document.addEventListener("click",function(e){ if(!e.target.closest(".search-wrap")) drop.classList.remove("show"); });\n'
        '})();\n'
        '</script>\n'
        '</body>\n'
        '</html>'
    )

    (BLOG_DIR / "index.html").write_text(html, encoding="utf-8")


def main():
    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)

    cache = {}
    if CACHE_PATH.exists():
        cache = json.loads(CACHE_PATH.read_text(encoding="utf-8"))

    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    md_files = sorted(CONTENT_DIR.glob("*.md"))
    articles_meta = []
    built = 0
    skipped = 0

    for md_path in md_files:
        title, date = get_title_date(md_path)
        fhash = file_hash(md_path)
        slug = md_path.stem
        out_path = ARTICLES_DIR / f"{slug}.html"
        key = str(md_path)

        cached = cache.get(key, {})
        if cached.get("hash") == fhash and out_path.exists():
            articles_meta.append({"title": title, "date": date, "slug": slug})
            skipped += 1
            print(f"  [skip] {title}")
            continue

        md_content = md_path.read_text(encoding="utf-8")
        html_content = render_md(md_content)

        page = template.replace("{{TITLE}}", title)
        page = page.replace("{{DATE}}", date)
        page = page.replace("{{CONTENT}}", html_content)

        out_path.write_text(page, encoding="utf-8")

        cache[key] = {"hash": fhash, "title": title, "date": date, "slug": slug}
        articles_meta.append({"title": title, "date": date, "slug": slug})
        built += 1
        print(f"  [build] {title}")

    articles_meta.sort(key=lambda x: x["date"], reverse=True)
    NAV_PATH.write_text(
        json.dumps(articles_meta, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    CACHE_PATH.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    generate_search_index(articles_meta)
    search_data_json = SEARCH_PATH.read_text(encoding="utf-8")

    generate_index(articles_meta, search_data_json)
    print(f"\nDone! {built} built, {skipped} skipped, {len(articles_meta)} total.")


if __name__ == "__main__":
    main()
