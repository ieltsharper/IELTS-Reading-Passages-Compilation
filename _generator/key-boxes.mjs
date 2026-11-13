// Key layout 5 ("boxes", Environment): "UNIT n · GROUP · PASSAGE n" (Heading1), the passage title on the next
// line, a "⚠ Ghi chú lỗi PDF / đáp án gốc" box, BƯỚC 1/2/3 (Heading2). In BƯỚC 3 each answer is a one-cell box:
//   "✅ Câu 7 → pain  (paraphrase of the question)\nDẫn chứng: …\nGiải thích: …"
//   "✅ Câu 20–21 → A và D  (…)"          two letters, one question pair
//   "✅ Câu 9 → Florida, America (hoặc North America)  (…)"   "(hoặc …)" / "(a / b)" = also accepted
//   "⏸ Q2 (statement): … → NOT GIVEN."   a question settled while reading (TRUE/FALSE/NOT GIVEN/YES/NO)
// A trailing "*" on an answer (the key's "please decide") is not part of the answer.
// Paragraph variant (Food & Health): the answer is a paragraph "✅ Câu 32 → E · Jeffrey Friedman (paraphrase)"
// followed by "Dẫn chứng: …", "Giải thích: …", "Bẫy: …" paragraphs (together they are the box); the unit's
// "Ghi chú sửa lỗi nguồn" paragraphs before BƯỚC 1 are its notes. "(outer) shells" = shells, also "outer shells".
// Tourism: one key file for three handouts (UNIT 1–8, "UNIT 1 · Bondi Beach"); notes start "Lưu ý"; each
// passage in the topic config says which key unit it uses (`keyUnit`).
import { textOf } from './docx.mjs';

const VERDICT = /→\s*(TRUE|FALSE|NOT GIVEN|YES|NO)\b[^→]*$/;

/** Answer text -> { answer, alts }. */
export function readAnswer(raw) {
  let a = raw.replace(/\s{2,}\(.*$/, '').trim(); // the question paraphrase after two spaces
  let alts = [];
  const m = a.match(/^(.*?)\s*\((?:hoặc:?\s*)?([^()]*)\)$/);
  if (m && m[1]) {
    a = m[1].trim();
    alts = m[2].split('/').map((s) => s.trim()).filter(Boolean);
  }
  a = a.replace(/\*+$/, '').trim();
  if (/^[A-Z] và [A-Z]$/.test(a)) a = a.replace(' và ', ', ');
  return { answer: a, alts };
}

/** A paragraph answer: "E · Jeffrey Friedman (…)" -> { answer: 'E', alts: [] }. */
export function readParagraphAnswer(raw) {
  let a = raw.replace(/\s+\([^()]*\)$/, '').trim(); // the question paraphrase
  a = a.replace(/^([A-Z]) · .*$/, '$1'); // the option's words after the letter
  const opt = a.match(/^\(([^()]+)\) (.+)$/);
  if (opt) return { answer: opt[2], alts: [opt[1] + ' ' + opt[2]] };
  return { answer: a, alts: [] };
}
const FOLLOWS = /^(✅|⏸|Tiến độ|🔗|💡|\(\d+\)|→)/;

/** All units: { unit: { title, notes: [box], step1: [], step2: [], step3: [], answers, alts, boxes } }. */
export function readBoxes(blocks) {
  const units = {};
  let cur = null;
  let part = null;
  let open = null; // the paragraph box being filled
  blocks.forEach((b, i) => {
    const t = textOf(b).trim();
    const tt = b.kind === 'p' ? textOf(b).trim() : '';
    if (open && b.kind === 'p' && !/^Heading/.test(b.style || '') && tt && !FOLLOWS.test(tt)) {
      open.blocks.push(b);
      cur.step3.push(b);
      return;
    }
    open = null;
    // Tourism key: a plain "UNIT 2 · PASSAGE 1" line before the unit's heading (not part of the unit before).
    if (b.kind === 'p' && /^UNIT \d+ · PASSAGE \d+$/.test(t)) return;
    if (b.kind === 'p' && b.style === 'Heading1') {
      const m = t.match(/^UNIT (\d+) · (.*)$/);
      // "UNIT 1 · FOOD & DIET · PASSAGE 3" + the title on the next line, or "UNIT 1 · Bondi Beach" (Tourism).
      const title = m && (/· PASSAGE \d+$/.test(t) ? textOf(blocks[i + 1]).trim() : m[2].trim());
      cur = m ? (units[m[1]] = { unit: +m[1], title, notes: [], step1: [], step2: [], step3: [], answers: {}, alts: {}, boxes: {} }) : null;
      part = 'pre';
      return;
    }
    if (!cur) return;
    if (b.kind === 'p' && b.style === 'Heading2') {
      part = /^BƯỚC 1/.test(t) ? 'step1' : /^BƯỚC 2/.test(t) ? 'step2' : /^BƯỚC 3/.test(t) ? 'step3' : part;
      if (part === 'step1' || part === 'step2') cur[part].push({ heading: b });
      return;
    }
    if (part === 'pre') {
      if (b.kind === 'tbl' && t.startsWith('⚠')) cur.notes.push(b);
      if (b.kind === 'p' && (/^(Ghi chú sửa lỗi nguồn|Lưu ý)/.test(t) || (cur.notes.length && cur.notes[0].kind === 'p'))) cur.notes.push(b);
      return;
    }
    if (part !== 'step3') {
      cur[part].push(b);
      return;
    }
    cur.step3.push(b);
    // "✅ Câu 9–10 → A, D (…)" (Tourism): one answer for a choose-TWO/THREE group.
    const para = b.kind === 'p' && t.match(/^✅ Câu (\d+)(?:[–-](\d+))? → (.*)$/);
    if (para) {
      const k = para[2] ? para[1] + '-' + para[2] : para[1];
      const { answer, alts } = readParagraphAnswer(para[3]);
      cur.answers[k] = answer;
      if (alts.length) cur.alts[k] = alts;
      cur.boxes[k] = open = { kind: 'group', blocks: [b] };
      return;
    }
    if (b.kind !== 'tbl') return;
    for (const line of t.split('\n')) {
      const ok = line.match(/^✅ Câu (\d+)(?:[–-](\d+))?(?: – [^→]*)? → (.*)$/);
      if (ok) {
        const k = ok[2] ? ok[1] + '-' + ok[2] : ok[1];
        const { answer, alts } = readAnswer(ok[3]);
        cur.answers[k] = answer;
        if (alts.length) cur.alts[k] = alts;
        cur.boxes[k] = b;
        continue;
      }
      const wait = line.match(/^⏸ Q(\d+)\b/);
      const v = wait && !/chờ/.test(line) && line.match(VERDICT);
      if (v && !cur.answers[wait[1]]) {
        cur.answers[wait[1]] = v[1];
        cur.boxes[wait[1]] = { kind: 'p', style: null, list: null, runs: [{ t: line }] };
      }
    }
  });
  return units;
}
