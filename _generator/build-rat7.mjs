// "Recent Actual Test 7" (18 passages): the Vietnamese solution guide (a PDF) -> data/recent-actual-test-7.json.
// The guide has, for each passage, the text, the questions and then the key with Vietnamese explanations.
// Usage: node _generator/build-rat7.mjs "<guide .pdf>"   (reads the cached block list in RAT7_BLOCKS if set)
// Then: node _generator/build-html.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDocx } from './docx.mjs';
import { plain, clean, slice, trim, block } from './runs.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'recent-actual-test-7';
const cache = process.env.RAT7_BLOCKS || path.join(os.tmpdir(), 'rat7', 'reading-blocks.json');
let blocks;
if (fs.existsSync(cache)) blocks = JSON.parse(fs.readFileSync(cache, 'utf8')).blocks;
else {
  blocks = readDocx(process.argv[2]).blocks;
  fs.mkdirSync(path.dirname(cache), { recursive: true });
  fs.writeFileSync(cache, JSON.stringify({ blocks }));
}

// Where each passage starts in the guide (its centred, bold title); 2022 is where the Listening part begins.
const STARTS = [12, 109, 224, 336, 446, 547, 678, 818, 940, 1059, 1172, 1263, 1362, 1482, 1578, 1713, 1808, 1923, 2022];
const TITLES = [
  'The study of laughter', 'Shoemaker–Levy 9 Collision with Jupiter', 'Dealing with Different Sleep Patterns', 'From Novices to Experts',
  'The Myth of the Five Senses', 'TV Addiction', 'Antarctica and Global Warming', 'Magnetic Therapy', 'Insects and Inspired Artificial Robots',
  'Extinction of Aussie Animals', 'A Brief History of Rubber', 'Desertification', 'The Legend of Tea', 'A Second Look at Twin Studies', 'Torch Relay',
  'Hurricane', 'Save the Turtles', 'Fears',
];
// The word lists of the summary questions are tables of loose words in the guide (no letters): alphabetical, A, B, ...
const WORDS = {
  3: ['rhythms', 'shadow', 'different', 'identical', 'paces', 'bright', 'body', 'shift workers', 'entraining', 'daylight', 'elders', 'blind', 'physiological', 'cycle', 'younger', 'sight'],
  4: ['mentors', 'laws', 'doctoral programs', 'chess', 'apprenticeship', 'description', 'new knowledge', 'complex tasks'],
  5: ['initial', 'limb', 'movement', 'dark', 'placement', 'entrain', 'stability', 'muscles', 'sensory organs', 'tongue', 'representation', 'picture'],
  14: ['behavioral genetics', 'longitudinal studies', 'molecular genetics', 'restrictions', 'obstacles', 'environment', 'unique environment', 'heritability', 'same family', 'accuracies', 'assumptions', 'acknowledges', 'appropriate figures', 'identical', 'distinct'],
};
// Passage layout: lettered paragraphs or not, and the question groups in the order of the book.
const LAYOUT = {
  1: { groups: ['multi', 'ynng', 'gap'] },
  2: { lettered: true, groups: ['headings', 'info:A-J', 'gap'] },
  3: { groups: ['tfng', 'bank'] },
  4: { groups: ['ynng', 'bank', 'gap'] },
  5: { lettered: true, groups: ['info:A-H', 'bank', 'tfng'] },
  6: { lettered: true, groups: ['headings', 'people'] },
  7: { lettered: true, groups: ['headings', 'tfng', 'gap'] },
  8: { lettered: true, groups: ['headings', 'tfng', 'gap'] },
  9: { lettered: true, groups: ['headings', 'people:14', 'short:19'] },
  10: { lettered: true, groups: ['info:A-H', 'endings', 'tfng'] },
  11: { lettered: true, groups: ['info:A-G', 'gap'] },
  12: { lettered: true, groups: ['info:A-I', 'ynng', 'gap'] },
  13: { lettered: true, groups: ['info:A-J', 'tfng', 'endings'] },
  14: { groups: ['tfng', 'bank'] },
  15: { lettered: true, groups: ['headings', 'tfng', 'short'] },
  16: { sections: true, groups: ['gap', 'tfng', 'short'] },
  17: { lettered: true, groups: ['headings', 'short'] },
  18: { lettered: true, groups: ['info:A-I', 'short', 'gap'] },
};
// Answers the guide allows besides the printed one (and the page accepts nothing else): "passage-n" -> alternatives.
const EXTRA_ACCEPT = {
  '1-22': ['scared'],
  '1-25': ['purpose'],
  '1-26': ['evolutionary advantage'],
  '15-27': ['excellence respect friendship', 'excellence, respect and friendship', 'excellence respect and friendship'],
};
// Keys the guide leaves out (passage 16, questions 39-40): worked out from the passage by us, said so on the page.
// Where the guide's "a / b" means "cold waters / cold temperatures", not two separate answers.
const REPLACE_ACCEPT = { '17-9': ['cold waters', 'cold temperatures', 'cold water'], '17-10': ['Florida, America', 'Florida America', 'Florida', '(the) North American'] };
const MISSING_KEYS = {
  16: {
    39: { answer: '20 and 30 mph', accept: ['20 and 30 mph', '20 to 30 mph', 'between 20 and 30 mph', '20-30 mph', '20 and 30 miles per hour', '20 to 30 miles per hour'], passage: 'may reach between 20 and 30 mph' },
    40: { answer: '500 miles', accept: ['500 miles', '500 miles wide', 'on average 500 miles', '500 miles across', '500'], passage: 'on average 500 miles wide' },
  },
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const text = (i) => (blocks[i].kind === 'p' ? plain(blocks[i].runs) : '');
const SENT_END = /[.?!”"’)…:]\s*$/;

function endOfQuestions(k) {
  for (let i = STARTS[k - 1]; i < STARTS[k]; i++) if (/^(KEY|Câu\s*\d+)/.test(text(i).trim())) return i;
  throw new Error(`passage ${k}: no key`);
}
function headerIndexes(k) {
  const out = [];
  for (let i = STARTS[k - 1]; i < endOfQuestions(k); i++) if (blocks[i].kind === 'p' && /^Questions?\s+\d/i.test(text(i).trim())) out.push(i);
  return out;
}

// ---------- small run helpers ----------
const run = (t, f = {}) => ({ t, ...f });
const stripNl = (runs) => trim(clean(runs.map((r) => (r.t ? { ...r, t: r.t.replace(/\s*\n\s*/g, ' ') } : r))));
function joinRuns(a, b) {
  return clean([...a, ...(SENT_END.test(plain(a)) ? [] : []), run(' '), ...b]);
}
// A paragraph the PDF cut in the middle of a sentence is glued back together.
function continues(prevText, nextText) {
  return !SENT_END.test(prevText) || /^[a-z]/.test(nextText);
}

/** Splits `runs` at the given [start, end) character ranges and returns the pieces between them and the cut texts. */
function cutAt(runs, ranges) {
  const out = [];
  let pos = 0;
  for (const [a, b] of ranges) {
    out.push(slice(runs, pos, a));
    pos = b;
  }
  out.push(slice(runs, pos));
  return out;
}

// ---------- the passage text ----------
function bodyOf(k, from, to, { lettered, sections }) {
  const body = [];
  let next = 0; // index of the letter expected next
  const addPara = (item) => body.push(item);
  for (let i = from; i < to; i++) {
    const b = blocks[i];
    if (b.kind !== 'p') continue;
    const runs = clean(b.runs);
    const t = plain(runs);
    if (!t.trim()) continue;
    if (sections && /^Section [A-Z]$/.test(t.trim())) {
      addPara({ sub: true, runs: trim(runs) });
      continue;
    }
    // letter markers "B. " at the start of the block, or after the end of a sentence (the PDF puts two paragraphs in one block)
    const marks = [];
    if (lettered) {
      let cur = 0;
      while (next < LETTERS.length) {
        let hit = null;
        const re = new RegExp(`(?:^|(?<=[.?!”"’)]\\s+))${LETTERS[next]}\\.\\s+(?=\\S)`, 'g');
        re.lastIndex = cur;
        const m = re.exec(t);
        if (m) hit = { letter: LETTERS[next], start: m.index, end: m.index + m[0].length };
        else if (cur === 0) {
          // a letter the book skips (no paragraph G): only at the very start of a block
          for (const skip of [1, 2]) {
            const m2 = new RegExp(`^${LETTERS[next + skip]}\\.\\s+(?=\\S)`).exec(t);
            if (m2) {
              hit = { letter: LETTERS[next + skip], start: 0, end: m2[0].length };
              next += skip;
              break;
            }
          }
        }
        if (!hit) break;
        marks.push(hit);
        cur = hit.end;
        next = LETTERS.indexOf(hit.letter) + 1;
      }
    }
    const pieces = cutAt(runs, marks.map((m) => [m.start, m.end]));
    // pieces[0] is the text before the first marker: a continuation (or an unlettered paragraph)
    const head = trim(pieces[0]);
    if (plain(head)) {
      const last = body[body.length - 1];
      if (last && !last.sub && continues(plain(last.runs), plain(head))) last.runs = trim(joinRuns(last.runs, head));
      else addPara({ runs: head });
    }
    marks.forEach((m, j) => addPara({ letter: m.letter, runs: trim(pieces[j + 1]) }));
  }
  return body;
}

// ---------- question groups ----------
function linesOf(from, to) {
  const lines = [];
  for (let i = from; i < to; i++) {
    const b = blocks[i];
    if (b.kind === 'tbl') lines.push({ tbl: i, runs: [] });
    else if (plain(b.runs).trim()) lines.push({ runs: clean(b.runs), list: !!b.list, center: !!b.center });
  }
  return lines;
}
const lineText = (l) => (l.tbl !== undefined ? '' : plain(l.runs));
function joinLines(lines) {
  const out = [];
  lines.forEach((l, i) => {
    if (i) out.push({ t: '\n' });
    out.push(...(l.tbl !== undefined ? [{ t: `\u0001${l.tbl}\u0001` }] : l.runs));
  });
  return out;
}

/** Marker positions of the numbered items a..b in `t`, in order. */
function markers(t, a, b, what) {
  const pos = [];
  let cur = 0;
  for (let n = a; n <= b; n++) {
    const re = new RegExp(`(?:^|\\n|(?<=[.?!”"’)]\\s+))${n}\\s*[.)]?[ \\t]*`, 'g');
    re.lastIndex = cur;
    let m;
    while ((m = re.exec(t))) {
      if (/\d/.test(t[m.index + m[0].indexOf(String(n)) + String(n).length] ?? '')) {
        re.lastIndex = m.index + 1;
        continue;
      }
      break;
    }
    if (!m) throw new Error(`${what}: item ${n} not found`);
    pos.push({ n, start: m.index, end: m.index + m[0].length });
    cur = m.index + m[0].length;
  }
  return pos;
}

/** Intro lines -> blocks: a split sentence is glued, TRUE/FALSE/NOT GIVEN lines become the little table. */
function introBlocks(lines) {
  const ps = [];
  for (const l of lines) {
    if (l.tbl !== undefined) {
      ps.push({ table: block(blocks[l.tbl]) });
      continue;
    }
    const t = plain(l.runs);
    const prev = ps[ps.length - 1];
    if (prev && !prev.table && !prev.row && (/^Passage \d/.test(t.trim()) || /^[a-z]/.test(t.trim()))) {
      prev.runs = trim(joinRuns(prev.runs, l.runs));
      continue;
    }
    const m = /^\s*(TRUE|FALSE|NOT GIVEN|YES|NO)\s*\t/.exec(t);
    if (m) {
      const cut = t.indexOf('\t');
      ps.push({ row: [trim(slice(l.runs, 0, cut)), trim(slice(l.runs, cut + 1))] });
    } else ps.push({ runs: trim(l.runs) });
  }
  const out = [];
  for (const p of ps) {
    if (p.table) out.push(p.table);
    else if (p.row) {
      const rowCells = [[{ type: 'p', runs: p.row[0].map((r) => ({ ...r, b: true })) }], [{ type: 'p', runs: p.row[1].map((r) => ({ ...r, i: true })) }]];
      const last = out[out.length - 1];
      if (last && last.type === 'table' && last.legend) last.rows.push(rowCells);
      else out.push({ type: 'table', legend: true, rows: [rowCells] });
    } else out.push({ type: 'p', runs: p.runs });
  }
  for (const o of out) delete o.legend;
  return out;
}

const limitOf = (introText) => {
  const t = introText.toUpperCase();
  const words = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4 };
  let m = /NO MORE THAN (ONE|TWO|THREE|FOUR) WORDS?( AND\/OR A NUMBER)?/.exec(t);
  if (m) return { words: words[m[1]], number: !!m[2], text: `${m[1]} WORD${m[1] === 'ONE' ? '' : 'S'}${m[2] ? ' AND/OR A NUMBER' : ''}` };
  m = /(ONE|TWO) WORDS? ONLY/.exec(t);
  if (m) return { words: words[m[1]], number: false, text: `${m[1]} WORD${m[1] === 'ONE' ? '' : 'S'}` };
  throw new Error('no word limit in: ' + introText);
};

function titleOf(headerText) {
  const m = /^Questions?\s+(\d+)\s*[-–]?\s*(\d+)?/i.exec(headerText.trim());
  const a = +m[1];
  const b = m[2] ? +m[2] : a;
  return { title: b > a ? `Questions ${a}–${b}` : `Question ${a}`, a, b, numbers: Array.from({ length: b - a + 1 }, (_, i) => a + i) };
}

/** Stems of the numbered items found in `lines`; `first` is the number printed in the book (it can differ from the true one). */
function itemsOf(lines, g, first, what) {
  const joined = joinLines(lines);
  const t = plain(joined);
  const ms = markers(t, first, first + g.numbers.length - 1, what);
  const intro = slice(joined, 0, ms[0].start);
  const stems = ms.map((m, i) => slice(joined, m.end, i + 1 < ms.length ? ms[i + 1].start : Infinity));
  return { intro, stems, joined };
}
const linesFromRuns = (runs) => {
  // back to lines (no flags)
  const out = [];
  let cur = [];
  for (const r of runs) {
    if (r.t && r.t.includes('\n')) {
      const parts = r.t.split('\n');
      parts.forEach((p, i) => {
        if (i) {
          out.push({ runs: clean(cur) });
          cur = [];
        }
        if (p) cur.push({ ...r, t: p });
      });
    } else cur.push(r);
  }
  out.push({ runs: clean(cur) });
  return out.filter((l) => plain(l.runs).trim() || l.tbl !== undefined);
};
function introFrom(runs) {
  // placeholders for tables are turned back into the table block
  const lines = linesFromRuns(runs).map((l) => {
    const m = /^\u0001(\d+)\u0001$/.exec(plain(l.runs).trim());
    return m ? { tbl: +m[1], runs: [] } : l;
  });
  return introBlocks(lines);
}
const oneLine = (runs) => stripNl(runs);

function parseGroup(k, spec, h, to) {
  const [kind, arg] = spec.split(':');
  const head = titleOf(text(h));
  const lines = linesOf(h + 1, to);
  const what = `passage ${k} ${head.title}`;
  const g = { type: null, title: head.title, numbers: head.numbers };
  const n0 = head.a;
  const printed = kind === 'people' || kind === 'short' ? (arg ? +arg : n0) : n0;

  if (kind === 'tfng' || kind === 'ynng') {
    const { intro, stems } = itemsOf(lines, g, n0, what);
    return {
      ...g,
      type: kind,
      intro: introFrom(intro),
      choices: kind === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'],
      questions: stems.map((s, i) => ({ n: n0 + i, stem: oneLine(s) })),
    };
  }
  if (kind === 'short') {
    const { intro, stems } = itemsOf(lines, g, printed, what);
    const introB = introFrom(intro);
    return { ...g, type: 'short', intro: introB, questions: stems.map((s, i) => ({ n: n0 + i, stem: oneLine(s) })), limit: limitOf(introB.map((b) => plain(b.runs || [])).join(' ')) };
  }
  if (kind === 'info') {
    const { intro, stems } = itemsOf(lines, g, n0, what);
    const [x, y] = arg.split('-');
    return {
      ...g,
      type: 'grid',
      intro: introFrom(intro),
      letters: LETTERS.slice(LETTERS.indexOf(x), LETTERS.indexOf(y) + 1).split(''),
      questions: stems.map((s, i) => ({ n: n0 + i, stem: oneLine(s) })),
    };
  }
  if (kind === 'headings') {
    // the list: "i<TAB>text" lines, or (passages 15 and 17) the numeral on one line and the text on the next
    const at = lines.findIndex((l) => /^List of Headings/.test(lineText(l).trim()));
    let ml = lines.findIndex((l, i) => i > at && /^\s*\d+\s*[.)]?\s*(\t|Paragraph)?/.test(lineText(l)) && /^\s*\d+/.test(lineText(l)));
    if (ml < 0) throw new Error(what + ': no questions');
    const listLines = lines.slice(at + 1, ml);
    const list = [];
    if (/^List of Headings\s+[ivx]+\s*$/.test(lineText(lines[at]).trim())) {
      // interleaved numerals: the texts, in order, are headings i, ii, iii...
      const texts = listLines.filter((l) => !/^\s*[ivx]+\s*$/.test(lineText(l)));
      const ROM = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii'];
      texts.forEach((l, i) => list.push({ key: ROM[i], runs: trim(l.runs) }));
    } else {
      for (const l of listLines) {
        const t = lineText(l);
        const m = /^\s*([ivx]+)\s*\t/.exec(t);
        if (!m) throw new Error(`${what}: heading line ${JSON.stringify(t)}`);
        list.push({ key: m[1], runs: trim(slice(l.runs, t.indexOf('\t') + 1)) });
      }
    }
    const { stems } = itemsOf(lines.slice(ml), g, n0, what);
    const intro = lines.slice(0, at);
    const questions = [];
    let before = null;
    stems.forEach((s, i) => {
      const ls = linesFromRuns(s);
      const q = { n: n0 + i, stem: oneLine(ls[0].runs) };
      if (before) q.before = before;
      before = null;
      if (ls.length > 1) {
        // "Example   Answer / Paragraph C   iii" printed between two questions
        const ex = ls.map((l) => plain(l.runs).replace(/\t/g, ' ').replace(/\s+/g, ' ').trim());
        if (/^Example/.test(ex[1])) before = [{ type: 'p', runs: [run(`Example: ${ex[2].replace(/ ([ivx]+)$/, ' – $1')}`, { b: true })] }];
        else throw new Error(`${what}: extra lines after item ${n0 + i}: ${ex}`);
      }
      questions.push(q);
    });
    return { ...g, type: 'headings', intro: introBlocks(intro), questions, options: { title: [[run('List of Headings', { b: true })]], list }, optionsAfter: false };
  }
  if (kind === 'people' || kind === 'endings') {
    // people: a table "A | Name" and statements "7. ___ found ..." -> statements with a drop-down for the person
    // endings: items "17. Ancient hunters" and lettered lines "A ___ caused ..."
    const opts = [];
    let rest = lines;
    if (kind === 'people') {
      const ti = lines.findIndex((l) => l.tbl !== undefined);
      const tb = blocks[lines[ti].tbl];
      for (const row of tb.rows) opts.push({ key: plain(row[0][0].runs).trim(), runs: trim(clean(row[1][0].runs)) });
      rest = lines.filter((l) => l.tbl === undefined);
    } else {
      rest = [];
      for (const l of lines) {
        const m = /^\s*([A-J])\s+_{3,}\s*/.exec(lineText(l));
        if (m) opts.push({ key: m[1], runs: [run('… '), ...slice(l.runs, m[0].length)] });
        else rest.push(l);
      }
    }
    const { intro, stems } = itemsOf(rest, g, kind === 'people' ? printed : n0, what);
    const introB = introFrom(intro);
    if (kind === 'people') {
      const content = stems.map((s, i) => {
        const r = oneLine(s);
        const t = plain(r);
        const m = /^_+\s*/.exec(t);
        if (!m) throw new Error(`${what}: statement without blank: ${t}`);
        return { type: 'p', list: true, runs: [{ gap: n0 + i }, run(' '), ...slice(r, m[0].length)] };
      });
      return { ...g, type: 'bank', typeName: 'matching features', intro: introB, content, options: { title: null, list: opts }, optionsAfter: false };
    }
    const introText2 = introB.map((b) => plain(b.runs || [])).join(' ');
    const phrases = /phrase/i.test(introText2);
    const options = { title: [[run(phrases ? 'List of Phrases' : 'List of Statements', { b: true })]], list: opts };
    return { ...g, type: 'match', typeName: phrases ? 'matching sentence endings' : 'matching features', intro: introB, questions: stems.map((s, i) => ({ n: n0 + i, stem: oneLine(s) })), options, optionsAfter: false };
  }
  if (kind === 'gap' || kind === 'bank') {
    const intro = [];
    let i = 0;
    const hasGap = (l) => /\d{1,2}\s*_{3,}/.test(lineText(l));
    const INTRO = /(NO MORE THAN|ONE WORD|TWO WORDS|THREE WORDS|answer sheet|There are more|NB\b|from the passage|Complete the|Choose your answer|Write )/i;
    while (i < lines.length && lines[i].tbl === undefined && !hasGap(lines[i]) && INTRO.test(lineText(lines[i]))) intro.push(lines[i++]);
    let contentLines = lines.slice(i).filter((l) => l.tbl === undefined);
    // the instruction and the first block of text in one paragraph
    const first = contentLines[0];
    const m = first && /^(?:Use|Choose|Write)\b[^]*?\b(?:for each answer|each answer|each blank)\.\s+/.exec(lineText(first));
    if (m) {
      intro.push({ runs: trim(slice(first.runs, 0, m[0].length)) });
      contentLines = [{ ...first, runs: slice(first.runs, m[0].length) }, ...contentLines.slice(1)];
    }
    const introB = introBlocks(intro);
    const content = contentLines.map((l) => {
      const t = plain(l.runs);
      const rs = [];
      const re = /(\d{1,2})\s*_{3,}/g;
      let pos = 0;
      let mm;
      while ((mm = re.exec(t))) {
        rs.push(...slice(l.runs, pos, mm.index), { gap: +mm[1] });
        pos = mm.index + mm[0].length;
      }
      rs.push(...slice(l.runs, pos));
      const p = { type: 'p', runs: clean(rs) };
      if (l.center) p.center = true;
      if (l.list) p.list = true;
      return p;
    });
    const gapsFound = content.flatMap((c) => c.runs.filter((r) => r.gap).map((r) => r.gap));
    if (gapsFound.join() !== head.numbers.join()) throw new Error(`${what}: gaps ${gapsFound} != ${head.numbers}`);
    const introText = introB.map((b) => plain(b.runs || [])).join(' ');
    if (kind === 'bank') {
      const sorted = [...WORDS[k]].sort((x, y) => x.localeCompare(y));
      return { ...g, type: 'bank', intro: introB, content, options: { title: null, list: sorted.map((w, j) => ({ key: LETTERS[j], runs: [run(w)] })) }, optionsAfter: true };
    }
    // A flow chart is a list of short steps; the book also calls summary paragraphs "flowchart" by mistake.
    const flow = content.length >= 3 ? { typeName: 'flow-chart completion' } : {};
    return { ...g, type: 'gap', ...flow, intro: introB, content, limit: limitOf(introText) };
  }
  if (kind === 'multi') {
    // passage 1, questions 14-15: "Choose TWO letters from A-E", the question and options A-E
    const optLines = lines.filter((l) => /^\s*[A-E]\.\s/.test(lineText(l)));
    const other = lines.filter((l) => !optLines.includes(l));
    return {
      ...g,
      type: 'multi',
      typeName: 'multiple choice',
      intro: [{ type: 'p', runs: trim(clean(other[1].runs)) }],
      label: `${head.a}–${head.b}`,
      stem: trim(clean(other[0].runs)),
      choose: 2,
      options: optLines.map((l) => ({ key: lineText(l).trim()[0], runs: trim(slice(l.runs, lineText(l).indexOf('.') + 1)) })),
    };
  }
  throw new Error('group kind ' + kind);
}

// ---------- the key ----------
const LABELS = /(?<=\S\s)(?=(?:Vị trí|Câu hỏi|Từ khóa|Giải thích(?: đáp án)?|Dẫn chứng|Bẫy):)/;
function explanationBlocks(bs) {
  const out = [];
  for (const b of bs) {
    if (b.kind !== 'p') continue;
    const runs = clean(b.runs);
    const t = plain(runs);
    if (!t.trim()) continue;
    // split at the labels that start a new part inside a paragraph
    const cuts = [];
    const re = /(?<=\s)(?=(?:Vị trí|Câu hỏi|Từ khóa|Giải thích(?: đáp án)?|Dẫn chứng|Bẫy):)/g;
    let m;
    while ((m = re.exec(t))) {
      if (m.index > 0) cuts.push(m.index);
      re.lastIndex = m.index + 1;
    }
    const parts = [];
    let pos = 0;
    for (const c of cuts) {
      parts.push(slice(runs, pos, c));
      pos = c;
    }
    parts.push(slice(runs, pos));
    for (const part of parts) {
      const pt = plain(part);
      const lm = /^(Vị trí|Câu hỏi|Từ khóa|Giải thích(?: đáp án)?|Dẫn chứng|Bẫy):/.exec(pt);
      const rs = lm ? [run(lm[0], { b: true }), ...slice(part, lm[0].length)] : part;
      out.push({ type: 'p', runs: trim(clean(rs)) });
    }
  }
  return out;
}

function keyOf(k) {
  const entries = [];
  const end = STARTS[k];
  for (let i = endOfQuestions(k); i < end; i++) {
    const b = blocks[i];
    if (b.kind !== 'p') {
      if (entries.length) entries[entries.length - 1].blocks.push(b);
      continue;
    }
    const t = plain(b.runs);
    const m = /^Câu\s*(\d+)\s*(?:[-–]\s*(\d+))?\s*:\s*/.exec(t);
    if (m) {
      // the answer is the rest of the line, up to the first label (passage 10, question 16 has the position in the same block)
      let rest = t.slice(m[0].length);
      const lab = rest.search(/\s(?:Vị trí|Câu hỏi|Từ khóa|Giải thích)/);
      let tail = null;
      if (lab > 0) {
        tail = { kind: 'p', runs: slice(b.runs, m[0].length + lab + 1) };
        rest = rest.slice(0, lab);
      }
      entries.push({ n: +m[1], answer: rest.trim(), blocks: tail ? [tail] : [] });
    } else if (entries.length) entries[entries.length - 1].blocks.push(b);
  }
  return entries;
}

const norm = (s) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

function finishKey(k, groups, entries) {
  const key = {};
  const byN = new Map(entries.map((e) => [e.n, e]));
  const miss = MISSING_KEYS[k] || {};
  const note = (n, what) => [
    { type: 'p', runs: [run('Ghi chú: ', { b: true }), run(`sách hướng dẫn không có đáp án cho câu ${n}; đáp án này được lấy trực tiếp từ bài đọc (“${what}”).`)] },
  ];
  for (const g of groups) {
    if (g.type === 'multi') {
      const a = byN.get(g.numbers[0]);
      const b = byN.get(g.numbers[1]);
      const letters = [a, b].map((e) => /^[A-E]/.exec(e.answer)[0]);
      g.key = {
        answer: letters.join(', '),
        accept: letters,
        explanation: [a, b].flatMap((e) => [{ type: 'p', runs: [run(`Câu ${e.n}`, { b: true })] }, ...explanationBlocks(e.blocks)]),
        evidence: null,
      };
      continue;
    }
    for (const n of g.numbers) {
      let e = byN.get(n);
      let answer;
      let accept;
      let explanation;
      if (!e) {
        const m = miss[n];
        if (!m) throw new Error(`passage ${k}: no key for question ${n}`);
        key[n] = { answer: m.answer, accept: m.accept, explanation: note(n, m.passage), evidence: null };
        continue;
      }
      const raw = e.answer;
      if (g.type === 'tfng' || g.type === 'ynng') {
        answer = raw.toUpperCase().replace(/\s+/g, ' ').replace(/\.$/, '');
        if (!g.choices.includes(answer)) throw new Error(`passage ${k} Q${n}: answer ${raw}`);
        accept = [answer];
      } else if (g.type === 'headings') {
        const m = /^\s*([ivx]+)\b/.exec(raw);
        answer = m[1];
        if (!g.options.list.some((o) => o.key === answer)) throw new Error(`passage ${k} Q${n}: heading ${raw}`);
        accept = [answer];
      } else if (g.type === 'grid') {
        const m = /^([A-Z])\b/.exec(raw);
        answer = m[1];
        if (!g.letters.includes(answer)) throw new Error(`passage ${k} Q${n}: letter ${raw}`);
        accept = [answer];
      } else if (g.type === 'match' || (g.type === 'bank' && g.options.title === null && g.typeName === 'matching features')) {
        const m = /^([A-Z])\b/.exec(raw);
        answer = m[1];
        if (!g.options.list.some((o) => o.key === answer)) throw new Error(`passage ${k} Q${n}: letter ${raw}`);
        accept = [answer];
      } else if (g.type === 'bank') {
        let w = norm(raw.replace(/^academic /i, ''));
        const o = g.options.list.find((x) => norm(plain(x.runs)) === w);
        if (!o) throw new Error(`passage ${k} Q${n}: bank word ${raw}`);
        answer = o.key;
        accept = [answer];
      } else {
        // words: "a / b" are alternatives, "(short) x" is "x" or "short x"
        const alts = /^\w\/\w$/.test(raw) ? [raw] : raw.split(/\s*\/\s*/).filter(Boolean);
        accept = [];
        for (const a of alts) {
          const par = /^\((.+?)\)\s*(.+)$/.exec(a);
          if (par) accept.push(par[2], `${par[1]} ${par[2]}`);
          else accept.push(a);
        }
        const par = /^\((.+?)\)\s*(.+)$/.exec(raw);
        for (const x of EXTRA_ACCEPT[`${k}-${n}`] || []) accept.push(x);
        if (REPLACE_ACCEPT[`${k}-${n}`]) accept = [...REPLACE_ACCEPT[`${k}-${n}`]];
        answer = accept[0];
        accept = [...new Set(accept)];
      }
      explanation = explanationBlocks(e.blocks);
      key[n] = { answer, accept, explanation, evidence: null };
    }
  }
  return key;
}

// ---------- build ----------
const passages = [];
for (let k = 1; k <= 18; k++) {
  const layout = LAYOUT[k];
  const hs = headerIndexes(k);
  if (hs.length !== layout.groups.length) throw new Error(`passage ${k}: ${hs.length} question headers, expected ${layout.groups.length}`);
  const qEnd = endOfQuestions(k);
  const body = bodyOf(k, STARTS[k - 1] + 1, hs[0], layout);
  const groups = layout.groups.map((spec, j) => {
    if (spec === 'multi') {
      return parseGroup(k, 'multi', hs[j], hs[j + 1] ?? qEnd);
    }
    return parseGroup(k, spec, hs[j], hs[j + 1] ?? qEnd);
  });
  // The book's instruction for passage 18 names "the Great Eastern" (a ship from another passage): a copy-and-paste slip.
  for (const g of groups) for (const b of g.intro || []) for (const r of b.runs || []) if (r.t) r.t = r.t.replace('Complete the summary of the Great Eastern.', 'Complete the summary below.');
  const key = finishKey(k, groups, keyOf(k));
  const notes = MISSING_KEYS[k]
    ? [{ type: 'p', runs: [run('Lưu ý: ', { b: true }), run(`sách hướng dẫn không có đáp án cho câu ${Object.keys(MISSING_KEYS[k]).join(' và ')}. Hai đáp án này được rút ra trực tiếp từ bài đọc.`)] }]
    : [];
  passages.push({
    slug: `passage-${String(k).padStart(2, '0')}-${TITLES[k - 1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    order: k,
    number: k,
    head: [],
    title: [run(TITLES[k - 1])],
    standfirst: null,
    body,
    footnotes: [],
    groups,
    key,
    strategy: [],
    reading: [],
    ...(notes.length ? { keyNotes: notes } : {}),
  });
}

const data = {
  topic: 'Recent Actual Test 7',
  slug: SLUG,
  numberLabel: 'Passage',
  sources: { questions: 'HƯỚNG DẪN GIẢI ĐỀ RECENT ACTUAL TESTS.pdf', key: 'HƯỚNG DẪN GIẢI ĐỀ RECENT ACTUAL TESTS.pdf' },
  passages,
};
fs.writeFileSync(path.join(root, 'data', `${SLUG}.json`), JSON.stringify(data, null, 1) + '\n');

// a short report
for (const p of passages) {
  const letters = p.body.filter((b) => b.letter).map((b) => b.letter).join('');
  console.log(`P${p.number} ${plain(p.title)}: ${p.body.length} body items, letters ${letters || '-'}; groups ${p.groups.map((g) => `${g.type}${g.numbers[0]}-${g.numbers[g.numbers.length - 1]}`).join(' ')}`);
}
