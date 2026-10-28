// Step 2 of the generator: data/*.json -> HTML pages (index.html, <topic>/index.html, <topic>/<passage>.html).
// Usage: node _generator/build-html.mjs
// Never edit the generated HTML by hand: change this file or the data, then run it again.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORTAL = 'https://ieltsharper.github.io/portal/';
const SITE = 'IELTS Reading Passages';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = (runs) => (runs || []).map((r) => r.t || '').join('');

/** Runs -> HTML. `gap` runs are handed to onGap(n). */
function runsHtml(runs, onGap, opts = {}) {
  return (runs || [])
    .map((r) => {
      if (r.gap) return onGap ? onGap(r.gap, r.part) : `[${r.gap}]`;
      // A picture from the PDF (assets/img/<topic>/<id>.png), e.g. a flow-chart.
      if (r.img) return `<img class="chart" src="../assets/img/${opts.topic}/${r.img}.png" alt="${esc(opts.alt || 'Picture from the test paper')}">`;
      if (r.t === undefined) return '';
      let h = esc(r.t).replace(/\t/g, ' ').replace(/\n/g, '<br>');
      if (r.u) h = `<u>${h}</u>`;
      if (r.i) h = `<em>${h}</em>`;
      if (r.b) h = `<strong>${h}</strong>`;
      return h;
    })
    .join('');
}

/** Generic blocks (p / list p / table / h) -> HTML; consecutive list paragraphs become one <ul>. */
function blocksHtml(blocks, opts = {}) {
  let out = '';
  let inList = false;
  for (const b of blocks) {
    if (b.type === 'p' && b.list) {
      if (!inList) out += '<ul>';
      inList = true;
      out += `<li>${runsHtml(b.runs, opts.onGap)}</li>`;
      continue;
    }
    if (inList) out += '</ul>';
    inList = false;
    if (b.type === 'h') out += `<h3>${runsHtml(b.runs)}</h3>`;
    else if (b.type === 'p') out += `<p${b.center ? ' class="center"' : ''}>${runsHtml(b.runs, opts.onGap, opts)}</p>`;
    else out += tableHtml(b, opts);
  }
  if (inList) out += '</ul>';
  return out;
}

function tableHtml(t, opts) {
  // Drop columns that are empty in every row (e.g. the blank first column of the TRUE/FALSE legend).
  const width = Math.max(...t.rows.map((r) => r.length));
  const keep = [...Array(width).keys()].filter((c) => t.rows.some((r) => r[c] && r[c].length));
  const rows = t.rows.map((r, i) => `<tr>${keep.map((c) => {
    const tag = i === 0 && opts.headerRow ? 'th' : 'td';
    return `<${tag}>${blocksHtml(r[c] || [], opts)}</${tag}>`;
  }).join('')}</tr>`);
  return `<div class="table-wrap"><table>${rows.join('')}</table></div>`;
}

function page({ title, depth, back, newTab, body, data, scripts }) {
  const up = '../'.repeat(depth);
  const nt = newTab ? ' target="_blank" rel="noopener"' : '';
  const ntNote = newTab ? '<span class="sr-only"> (opens in a new tab)</span>' : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${up}assets/theme.css">
</head>
<body${data ? ' class="reading"' : ''}>
<header class="topbar">
  <div class="topbar-inner">
    <a class="brand" href="${PORTAL}"${nt}><span class="brand-mark" aria-hidden="true">IH</span>IELTS Harper Portal${ntNote}</a>
    ${back ? `<a class="topbar-link" href="${back.href}"${nt}>← ${esc(back.label)}${ntNote}</a>` : ''}
  </div>
</header>
${body}
${data ? `<script type="application/json" id="answer-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>` : ''}
${(scripts || []).map((s) => `<script src="${up}assets/${s}"></script>`).join('\n')}
</body>
</html>
`;
}

// ---- Passage page ----
function typesOf(p) {
  const names = { tfng: 'TFNG', ynng: 'YNNG', mcq: 'multiple choice', multi: 'multiple choice (choose three)', gap: 'completion', bank: 'summary completion (word list)', headings: 'matching headings', short: 'short answer' };
  const out = [];
  for (const g of p.groups) {
    let t = names[g.type];
    const intro = g.intro.map((b) => plain(b.runs)).join(' ');
    if (g.type === 'gap') {
      const first = plain(g.intro[0]?.runs);
      t = /summary/i.test(first) ? 'summary completion' : /notes/i.test(first) ? 'note completion' : /sentences/i.test(first) ? 'sentence completion' : /table/i.test(first) ? 'table completion' : /flow-chart/i.test(first) ? 'flow-chart completion' : 'completion';
    }
    if (g.type === 'bank' && /ending/i.test(intro)) t = 'matching sentence endings';
    if (g.type === 'grid' || g.type === 'match') {
      t = g.options?.list[0]?.key === 'i' ? 'matching headings' : /Which paragraph/i.test(intro) ? 'matching information' : /ending/i.test(intro) ? 'matching sentence endings' : 'matching features';
    }
    if (g.typeName) t = g.typeName;
    if (!out.includes(t)) out.push(t);
  }
  return out;
}
export const countOf = (p) => p.groups.reduce((s, g) => s + g.numbers.length, 0);
export const noteOf = (p) => `${countOf(p)} questions: ${typesOf(p).join(', ')}`;

function feedback(id, key, extra = '', multi = false) {
  const alt = multi ? ' <span class="muted">(in any order)</span>' : key.accept.length > 1 ?` <span class="muted">(also accepted: ${key.accept.slice(1).map(esc).join(', ')})</span>` : '';
  return `<div class="fb" id="fb-${id}" hidden>
  <p class="fb-result" aria-hidden="true"></p>
  <p class="fb-answer"><strong>Answer:</strong> ${esc(key.answer)}${extra}${alt}</p>
  ${key.evidence && plain(key.evidence).trim() ? `<blockquote class="fb-evidence">${runsHtml(key.evidence)}</blockquote>` : ''}
  ${key.explanation.length ? `<div class="fb-expl" lang="vi">${blocksHtml(key.explanation)}</div>` : ''}
</div>`;
}

function optionListHtml(opts) {
  return `<div class="option-list">${opts.title ? opts.title.map((t) => `<p class="option-title">${runsHtml(t)}</p>`).join('') : ''}
  <dl>${opts.list.map((o) => `<div><dt>${esc(o.key)}</dt><dd>${runsHtml(o.runs)}</dd></div>`).join('')}</dl></div>`;
}

function selectHtml(id, label, choices) {
  return `<select id="${id}" name="${id}" data-q="${id}">${label ? '' : ''}<option value="">–</option>${choices.map((c) => `<option value="${esc(c.value)}">${esc(c.text)}</option>`).join('')}</select>`;
}

function groupHtml(g, p, qs) {
  const key = p.key;
  let h = `<section class="q-group" aria-labelledby="g-${g.numbers[0]}">
<h2 id="g-${g.numbers[0]}">${esc(g.title)}</h2>
<div class="instr">${blocksHtml(g.intro)}</div>`;
  const before = g.options && !Array.isArray(g.options) && !g.optionsAfter ? optionListHtml(g.options) : '';
  const after = g.options && !Array.isArray(g.options) && g.optionsAfter ? optionListHtml(g.options) : '';
  h += before;
  if (g.extra) h += `<div class="extra">${blocksHtml(g.extra)}</div>`;

  if (g.type === 'short') {
    for (const q of g.questions) {
      const id = `q${q.n}`;
      h += `<div class="q short" id="item-${id}">
  <label class="match-row" for="${id}"><span class="qn">${q.n}</span> <span class="stem">${runsHtml(q.stem)}</span></label>
  <span class="short-input"><input type="text" id="${id}" name="${id}" data-q="${id}" autocomplete="off" autocapitalize="off" spellcheck="false"><span class="mark" id="mark-${id}" aria-hidden="true"></span></span>
  ${feedback(id, key[q.n])}
</div>`;
      qs.push({ id, ns: [q.n], kind: 'text', accept: key[q.n].accept, limit: g.limit });
    }
  } else if (g.type === 'tfng' || g.type === 'ynng' || g.type === 'mcq') {
    for (const q of g.questions) {
      const id = `q${q.n}`;
      const choices = g.type === 'mcq' ? q.options.map((o) => ({ value: o.key, html: `<span class="opt-key">${esc(o.key)}</span> ${runsHtml(o.runs)}` })) : g.choices.map((c) => ({ value: c, html: esc(c) }));
      h += `<fieldset class="q ${g.type === 'mcq' ? 'mcq' : 'tf'}" id="item-${id}">
  <legend><span class="qn">${q.n}</span> <span class="stem">${runsHtml(q.stem)}</span></legend>
  <div class="choices">${choices.map((c, i) => `<label class="choice"><input type="radio" name="${id}" value="${esc(c.value)}" data-q="${id}"${i === 0 ? ` id="${id}"` : ''}><span>${c.html}</span></label>`).join('')}</div>
  <span class="mark" id="mark-${id}" aria-hidden="true"></span>
  ${feedback(id, key[q.n])}
</fieldset>`;
      qs.push({ id, ns: [q.n], kind: 'choice', accept: key[q.n].accept });
    }
  } else if (g.type === 'multi') {
    const id = `q${g.numbers[0]}-${g.numbers[g.numbers.length - 1]}`;
    h += `<fieldset class="q mcq multi" id="item-${id}" data-choose="${g.choose}">
  <legend><span class="qn">${esc(g.label)}</span> <span class="stem">${runsHtml(g.stem)}</span></legend>
  <div class="choices">${g.options.map((o, i) => `<label class="choice"><input type="checkbox" name="${id}" value="${o.key}" data-q="${id}"${i === 0 ? ` id="${id}"` : ''}><span><span class="opt-key">${o.key}</span> ${runsHtml(o.runs)}</span></label>`).join('')}</div>
  <p class="hint" id="hint-${id}">Choose ${g.choose}. Each correct letter scores one mark. <span class="mark" id="mark-${id}" aria-hidden="true"></span></p>
  ${feedback(id, g.key, '', true)}
</fieldset>`;
    qs.push({ id, ns: g.numbers, kind: 'multi', accept: g.key.accept, choose: g.choose });
  } else if (g.type === 'match' || g.type === 'grid' || g.type === 'headings') {
    const letters = g.options ? g.options.list.map((o) => o.key) : g.letters;
    h += '<div class="match-list">';
    for (const q of g.questions) {
      const id = `q${q.n}`;
      // Heading questions sit in the passage ("27 ……"); the label here is page text, not source text.
      const stem = q.stem ? runsHtml(q.stem) : `<span class="ui-label">Heading for the paragraph marked <a href="#marker-${q.n}">${q.n}</a> in the passage</span>`;
      h += `<div class="q match" id="item-${id}">
  <label class="match-row" for="${id}"><span class="qn">${q.n}</span> <span class="stem">${stem}</span></label>
  <span class="match-input">${selectHtml(id, null, letters.map((l) => ({ value: l, text: l })))}<span class="mark" id="mark-${id}" aria-hidden="true"></span></span>
  ${feedback(id, key[q.n])}
</div>`;
      qs.push({ id, ns: [q.n], kind: 'choice', accept: key[q.n].accept });
    }
    h += '</div>';
  } else if (g.type === 'gap' || g.type === 'bank') {
    const bank = g.type === 'bank' ? g.options.list : null;
    // Sentence endings are too long for a dropdown: show letters only (the list is on the page).
    const longBank = bank && bank.some((o) => plain(o.runs).length > 30);
    const isPair = (n) => g.pairs?.includes(n);
    const textInput = (id, dataQ) => `<input type="text" id="${id}" name="${id}" data-q="${dataQ}" autocomplete="off" autocapitalize="off" spellcheck="false">`;
    const onGap = (n, part) => {
      const id = `q${n}`;
      // The second blank of a two-blank question: same question, its own box; the mark follows it.
      if (part === 2) return `<span class="gap"><label class="sr-only" for="${id}b">Question ${n}, second blank</label>${textInput(`${id}b`, id)}<span class="mark" id="mark-${id}" aria-hidden="true"></span></span>`;
      const input = bank
        ? selectHtml(id, null, bank.map((o) => ({ value: o.key, text: longBank ? o.key : `${o.key} ${plain(o.runs)}` })))
        : textInput(id, id);
      const mark = isPair(n) ? '' : `<span class="mark" id="mark-${id}" aria-hidden="true"></span>`;
      return `<span class="gap" id="item-${id}"><label class="qn" for="${id}"><span class="sr-only">Question </span>${n}${isPair(n) ? '<span class="sr-only">, first blank</span>' : ''}</label>${input}${mark}</span>`;
    };
    h += `<div class="content">${blocksHtml(g.content, { onGap, topic: p.topicSlug, alt: g.imageAlt })}</div>`;
    h += `<div class="fb-list">${g.numbers.map((n) => {
      const word = bank ? bank.find((o) => o.key === key[n].answer) : null;
      let extra = word ? ` <span class="muted">(${esc(plain(word.runs))})</span>` : '';
      if (isPair(n)) extra += ' <span class="muted">(two blanks, in either order)</span>';
      if (key[n].unordered) extra += ` <span class="muted">(${key[n].unordered.second ? key[n].unordered.with : n} and ${key[n].unordered.second ? n : key[n].unordered.with} can be in either order)</span>`;
      const k = isPair(n) || key[n].unordered ? { ...key[n], accept: [key[n].answer] } : key[n];
      return `<div class="fb-row"><span class="qn">${n}</span>${feedback(`q${n}`, k, extra)}</div>`;
    }).join('')}</div>`;
    for (const n of g.numbers) {
      const q = { id: `q${n}`, ns: [n], kind: bank ? 'choice' : isPair(n) ? 'pair' : 'text', accept: key[n].accept, ...(bank ? {} : { limit: g.limit }) };
      if (key[n].unordered) q.unordered = { with: `q${key[n].unordered.with}`, second: key[n].unordered.second };
      qs.push(q);
    }
  }
  h += after;
  return `${h}\n</section>`;
}

function passagePage(topic, p) {
  const qs = [];
  const groups = p.groups.map((g) => groupHtml(g, { ...p, topicSlug: topic.slug }, qs)).join('\n');
  const total = countOf(p);
  const head = p.head.map((b) => `<p class="p-head">${runsHtml(b.runs)}</p>`).join('');
  // The source line is "27 ……": keep its dots, link the number to its question.
  const markerText = (b) =>
    `<p class="h-marker" id="marker-${b.marker}"><a class="qn" href="#item-q${b.marker}">${b.marker}</a> <span aria-hidden="true">${runsHtml(b.runs)}</span><span class="sr-only">Heading question ${b.marker} for the next paragraph</span></p>`;
  const body = p.body
    .map((b) =>
      b.marker
        ? markerText(b)
        : b.sub || b.example
          ? `<h2 class="p-sub${b.example ? ' p-example' : ''}">${runsHtml(b.runs)}</h2>`
          : `<p class="para">${b.letter ? `<span class="p-letter">${b.letter}</span> ` : ''}${runsHtml(b.runs)}</p>`,
    )
    .join('\n');
  const html = `<div class="toolbar" role="region" aria-label="Test controls">
  <p class="toolbar-title">${esc(topic.topic)} · ${esc(labelOf(topic, p))}</p>
  <div class="timer-wrap"><span class="timer" id="timer" role="timer" aria-label="Timer, 20 minutes">20:00</span><button type="button" class="btn" id="timer-btn">Start timer</button></div>
  <p class="answered" aria-live="polite">Answered <strong id="answered">0</strong> / ${total}</p>
  <div class="actions">
    <button type="button" class="btn btn-primary" id="check-btn">Check answers</button>
    <button type="button" class="btn" id="show-btn">Show answers</button>
    <button type="button" class="btn btn-danger" id="reset-btn">Reset</button>
  </div>
</div>
<main class="split">
  <section class="pane passage-pane" id="passage-pane" aria-labelledby="passage-title" tabindex="0">
    <article class="passage">
      ${head}
      <h1 id="passage-title">${runsHtml(p.title)}</h1>
      ${p.standfirst ? `<p class="standfirst">${runsHtml(p.standfirst.runs)}</p>` : ''}
      ${body}
      ${p.footnotes.length ? `<div class="footnotes">${blocksHtml(p.footnotes)}</div>` : ''}
    </article>
  </section>
  <div class="splitter" id="splitter" role="separator" aria-orientation="vertical" aria-controls="passage-pane" aria-label="Resize the passage and the questions" aria-valuemin="20" aria-valuemax="80" aria-valuenow="50" tabindex="0" title="Drag to resize (double-click to reset)"></div>
  <section class="pane questions-pane" aria-label="Questions">
    <div class="score" id="score" role="status" aria-live="polite"></div>
    ${p.keyNotes?.length ? `<div class="key-note" lang="vi">${blocksHtml(p.keyNotes)}</div>` : ''}
    ${groups}
    ${p.strategy.length ? `<details class="strategy" lang="vi"><summary>Hướng dẫn One-Shot</summary>${blocksHtml(p.strategy, { headerRow: true })}</details>` : ''}
    ${p.reading?.length ? `<details class="strategy reading" lang="vi"><summary>Phân tích từng đoạn</summary>${blocksHtml(p.reading, { headerRow: true })}</details>` : ''}
    ${p.vocab?.length ? `<details class="strategy vocab" lang="vi"><summary>Từ vựng học thuật</summary>${blocksHtml(p.vocab, { headerRow: true })}</details>` : ''}
    <nav class="q-nav" aria-label="Question navigator">${qs.flatMap((q) => q.ns.map((n) => `<a href="#item-${q.id}" class="nav-btn" data-nav="${q.id}" id="nav-${n}">${n}</a>`)).join('')}</nav>
  </section>
</main>
<div class="sr-only" id="announce" aria-live="assertive"></div>`;
  return page({
    title: `${plain(p.title)} – ${topic.topic} – ${SITE}`,
    depth: 1,
    back: { href: 'index.html', label: `${topic.topic} passages` },
    newTab: true,
    body: html,
    data: { total, questions: qs },
    scripts: ['reading.js'],
  });
}

export const labelOf = (topic, p) => `${topic.numberLabel || 'Passage'} ${p.number ?? p.order}`;

function topicPage(topic) {
  const li = (p) => `<li><a href="${p.slug}.html"><span><span class="item-title">${esc(labelOf(topic, p))}: ${runsHtml(p.title)}</span><span class="item-note">${esc(noteOf(p))}</span></span></a></li>`;
  // Topics with themes (config `groups`) list their passages under one heading per theme.
  const items = topic.groups
    ? topic.groups
        .map((name) => {
          const ps = topic.passages.filter((p) => p.group === name);
          return ps.length ? `<h2 class="group-title">${esc(name)}</h2>\n<ul class="menu-list">\n${ps.map(li).join('\n')}\n</ul>` : '';
        })
        .join('\n')
    : `<ul class="menu-list">\n${topic.passages.map(li).join('\n')}\n</ul>`;
  return page({
    title: `${topic.topic} – ${SITE}`,
    depth: 1,
    back: { href: '../index.html', label: 'All topics' },
    body: `<main class="container">
<h1>${esc(topic.topic)}</h1>
<p class="summary">${topic.passages.length} reading passages, ${topic.passages.reduce((s, p) => s + countOf(p), 0)} questions. Answers are saved in this browser; check them on each page.</p>
${topic.topicNotes ? `<details class="strategy topic-notes" lang="vi"><summary>Các bẫy lặp lại trong đề</summary>${blocksHtml(topic.topicNotes)}</details>` : ''}
${items}
</main>`,
  });
}

function rootPage(topics) {
  const items = topics
    .map((t) => `<li><a href="${t.slug}/index.html"><span><span class="item-title">${esc(t.topic)}</span><span class="item-note">${t.passages.length} passages, ${t.passages.reduce((s, p) => s + countOf(p), 0)} questions</span></span></a></li>`)
    .join('\n');
  return page({
    title: SITE,
    depth: 0,
    body: `<main class="container">
<h1>${SITE}</h1>
<p class="summary">IELTS Academic Reading practice by topic.</p>
<ul class="menu-list">
${items}
</ul>
</main>`,
  });
}

// ---- Build ----
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const topics = fs
    .readdirSync(path.join(root, 'data'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8')))
    .sort((a, b) => a.topic.localeCompare(b.topic));
  for (const t of topics) {
    const dir = path.join(root, t.slug);
    fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) if (f.endsWith('.html')) fs.unlinkSync(path.join(dir, f));
    fs.writeFileSync(path.join(dir, 'index.html'), topicPage(t));
    for (const p of t.passages) fs.writeFileSync(path.join(dir, `${p.slug}.html`), passagePage(t, p));
    console.log(`${t.slug}: ${t.passages.length} passage pages`);
  }
  fs.writeFileSync(path.join(root, 'index.html'), rootPage(topics));
}
