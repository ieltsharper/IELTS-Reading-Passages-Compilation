// Step 1 of the generator: .docx (questions + key) -> data/<topic>.json
// Usage: node _generator/build-data.mjs <topic> <questions.docx> <key.docx>
// Every word on the pages comes from the two files; this script only cuts them into parts, plus the
// corrections the owner approved, listed in the topic config (`fixes`, `splits`, `relabel`).
// It stops with an error when the files do not match the topic config or the key disagrees with itself.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDocx, textOf } from './docx.mjs';
import { applyFixes, block, clean, isEmpty, plain, slice, splitRuns, trim } from './runs.mjs';

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

// ---- Approved corrections to the questions file (config.fixes), applied before anything else ----
applyFixes(Q, config.fixes);
for (const f of config.fixes || []) problems.push(`fix applied (block ${f.block}): ${JSON.stringify(f.find)} -> ${JSON.stringify(f.replace)}`);

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
/** All paragraphs of a block, tables flattened row by row. */
const parasOf = (b) => (b.kind === 'p' ? [b] : b.rows.flatMap((row) => row.flatMap((cell) => cell.flatMap(parasOf))));
const hasText = (b) => b.kind === 'p' && plain(b.runs).trim();

function numbersOf(title) {
  const m = title.match(/Questions?\s+(\d+)\s*[-–]\s*(\d+)/);
  if (!m) fail(`no question range in ${JSON.stringify(title)}`);
  const out = [];
  for (let n = +m[1]; n <= +m[2]; n++) out.push(n);
  return out;
}

function wordLimit(text) {
  const m = text.match(/\b(ONE|TWO|THREE) WORDS?(?: ONLY)?((?:\s+AND\s*\/\s*OR|\s+AND\/OR)\s+A\s+NUMBER)?/i);
  if (!m) return null;
  return { words: { ONE: 1, TWO: 2, THREE: 3 }[m[1].toUpperCase()], number: !!m[2], text: m[0].replace(/\s+/g, ' ') };
}

/** Splits "27\tstem" / "27.\tstem" / "A.\toption" / "☐\toption" into [prefix, runs after the tab]. */
function splitTab(p) {
  const text = plain(p.runs);
  const tab = text.indexOf('\t');
  if (tab < 0) return [null, trim(p.runs)];
  return [text.slice(0, tab).trim(), trim(slice(p.runs, tab + 1))];
}
/** Removes an answer leader at the end of a stem ("Celia Lashlie ……", "Alison Wray 37 ……", "1400:……"). */
const stripLeader = (runs) => {
  const text = plain(runs);
  const m = text.match(/\s*(?:\(?\d{1,2}\)?\s*)?[…_]{2,}\s*$/);
  return m ? trim(slice(runs, 0, m.index)) : runs;
};

// ---- Option lists ----
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv'];
/** Options from paragraphs: "A Boys gain…", "A.\tProfessor…", "i\tDisagreement…", or a letter alone followed by its text. */
function optionsFromParas(paras, where) {
  const title = [];
  const list = [];
  let pending = null;
  for (const p of paras.filter(hasText)) {
    const text = plain(p.runs);
    if (pending) {
      list.push({ key: pending, runs: trim(p.runs) });
      pending = null;
      continue;
    }
    const m = text.match(/^\s*([A-Z]|[ivx]+)\.?(?:\t|\s+)(?=\S)/);
    if (m) list.push({ key: m[1], runs: trim(slice(p.runs, m[0].length)) });
    else if (/^\s*[A-Z]\.?\s*$/.test(text)) pending = text.trim().replace('.', '');
    else if (!list.length) title.push(trim(p.runs));
    else fail(`${where}: unexpected line in option list: ${JSON.stringify(text)}`);
  }
  return { title: title.length ? title : null, list };
}
function optionList(spec, where) {
  const blocks = Array.isArray(spec[0]) ? range(spec) : [at(spec)];
  return optionsFromParas(blocks.flatMap(parasOf), where);
}
/** "A the phonics method B the whole-word method …": options run together in one paragraph. */
function inlineOptions(runs, where) {
  const text = plain(runs);
  const starts = [];
  let from = 0;
  for (let i = 0; ; i++) {
    const L = String.fromCharCode(65 + i);
    const re = new RegExp(`(^|\\s)${L}\\s+(?=\\S)`, 'g');
    re.lastIndex = from;
    const m = re.exec(text);
    if (!m) break;
    starts.push({ key: L, at: m.index + m[1].length, body: m.index + m[0].length });
    from = m.index + m[0].length;
  }
  if (starts.length < 2) fail(`${where}: inline options not found`);
  return starts.map((s, i) => ({ key: s.key, runs: trim(slice(runs, s.body, i + 1 < starts.length ? starts[i + 1].at : Infinity)) }));
}

function checkKeys(list, where, relabel) {
  if (relabel) {
    for (const [pos, key] of Object.entries(relabel)) {
      const o = list[+pos - 1] || fail(`${where}: relabel position ${pos} missing`);
      problems.push(`${where}: option ${pos} relabelled ${o.key} -> ${key}`);
      o.key = key;
      o.relabelled = true;
    }
  }
  const roman = list[0]?.key === 'i';
  list.forEach((o, i) => {
    const want = roman ? ROMAN[i] : String.fromCharCode(65 + i);
    if (o.key !== want) fail(`${where}: option ${i + 1} is ${o.key}, expected ${want}`);
  });
}

// ---- Groups ----
function buildGroup(g, where, passage) {
  const titleText = textOf(at(g.title)).trim();
  const numbers = numbersOf(titleText);
  const intro = g.intro ? range(g.intro).map(block).filter((x) => !isEmpty(x)) : [];
  const out = { type: g.type, title: titleText, numbers, intro };
  if (g.typeName) out.typeName = g.typeName; // question-type name for the topic page, when it cannot be read from the instructions
  // Lines between the option list and the questions (e.g. "Example: Section A – ix").
  if (g.extra) out.extra = range(g.extra).map(block).filter((x) => !isEmpty(x));
  const introText = intro.map((x) => (x.type === 'p' ? plain(x.runs) : '')).join(' ');
  const W = `${where} ${titleText}`;
  const items = () =>
    range(g.items)
      .filter(hasText)
      .map((p) => {
        const [pre, stem] = splitTab(p);
        if (!/^\d+\.?$/.test(pre || '')) fail(`${W}: expected a numbered item, got ${JSON.stringify(plain(p.runs).slice(0, 40))}`);
        return { n: +pre.replace(/\.$/, ''), stem };
      });

  if (g.type === 'tfng' || g.type === 'ynng') {
    out.choices = g.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];
    out.questions = items();
  } else if (g.type === 'short') {
    out.questions = items().map((q) => ({ ...q, stem: stripLeader(q.stem) }));
    out.limit = wordLimit(introText) || fail(`${W}: no word limit in the instructions`);
  } else if (g.type === 'mcq') {
    out.questions = [];
    for (const p of range(g.items).filter(hasText)) {
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
    for (const q of out.questions) checkKeys(q.options, `${W} Q${q.n}`);
  } else if (g.type === 'multi') {
    const ps = range(g.items).filter(hasText);
    const head = plain(ps[0].runs).match(/^\s*(\d+)\s*[-–]\s*(\d+)\s+/);
    if (!head) fail(`${W}: no question numbers before the stem`);
    out.label = `${head[1]}-${head[2]}`;
    out.stem = trim(slice(ps[0].runs, head[0].length));
    out.choose = g.choose;
    out.options = ps.slice(1).map((p, i) => {
      const [pre, rest] = splitTab(p);
      if (pre === '☐') {
        out.lettersAdded = true;
        return { key: String.fromCharCode(65 + i), runs: rest, added: true };
      }
      if (/^[A-Z]\.?$/.test(pre)) return { key: pre.replace('.', ''), runs: rest };
      return fail(`${W}: unexpected option ${JSON.stringify(plain(p.runs))}`);
    });
    checkKeys(out.options, W);
    if (out.choose !== numbers.length) fail(`${W}: choose ${out.choose} but ${numbers.length} numbers`);
  } else if (g.type === 'match' || g.type === 'headings') {
    if (g.type === 'headings') {
      // Heading questions placed in the passage ("27 ……" above a paragraph): the numbers are the markers.
      const markers = passage.body.filter((b) => b.marker).map((b) => b.marker);
      if (markers.join() !== numbers.join()) fail(`${W}: passage markers ${markers.join()} but questions ${numbers.join()}`);
      out.questions = numbers.map((n) => ({ n, stem: null }));
    } else out.questions = items().map((q) => ({ ...q, stem: stripLeader(q.stem) }));
    if (g.options) {
      out.options = optionList(g.options, W);
      out.optionsAfter = !!g.optionsAfter;
      checkKeys(out.options.list, W, g.relabel);
    } else out.letters = g.letters.split('');
  } else if (g.type === 'grid') {
    const t = at(g.grid);
    const letters = t.rows[0].slice(1).map((c) => c.map(textOf).join('').trim());
    out.letters = letters;
    out.questions = t.rows.slice(1).map((row) => {
      const p = row[0].find(hasText);
      const m = plain(p.runs).match(/^\s*(\d+)\s+/);
      if (!m) fail(`${W}: grid row without a number`);
      if (row.slice(1).some((c) => c.map(textOf).join('').trim())) fail(`${W}: grid row ${m[1]} has text in an answer cell`);
      return { n: +m[1], stem: trim(slice(p.runs, m[0].length)) };
    });
    if (g.options) {
      out.options = optionList(g.options, W);
      checkKeys(out.options.list, W);
      if (out.options.list.map((o) => o.key).join('') !== letters.join('')) fail(`${W}: option list and grid letters differ`);
    }
  } else if (g.type === 'gap' || g.type === 'bank') {
    const content = range(g.content).flatMap(unwrap).map(block).filter((x) => !isEmpty(x));
    let inline = null;
    if (g.inlineOptions) {
      const host = content.find((b) => b.type === 'p' && plain(b.runs).includes(g.inlineOptions)) || fail(`${W}: inline options not found`);
      const cut = plain(host.runs).indexOf(g.inlineOptions);
      inline = inlineOptions(slice(host.runs, cut), W);
      host.runs = trim(slice(host.runs, 0, cut));
    }
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
      out.options = inline ? { title: null, list: inline } : optionList(g.options, W);
      out.optionsAfter = inline ? true : !!g.optionsAfter;
      checkKeys(out.options.list, W);
    }
  } else fail(`unknown group type ${g.type}`);

  if (out.questions) {
    const got = out.questions.map((q) => q.n).join();
    if (got !== numbers.join()) fail(`${W}: questions ${got} but title says ${numbers.join()}`);
  }
  return out;
}

// ---- Passage text ----
// Paragraph letters: "A  text" / "A\ttext" with a bold letter. A "27 ……" line is a heading-question marker.
// `splits` (approved) cut a merged paragraph into pieces; `subs` mark plain sub-headings.
function bodyOf(blocks, firstIndex, pc) {
  const out = [];
  let standfirst = null;
  blocks.forEach((b, k) => {
    if (b.kind !== 'p' || !plain(b.runs).trim()) return;
    const index = firstIndex + k;
    const split = (pc.splits || []).find((s) => s.block === index);
    if (!split) {
      out.push(item(b.runs, index));
      return;
    }
    splitRuns(b.runs, split.at).forEach((runs, i) => {
      const kind = i === 0 ? split.first : split.kinds?.[i - 1];
      if (kind === 'standfirst') standfirst = { type: 'p', runs };
      else if (kind === 'example') out.push({ example: true, runs });
      else if (kind && kind.letter) {
        const m = plain(runs).match(new RegExp(`^${kind.letter}\\s+`));
        if (!m) fail(`split: piece should start with letter ${kind.letter}`);
        out.push({ letter: kind.letter, runs: trim(slice(runs, m[0].length)) });
      } else out.push(item(runs, index));
    });
  });
  return { body: out, standfirst };

  function item(runs, index) {
    const text = plain(runs);
    const marker = text.match(/^\s*(\d{1,2})\s*[…_]{3,}\s*$/);
    if (marker) return { marker: +marker[1], runs: trim(slice(runs, text.indexOf(marker[1]) + marker[1].length)) };
    const m = text.match(/^([A-Z])(\s{2,}|\t)/);
    if (m && runs[0]?.b) return { letter: m[1], runs: trim(slice(runs, m[0].length)) };
    if (m && text[1] === '\t') return { letter: m[1], runs: trim(slice(runs, m[0].length)) };
    const t = trim(runs);
    if ((pc.subs || []).includes(index)) return { sub: true, runs: t };
    if (t.every((r) => r.b) && plain(t).length < 60) return { sub: true, runs: t };
    return { runs: t };
  }
}

// ---- Key, layout 1 (Education): answer table "Bài | Đáp án" + sections "Bài n – title (Qa–b)" ----
const keyText = (b) => textOf(b).trim();
function parseKeyTable() {
  const summary = K.find((b) => b.kind === 'tbl' && keyText({ kind: 'p', runs: b.rows[0][0][0]?.runs || [] }) === 'Bài');
  if (!summary) fail('key: no answer table starting with "Bài"');
  const sections = [];
  let cur = null;
  let part = null;
  for (const b of K) {
    if (b.kind === 'p' && b.style === 'Heading2') {
      const m = keyText(b).match(/^Bài (\d+) – (.*?)\s*\(Q(\d+)[–-](\d+)\)$/);
      if (m) {
        cur = { n: +m[1], title: m[2], step1: [], step2: [], step3: [], table: null };
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
  return sections.map((section) => {
    const row = summary.rows[section.n];
    const answers = {};
    for (const token of keyText({ kind: 'p', runs: row[1].flatMap((p) => p.runs || []) }).split(' · ')) {
      const m = token.match(/^(\d+(?:–\d+)?)\s+(.+)$/);
      if (!m) fail(`key Bài ${section.n}: cannot read ${JSON.stringify(token)}`);
      answers[m[1].replace('–', '-')] = m[2].trim();
    }
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
    const t = section.table || fail(`key Bài ${section.n}: no keyword table`);
    const header = t.rows[0].map((c) => c.map(textOf).join('').trim());
    const qi = header.indexOf('Câu');
    const ei = header.findIndex((h) => h.startsWith('Trích dẫn'));
    const ai = header.indexOf('Đáp án');
    if (qi < 0 || ei < 0 || ai < 0) fail(`key Bài ${section.n}: keyword table columns not found`);
    const evidence = {};
    const tableAnswers = {};
    for (const r of t.rows.slice(1)) {
      const k = r[qi].map(textOf).join('').trim().replace('–', '-');
      evidence[k] = trim(r[ei].flatMap((p) => [...(p.runs || []), { t: ' ' }]));
      tableAnswers[k] = r[ai].map(textOf).filter(Boolean).map((s) => s.trim());
    }
    const alts = {};
    for (const [n, h] of Object.entries(heads)) {
      const m = h.match(/^(.*?)\s*\((.*)\)$/);
      if (m && m[1] === answers[n]) alts[n] = [m[2]];
    }
    return {
      label: `Bài ${section.n}`,
      title: section.title,
      answers,
      alts,
      altsOnlyFor: 'gap',
      expl,
      evidence,
      crossCheck: { heads, tableAnswers },
      strategy: [...section.step1, ...section.step2].map((x) => (x.type === 'h' ? x : block(x))).filter((x) => x.type === 'h' || !isEmpty(x)),
      reading: [],
    };
  });
}

// ---- Key, layout 2 (compilations): "UNIT n · title" sections, answers as "✅ Câu n → X" ----
function parseKeyUnits() {
  const units = {};
  let cur = null;
  let part = null;
  for (const b of K) {
    const t = keyText(b);
    if (b.kind === 'p' && b.style === 'Heading1') {
      const m = t.match(/^UNIT (\d+) · (.*)$/);
      if (m) {
        cur = { unit: +m[1], title: m[2], step1: [], step2: [], step3: [] };
        units[cur.unit] = cur;
        part = null;
      }
      continue;
    }
    if (!cur) continue;
    if (b.kind === 'p' && b.style === 'Heading2') {
      part = /^BƯỚC 1/.test(t) ? 'step1' : /^BƯỚC 2/.test(t) ? 'step2' : /^BƯỚC 3/.test(t) ? 'step3' : fail(`key unit ${cur.unit}: unknown heading ${t}`);
      if (part !== 'step3') cur[part].push({ type: 'h', runs: trim(b.runs) });
      continue;
    }
    if (!part) continue;
    if (b.kind === 'p' && /^UNIT \d+ · PASSAGE \d$/.test(t)) continue; // label line before the next unit
    cur[part].push(b);
  }
  const out = {};
  for (const u of Object.values(units)) {
    const answers = {};
    const alts = {};
    const expl = {};
    let open = null;
    for (const b of u.step3) {
      const t = keyText(b);
      const m = b.kind === 'p' && t.match(/^✅ Câu (\d+)(?:[–-](\d+))?(?: – [^→]*)? → (.*)$/);
      if (m) {
        const k = m[2] ? `${m[1]}-${m[2]}` : m[1];
        if (answers[k]) fail(`key unit ${u.unit}: two answers for ${k}`);
        const rest = m[3].trim();
        const alt = rest.match(/\(hoặc:\s*(.*?)\)\s*$/);
        answers[k] = rest.replace(/\s*\(.*$/, '').replace(/\s+–\s+.*$/, '').trim();
        if (alt) alts[k] = alt[1].split('/').map((s) => s.trim());
        open = k;
        expl[k] = [block(b)];
        continue;
      }
      if (!open) continue;
      if (b.kind !== 'p' || !t || /^(\(\d+\)|⏸|🔗|Tiến độ|✅)/.test(t) || b.style === 'Heading3') {
        open = null;
        continue;
      }
      expl[open].push(block(b));
    }
    out[u.unit] = {
      label: `UNIT ${u.unit}`,
      title: u.title,
      answers,
      alts,
      altsOnlyFor: null,
      expl,
      evidence: {},
      crossCheck: null,
      strategy: [...u.step1, ...u.step2].map((x) => (x.type === 'h' ? x : block(x))).filter((x) => x.type === 'h' || !isEmpty(x)),
      reading: u.step3
        .filter((b) => !(b.kind === 'p' && !plain(b.runs).trim()))
        .map((b) => (b.kind === 'p' && b.style === 'Heading3' ? { type: 'h', runs: trim(b.runs) } : block(b)))
        .filter((x) => x.type === 'h' || !isEmpty(x)),
    };
  }
  return out;
}

const norm = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z]/g, '');
const coreOf = (s) => s.replace(/\s*\(.*\)\s*$/, '').replace(/\.$/, '').trim();

function keyFor(section, passage) {
  const { answers, expl, evidence } = section;
  const key = {};
  const used = new Set();
  const W = `key ${section.label}`;
  for (const g of passage.groups) {
    if (g.type === 'multi') {
      const k = `${g.numbers[0]}-${g.numbers[g.numbers.length - 1]}`;
      const a = answers[k] || fail(`${W}: no answer for ${k}`);
      used.add(k);
      const letters = a.split(/\s*,\s*/);
      if (letters.length !== g.choose || letters.some((l) => !g.options.some((o) => o.key === l))) fail(`${W} ${k}: ${a} does not fit the options`);
      g.key = { answer: a, accept: letters, explanation: expl[k] || [], evidence: evidence[k] || null };
      crossCheck(k, a);
      continue;
    }
    for (const n of g.numbers) {
      const a = answers[n] || fail(`${W}: no answer for Q${n}`);
      used.add(String(n));
      let accept = [a];
      if (g.type === 'tfng' || g.type === 'ynng') {
        if (!g.choices.includes(a)) fail(`${W} Q${n}: ${a} is not one of ${g.choices.join('/')}`);
      } else if (g.type === 'gap' || g.type === 'short') {
        if (section.alts[n] && (!section.altsOnlyFor || section.altsOnlyFor === 'gap')) {
          accept = [a, ...section.alts[n]];
          problems.push(`${section.label} Q${n}: accepted answers ${accept.map((x) => JSON.stringify(x)).join(', ')}`);
        }
      } else {
        const letters = g.options?.list.map((o) => o.key) || g.letters || g.questions?.find((q) => q.n === n)?.options.map((o) => o.key);
        if (!letters.includes(a)) fail(`${W} Q${n}: ${a} is not one of the options ${letters.join(' ')}`);
      }
      key[n] = { answer: a, accept, explanation: expl[n] || [], evidence: evidence[n] || null };
      if (!expl[n]) problems.push(`${section.label} Q${n}: no explanation in the key`);
      crossCheck(n, a);
    }
  }
  for (const k of Object.keys(answers)) if (!used.has(k)) fail(`${W}: answer ${k} has no question`);
  return key;

  function crossCheck(n, a) {
    if (!section.crossCheck) return;
    const head = section.crossCheck.heads[n];
    const table = section.crossCheck.tableAnswers[n];
    if (head !== undefined && coreOf(head) !== a) problems.push(`${section.label} Q${n}: answer table says ${a}, explanation heading says ${head}`);
    if (table && (table.length !== 1 || coreOf(table[0]) !== a)) problems.push(`${section.label} Q${n}: answer table says ${a}, keyword table says ${table.join(' / ')}`);
  }
}

// ---- Build ----
const tableSections = config.keyFormat === 'units' ? null : parseKeyTable();
const unitSections = config.keyFormat === 'units' ? parseKeyUnits() : null;

const passages = config.passages.map((pc, i) => {
  const where = `passage ${i + 1}${pc.unit ? ` (unit ${pc.unit})` : ''}`;
  const title = trim(para(at(pc.title)).runs);
  const { body, standfirst } = bodyOf(range(pc.body), pc.body[0][0], pc);
  const p = {
    slug: pc.slug,
    order: i + 1,
    number: pc.unit || i + 1,
    group: pc.group || null,
    head: (pc.head || []).map((h) => block(at(h))),
    title,
    standfirst: pc.standfirst ? block(at(pc.standfirst)) : standfirst,
    body,
    footnotes: pc.footnotes ? range(pc.footnotes).map(block).filter((x) => !isEmpty(x)) : [],
  };
  p.groups = pc.groups.map((g) => buildGroup(g, where, p));
  const section = unitSections ? unitSections[pc.unit] || fail(`key: no UNIT ${pc.unit}`) : tableSections[i] || fail(`key: no section for ${where}`);
  const a = norm(section.title);
  const b = norm(plain(title));
  if (!(a.startsWith(b.slice(0, 20)) || b.startsWith(a.slice(0, 20)))) fail(`${where}: key section "${section.title}" does not match title "${plain(title)}"`);
  const nums = p.groups.flatMap((g) => g.numbers);
  for (let k = 1; k < nums.length; k++) if (nums[k] !== nums[k - 1] + 1) fail(`${where}: numbering gap/duplicate at ${nums[k]}`);
  p.key = keyFor(section, p);
  p.strategy = section.strategy;
  p.reading = section.reading;
  return p;
});
if (tableSections && tableSections.length !== passages.length) fail(`key has ${tableSections.length} sections, config has ${passages.length} passages`);

const data = {
  topic: config.topic,
  slug: config.slug,
  numberLabel: config.numberLabel || 'Passage',
  groups: config.groups || null,
  sources: { questions: config.questionsFile, key: config.keyFile },
  passages,
};
const outFile = path.join(here, '..', 'data', `${config.slug}.json`);
fs.writeFileSync(outFile, JSON.stringify(data, null, 1) + '\n');
console.log(`Wrote ${path.relative(process.cwd(), outFile)}: ${passages.length} passages, ${passages.reduce((s, p) => s + p.groups.reduce((t, g) => t + g.numbers.length, 0), 0)} questions`);
for (const pr of problems) console.log('NOTE', pr);
