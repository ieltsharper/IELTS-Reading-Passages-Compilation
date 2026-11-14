// Checks of the Recent Actual Test 7 pages (built by build-rat7.mjs from the guide PDF).
// Usage: node _generator/check-rat7.mjs     (jsdom from the portal, or JSDOM_PATH; blocks from build-rat7.mjs's cache)
// 1. Passage text on each page = the guide's text (word by word, paragraph letters ignored).
// 2. Question text on each page = the guide's text (same words, order aside: word banks are re-sorted).
// 3. Numbering continuous; every answer on the page matches the guide's "Câu n: ..." line, independently re-read here.
// 4. Scoring with the real reading.js: key answers N/N, every alternative N/N, empty 0, each question wrong N-1.
// 5. Links and assets resolve, nothing loads from another site, noindex and the top bar are there.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsdomPath = process.env.JSDOM_PATH || 'D:/IELTS LEARNING PORTAL/node_modules/jsdom';
const { JSDOM } = createRequire(import.meta.url)(jsdomPath);
const SLUG = 'recent-actual-test-7';
const data = JSON.parse(fs.readFileSync(path.join(root, 'data', `${SLUG}.json`), 'utf8'));
const { blocks } = JSON.parse(fs.readFileSync(process.env.RAT7_BLOCKS || path.join(os.tmpdir(), 'rat7', 'reading-blocks.json'), 'utf8'));
const readingJs = fs.readFileSync(path.join(root, 'assets', 'reading.js'), 'utf8');
const STARTS = [12, 109, 224, 336, 446, 547, 678, 818, 940, 1059, 1172, 1263, 1362, 1482, 1578, 1713, 1808, 1923, 2022];

let failures = 0;
let passes = 0;
const ok = (c, m) => (c ? passes++ : (failures++, console.log('FAIL', m)));
const norm = (s) => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
const runsText = (rs) => (rs || []).map((r) => r.t || '').join('');
const blockText = (b) => (b.kind === 'tbl' ? b.rows.map((r) => r.map((c) => c.map(blockText).join(' ')).join(' ')).join(' ') : runsText(b.runs));
const text = (i) => blockText(blocks[i]);
const endOfQuestions = (k) => {
  for (let i = STARTS[k - 1]; i < STARTS[k]; i++) if (/^(KEY|Câu\s*\d+)/.test(text(i).trim())) return i;
  throw new Error(`no key in passage ${k}`);
};
const headerIndexes = (k) => {
  const out = [];
  for (let i = STARTS[k - 1]; i < endOfQuestions(k); i++) if (blocks[i].kind === 'p' && /^Questions?\s+\d/i.test(text(i).trim())) out.push(i);
  return out;
};
const wordsOf = (s) =>
  norm(s.replace(/[…_]{2,}/g, ' ').replace(/[☐\t]/g, ' ').replace(/\(\d+\)/g, ' ').replace(/[“”"‘’']/g, '').replace(/[–—]/g, ' ').replace(/(^|\s)-(?=\d)/g, ' '))
    .toLowerCase()
    .split(' ')
    .filter((w) => w && !/^(\d+[.):]?|\d+-\d+|[a-z]\.?|[ivx]+|-|…)$/.test(w));
const bagDiff = (a, b) => {
  const m = new Map();
  for (const w of a) m.set(w, (m.get(w) || 0) + 1);
  for (const w of b) m.set(w, (m.get(w) || 0) - 1);
  const missing = [];
  const extra = [];
  for (const [w, n] of m) for (let j = 0; j < Math.abs(n); j++) (n > 0 ? missing : extra).push(w);
  return { missing, extra };
};
const LABELS = /(Vị trí|Câu hỏi|Từ khóa|Giải thích|Dẫn chứng|Bẫy)/;
const keyLines = (k) => {
  const out = {};
  for (let i = endOfQuestions(k); i < STARTS[k]; i++) {
    const m = /^Câu\s*(\d+)\s*[:：]\s*(.*)$/s.exec(text(i).trim());
    if (!m) continue;
    const cut = m[2].search(LABELS);
    out[m[1]] = norm(cut >= 0 ? m[2].slice(0, cut) : m[2]);
  }
  return out;
};

const htmlFiles = [];
for (const [i, p] of data.passages.entries()) {
  const k = i + 1;
  const file = path.join(root, SLUG, `${p.slug}.html`);
  htmlFiles.push(file);
  const html = fs.readFileSync(file, 'utf8');
  const label = `P${k} ${p.slug}`;
  const dom = new JSDOM(html, { url: `http://localhost/${SLUG}/${p.slug}.html`, runScripts: 'outside-only' });
  const doc = dom.window.document;

  // ---- 1. Passage text ----
  const hs = headerIndexes(k);
  const srcPassage = [];
  for (let j = STARTS[k - 1]; j < hs[0]; j++) srcPassage.push(text(j));
  const article = doc.querySelector('article.passage').cloneNode(true);
  article.querySelectorAll('.sr-only').forEach((e) => e.remove());
  const pageText = [...article.querySelectorAll('p, h1, h2')].map((e) => e.textContent).join(' ');
  const d1 = bagDiff(wordsOf(srcPassage.join(' ')), wordsOf(pageText));
  ok(!d1.missing.length && !d1.extra.length, `${label}: passage words differ. In the guide only: ${d1.missing.slice(0, 15)}; on the page only: ${d1.extra.slice(0, 15)}`);
  // order, too
  const sw = wordsOf(srcPassage.join(' '));
  const pw = wordsOf(pageText);
  let at = -1;
  for (let j = 0; j < Math.min(sw.length, pw.length); j++) if (sw[j] !== pw[j]) { at = j; break; }
  ok(at < 0 && sw.length === pw.length, `${label}: passage text order differs at word ${at}: guide "${sw.slice(Math.max(0, at - 4), at + 6).join(' ')}" vs page "${pw.slice(Math.max(0, at - 4), at + 6).join(' ')}"`);

  // ---- 2. Question text ----
  const sections = [...doc.querySelectorAll('section.q-group')];
  ok(sections.length === hs.length, `${label}: ${sections.length} question groups on the page, ${hs.length} in the guide`);
  const qEnd = endOfQuestions(k);
  hs.forEach((h, gi) => {
    const to = hs[gi + 1] ?? qEnd;
    let src = '';
    for (let j = h; j < to; j++) src += ' ' + text(j);
    const g = p.groups[gi];
    if (g.type === 'tfng' || g.type === 'ynng') src = src.replace(/(^|\s)(TRUE|FALSE|NOT GIVEN|YES|NO)( (TRUE|FALSE|NOT GIVEN|YES|NO))+(?=\s|$)/g, ' ');
    const sec = sections[gi].cloneNode(true);
    sec.querySelectorAll('.fb, .fb-list, .mark, .hint, select, .sr-only, .ui-label, .tf .choices').forEach((e) => e.remove());
    sec.querySelectorAll('p, li, td, th, dt, dd, legend, label, h2, div').forEach((e) => e.append(' '));
    const d = bagDiff(wordsOf(src), wordsOf(sec.textContent));
    // Words the page adds for its own sake, or leaves out on purpose (labels, the "A-K" lists, the Great Eastern slip)
    // (passage 6's printed "Example Answer" is shown as "Example:"; passage 18's "of the Great Eastern" slip is dropped)
    const skip = ['true', 'false', 'not', 'given', 'yes', 'no', 'list', 'headings', 'phrases', 'statements', 'of', 'questions', 'question', ...(k === 6 && gi === 0 ? ['answer', 'example', 'example:'] : []), ...(k === 18 && gi === 2 ? ['the', 'great', 'eastern.', 'below.'] : [])];
    const meaningful = (ws) => ws.filter((w) => !skip.includes(w));
    const mm = meaningful(d.missing);
    const ee = meaningful(d.extra);
    ok(!mm.length && !ee.length, `${label} ${g.title}: question words differ. Guide only: ${mm.slice(0, 20)}; page only: ${ee.slice(0, 20)}`);
  });

  // ---- 3. Numbering, answers and inputs ----
  const ad = JSON.parse(doc.getElementById('answer-data').textContent);
  const nums = ad.questions.flatMap((q) => q.ns);
  const expected = p.groups.flatMap((g) => g.numbers);
  ok(nums.join() === expected.join(), `${label}: answer numbers ${nums.join()} vs questions ${expected.join()}`);
  ok(new Set(nums).size === nums.length, `${label}: duplicate question numbers`);
  for (let j = 1; j < nums.length; j++) ok(nums[j] === nums[j - 1] + 1, `${label}: numbering gap after ${nums[j - 1]}`);
  ok(ad.total === nums.length, `${label}: total ${ad.total} vs ${nums.length} numbers`);
  const navs = [...doc.querySelectorAll('.q-nav [data-nav]')].map((a) => +a.textContent);
  ok(navs.join() === nums.join(), `${label}: navigator ${navs.join()}`);
  const raw = keyLines(k);
  const lowers = (s) => s.toLowerCase().replace(/[“”"‘’']/g, '').replace(/[.;]+$/, '').trim();
  for (const q of ad.questions) {
    const n = q.ns[0];
    const r = raw[q.kind === 'multi' ? q.ns[0] : n];
    const got = q.accept;
    if (q.kind === 'multi') {
      ok(q.ns.every((x) => raw[x] || raw[q.ns[0]]), `${label}: no key line for ${q.id}`);
    } else if (r === undefined) {
      // passage 16 questions 39 and 40 are not in the guide; they are explained on the page
      ok(k === 16 && (n === 39 || n === 40), `${label}: no "Câu ${n}" line in the guide`);
    } else {
      const wantAlts = (/^\w\/\w$/.test(r) ? [r] : r.split(/\s*\/\s*/)).map(lowers);
      const gotL = got.map(lowers);
      const g = p.groups.find((x) => x.numbers.includes(n));
      const lead = /^([ivx]+|[A-Z])(?=\W|$)/.exec(r)?.[1]; // "viii Geographical..." / "W: Winn" -> the letter or numeral
      if (['tfng', 'ynng'].includes(g.type)) {
        ok(gotL.length === 1 && gotL[0] === lowers(r), `${label}: ${q.id} accepts ${gotL}, the guide says ${r}`);
      } else if (['headings', 'grid', 'match'].includes(g.type) || (g.type === 'bank' && lead && g.options.list.some((o) => o.key === lead))) {
        ok(gotL.length === 1 && lead && gotL[0] === lowers(lead), `${label}: ${q.id} accepts ${gotL}, the guide says ${r}`);
      } else if (g.type === 'bank') {
        const w = lowers(r).replace(/^academic /, '');
        const opt = (g.options.list || []).find((o) => lowers(runsText(o.runs)) === w) || (g.options.list || []).find((o) => lowers(runsText(o.runs)).startsWith(w));
        ok(opt && gotL.length === 1 && gotL[0] === lowers(opt.key), `${label}: ${q.id} accepts ${gotL}, the guide says ${r}`);
      } else {
        // words: the first answer on the page is the guide's first alternative; every alternative of the guide is accepted
        // unless the guide's slash means "cold waters / (cold) temperatures" style (listed below).
        const first = wantAlts[0].replace(/^\([^)]*\)\s*/, '');
        const slashHandled = ['17-9', '17-10'].includes(`${k}-${n}`);
        ok(gotL[0] === first || slashHandled, `${label}: ${q.id} first answer ${gotL[0]} vs guide ${first}`);
        if (!slashHandled && !/^\w\/\w$/.test(r)) for (const a of wantAlts) ok(gotL.includes(a.replace(/^\([^)]*\)\s*/, '')), `${label}: ${q.id} does not accept the guide's "${a}" (${gotL})`);
      }
    }
    const els = doc.querySelectorAll(`[data-q="${q.id}"]`);
    ok(els.length > 0, `${label}: no input for ${q.id}`);
    ok(doc.getElementById(`fb-${q.id}`), `${label}: no feedback for ${q.id}`);
    ok(q.accept.length > 0, `${label}: no answer for ${q.id}`);
    for (const e of els) ok(e.closest('label') || doc.querySelector(`label[for="${e.id}"]`), `${label}: input ${q.id} has no label`);
    const sel = els[0].tagName === 'SELECT' ? [...els[0].options].map((o) => o.value).filter(Boolean) : null;
    if (sel) ok(q.accept.every((a) => sel.includes(a)), `${label}: answer ${q.accept} of ${q.id} is not in its select`);
    if (els[0].type === 'radio' || els[0].type === 'checkbox') ok(q.accept.every((a) => [...els].some((e) => e.value === a)), `${label}: answer of ${q.id} is not a choice`);
  }
  p.groups.forEach((g) => {
    const letters = g.options?.list ? g.options.list.map((o) => o.key) : g.letters || null;
    if (!letters) return;
    for (const n of g.numbers) {
      const s = doc.getElementById(`q${n}`);
      if (s?.tagName === 'SELECT') ok([...s.options].map((o) => o.value).filter(Boolean).join('') === letters.join(''), `${label}: select q${n} letters incomplete`);
    }
  });

  // ---- 4. Scoring with the real reading.js ----
  const tester = new JSDOM(html, { url: `http://localhost/${SLUG}/${p.slug}.html`, runScripts: 'outside-only' });
  tester.window.confirm = () => true;
  tester.window.HTMLElement.prototype.scrollIntoView = () => {};
  tester.window.eval(readingJs);
  const typed = (a) => (typeof a === 'string' ? a.replace(/^\(the\) /, '') : a); // "(the) x": the article is optional
  const run = (fill) => {
    const r = tester.window.__reading;
    for (const q of r.data.questions) r.setValue(q, typed(fill(q)));
    r.check();
    return +tester.window.document.getElementById('score').textContent.match(/Score: (\d+)/)[1];
  };
  const N = ad.total;
  const listKind = (q) => q.kind === 'multi' || q.kind === 'pair';
  const answers = (q) => (listKind(q) ? q.accept : q.accept[0]);
  ok(run(answers) === N, `${label}: key answers do not score ${N}/${N}`);
  const maxAlt = Math.max(...ad.questions.map((q) => (listKind(q) ? 1 : q.accept.length)));
  for (let a = 1; a < maxAlt; a++) ok(run((q) => (listKind(q) ? q.accept : q.accept[Math.min(a, q.accept.length - 1)])) === N, `${label}: alternative #${a} does not score ${N}/${N}`);
  ok(run((q) => (q.kind === 'text' ? `  ${q.accept[0].toUpperCase().replace(/'/g, '\u2019')}. ` : answers(q))) === N, `${label}: case/quote/spacing variants fail`);
  ok(run((q) => (listKind(q) ? [...q.accept].reverse() : answers(q))) === N, `${label}: list answers in another order fail`);
  ok(run(() => '') === 0 && run((q) => (q.kind === 'multi' ? [] : '')) === 0, `${label}: empty page does not score 0`);
  const wrongFor = (q) =>
    q.kind === 'text' ? 'zzz' : q.kind === 'pair' ? ['zzz', 'zzz'] : [...doc.querySelectorAll(`[data-q="${q.id}"]`)].flatMap((e) => (e.tagName === 'SELECT' ? [...e.options].map((o) => o.value) : [e.value])).find((v) => v && !q.accept.includes(v));
  for (const q of ad.questions) {
    if (q.kind === 'multi') {
      const wrongLetter = [...doc.querySelectorAll(`[data-q="${q.id}"]`)].map((e) => e.value).find((v) => !q.accept.includes(v));
      const s = run((x) => (x.id === q.id ? [...q.accept.slice(1), wrongLetter] : answers(x)));
      ok(s === N - 1, `${label}: ${q.id} with one wrong letter scores ${s}`);
    } else ok(run((x) => (x.id === q.id ? wrongFor(q) ?? 'zzz' : answers(x))) === N - 1, `${label}: ${q.id} wrong still scores full`);
  }
  tester.window.close();
  dom.window.close();
}

// ---- 5. Links, assets, external requests, noindex, top bar ----
const allHtml = [path.join(root, 'index.html'), path.join(root, SLUG, 'index.html'), ...htmlFiles];
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
}
console.log(`\n${passes} checks passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
