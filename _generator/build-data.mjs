// Step 1 of the generator: .docx (questions + key) -> data/<topic>.json
// Usage: node _generator/build-data.mjs <topic> <questions.docx> <key.docx>
// Every word on the pages comes from the two files; this script only cuts them into parts.
// It stops with an error when the files do not match the topic config or the key disagrees with itself.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDocx, textOf } from './docx.mjs';
import { block, clean, isEmpty, plain, slice, trim } from './runs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const [topicName, questionsPath, keyPath] = process.argv.slice(2);
if (!keyPath) {
  console.error('Usage: node _generator/build-data.mjs <topic> <questions.docx> <key.docx>');
  process.exit(1);
}
const config = (await import(`./topics/${topicName}.mjs`)).default;
const { blocks: Q } = readDocx(questionsPath);
const { blocks: K } = readDocx(keyPath);

const problems = [];
const fail = (msg) => {
  throw new Error(msg);
};

/** Block at [index, 'expected start'], checked. */
function at([i, expect]) {
  const b = Q[i];
  if (!b) fail(`block ${i} does not exist`);
  if (expect && !textOf(b).startsWith(expect)) fail(`block ${i} should start with ${JSON.stringify(expect)} but is ${JSON.stringify(textOf(b).slice(0, 60))}`);
  return b;
}
/** Blocks from [a, 'start'] to [b, 'start'] inclusive. */
function range([from, to]) {
  at(from);
  at(to);
  return Q.slice(from[0], to[0] + 1);
}
const para = (b) => (b.kind === 'p' ? b : fail('expected a paragraph'));
/** The paragraphs inside a 1x1 table, or the block itself. */
const unwrap = (b) => (b.kind === 'tbl' && b.rows.length === 1 && b.rows[0].length === 1 ? b.rows[0][0] : [b]);

function numbersOf(title) {
  const m = title.match(/Questions?\s+(\d+)\s*[-–]\s*(\d+)/);
  if (!m) fail(`no question range in ${JSON.stringify(title)}`);
  const out = [];
  for (let n = +m[1]; n <= +m[2]; n++) out.push(n);
  return out;
}

function wordLimit(text) {
  const m = text.match(/\b(ONE|TWO|THREE) WORDS?(?: ONLY)?( AND\/OR A NUMBER)?/);
  if (!m) return null;
  return { words: { ONE: 1, TWO: 2, THREE: 3 }[m[1]], number: !!m[2], text: m[0] };
}

/** Splits "27\tstem" / "27.\tstem" / "A.\toption" / "☐\toption" into [prefix, runs after the tab]. */
function splitTab(p) {
  const text = plain(p.runs);
  const tab = text.indexOf('\t');
  if (tab < 0) return [null, trim(p.runs)];
  return [text.slice(0, tab).trim(), trim(slice(p.runs, tab + 1))];
}
const stripLeader = (runs) => {
  const text = plain(runs);
  const m = text.match(/\s*…+\s*$/);
  return m ? trim(slice(runs, 0, m.index)) : runs;
};

// ---- Option lists: "A Boys gain…", "A. Professor…", word banks in a nested table ----
function optionList(b) {
  const cell = unwrap(b);
  const nested = cell.find((x) => x.kind === 'tbl');
  if (nested) {
    const flat = nested.rows.flatMap((row) => row.map((c) => c.filter((x) => !isEmpty(block(x))))).filter((c) => c.length);
    const list = [];
    for (let i = 0; i < flat.length; i += 2) {
      const key = flat[i].map(textOf).join('').trim();
      if (!/^[A-Z]$/.test(key)) fail(`word bank: expected a letter, got ${JSON.stringify(key)}`);
      list.push({ key, runs: trim(flat[i + 1].flatMap((x) => x.runs)) });
    }
    return { title: null, list };
  }
  const title = [];
  const list = [];
  for (const p of cell.filter((x) => x.kind === 'p' && plain(x.runs).trim())) {
    const text = plain(p.runs);
    const m = text.match(/^\s*([A-Z]|[ivx]+)\.?\s+(?=\S)/);
    if (m && (/^[A-Z]$/.test(m[1]) || /^[ivx]+$/.test(m[1]))) list.push({ key: m[1], runs: trim(slice(p.runs, m[0].length)) });
    else if (!list.length) title.push(trim(p.runs));
    else fail(`unexpected line in option list: ${JSON.stringify(text)}`);
  }
  return { title: title.length ? title : null, list };
}

function checkLetters(list, where) {
  list.forEach((o, i) => {
    if (o.key !== String.fromCharCode(65 + i)) fail(`${where}: option ${i + 1} is ${o.key}, expected ${String.fromCharCode(65 + i)}`);
  });
}

// ---- Groups ----
function buildGroup(g, where) {
  const titleText = textOf(at(g.title)).trim();
  const numbers = numbersOf(titleText);
  const intro = range(g.intro).map(block).filter((x) => !isEmpty(x));
  const out = { type: g.type, title: titleText, numbers, intro };
  const introText = intro.map((x) => (x.type === 'p' ? plain(x.runs) : '')).join(' ');
  const W = `${where} ${titleText}`;

  if (g.type === 'tfng' || g.type === 'ynng') {
    out.choices = g.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];
    out.questions = range(g.items).filter((b) => b.kind === 'p' && plain(b.runs).trim()).map((p) => {
      const [pre, stem] = splitTab(p);
      return { n: +pre.replace(/\.$/, ''), stem };
    });
  } else if (g.type === 'mcq') {
    out.questions = [];
    for (const p of range(g.items).filter((b) => b.kind === 'p' && plain(b.runs).trim())) {
      const [pre, rest] = splitTab(p);
      if (/^\d+\.?$/.test(pre)) out.questions.push({ n: +pre.replace(/\.$/, ''), stem: rest, options: [] });
      else {
        const q = out.questions[out.questions.length - 1];
        if (!q) fail(`${W}: option before the first question`);
        if (pre === '☐') {
          q.options.push({ key: String.fromCharCode(65 + q.options.length), runs: rest, added: true });
          out.lettersAdded = true;
        } else if (/^[A-Z]\.?$/.test(pre)) q.options.push({ key: pre.replace('.', ''), runs: rest });
        else fail(`${W}: unexpected line ${JSON.stringify(plain(p.runs))}`);
      }
    }
    for (const q of out.questions) checkLetters(q.options, `${W} Q${q.n}`);
  } else if (g.type === 'multi') {
    const ps = range(g.items).filter((b) => b.kind === 'p' && plain(b.runs).trim());
    const head = plain(ps[0].runs).match(/^\s*(\d+)\s*[-–]\s*(\d+)\s+/);
    if (!head) fail(`${W}: no question numbers before the stem`);
    out.label = `${head[1]}-${head[2]}`;
    out.stem = trim(slice(ps[0].runs, head[0].length));
    out.choose = g.choose;
    out.options = ps.slice(1).map((p, i) => {
      const [pre, rest] = splitTab(p);
      if (pre !== '☐') fail(`${W}: expected ☐ options`);
      return { key: String.fromCharCode(65 + i), runs: rest, added: true };
    });
    out.lettersAdded = true;
    if (out.choose !== numbers.length) fail(`${W}: choose ${out.choose} but ${numbers.length} numbers`);
  } else if (g.type === 'match') {
    out.questions = range(g.items).filter((b) => b.kind === 'p' && plain(b.runs).trim()).map((p) => {
      const [pre, stem] = splitTab(p);
      return { n: +pre.replace(/\.$/, ''), stem: stripLeader(stem) };
    });
    if (g.options) {
      out.options = optionList(at(g.options));
      out.optionsAfter = !!g.optionsAfter;
      checkLetters(out.options.list, W);
    } else out.letters = g.letters.split('');
  } else if (g.type === 'grid') {
    const t = at(g.grid);
    const letters = t.rows[0].slice(1).map((c) => c.map(textOf).join('').trim());
    out.letters = letters;
    out.questions = t.rows.slice(1).map((row) => {
      const p = row[0].find((x) => x.kind === 'p' && plain(x.runs).trim());
      const m = plain(p.runs).match(/^\s*(\d+)\s+/);
      if (!m) fail(`${W}: grid row without a number`);
      if (row.slice(1).some((c) => c.map(textOf).join('').trim())) fail(`${W}: grid row ${m[1]} has text in an answer cell`);
      return { n: +m[1], stem: trim(slice(p.runs, m[0].length)) };
    });
    if (g.options) {
      out.options = optionList(at(g.options));
      checkLetters(out.options.list, W);
      if (out.options.list.map((o) => o.key).join('') !== letters.join('')) fail(`${W}: option list and grid letters differ`);
    }
  } else if (g.type === 'gap' || g.type === 'bank') {
    const content = range(g.content).flatMap(unwrap).map(block).filter((x) => !isEmpty(x));
    const seen = [];
    for (const b of content) {
      if (b.type !== 'p') fail(`${W}: table inside completion content is not supported yet`);
      const text = plain(b.runs);
      const re = /\(?(\d{1,2})\)?\s*[…_]{2,}/g;
      const parts = [];
      let pos = 0;
      let m;
      while ((m = re.exec(text))) {
        const n = +m[1];
        if (!numbers.includes(n)) continue;
        parts.push(...slice(b.runs, pos, m.index), { gap: n });
        seen.push(n);
        pos = m.index + m[0].length;
      }
      parts.push(...slice(b.runs, pos));
      b.runs = clean(parts.map((r) => (r.gap ? r : { ...r })));
    }
    if (seen.join() !== numbers.join()) fail(`${W}: gaps found ${seen.join()} but expected ${numbers.join()}`);
    out.content = content;
    if (g.type === 'gap') {
      out.limit = wordLimit(introText);
      if (!out.limit) fail(`${W}: no word limit in the instructions`);
    } else {
      out.options = optionList(at(g.options));
      out.optionsAfter = !!g.optionsAfter;
      checkLetters(out.options.list, W);
    }
  } else fail(`unknown group type ${g.type}`);

  if (out.questions) {
    const got = out.questions.map((q) => q.n).join();
    if (got !== numbers.join()) fail(`${W}: questions ${got} but title says ${numbers.join()}`);
  }
  return out;
}

// ---- Passage text ----
function bodyOf(blocks) {
  return blocks
    .filter((b) => b.kind === 'p' && plain(b.runs).trim())
    .map((p) => {
      const text = plain(p.runs);
      const m = text.match(/^([A-Z])(\s{2,}|\t)/);
      if (m && p.runs[0]?.b) return { letter: m[1], runs: trim(slice(p.runs, m[0].length)) };
      const runs = trim(p.runs);
      if (runs.every((r) => r.b) && plain(runs).length < 60) return { sub: true, runs };
      return { runs };
    });
}

// ---- Key ----
const keyText = (b) => textOf(b).trim();
const summary = K.find((b) => b.kind === 'tbl' && keyText({ kind: 'p', runs: b.rows[0][0][0]?.runs || [] }) === 'Bài');
if (!summary) fail('key: no answer table starting with "Bài"');
const sections = [];
let cur = null;
let part = null;
for (const b of K) {
  if (b.kind === 'p' && b.style === 'Heading2') {
    const t = keyText(b);
    const m = t.match(/^Bài (\d+) – (.*?)\s*\(Q(\d+)[–-](\d+)\)$/);
    if (m) {
      cur = { n: +m[1], title: m[2], from: +m[3], to: +m[4], step1: [], step2: [], step3: [], table: null };
      sections.push(cur);
      part = null;
    }
    continue;
  }
  if (!cur) continue;
  if (b.kind === 'p' && b.style === 'Heading3') {
    const t = keyText(b);
    part = /^Bước 1/.test(t) ? 'step1' : /^Bước 2/.test(t) ? 'step2' : /^Bước 3/.test(t) ? 'step3' : /^Bảng keyword/.test(t) ? 'table' : fail(`key: unknown heading ${t}`);
    if (part === 'step1' || part === 'step2') cur[part].push({ type: 'h', runs: trim(b.runs) });
    continue;
  }
  if (!part) continue;
  if (part === 'table') {
    if (b.kind === 'tbl') cur.table = b;
  } else if (!isEmpty(block(b))) cur[part].push(b);
}

const norm = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z]/g, '');
const coreOf = (s) => s.replace(/\s*\(.*\)\s*$/, '').replace(/\.$/, '').trim();

function keyFor(section, passage) {
  const row = summary.rows[section.n];
  const answers = {};
  for (const token of keyText({ kind: 'p', runs: row[1].flatMap((p) => p.runs || []) }).split(' · ')) {
    const m = token.match(/^(\d+(?:–\d+)?)\s+(.+)$/);
    if (!m) fail(`key Bài ${section.n}: cannot read ${JSON.stringify(token)}`);
    answers[m[1].replace('–', '-')] = m[2].trim();
  }
  // Explanations (step 3): items "Qn – answer. …", notes attached as agreed in the generator notes.
  const expl = {};
  const add = (k, b) => (expl[k] ||= []).push(block(b));
  const heads = {};
  let target = null;
  for (const b of section.step3) {
    const t = keyText(b);
    if (b.kind === 'p' && !b.list) {
      const c = t.match(/^Chốt Q(\d+)[–-](\d+)/);
      if (c) {
        target = `${c[1]}-${c[2]}`;
        add(target, b);
      }
      continue; // paragraph headings ("Đoạn A …") and reading notes are not explanations
    }
    const q = t.match(/^Q(\d+)\s*–\s*(.*?)\.\s/) || t.match(/^Q(\d+)\s*–\s*(.*?)\.$/);
    const note = t.match(/^Ghi chú (\d+)[–-](\d+)/);
    const refs = [...new Set([...t.matchAll(/Q(\d+)/g)].map((x) => x[1]))];
    if (q) {
      target = q[1];
      heads[q[1]] = q[2];
      (expl[target] ||= []).unshift(block(b)); // the "Qn – answer" line first, notes after it
    } else if (note) add(`${note[1]}-${note[2]}`, b);
    else if (refs.length === 1) add(refs[0], b);
    else if (target) add(target, b);
    else fail(`key Bài ${section.n}: note before any question: ${t.slice(0, 60)}`);
  }
  // Evidence and answers from the keyword table.
  const t = section.table || fail(`key Bài ${section.n}: no keyword table`);
  const header = t.rows[0].map((c) => c.map(textOf).join('').trim());
  const qi = header.indexOf('Câu');
  const ei = header.findIndex((h) => h.startsWith('Trích dẫn'));
  const ai = header.indexOf('Đáp án');
  if (qi < 0 || ei < 0 || ai < 0) fail(`key Bài ${section.n}: keyword table columns not found`);
  const evidence = {};
  for (const row of t.rows.slice(1)) {
    const k = row[qi].map(textOf).join('').trim().replace('–', '-');
    evidence[k] = { runs: trim(row[ei].flatMap((p) => [...(p.runs || []), { t: ' ' }])), answer: row[ai].map(textOf).filter(Boolean).map((s) => s.trim()) };
  }

  // Match passage questions to answers.
  const key = {};
  const groupKeys = [];
  for (const g of passage.groups) {
    if (g.type === 'multi') {
      const k = `${g.numbers[0]}-${g.numbers[g.numbers.length - 1]}`;
      const a = answers[k] || fail(`key Bài ${section.n}: no answer for ${k}`);
      const letters = a.split(/\s*,\s*/);
      if (letters.length !== g.choose || letters.some((l) => !g.options.some((o) => o.key === l))) fail(`key ${k}: ${a} does not fit the options`);
      g.key = { answer: a, accept: letters, explanation: expl[k] || [], evidence: evidence[k]?.runs || null };
      groupKeys.push(k);
      check(k, a, evidence[k]?.answer, null);
      continue;
    }
    for (const n of g.numbers) {
      const a = answers[n] || fail(`key Bài ${section.n}: no answer for Q${n}`);
      let accept = [a];
      if (g.type === 'tfng' || g.type === 'ynng') {
        if (!g.choices.includes(a)) fail(`Q${n}: ${a} is not one of ${g.choices.join('/')}`);
      } else if (g.type === 'gap') {
        const h = heads[n] && heads[n].match(/^(.*?)\s*\((.*)\)$/);
        if (h && h[1] === a) {
          accept = [a, h[2]];
          problems.push(`Bài ${section.n} Q${n}: alternatives from the explanation heading: ${accept.map((x) => JSON.stringify(x)).join(', ')}`);
        }
      } else {
        const letters = g.options?.list.map((o) => o.key) || g.letters || g.questions?.find((q) => q.n === n)?.options.map((o) => o.key);
        if (!letters.includes(a)) fail(`Q${n}: ${a} is not one of the options ${letters.join('')}`);
      }
      key[n] = { answer: a, accept, explanation: expl[n] || [], evidence: evidence[n]?.runs || null };
      if (!expl[n]) problems.push(`Bài ${section.n} Q${n}: no explanation in the key`);
      if (!evidence[n]) problems.push(`Bài ${section.n} Q${n}: no row in the keyword table`);
      check(n, a, evidence[n]?.answer, heads[n]);
    }
  }
  const all = passage.groups.flatMap((g) => (g.type === 'multi' ? [] : g.numbers.map(String)));
  for (const k of Object.keys(answers)) if (!all.includes(k) && !groupKeys.includes(k)) fail(`key Bài ${section.n}: answer ${k} has no question`);

  function check(n, a, tableAnswers, head) {
    if (head !== undefined && head !== null && coreOf(head) !== a) problems.push(`Bài ${section.n} Q${n}: answer table says ${a}, explanation heading says ${head}`);
    if (tableAnswers && (tableAnswers.length !== 1 || coreOf(tableAnswers[0]) !== a))
      problems.push(`Bài ${section.n} Q${n}: answer table says ${a}, keyword table says ${tableAnswers.join(' / ')}`);
  }
  return key;
}

// ---- Build ----
const passages = config.passages.map((pc, i) => {
  const where = `passage ${i + 1}`;
  const title = trim(para(at(pc.title)).runs);
  const p = {
    slug: pc.slug,
    order: i + 1,
    head: pc.head.map((h) => block(at(h))),
    title,
    standfirst: pc.standfirst ? block(at(pc.standfirst)) : null,
    body: bodyOf(range(pc.body)),
    footnotes: pc.footnotes ? range(pc.footnotes).map(block).filter((x) => !isEmpty(x)) : [],
  };
  p.groups = pc.groups.map((g) => buildGroup(g, where));
  const section = sections[i] || fail(`key: no section for ${where}`);
  const a = norm(section.title);
  const b = norm(plain(title));
  if (!(a.startsWith(b.slice(0, 20)) || b.startsWith(a.slice(0, 20)))) fail(`${where}: key section "${section.title}" does not match title "${plain(title)}"`);
  const nums = p.groups.flatMap((g) => g.numbers);
  if (nums[0] !== section.from || nums[nums.length - 1] !== section.to) fail(`${where}: key covers Q${section.from}-${section.to}, page has ${nums[0]}-${nums[nums.length - 1]}`);
  for (let k = 1; k < nums.length; k++) if (nums[k] !== nums[k - 1] + 1) fail(`${where}: numbering gap/duplicate at ${nums[k]}`);
  p.key = keyFor(section, p);
  p.strategy = [...section.step1, ...section.step2].map((x) => (x.type === 'h' ? x : block(x))).filter((x) => x.type === 'h' || !isEmpty(x));
  return p;
});
if (sections.length !== passages.length) fail(`key has ${sections.length} sections, config has ${passages.length} passages`);

const data = { topic: config.topic, slug: config.slug, sources: { questions: config.questionsFile, key: config.keyFile }, passages };
const outFile = path.join(here, '..', 'data', `${config.slug}.json`);
fs.writeFileSync(outFile, JSON.stringify(data, null, 1) + '\n');
console.log(`Wrote ${path.relative(process.cwd(), outFile)}: ${passages.length} passages, ${passages.reduce((s, p) => s + p.groups.reduce((t, g) => t + g.numbers.length, 0), 0)} questions`);
for (const p of problems) console.log('NOTE', p);
