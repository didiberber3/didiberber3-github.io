import os, re, html as html_mod, json, hashlib
from datetime import datetime
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CONTENT_DIR = BASE / "content"
NOTES_DIR = CONTENT_DIR / "notes"
SHARES_DIR = CONTENT_DIR / "shares"
BLOG_DIR = BASE / "blog"
ARTICLES_DIR = BLOG_DIR / "articles"
TEMPLATE_PATH = BLOG_DIR / "template.html"
SHARE_TEMPLATE_PATH = BLOG_DIR / "share-template.html"
CACHE_PATH = BLOG_DIR / ".cache.json"
NAV_PATH = BLOG_DIR / "nav.json"
SEARCH_PATH = BLOG_DIR / "search.json"

# ── Utility ──

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

def parse_frontmatter(raw):
    clean = raw.replace("\ufeff", "")
    m = re.match(r"^---\s*\n([\s\S]*?)\n---\s*\n", clean)
    if m:
        meta = {}
        for line in m.group(1).split("\n"):
            kv = re.match(r"^(\w+):\s*(.+)", line)
            if kv:
                meta[kv.group(1).strip()] = kv.group(2).strip()
        return meta, clean[m.end():]
    return {}, clean

def get_title_date(md_path):
    name = md_path.stem
    mtime = datetime.fromtimestamp(md_path.stat().st_mtime)
    return name, mtime.strftime("%Y-%m-%d")

def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]

# ── Render MD to HTML ──

def render_md(text):
    lines = text.split("\n")
    out, i, n = [], 0, len(lines)
    in_code, code_buf, lang = False, [], ""
    para, in_list, list_type, list_items = [], False, None, []

    def fp():
        if para:
            p = " ".join(p for p in para if p)
            if p: out.append(f"<p>{inline_fmt(p)}</p>")
            para.clear()

    def fl():
        nonlocal in_list, list_type, list_items
        if in_list and list_items:
            tag = list_type or "ul"
            out.append(f"<{tag}>{''.join(f'<li>{inline_fmt(li)}</li>' for li in list_items)}</{tag}>")
            in_list, list_type, list_items = False, None, []

    while i < n:
        line, s = lines[i], lines[i].strip()
        if s == "[TOC]": i += 1; continue
        if s.startswith("```"):
            if in_code:
                fp(); fl(); out.append(f'<pre><code class="language-{lang}">{html_mod.escape(chr(10).join(code_buf))}</code></pre>')
            else:
                fp(); fl(); lang = s[3:].strip(); code_buf = []
            in_code = not in_code; i += 1; continue
        if in_code: code_buf.append(line); i += 1; continue

        hm = re.match(r"^(#{1,6})\s+(.+)$", line)
        if hm:
            fp(); fl(); lv, txt = len(hm.group(1)), hm.group(2).strip()
            out.append(f'<h{lv} id="{slugify(txt)}">{inline_fmt(txt)}</h{lv}>')
            i += 1; continue

        if s.startswith("|") and s.endswith("|") and len(s.split("|")) >= 3:
            fp(); fl(); rows, j = [], i
            while j < n and (t := lines[j].strip()).startswith("|") and t.endswith("|"):
                if not re.match(r"^\|[\s\-:|]+\|$", t):
                    rows.append([c.strip() for c in t.split("|")[1:-1]])
                j += 1
            if rows:
                t = "<table><thead><tr>" + "".join(f"<th>{inline_fmt(c)}</th>" for c in rows[0]) + "</tr></thead>"
                if len(rows) > 1:
                    t += "<tbody>" + "".join("<tr>" + "".join(f"<td>{inline_fmt(c)}</td>" for c in r) + "</tr>" for r in rows[1:]) + "</tbody>"
                out.append(t + "</table>")
            i = j; continue

        ulm = re.match(r"^\s*[-*+]\s+(.+)$", line)
        if ulm:
            fp()
            if not in_list or list_type != "ul": fl(); in_list, list_type = True, "ul"
            list_items.append(ulm.group(1)); i += 1; continue

        olm = re.match(r"^\s*\d+\.\s+(.+)$", line)
        if olm:
            fp()
            if not in_list or list_type != "ol": fl(); in_list, list_type = True, "ol"
            list_items.append(olm.group(1)); i += 1; continue

        if not s: fp(); fl(); i += 1; continue

        para.append(s); i += 1

    fp(); fl()
    return "\n".join(out)

# ── Search Index ──

def generate_search_index():
    index = []
    for md_path in sorted(NOTES_DIR.glob("*.md")):
        slug = md_path.stem
        title, date = get_title_date(md_path)
        raw = md_path.read_text(encoding="utf-8")
        index.append({"title": title, "slug": slug, "date": date, "text": strip_md(raw)})
    SEARCH_PATH.write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")


# ── Home Page ──

def generate_home(notes_meta, shares_meta, search_json):
    note_cards = "\n".join(
        f'<article class="card"><a href="articles/{a["slug"]}.html"><span class="card-title">{a["title"]}</span><span class="card-date">{a["date"]}</span></a></article>'
        for a in notes_meta[:6]
    )
    share_cards = ""
    if shares_meta:
        share_cards = "\n".join(
            f'<article class="card share-inline"><a href="shared/{s["slug"]}.html"><span class="card-title">{s["title"]}</span><span class="share-tag-mini">{s["tag"]}</span><span class="card-date">{s["date"]}</span></a></article>'
            for s in shares_meta[:4]
        )

    notes_extra = ""
    if len(notes_meta) > 6:
        notes_extra = f'<p class="section-more"><a href="notes.html">查看全部 &rarr;</a></p>'

    share_section = ""
    if shares_meta:
        share_section = (
            f'<section class="home-section">'
            f'<div class="section-head"><h2>分享</h2><a class="section-more-link" href="shares.html">查看全部 &rarr;</a></div>'
            f'<div class="card-list">{share_cards}</div>'
            f'</section>'
        )

    html = (
        '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n'
        '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        '<title>Java 学习笔记</title>\n<link rel="stylesheet" href="style.css">\n</head>\n<body>\n'
        '<header class="intro">\n<h1>记录与分享</h1>\n'
        f'<p class="tagline">学了 {len(notes_meta)} 篇笔记 &middot; 收藏了 {len(shares_meta)} 条分享</p>\n'
        '<p class="intro-sub">一个在学 Java 的人</p>\n</header>\n'
        '<nav class="nav-tabs">\n<a href="index.html" class="tab active">首页</a>\n<a href="notes.html" class="tab">笔记</a>\n<a href="shares.html" class="tab">分享</a>\n</nav>\n'
        '<section class="home-section">\n<div class="section-head"><h2>最新笔记</h2>\n'
        f'<a class="section-more-link" href="notes.html">查看全部 &rarr;</a></div>\n'
        f'<div class="card-list">{note_cards}</div>\n{notes_extra}\n</section>\n'
        f'{share_section}\n'
        '<footer>&copy; 2026</footer>\n</body>\n</html>'
    )
    (BLOG_DIR / "index.html").write_text(html, encoding="utf-8")


# ── Notes Index Page ──

def generate_notes_page(notes_meta, shares_meta):
    cards = "\n".join(
        f'<article class="card"><a href="articles/{a["slug"]}.html"><span class="card-title">{a["title"]}</span><span class="card-date">{a["date"]}</span></a></article>'
        for a in notes_meta
    )
    html = (
        '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n'
        '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        '<title>笔记 - Java 学习笔记</title>\n<link rel="stylesheet" href="style.css">\n</head>\n<body>\n'
        '<nav class="nav-tabs-bar">\n<div class="nav-tabs">\n'
        '<a href="index.html" class="tab">首页</a>\n<a href="notes.html" class="tab active">笔记</a>\n<a href="shares.html" class="tab">分享</a>\n</div>\n'
        '<div class="nav-info">\n<span class="nav-title">学习笔记</span>\n</div>\n</nav>\n'
        '<header class="page-header">\n'
        '  <div class="search-wrap">\n    <input type="search" class="search-input" id="searchInput" placeholder="搜索..." autocomplete="off">\n'
        '    <div class="search-dropdown" id="searchDropdown"></div>\n  </div>\n'
        f'  <p class="meta">共 {len(notes_meta)} 篇</p>\n  <hr>\n</header>\n'
        '<main class="card-list">\n' + cards + '\n</main>\n'
        '<footer>&copy; 2026</footer>\n'
        f'<script id="search-data" type="application/json">'
        + json.dumps(
            [{"title": a["title"], "slug": a["slug"], "date": a["date"], "text": ""}
             for a in notes_meta],
            ensure_ascii=False
        ) + '</script>\n'
        '<script>'
        '(function(){var inp=document.getElementById("searchInput");'
        'if(!inp)return;var drop=document.getElementById("searchDropdown");'
        'if(!drop)return;var data=JSON.parse(document.getElementById("search-data").textContent);'
        'inp.addEventListener("input",function(){var q=this.value.trim().toLowerCase();if(!q){drop.innerHTML="";drop.classList.remove("show");return;}_srch(q)});'
        'function _srch(q){var r=data.filter(function(i){return i.title.toLowerCase().indexOf(q)>-1||i.text.toLowerCase().indexOf(q)>-1}).slice(0,10);'
        'if(!r.length){drop.innerHTML=\'<div class="search-empty">\u65e0\u7ed3\u679c</div>\'}'
        'else{drop.innerHTML=r.map(function(i){return\'<a class="search-item" href="articles/\'+i.slug+\'.html"><span>\'+_hl(i.title,q)+\'</span><span class="search-date">\'+i.date+\'</span></a>\'}).join("")}'
        'drop.classList.add("show")}'
        'function _hl(t,q){var i=t.toLowerCase().indexOf(q);if(i<0)return t;return t.slice(0,i)+"<em>"+t.slice(i,i+q.length)+"</em>"+t.slice(i+q.length)}'
        'document.addEventListener("click",function(e){if(!e.target.closest(".search-wrap"))drop.classList.remove("show")})})();\n'
        '</script>\n</body>\n</html>'
    )
    (BLOG_DIR / "notes.html").write_text(html, encoding="utf-8")

    note_cards_home = "\n".join(
        f'<article class="card"><a href="articles/{a["slug"]}.html"><span class="card-title">{a["title"]}</span><span class="card-date">{a["date"]}</span></a></article>'
        for a in notes_meta[:6]
    )

    # also return preview cards for homepage
    return note_cards_home


# ── Shares Index Page ──

def generate_shares_page(shares_meta):
    cards = "\n".join(
        f'<article class="share-card">'
        f'<div class="share-meta"><span class="share-tag">{s["tag"]}</span><span class="share-date">{s["date"]}</span></div>'
        f'<h2><a href="shared/{s["slug"]}.html">{s["title"]}</a></h2>'
        f'<p>{s["desc"]}</p>'
        f'<a class="share-url" href="{s["url"]}" target="_blank" rel="noopener">{s["url"]}</a>'
        f'</article>'
        for s in shares_meta
    )
    html = (
        '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n'
        '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        '<title>分享 - Java 学习笔记</title>\n<link rel="stylesheet" href="style.css">\n</head>\n<body>\n'
        '<nav class="nav-tabs-bar">\n<div class="nav-tabs">\n'
        '<a href="index.html" class="tab">首页</a>\n<a href="notes.html" class="tab">笔记</a>\n<a href="shares.html" class="tab active">分享</a>\n</div>\n'
        '<div class="nav-info">\n<span class="nav-title">分享</span>\n'
        f'<span class="nav-date">{len(shares_meta)} 条</span>\n</div>\n</nav>\n'
        f'<main class="share-list" style="margin-top:1.5rem">{cards}</main>\n'
        '<footer>&copy; 2026</footer>\n</body>\n</html>'
    )
    (BLOG_DIR / "shares.html").write_text(html, encoding="utf-8")

# ── Main ──

def main():
    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)
    shared_dir = BLOG_DIR / "shared"
    shared_dir.mkdir(parents=True, exist_ok=True)

    cache = {}
    if CACHE_PATH.exists():
        cache = json.loads(CACHE_PATH.read_text(encoding="utf-8"))

    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    share_template = SHARE_TEMPLATE_PATH.read_text(encoding="utf-8")

    # ── Build notes ──
    notes_meta = []
    built = 0
    for md_path in sorted(NOTES_DIR.glob("*.md")):
        title, date = get_title_date(md_path)
        fh = file_hash(md_path)
        slug = md_path.stem
        out_path = ARTICLES_DIR / f"{slug}.html"
        key = str(md_path)

        cached = cache.get(key, {})
        if cached.get("hash") == fh and out_path.exists():
            notes_meta.append({"title": title, "date": date, "slug": slug})
            print(f"  [skip note] {title}")
            continue

        raw = md_path.read_text(encoding="utf-8")
        html_content = render_md(raw)
        page = template.replace("{{TITLE}}", title).replace("{{DATE}}", date).replace("{{CONTENT}}", html_content)
        out_path.write_text(page, encoding="utf-8")
        cache[key] = {"hash": fh, "title": title, "date": date, "slug": slug}
        notes_meta.append({"title": title, "date": date, "slug": slug})
        built += 1
        print(f"  [build note] {title}")

    # ── Build shares ──
    shares_meta = []
    for md_path in sorted(SHARES_DIR.glob("*.md")):
        title, date = get_title_date(md_path)
        fh = file_hash(md_path)
        slug = md_path.stem
        out_path = shared_dir / f"{slug}.html"
        key = str(md_path)

        cached = cache.get(key, {})
        if cached.get("hash") == fh and out_path.exists():
            shares_meta.append({"title": title, "date": date, "slug": slug, "tag": "", "url": "", "desc": ""})
            print(f"  [skip share] {title}")
            continue

        raw = md_path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(raw)
        html_content = render_md(body)
        tag = meta.get("tag", "")
        url = meta.get("url", "")
        page = share_template.replace("{{TITLE}}", title).replace("{{TAG}}", tag).replace("{{URL}}", url).replace("{{CONTENT}}", html_content)
        out_path.write_text(page, encoding="utf-8")
        cache[key] = {"hash": fh, "title": title, "date": date, "slug": slug, "tag": tag, "url": url}
        desc = strip_md(body).replace("\n", " ")[:120]
        shares_meta.append({"title": title, "date": date, "slug": slug, "tag": tag, "url": url, "desc": desc})
        built += 1
        print(f"  [build share] {title} (tag={tag})")

    # ── Save cache & nav ──
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    notes_meta.sort(key=lambda x: x["date"], reverse=True)
    NAV_PATH.write_text(json.dumps(notes_meta, ensure_ascii=False, indent=2), encoding="utf-8")

    # ── Search index (notes only) ──
    generate_search_index()
    search_json = SEARCH_PATH.read_text(encoding="utf-8")

    # ── Generate pages ──
    generate_home(notes_meta, shares_meta, search_json)
    generate_notes_page(notes_meta, shares_meta)
    if shares_meta:
        generate_shares_page(shares_meta)

    print(f"\nDone! {built} built, {len(notes_meta)} notes, {len(shares_meta)} shares.")

if __name__ == "__main__":
    main()
