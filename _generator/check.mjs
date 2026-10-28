// Automated checks of the generated pages against the source .docx (step 4).
// Usage: node _generator/check.mjs <topic> <questions.docx> <key.docx> [analysis.docx]  (jsdom from the portal,
//        or set JSDOM_PATH)
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
const [topicName, questionsPath, keyPath, analysisPath] = process.argv.slice(2);
const jsdomPath = process.env.JSDOM_PATH || 'D:/IELTS LEARNING PORTAL/node_modules/jsdom';
if (!keyPath) {
  console.error('Usage: node _generator/check.mjs <topic> <questions.docx> <key.docx> [analysis.docx]');
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
// Alternative answers the key allows, per passage: { n: ['five hours'] }. The page must accept exactly
// the key's answer plus these, nothing else.
let keyAlts = [];
const isWordAnswer = (a) => !/^([A-Z]|[ivx]+|TRUE|FALSE|NOT GIVEN|YES|NO)$/.test(a);
if (config.keyFormat === 'units') {
  const byUnit = {};
  const altsByUnit = {};
  let unit = null;
  let unitNo = null;
  for (const b of K) {
    const t = textOf(b).trim();
    const u = b.kind === 'p' && b.style === 'Heading1' && t.match(/^UNIT (\d+) ·/);
    if (u) {
      unit = byUnit[u[1]] = {};
      unitNo = u[1];
      altsByUnit[unitNo] = {};
    }
    const m = b.kind === 'p' && unit && t.match(/^✅ Câu (\d+)(?:[–-](\d+))?(?: – [^→]*)? → (.*)$/);
    if (!m) continue;
    unit[m[2] ? `${m[1]}-${m[2]}` : m[1]] = m[3].split(' (')[0].split(' – ')[0].trim();
    const alt = m[3].match(/\(hoặc:\s*(.*?)\)\s*$/);
    if (alt) altsByUnit[unitNo][m[1]] = alt[1].split('/').map((s) => s.trim());
  }
  // Units answered by the One-shot analysis: its "Đáp án nhanh" line (NG/T/F/Y/N spelled out).
  if (config.analysisUnits?.length) {
    if (!analysisPath) throw new Error(`This topic also needs its analysis file (${config.analysisFile}) as the 4th argument.`);
    const long = { NG: 'NOT GIVEN', T: 'TRUE', F: 'FALSE', Y: 'YES', N: 'NO' };
    let au = null;
    for (const b of readDocx(analysisPath).blocks) {
      const t = textOf(b).trim();
      const u = b.kind === 'p' && b.style === 'Heading1' && t.match(/^UNIT (\d+) ·/);
      if (u) {
        au = config.analysisUnits.includes(+u[1]) ? (byUnit[u[1]] = {}) : null;
        if (au) altsByUnit[u[1]] = {};
      }
      const q = au && t.match(/^Đáp án nhanh:\s*(.*)$/);
      if (!q) continue;
      const unitAlts = altsByUnit[Object.keys(byUnit).find((k) => byUnit[k] === au)];
      for (const tok of q[1].split(' · ')) {
        const m = tok.trim().match(/^(\d+(?:[–-]\d+)?)\s+(.+)$/);
        const [first, ...more] = m[2].split('/').map((s) => s.trim());
        au[m[1].replace('–', '-')] = first;
        if (more.length) unitAlts[m[1]] = more;
      }
    }
    // Short TFNG/YNNG answers are spelled out at the comparison, where the page's question type is known.
    keyAnswers = config.passages.map((pc) => byUnit[pc.unit]);
    keyAnswers.spell = long;
  } else keyAnswers = config.passages.map((pc) => byUnit[pc.unit]);
  keyAlts = config.passages.map((pc) => altsByUnit[pc.unit] || {});
} else if (config.keyFormat === 'tables') {
  // "UNIT n – title" sections with answer tables (Câu | Đáp án | …); "E (Grimm)" counts as "E".
  const byUnit = {};
  let unit = null;
  for (const b of K) {
    const t = textOf(b).trim();
    const u = b.kind === 'p' && b.style === 'Heading1' && t.match(/^UNIT (\d+) – /);
    if (u) unit = byUnit[u[1]] = {};
    if (!unit || b.kind !== 'tbl') continue;
    const head = b.rows[0].map((c) => c.map(textOf).join('').trim());
    if (head[0] !== 'Câu' || head[1] !== 'Đáp án') continue;
    for (const r of b.rows.slice(1)) unit[r[0].map(textOf).join('').trim()] = r[1].map(textOf).join(' ').trim().replace(/\s*\(.*\)\s*$/, '');
  }
  // Owner-approved letters for questions the key answers with the idea only (config answerLetters).
  keyAnswers = config.passages.map((pc) => ({ ...byUnit[pc.unit], ...pc.answerLetters }));
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
  // "Qn – 5 hours (five hours)." in a section's explanations: the bracket is an alternative for word answers.
  let sec = -1;
  for (const b of K) {
    const t = textOf(b).trim();
    if (b.kind === 'p' && b.style === 'Heading2' && /^Bài \d+ – /.test(t)) keyAlts[++sec] = {};
    const m = sec >= 0 && b.kind === 'p' && t.match(/^Q(\d+)\s*–\s*(.*?)\s*\((.*?)\)\./);
    if (m && keyAnswers[sec]?.[m[1]] === m[2] && isWordAnswer(m[2])) keyAlts[sec][m[1]] = [m[3]];
  }
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
/** The footnotes at the end of a group's content (config footnotesFrom), from the source. */
const footTail = (g) => {
  const t = range(...g.content).map(blockText).join(' ');
  return t.slice(t.indexOf(g.footnotesFrom.at));
};
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
  if (process.env.CHECK_TRACE) console.log("start", label);

  // ---- 1. Passage text ----
  const src = [...(pc.head || []).map(([n]) => Q[n]), Q[pc.title[0]], ...(pc.standfirst ? [Q[pc.standfirst[0]]] : []), ...range(...pc.body), ...(pc.footnotes ? range(...pc.footnotes) : [])]
    .map(blockText)
    .join(' ')
    // Footnotes printed after a word list are shown under the passage (config footnotesFrom).
    .concat(...pc.groups.filter((g) => g.footnotesFrom).map((g) => ' ' + footTail(g)));
  const dom =new JSDOM(html, { url: `http://localhost/${config.slug}/${pc.slug}.html`, runScripts: 'outside-only' });
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
    let srcText = [...parts, ...before, ...extra, ...main, ...after].map(blockText).join(' ');
    if (g.footnotesFrom) srcText = srcText.slice(0, srcText.indexOf(g.footnotesFrom.at)); // moved under the passage
    const srcWords = words(srcText);
    const sec = sections[gi].cloneNode(true);
    // Not source text: feedback, marks, hints, selects, page labels and the TRUE/FALSE/NOT GIVEN buttons.
    sec.querySelectorAll('.fb, .fb-list, .mark, .hint, select, .sr-only, .ui-label, .tf .choices').forEach((e) => e.remove());
    sec.querySelectorAll('p, li, td, th, dt, dd, legend, label, h2, div').forEach((e) => e.append(' '));
    if (g.optionsAnyOrder) {
      // A word list printed in columns is listed A, B, C… on the page: same words, letters without full stops.
      const bag = (ws) => ws.map((w) => w.replace(/\.$/, '')).sort().join(' ');
      ok(bag(srcWords) === bag(words(sec.textContent)), `${label} ${g.title[1]}: question words differ from the source`);
    } else {
      const d2 = diff(srcWords, words(sec.textContent));
      ok(!d2, `${label} ${g.title[1]}: question text differs ${d2}`);
    }
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
    const isList = q.kind === 'multi' || q.kind === 'pair';
    const gd = p.groups.find((g) => g.numbers.includes(q.ns[0])); // the approved answer rules of this group
    let want = q.kind === 'multi' ? ka[`${q.ns[0]}-${q.ns[q.ns.length - 1]}`] : ka[q.ns[0]];
    const got = q.kind === 'multi' ? q.accept.join(', ') : q.kind === 'pair' ? q.accept.join('; ') : q.accept[0];
    if (q.kind === 'pair' && want) want = want.split(/\s*[;,]\s*/).join('; '); // "a, b" and "a; b" are the same two answers
    if (keyAnswers.spell?.[want] &&['TRUE', 'FALSE', 'NOT GIVEN', 'YES', 'NO'].includes(got)) want = keyAnswers.spell[want];
    if (!isList) {
      // The page accepts exactly the key's answer, the key's own alternatives and the owner-approved extras
      // (config alsoAccept; either-order pairs accept both of the pair's key answers).
      let allowed = [want, ...(keyAlts[i]?.[q.ns[0]] || []), ...(gd?.alsoAccept?.[q.ns[0]] || [])];
      const pair = gd?.unordered?.find((u) => u.includes(q.ns[0]));
      if (pair) allowed = pair.map((n) => ka[n]);
      const expected = allowed.map((s) => s.toLowerCase()).sort().join(' | ');
      const accepted = q.accept.map((s) => s.toLowerCase()).sort().join(' | ');
      ok(expected === accepted, `${label}: ${q.id} accepts ${accepted}, key allows ${expected}`);
    }
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
  // One page with the real reading.js per passage (many pages at once run out of memory): every run fills in
  // all answers, checks, and reads the score; `inspect(doc)` reads anything else a test needs.
  const tester = new JSDOM(html, { url: `http://localhost/${config.slug}/${pc.slug}.html`, runScripts: 'outside-only' });
  tester.window.confirm = () => true;
  tester.window.HTMLElement.prototype.scrollIntoView = () => {};
  tester.window.eval(readingJs);
  const run = (fill, inspect) => {
    const r = tester.window.__reading;
    for (const q of r.data.questions) r.setValue(q, fill(q));
    r.check();
    const doc2 = tester.window.document;
    return { score: +doc2.getElementById('score').textContent.match(/Score: (\d+)/)[1], extra: inspect ? inspect(doc2) : null };
  };
  const N = ad.total;
  // "multi" (choose three) and "pair" (two blanks, one mark) take a list of answers.
  const listKind = (q) => q.kind === 'multi' || q.kind === 'pair';
  const answers = (q) => (listKind(q) ? q.accept : q.accept[0]);
  ok(run(answers).score === N, `${label}: key answers do not score ${N}/${N}`);
  const maxAlt = Math.max(...ad.questions.map((q) => (listKind(q) ? 1 : q.accept.length)));
  for (let k = 1; k < maxAlt; k++) ok(run((q) => (listKind(q) ? q.accept : q.accept[Math.min(k, q.accept.length - 1)])).score === N, `${label}: alternative #${k} does not score ${N}/${N}`);
  // curly apostrophes, case, spaces and final full stop do not matter
  ok(run((q) => (q.kind === 'text' ? `  ${q.accept[0].toUpperCase().replace(/'/g, '\u2019')}. ` : answers(q))).score === N, `${label}: case/quote/spacing variants fail`);
  ok(run((q) => (listKind(q) ? [...q.accept].reverse() : answers(q))).score === N, `${label}: list answers in another order fail`);
  ok(run(() => '').score === 0 && run((q) => (q.kind === 'multi' ? [] : '')).score === 0, `${label}: empty page does not score 0`);
  // Either-order pairs: the same word in both blanks scores only once.
  for (const q of ad.questions.filter((x) => x.unordered?.second)) {
    const res = run((x) => (x.id === q.id ? ad.questions.find((y) => y.id === q.unordered.with).accept[0] : answers(x)));
    ok(res.score === N - 1, `${label}: ${q.id} repeating the other word of its pair still scores`);
  }
  const first = ad.questions.find((q) => !listKind(q));
  const wrongFor = (q) =>
    q.kind === 'text' ? 'zzz' : q.kind === 'pair' ? ['zzz', 'zzz'] : [...doc.querySelectorAll(`[data-q="${q.id}"]`)].flatMap((e) => (e.tagName === 'SELECT' ? [...e.options].map((o) => o.value) : [e.value])).find((v) => v && !q.accept.includes(v));
  const oneWrong = run((q) => (q === first || q.id === first.id ? wrongFor(q) : answers(q)), (d) => d.getElementById(`mark-${first.id}`).textContent);
  ok(oneWrong.score === N - 1, `${label}: one wrong answer scores ${oneWrong.score}, expected ${N - 1}`);
  ok(oneWrong.extra === '✗', `${label}: wrong answer not marked ✗`);
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
    const long = run((q) => (q.id === textQ.id ? `${q.accept[0]} and many more words here` : answers(q)), (d) => d.querySelector(`#fb-${textQ.id} .fb-result`).textContent);
    ok(long.score === N - 1 && /word limit/.test(long.extra), `${label}: over-long answer not flagged`);
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
    d.window.close();
  }
  tester.window.close();
  dom.window.close();
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
