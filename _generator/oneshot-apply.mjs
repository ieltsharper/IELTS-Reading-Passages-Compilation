// One-shot guides: turn _generator/strategy/<topic>/<slug>.json into data/<topic>.json `strategy` blocks.
//   node _generator/oneshot-apply.mjs <topic> --check     validate only (answers = key, quotes appear in the passage, every question covered)
//   node _generator/oneshot-apply.mjs <topic>             validate, then write `strategy` into data/<topic>.json
// Source file format (Vietnamese text, English quotes):
// { "step1": "...", "types": [["1-5","Dạng","Locate được?","Từ khóa"], ...], "typesNote": "...",
//   "walk": [ { "para": "Đoạn 1", "idea": "ý chính", "answers": [ { "q": 1, "ans": "TRUE", "quote": "text copied from passage", "how": "..." } ], "note": "..." } ],
//   "tips": ["..."] }
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const topic = process.argv[2];
const checkOnly = process.argv.includes('--check');
const dataFile = path.join(root, 'data', `${topic}.json`);
const dir = path.join(root, '_generator', 'strategy', topic);
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const norm = (s) => String(s).replace(/[‘’‛′`]/g, "'").replace(/[“”„]/g, '"').replace(/[–—−]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
const runsText = (runs) => (runs || []).map((r) => r.t ?? '').join('');
const blockText = (b) => (b.runs ? runsText(b.runs) : Array.isArray(b) ? b.map(blockText).join(' ') : JSON.stringify(b));
const T = (t, o = {}) => ({ t, ...o });
const P = (runs, extra = {}) => ({ type: 'p', runs: runs.map((r) => (typeof r === 'string' ? T(r) : r)), ...extra });
const H = (t) => ({ type: 'h', runs: [T(t)] });

let problems = 0;
const bad = (slug, msg) => { problems++; console.log(`  PROBLEM ${slug}: ${msg}`); };

function render(g) {
  const out = [H('Bước 1 – Đọc tiêu đề, nắm chủ đề'), P([g.step1])];
  out.push(H('Bước 2 – Phân loại câu hỏi'));
  out.push({ type: 'table', rows: g.types.map((r) => r.map((c) => [P([c])])) });
  if (g.typesNote) out.push(P([g.typesNote]));
  out.push(H('Bước 3 – Đọc One-Shot: đến đoạn nào chốt hết câu hỏi của đoạn đó'));
  for (const w of g.walk) {
    out.push(P([T(`${w.para} – `, { b: true }), w.idea]));
    for (const a of w.answers || []) {
      const runs = [T(`Câu ${a.q} → ${a.ans}. `, { b: true }), a.how];
      if (a.quote) runs.push(T(` Trích: "${a.quote}"`, { i: true }));
      out.push(P(runs, { list: true }));
    }
    if (w.note) out.push(P([T('Lưu ý: ', { b: true }), w.note], { list: true }));
  }
  if (g.tips?.length) {
    out.push(H('Bẫy cần tránh'));
    for (const t of g.tips) out.push(P([t], { list: true }));
  }
  return out;
}

let done = 0;
for (const p of data.passages) {
  const f = path.join(dir, `${p.slug}.json`);
  if (!fs.existsSync(f)) continue;
  let g;
  try { g = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { bad(p.slug, 'invalid JSON: ' + e.message); continue; }
  const body = norm(p.body.map(blockText).join(' '));
  const keyNums = Object.keys(p.key).map(Number);
  const seen = new Set();
  if (!g.step1 || !Array.isArray(g.types) || !g.types.length || !Array.isArray(g.walk) || !g.walk.length) { bad(p.slug, 'missing step1/types/walk'); continue; }
  for (const w of g.walk) {
    if (!w.para || !w.idea) bad(p.slug, 'walk item without para/idea');
    for (const a of w.answers || []) {
      const k = p.key[String(a.q)];
      if (!k) { bad(p.slug, `Q${a.q} is not in the key`); continue; }
      seen.add(Number(a.q));
      const okAns = [k.answer, ...(k.accept || [])].flat().map(norm);
      if (!okAns.includes(norm(a.ans))) bad(p.slug, `Q${a.q} answer "${a.ans}" differs from key "${k.answer}"`);
      if (!a.how) bad(p.slug, `Q${a.q} has no explanation`);
      if (a.quote) for (const frag of String(a.quote).split(/\.{3}|…/).map(norm).filter((x) => x.length > 2)) if (!body.includes(frag)) bad(p.slug, `Q${a.q} quote not in passage: "${frag}"`);
    }
  }
  for (const n of keyNums) if (!seen.has(n)) bad(p.slug, `Q${n} not covered`);
  if (!checkOnly) p.strategy = render(g);
  done++;
}
console.log(`${topic}: ${done} guide file(s) read, ${problems} problem(s)`);
if (!checkOnly && !problems) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 1) + '\n');
}
process.exit(problems ? 1 : 0);
