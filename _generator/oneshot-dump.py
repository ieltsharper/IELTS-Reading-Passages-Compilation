"""Print one passage as plain text for writing its One-shot guide.
Usage: python _generator/oneshot-dump.py <topic> <slug>      (topic = data/<topic>.json)
       python _generator/oneshot-dump.py <topic> --list       (list slugs; * = already has a strategy)
"""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def runs_text(runs):
    out = []
    for r in runs or []:
        if 'gap' in r:
            out.append('[%s]' % r['gap'])
        elif 't' in r:
            out.append(r['t'])
    return ''.join(out)

def flat(x, depth=0):
    """Collect text lines from any block structure."""
    lines = []
    if isinstance(x, list) and x and all(isinstance(y, dict) and ('t' in y or 'gap' in y) and 'type' not in y for y in x):
        return [runs_text(x)]
    if isinstance(x, list):
        for y in x:
            lines += flat(y, depth)
    elif isinstance(x, dict):
        if 'runs' in x:
            t = runs_text(x['runs'])
            if t.strip():
                lines.append(('%s. ' % x['key'] if 'key' in x else '') + t)
        elif x.get('type') == 'table':
            for row in x['rows']:
                cells = []
                for c in row:
                    cells.append(' / '.join(flat(c)))
                lines.append(' | '.join(cells))
        else:
            for k, v in x.items():
                if k in ('type', 'numbers'):
                    continue
                if k == 'questions':
                    for q in v:
                        stem = flat(q.get('stem', []))
                        lines.append('Q%s: %s' % (q.get('n'), ' '.join(stem)))
                        for k2, v2 in q.items():
                            if k2 not in ('n', 'stem'):
                                lines += ['   ' + s for s in flat(v2)] if isinstance(v2, (list, dict)) else ['   %s: %s' % (k2, v2)]
                elif isinstance(v, (list, dict)):
                    lines += flat(v)
                elif isinstance(v, str) and k in ('title',):
                    lines.append(v)
                elif isinstance(v, list):
                    lines += [str(i) for i in v]
    elif isinstance(x, str):
        lines.append(x)
    return lines

def main():
    topic = sys.argv[1]
    d = json.load(open('data/%s.json' % topic, encoding='utf8'))
    if len(sys.argv) > 2 and sys.argv[2] == '--list':
        for p in d['passages']:
            print(('*' if p.get('strategy') else ' ') + ' ' + p['slug'])
        return
    p = next(p for p in d['passages'] if p['slug'] == sys.argv[2])
    print('SLUG:', p['slug'])
    print('TITLE:', ' '.join(flat(p['title'])) if not isinstance(p['title'], str) else p['title'])
    if p.get('standfirst'):
        print('STANDFIRST:', ' '.join(flat(p['standfirst'])))
    print('\n=== PASSAGE (paragraphs numbered in order) ===')
    for i, b in enumerate(p['body'], 1):
        t = ' '.join(flat(b)) if isinstance(b, (dict, list)) else str(b)
        print('[P%d] %s\n' % (i, t))
    print('=== QUESTIONS ===')
    for g in p['groups']:
        print('\n--- group type=%s ---' % g.get('type'))
        for l in flat([g]):
            print(l)
    print('\n=== OFFICIAL KEY (never change) ===')
    for n in sorted(p['key'], key=lambda s: int(s)):
        k = p['key'][n]
        ex = ' '.join(flat(k.get('explanation') or []))
        print('Q%s: %s   (accept: %s)\n    existing note: %s' % (n, k['answer'], k.get('accept'), ex[:500]))

main()
