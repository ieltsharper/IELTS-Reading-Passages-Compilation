// Automated checks of the generated pages against the source .docx (step 4).
// Usage: node _generator/check.mjs <topic> <questions.docx> [jsdom module path]
// 1. Passage text on each page = source text (normalised plain text), read straight from the .docx.
// 2. Question text (titles, instructions, statements, options, summaries) = source text, word by word.
// 3. Numbering continuous, no duplicates; questions = answers = inputs = navigator buttons.
// 4. Scoring with the real reading.js: key answers N/N, every alternative N/N, empty 0/N, one wrong N-1,
//    an over-long answer is marked wrong with the word-limit note.
// 5. Links and assets resolve; nothing is loaded from another site; every page has noindex and the top bar.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readDocx, textOf } from './docx.mjs';
import { applyFixes } from './runs.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const [topicName, questionsPath, keyPath, jsdomPath = 'D:/IELTS LEARNING PORTAL/node_modules/jsdom'] = process.argv.slice(2);
if (!keyPath) {
  console.error('Usage: node _generator/check.mjs <topic> <questions.docx> <key.docx> [jsdom path]');
  process.exit(1);
}
const { JSDOM } = createRequire(import.meta.url)(jsdomPath);
const config = (await import(`./topics/${topicName}.mjs`)).default;
const data = JSON.parse(fs.readFileSync(path.join(root, 'data', `${config.slug}.json`), 'utf8'));
const { blocks: Q } = readDocx(questionsPath);
// The source as approved: the owner's corrections (config.fixes) are part of the expected text.
applyFixes(Q, config.fixes);
const readingJs = fs.readFileSync(path.join(root, 'assets', 'reading.js'), 'utf8');
// Answers straight from the key, independent of the generator: the answer table ("Bài | Đáp án"), or
// for compilations the "✅ Câu n → X" lines of each "UNIT n" section.
const K = readDocx(keyPath).blocks;
let keyAnswers;
if (config.keyFormat === 'units') {
  const byUnit = {};
  let unit = null;
  for (const b of K) {
    const t = textOf(b).trim();
    const u = b.kind === 'p' && b.style === 'Heading1' && t.match(/^UNIT (\d+) ·/);
    if (u) unit = byUnit[u[1]] = {};
    const m = b.kind === 'p' && unit && t.match(/^✅ Câu (\d+)(?:[–-](\d+))?(?: – [^→]*)? → (.*)$/);
    if (m) unit[m[2] ? `${m[1]}-${m[2]}` : m[1]] = m[3].split(' (')[0].split(' – ')[0].trim();
  }
  keyAnswers = config.passages.map((pc) => byUnit[pc.unit]);
} else {
  const keyTable = K.find((b) => b.kind === 'tbl' && textOf(b).startsWith('Bài'));
  keyAnswers = keyTable.rows.slice(1).map((row) => {
    const out = {};
    for (const t of row[1].map(textOf).join(' ').split(' · ')) {
      const m = t.trim().match(/^(\d+(?:–\d+)?)\s+(.+)$/);
      out[m[1].replace('–', '-')] = m[2].trim();
    }
    return out;
  });
}

let failures = 0;
let passes = 0;
const fail = (msg) => {
  failures++;
  console.log('FAIL', msg);
};
const ok = (cond, msg) => (cond ? passes++ : fail(msg));

const norm = (s) => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
const range = ([a], [b]) => Q.slice(a, b + 1);
const blockText = (b) => (b.kind === 'p' ? textOf(b) : b.rows.map((r) => r.map((c) => c.map(blockText).join(' ')).join(' ')).join(' '));
/** Words for the question comparison: no answer leaders, no lone numbers/letters, no ☐. */
const words = (s) =>
  norm(s.replace(/[…_]{2,}/g, ' ').replace(/[☐\t]/g, ' ').replace(/\(\d+\)/g, ' '))
    .split(' ')
    .filter((w) => w && !/^(\d+[.)]?|\d+[-–]\d+|[A-J]\.?|[ivx]+|–|-)$/.test(w));

function diff(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (i === a.length && i === b.length) return null;
  return `at word ${i}: source "${a.slice(Math.max(0, i - 4), i + 6).join(' ')}" vs page "${b.slice(Math.max(0, i - 4), i + 6).join(' ')}"`;
}

const htmlFiles = [];
for (const [i, pc] of config.passages.entries()) {
  const p = data.passages[i];
  const file = path.join(root, config.slug, `${pc.slug}.html`);
  htmlFiles.push(file);
  const html = fs.readFileSync(file, 'utf8');
  const label = `P${i + 1} ${pc.slug}`;

  // ---- 1. Passage text ----
  const src = [...(pc.head || []).map(([n]) => Q[n]), Q[pc.title[0]], ...(pc.standfirst ? [Q[pc.standfirst[0]]] : []), ...range(...pc.body), ...(pc.footnotes ? range(...pc.footnotes) : [])]
    .map(blockText)
    .join(' ');
  const dom = new JSDOM(html, { url: `http://localhost/${config.slug}/${pc.slug}.html`, runScripts: 'outside-only' });
  const doc = dom.window.document;
  const article = doc.querySelector('article.passage').cloneNode(true);
  article.querySelectorAll('.sr-only').forEach((e) => e.remove()); // screen-reader labels are page text
  const pageText = [...article.querySelectorAll('p, h1, h2')].map((e) => e.textContent).join(' ');
  const d1 = diff(norm(src).split(' '), norm(pageText).split(' '));
  ok(!d1, `${label}: passage text differs ${d1}`);

  // ---- 2. Question text, group by group ----
  const sections = doc.querySelectorAll('section.q-group');
  ok(sections.length === pc.groups.length, `${label}: ${sections.length} question groups on the page, ${pc.groups.length} in the source`);
  pc.groups.forEach((g, gi) => {
    const parts = [Q[g.title[0]], ...(g.intro ? range(...g.intro) : [])];
    const opts = g.options ? (Array.isArray(g.options[0]) ? range(...g.options) : [Q[g.options[0]]]) : [];
    const before = g.optionsAfter ? [] : opts;
    const after = g.optionsAfter ? opts : [];
    const extra = g.extra ? range(...g.extra) : [];
    const main = g.items ? range(...g.items) : g.content ? range(...g.content) : g.grid ? [Q[g.grid[0]]] : [];
    const srcWords = words([...parts, ...before, ...extra, ...main, ...after].map(blockText).join(' '));
    const sec = sections[gi].cloneNode(true);
    // Not source text: feedback, marks, hints, selects, page labels and the TRUE/FALSE/NOT GIVEN buttons.
    sec.querySelectorAll('.fb, .fb-list, .mark, .hint, select, .sr-only, .ui-label, .tf .choices').forEach((e) => e.remove());
    sec.querySelectorAll('p, li, td, th, dt, dd, legend, label, h2, div').forEach((e) => e.append(' '));
    const d2 = diff(srcWords, words(sec.textContent));
    ok(!d2, `${label} ${g.title[1]}: question text differs ${d2}`);
  });

  // ---- 3. Numbering and inputs ----
  const ad = JSON.parse(doc.getElementById('answer-data').textContent);
  const nums = ad.questions.flatMap((q) => q.ns);
  const expected = p.groups.flatMap((g) => g.numbers);
  ok(nums.join() === expected.join(), `${label}: answer numbers ${nums.join()} vs questions ${expected.join()}`);
  ok(new Set(nums).size === nums.length, `${label}: duplicate question numbers`);
  for (let k = 1; k < nums.length; k++) ok(nums[k] === nums[k - 1] + 1, `${label}: numbering gap after ${nums[k - 1]}`);
  ok(ad.total === nums.length, `${label}: total ${ad.total} vs ${nums.length} numbers`);
  const navs = [...doc.querySelectorAll('.q-nav [data-nav]')].map((a) => +a.textContent);
  ok(navs.join() === nums.join(), `${label}: navigator ${navs.join()}`);
  const ka = keyAnswers[i];
  ok(Object.keys(ka).length === ad.questions.length, `${label}: key has ${Object.keys(ka).length} answers, page ${ad.questions.length} questions`);
  for (const q of ad.questions) {
    const want = q.kind === 'multi' ? ka[`${q.ns[0]}-${q.ns[q.ns.length - 1]}`] : ka[q.ns[0]];
    const got = q.kind === 'multi' ? q.accept.join(', ') : q.accept[0];
    ok(want === got, `${label}: ${q.id} answer on the page is ${JSON.stringify(got)}, key says ${JSON.stringify(want)}`);
    const els = doc.querySelectorAll(`[data-q="${q.id}"]`);
    ok(els.length > 0, `${label}: no input for ${q.id}`);
    ok(doc.getElementById(`fb-${q.id}`), `${label}: no feedback for ${q.id}`);
    ok(q.accept.length > 0, `${label}: no answer for ${q.id}`);
    // every input has a real label
    for (const e of els) ok(e.closest('label') || doc.querySelector(`label[for="${e.id}"]`), `${label}: input ${q.id} has no label`);
    const sel = els[0].tagName === 'SELECT' ? [...els[0].options].map((o) => o.value).filter(Boolean) : null;
    if (sel) ok(q.accept.every((a) => sel.includes(a)), `${label}: answer ${q.accept} of ${q.id} is not in its select`);
    if (els[0].type === 'radio' || els[0].type === 'checkbox') ok(q.accept.every((a) => [...els].some((e) => e.value === a)), `${label}: answer of ${q.id} is not a choice`);
  }
  // select option lists are complete (match the options shown or the letters of the group)
  p.groups.forEach((g) => {
    const letters = g.options?.list ? g.options.list.map((o) => o.key) : g.letters || null;
    if (!letters) return;
    for (const n of g.numbers) {
      const s = doc.getElementById(`q${n}`);
      if (s?.tagName === 'SELECT') ok([...s.options].map((o) => o.value).filter(Boolean).join('') === letters.join(''), `${label}: select q${n} letters incomplete`);
    }
  });

  // ---- 4. Scoring with the real reading.js ----
  const run = (fill) => {
    const d = new JSDOM(html, { url: `http://localhost/${config.slug}/${pc.slug}.html`, runScripts: 'outside-only' });
    d.window.confirm = () => true;
    d.window.HTMLElement.prototype.scrollIntoView = () => {};
    d.window.eval(readingJs);
    const r = d.window.__reading;
    for (const q of r.data.questions) r.setValue(q, fill(q));
    r.check();
    const score = d.window.document.getElementById('score').textContent;
    return { score: +score.match(/Score: (\d+)/)[1], doc: d.window.document, r, d };
  };
  const N = ad.total;
  const answers = (q) => (q.kind === 'multi' ? q.accept : q.accept[0]);
  ok(run(answers).score === N, `${label}: key answers do not score ${N}/${N}`);
  const maxAlt = Math.max(...ad.questions.map((q) => (q.kind === 'multi' ? 1 : q.accept.length)));
  for (let k = 1; k < maxAlt; k++) ok(run((q) => (q.kind === 'multi' ? q.accept : q.accept[Math.min(k, q.accept.length - 1)])).score === N, `${label}: alternative #${k} does not score ${N}/${N}`);
  // curly apostrophes, case, spaces and final full stop do not matter
  ok(run((q) => (q.kind === 'text' ? `  ${q.accept[0].toUpperCase().replace(/'/g, '\u2019')}. ` : answers(q))).score === N, `${label}: case/quote/spacing variants fail`);
  ok(run((q) => (q.kind === 'multi' ? [...q.accept].reverse() : answers(q))).score === N, `${label}: multi answers in another order fail`);
  ok(run(() => '').score === 0 && run((q) => (q.kind === 'multi' ? [] : '')).score === 0, `${label}: empty page does not score 0`);
  const first = ad.questions.find((q) => q.kind !== 'multi');
  const wrongFor = (q) => (q.kind === 'text' ? 'zzz' : [...doc.querySelectorAll(`[data-q="${q.id}"]`)].flatMap((e) => (e.tagName === 'SELECT' ? [...e.options].map((o) => o.value) : [e.value])).find((v) => v && !q.accept.includes(v)));
  const oneWrong = run((q) => (q === first || q.id === first.id ? wrongFor(q) : answers(q)));
  ok(oneWrong.score === N - 1, `${label}: one wrong answer scores ${oneWrong.score}, expected ${N - 1}`);
  ok(oneWrong.doc.getElementById(`mark-${first.id}`).textContent === '✗', `${label}: wrong answer not marked ✗`);
  // Every question individually wrong scores N-1 (catches an answer accepted by mistake).
  for (const q of ad.questions) {
    const w = wrongFor(q) ?? (q.kind === 'multi' ? null : 'zzz');
    if (q.kind === 'multi') {
      const wrongLetter = [...doc.querySelectorAll(`[data-q="${q.id}"]`)].map((e) => e.value).find((v) => !q.accept.includes(v));
      const res = run((x) => (x.id === q.id ? [...q.accept.slice(1), wrongLetter] : answers(x)));
      ok(res.score === N - 1, `${label}: ${q.id} with one wrong letter scores ${res.score}`);
    } else ok(run((x) => (x.id === q.id ? w : answers(x))).score === N - 1, `${label}: ${q.id} wrong still scores full`);
  }
  // Word limit: an over-long text answer is wrong and says so.
  const textQ = ad.questions.find((q) => q.kind === 'text');
  if (textQ) {
    const long = run((q) => (q.id === textQ.id ? `${q.accept[0]} and many more words here` : answers(q)));
    ok(long.score === N - 1 && /word limit/.test(long.doc.querySelector(`#fb-${textQ.id} .fb-result`).textContent), `${label}: over-long answer not flagged`);
  }
  // Answers survive a reload (localStorage).
  {
    const d = new JSDOM(html, { url: `http://localhost/${config.slug}/${pc.slug}.html`, runScripts: 'outside-only' });
    d.window.HTMLElement.prototype.scrollIntoView = () => {};
    d.window.eval(readingJs);
    const q0 = d.window.__reading.data.questions[0];
    const el = d.window.document.querySelector(`[data-q="${q0.id}"]`);
    d.window.__reading.setValue(q0, answers(q0));
    el.dispatchEvent(new d.window.Event('change', { bubbles: true }));
    const saved = d.window.localStorage.getItem(`ih-reading:/${config.slug}/${pc.slug}.html`);
    ok(saved && saved.includes(JSON.stringify(answers(q0))), `${label}: answer not saved in localStorage`);
  }
}

// ---- 5. Links, assets, external requests, noindex, top bar ----
const allHtml = [path.join(root, 'index.html'), path.join(root, config.slug, 'index.html'), ...htmlFiles];
for (const f of allHtml) {
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(root, f);
  ok(html.includes('<meta name="robots" content="noindex, nofollow">'), `${rel}: no robots noindex`);
  ok(html.includes('class="brand-mark" aria-hidden="true">IH</span>IELTS Harper Portal') && html.includes('href="https://ieltsharper.github.io/portal/"'), `${rel}: no portal top bar`);
  for (const m of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    const url = m[2];
    if (url.startsWith('#')) continue;
    if (/^https?:/.test(url)) {
      ok(m[1] === 'href' && url === 'https://ieltsharper.github.io/portal/', `${rel}: external ${m[1]} ${url}`);
      continue;
    }
    ok(fs.existsSync(path.join(path.dirname(f), url.split('#')[0])), `${rel}: broken link ${url}`);
  }
  ok(!/<(script|link|img|iframe)[^>]+(src|href)="https?:/.test(html), `${rel}: loads something from another site`);
  if (htmlFiles.includes(f)) ok(!/<a [^>]*href="(?!#)[^"]*"(?![^>]*target="_blank")/.test(html), `${rel}: a link that leaves the page does not open a new tab`);
}
ok(!/https?:\/\//.test(readingJs) && !/fetch\(|XMLHttpRequest|sendBeacon/.test(readingJs), 'reading.js makes network requests');

console.log(`\n${passes} checks passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
