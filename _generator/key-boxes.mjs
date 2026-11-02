// Key layout 5 ("boxes", Environment): "UNIT n · GROUP · PASSAGE n" (Heading1), the passage title on the next
// line, a "⚠ Ghi chú lỗi PDF / đáp án gốc" box, BƯỚC 1/2/3 (Heading2). In BƯỚC 3 each answer is a one-cell box:
//   "✅ Câu 7 → pain  (paraphrase of the question)\nDẫn chứng: …\nGiải thích: …"
//   "✅ Câu 20–21 → A và D  (…)"          two letters, one question pair
//   "✅ Câu 9 → Florida, America (hoặc North America)  (…)"   "(hoặc …)" / "(a / b)" = also accepted
//   "⏸ Q2 (statement): … → NOT GIVEN."   a question settled while reading (TRUE/FALSE/NOT GIVEN/YES/NO)
// A trailing "*" on an answer (the key's "please decide") is not part of the answer.
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

/** All units: { unit: { title, notes: [box], step1: [], step2: [], step3: [], answers, alts, boxes } }. */
export function readBoxes(blocks) {
  const units = {};
  let cur = null;
  let part = null;
  blocks.forEach((b, i) => {
    const t = textOf(b).trim();
    if (b.kind === 'p' && b.style === 'Heading1') {
      const m = t.match(/^UNIT (\d+) · /);
      cur = m ? (units[m[1]] = { unit: +m[1], title: textOf(blocks[i + 1]).trim(), notes: [], step1: [], step2: [], step3: [], answers: {}, alts: {}, boxes: {} }) : null;
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
      return;
    }
    if (part !== 'step3') {
      cur[part].push(b);
      return;
    }
    cur.step3.push(b);
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
