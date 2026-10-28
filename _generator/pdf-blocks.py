# Reads a text PDF into the same blocks as docx.mjs (paragraphs with bold/italic runs, tables), as JSON on stdout.
# Usage: python -I _generator/pdf-blocks.py <file.pdf>   (needs PyMuPDF; called by docx.mjs for .pdf files)
# - Pages without a text layer (pictures of text) give no blocks.
# - Running headers ("VOL 7 TEST 2", the rule under it) and page numbers are dropped.
# - Pieces of one line set apart by a wide gap ("7    The Italians…") are joined with a tab, like a .docx item.
# - A paragraph cut by a page break is joined again (the next page starts in lower case, no full stop before).
# - Each block carries its page and, for pictures (charts), an { img: 'p18-1' } run with its box on the page.
import json
import re
import sys

import pymupdf

GAP = 9  # points between two pieces of a line that count as a tab
ENDED = r'([.?!:;"”\'’)]|[_…]{3,})\s*$'  # text that ends a sentence (or an answer blank)


def is_bold(span):
    return bool(span['flags'] & 16) or 'Bold' in span['font']


def is_italic(span):
    return bool(span['flags'] & 2) or 'Italic' in span['font']


def clean(t):
    return t.replace('​', '').replace(' ', ' ')


def add_run(runs, t, b, i):
    if not t:
        return
    if runs and runs[-1].get('b', False) == b and runs[-1].get('i', False) == i and 'img' not in runs[-1]:
        runs[-1]['t'] += t
    else:
        r = {'t': t}
        if b:
            r['b'] = True
        if i:
            r['i'] = True
        runs.append(r)


def plain(runs):
    return ''.join(r.get('t', '') for r in runs)


def rows_of(block):
    """Visual rows: lines with the same baseline, left to right."""
    lines = sorted(block['lines'], key=lambda l: (round(l['bbox'][3]), l['bbox'][0]))
    rows = []
    for l in lines:
        if rows and abs(rows[-1]['y'] - l['bbox'][3]) < 3:
            rows[-1]['lines'].append(l)
        else:
            rows.append({'y': l['bbox'][3], 'top': l['bbox'][1], 'lines': [l]})
    for r in rows:
        r['lines'].sort(key=lambda l: l['bbox'][0])
        r['top'] = min(l['bbox'][1] for l in r['lines'])
        r['x'] = r['lines'][0]['bbox'][0]
    return rows


def row_runs(row):
    runs = []
    last_x = None
    for l in row['lines']:
        for s in l['spans']:
            t = clean(s['text'])
            if not t:
                continue
            if last_x is not None and s['bbox'][0] - last_x > GAP and t.strip():
                prev = plain(runs)
                if prev.strip():
                    runs[-1]['t'] = runs[-1]['t'].rstrip()
                    add_run(runs, '\t', False, False)
                    t = t.lstrip()
            add_run(runs, t, is_bold(s), is_italic(s))
            if t.strip():
                last_x = s['bbox'][2]
    return runs


def join(a, b):
    """Joins two lines of one paragraph."""
    if not a:
        return b
    ta = plain(a).rstrip()
    a[-1]['t'] = a[-1]['t'].rstrip()
    while a and not a[-1]['t']:
        a.pop()
    tb = plain(b).lstrip()
    if b:
        b[0]['t'] = b[0]['t'].lstrip()
    sep = '' if re.search(r'[A-Za-z0-9]-$', ta) and re.match(r'[a-z0-9]', tb) else ' '  # "2500-" + "2000", "sought-" + "after"
    out = [dict(r) for r in a]
    add_run(out, sep, out[-1].get('b', False) if out else False, out[-1].get('i', False) if out else False)
    for r in b:
        add_run(out, r.get('t', ''), r.get('b', False), r.get('i', False))
    return out


def para(runs, page, **extra):
    while runs and not runs[-1]['t'].strip():
        runs.pop()
    if runs:
        runs[-1]['t'] = runs[-1]['t'].rstrip()
        runs[0]['t'] = runs[0]['t'].lstrip()
    return {'kind': 'p', 'style': None, 'list': None, 'center': extra.get('center', False), 'runs': runs, 'page': page}


def cell_blocks(page, rect):
    """A table cell: its lines joined into one paragraph; a line starting with "- " or a bullet starts a new one."""
    d = page.get_text('dict', clip=rect)
    lines = [l for b in d['blocks'] if b['type'] == 0 for l in b['lines']]
    out = []
    runs = None
    for r in rows_of({'lines': lines}):
        rr = row_runs(r)
        if not plain(rr).strip():
            continue
        if runs is not None and re.match(r'^\s*([-•●]\s)', plain(rr)):
            out.append(para(runs, page.number + 1))
            runs = None
        runs = rr if runs is None else join(runs, rr)
    if runs is not None:
        out.append(para(runs, page.number + 1))
    return out


def table_block(page, t):
    rows = [[cell_blocks(page, pymupdf.Rect(c)) if c else [] for c in row.cells] for row in t.rows]
    out = []
    # A first row with one filled cell spanning the table is its title: a centred bold line above the table.
    filled = lambda row: [c for c in row if c]
    if rows and len(filled(rows[0])) == 1 and len(rows[0]) > 2:
        title = filled(rows[0])[0][0]
        title['center'] = True
        out.append(title)
        rows = rows[1:]
    # A row with an empty first cell and one filled cell is the rest of the row above (the PDF split the cell).
    merged = []
    for row in rows:
        f = [i for i, c in enumerate(row) if c]
        if merged and not row[0] and len(f) == 1:
            i = f[0]
            prev = merged[-1][i]
            if prev and not re.match(r'^\s*([-•●]\s)', plain(row[i][0]['runs'])):
                prev[-1]['runs'] = join(prev[-1]['runs'], row[i][0]['runs'])
                prev.extend(row[i][1:])
            else:
                prev.extend(row[i])
            continue
        merged.append(row)
    out.append({'kind': 'tbl', 'rows': merged, 'page': page.number + 1})
    return out


def page_blocks(page):
    H = page.rect.height
    W = page.rect.width
    items = []  # (top, block)
    tables = page.find_tables().tables
    boxes = []
    for t in tables:
        rect = pymupdf.Rect(t.bbox)
        boxes.append(rect)
        for k, blk in enumerate(table_block(page, t)):
            items.append((rect.y0 + k * 0.01, blk))
    d = page.get_text('dict')
    allrows = []
    for b in d['blocks']:
        r = pymupdf.Rect(b['bbox'])
        if any(box.intersects(r) and (box & r).get_area() > 0.5 * r.get_area() for box in boxes):
            continue
        if b['type'] == 1:
            if r.width > 100 and r.height > 50:
                items.append((r.y0, {'kind': 'p', 'style': None, 'list': None, 'center': False, 'page': page.number + 1,
                                     'runs': [{'img': f'p{page.number + 1}-{sum(1 for _, x in items if x['kind'] == 'p' and x['runs'] and 'img' in x['runs'][0]) + 1}', 'box': [r.x0, r.y0, r.x1, r.y1], 't': ''}]}))
            continue
        for l in b['lines']:
            l['block'] = id(b)
            allrows.append(l)
    # Rows over the whole page: a full stop the PDF stored as its own text block joins its line again.
    allrows = rows_of({'lines': allrows})
    for row in allrows:
        row['block'] = row['lines'][0]['block']
    # Running header ("VOL 7 TEST 2" and the rule under it), page numbers: dropped.
    rows = []
    for row in sorted(allrows, key=lambda r: (round(r['y']), r['x'])):
        t = plain(row_runs(row)).strip()
        if not t or re.match(r'^(VOL \d+ TEST \d+\s*)?_*$', t) and row['top'] < 80:
            continue
        if re.match(r'^_{10,}$', t) or (row['top'] > H - 70 and re.match(r'^\d{1,3}$', t)):
            continue
        rows.append(row)
    # Paragraphs: a new one after a gap clearly wider than the usual line gap, at a list marker or column
    # layout (a tab), or where the source's own text block changes after any gap.
    gaps = sorted(rows[k]['top'] - rows[k - 1]['y'] for k in range(1, len(rows)))
    usual = gaps[len(gaps) // 4] if gaps else 0
    left = min((r['x'] for r in rows), default=0)

    def is_centered(row):
        x0, x1 = row['lines'][0]['bbox'][0], row['lines'][-1]['bbox'][2]
        return abs((x0 + x1) / 2 - W / 2) < 15 and x0 > left + 30 and (x1 - x0) < 0.8 * (right - left)

    right = max((r['lines'][-1]['bbox'][2] for r in rows), default=0)  # a line that stops short ends its paragraph
    cur = None
    for k, row in enumerate(rows):
        runs = row_runs(row)
        t = plain(runs)
        h = row['y'] - row['top']
        start = cur is None
        if not start:
            gap = row['top'] - last['y']
            ended = re.search(ENDED, plain(cur))
            bold_row = all(r.get('b') for r in runs if r['t'].strip())
            centered = is_centered(row)
            start = ('\t' in t
                     or re.match(r'^\s*[●•]', t)
                     or bold_row != last_bold
                     or centered != last_center and (ended or bold_row or last_bold)
                     or re.match(r'^\s*Questions?\s+\d', t)
                     or last_right < right - 45 and re.match(r'^\s*[\w-]+(\s[\w-]+)?:\s', t)
                     or re.match(r'^\s*Questions?\s+\d+\s*[-–]\s*\d+\s*$', plain(cur))
                     or last_right < right - 45 and re.match(r'^\s*[A-Z0-9•●]', t) and not re.match(r'^\s*([●•]|-\t)', plain(cur))
                     or ended and (gap > usual + 0.35 * h
                                   or last_right < right - 45
                                   or re.match(r'^\s*(\d{1,2}\s|[A-Z]\s)', t)
                                   or (row['block'] != last['block'] and gap > usual + 0.1 * h)))
        if start:
            if cur is not None:
                items.append((cur_top, para(cur, page.number + 1, center=cur_center)))
            cur, cur_top = runs, row['top']
            cx = (row['lines'][0]['bbox'][0] + row['lines'][-1]['bbox'][2]) / 2
            cur_center = abs(cx - W / 2) < 15 and row['x'] > 120
        else:
            cur = join(cur, runs)
        last = row
        last_right = row['lines'][-1]['bbox'][2]
        last_center = is_centered(row)
        last_bold = all(r.get('b') for r in runs if r['t'].strip())
    if cur is not None:
        items.append((cur_top, para(cur, page.number + 1, center=cur_center)))
    items.sort(key=lambda x: x[0])
    return [b for _, b in items]


def main():
    doc = pymupdf.open(sys.argv[1])
    blocks = []
    joins = []
    for page in doc:
        pb = page_blocks(page)
        if not pb:
            continue
        first = pb[0]
        if blocks and first['kind'] == 'p' and blocks[-1]['kind'] == 'p' and first['runs'] and 'img' not in first['runs'][0]:
            prev = plain(blocks[-1]['runs']).rstrip()
            nxt = plain(first['runs']).lstrip()
            if prev and not re.search(ENDED, prev) and not all(r.get('b') for r in first['runs'] if r['t'].strip()):
                blocks[-1]['runs'] = join(blocks[-1]['runs'], first['runs'])
                joins.append(page.number + 1)
                pb = pb[1:]
        blocks.extend(pb)
    # --images <dir>: each picture saved as <dir>/<id>.png (the page area of the picture, at 2x).
    if '--images' in sys.argv:
        out = sys.argv[sys.argv.index('--images') + 1]
        for b in blocks:
            for r in b.get('runs', []) if b['kind'] == 'p' else []:
                if 'img' in r:
                    page = doc[b['page'] - 1]
                    page.get_pixmap(matrix=pymupdf.Matrix(2, 2), clip=pymupdf.Rect(r['box'])).save(f"{out}/{r['img']}.png")
    json.dump({'blocks': blocks, 'joinedAtPages': joins}, sys.stdout, ensure_ascii=False)


main()
