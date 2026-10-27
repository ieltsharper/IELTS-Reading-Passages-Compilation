// Helpers for "runs": arrays of { t, b?, i?, u? } text pieces (plus { gap: n } in completion content).
import { textOf } from './docx.mjs';

export const plain = (runs) => runs.map((r) => (r.gap ? `[${r.gap}]` : r.t || '')).join('');

/** Copies runs, dropping false flags and empty text. Adjacent runs with equal formatting are merged. */
export function clean(runs) {
  const out = [];
  for (const r of runs) {
    if (r.img) {
      out.push({ img: r.img });
      continue;
    }
    if (r.gap) {
      out.push(r.part ? { gap: r.gap, part: r.part } : { gap: r.gap });
      continue;
    }
    if (!r.t) continue;
    const x = { t: r.t };
    if (r.b) x.b = true;
    if (r.i) x.i = true;
    if (r.u) x.u = true;
    const last = out[out.length - 1];
    if (last && last.t !== undefined && !!last.b === !!x.b && !!last.i === !!x.i && !!last.u === !!x.u) last.t += x.t;
    else out.push(x);
  }
  return out;
}

/** Runs between character offsets [start, end) of the joined text. */
export function slice(runs, start, end = Infinity) {
  const out = [];
  let pos = 0;
  for (const r of runs) {
    const t = r.t || '';
    const a = Math.max(start, pos);
    const b = Math.min(end, pos + t.length);
    if (b > a) out.push({ ...r, t: t.slice(a - pos, b - pos) });
    pos += t.length;
  }
  return clean(out);
}

/** Trims whitespace at both ends of a run list. */
export function trim(runs) {
  const text = plain(runs);
  const start = text.length - text.trimStart().length;
  const end = text.trimEnd().length;
  return slice(runs, start, end);
}

/** Generic, cleaned copy of a docx block for rendering (paragraph or table). */
export function block(b) {
  if (b.kind === 'p') {
    const x = { type: 'p', runs: trim(b.runs) };
    if (b.center) x.center = true;
    if (b.list) x.list = true;
    return x;
  }
  return { type: 'table', rows: b.rows.map((row) => row.map((cell) => cell.map(block).filter((p) => !isEmpty(p)))) };
}

/**
 * Replaces `find` with `replace` in a paragraph's runs (an approved correction). The new text takes the
 * formatting of the run where `find` starts. Throws when `find` is not in the paragraph exactly once.
 */
export function replaceInRuns(runs, find, replace) {
  const text = plain(runs);
  const at = text.indexOf(find);
  if (at < 0 || text.indexOf(find, at + 1) >= 0) throw new Error(`fix: ${JSON.stringify(find)} found ${at < 0 ? 0 : 'more than 1'} times`);
  let pos = 0;
  let fmt = {};
  for (const r of runs) {
    const len = (r.t || '').length;
    if (at < pos + len) {
      fmt = { b: r.b, i: r.i, u: r.u };
      break;
    }
    pos += len;
  }
  return clean([...slice(runs, 0, at), { t: replace, ...fmt }, ...slice(runs, at + find.length)]);
}

/** Applies the approved corrections of a topic config ({ block, find, replace }) to the docx blocks. */
export function applyFixes(blocks, fixes = []) {
  for (const f of fixes) {
    const b = blocks[f.block];
    if (!b || b.kind !== 'p') throw new Error(`fix: block ${f.block} is not a paragraph`);
    b.runs = replaceInRuns(b.runs, f.find, f.replace);
  }
}

/** Splits runs before each marker text (in order). Returns the pieces. */
export function splitRuns(runs, markers) {
  const text = plain(runs);
  const cuts = [];
  let from = 0;
  for (const m of markers) {
    const at = text.indexOf(m, from);
    if (at < 0) throw new Error(`split: ${JSON.stringify(m)} not found`);
    cuts.push(at);
    from = at + m.length;
  }
  const bounds = [0, ...cuts, text.length];
  return bounds.slice(0, -1).map((a, i) => trim(slice(runs, a, bounds[i + 1])));
}

export const isEmpty =(b) => (b.type === 'p' ? !plain(b.runs).trim() : b.rows.every((r) => r.every((c) => !c.length)));

export { textOf };
