// Minimal .docx reader (no libraries): unzips word/document.xml and turns the body into blocks.
//   paragraph: { kind: 'p', style, list: { numId, ilvl } | null, center, runs: [{ t, b, i, u }] }
//   table:     { kind: 'tbl', rows: [[cell: block[]]] }
// Runs keep bold / italic / underline; tabs become '\t', line breaks '\n'. Deleted text (tracked
// changes) is dropped; images become a run { img: rId }.
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function readZip(file) {
  const buf = fs.readFileSync(file);
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error(`${file}: not a zip file`);
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const files = {};
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28);
    const xlen = buf.readUInt16LE(p + 30);
    const clen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen);
    const lnlen = buf.readUInt16LE(local + 26);
    const lxlen = buf.readUInt16LE(local + 28);
    const data = buf.subarray(local + 30 + lnlen + lxlen, local + 30 + lnlen + lxlen + csize);
    files[name] = method === 0 ? data : zlib.inflateRawSync(data);
    p += 46 + nlen + xlen + clen;
  }
  return files;
}

const decode = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, '&');

const on = (rpr, tag) => new RegExp(`<w:${tag}/>|<w:${tag} w:val="(1|true|on)"/>`).test(rpr);

function matchEnd(s, start, tag) {
  const re = new RegExp(`<${tag}[ >]|<${tag}/>|</${tag}>`, 'g');
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(s))) {
    if (m[0] === `<${tag}/>`) {
      if (depth === 0) return m.index + m[0].length;
    } else if (m[0].startsWith('</')) {
      depth--;
      if (depth === 0) return m.index + m[0].length;
    } else depth++;
  }
  return s.length;
}

function paragraph(p) {
  const ppr = (p.match(/<w:pPr>([\s\S]*?)<\/w:pPr>/) || [])[1] || '';
  const numId = (ppr.match(/<w:numId w:val="(\d+)"/) || [])[1];
  const ilvl = (ppr.match(/<w:ilvl w:val="(\d+)"/) || [])[1];
  const runs = [];
  const body = p.replace(/<w:del [\s\S]*?<\/w:del>/g, '').replace(/<w:pPr>[\s\S]*?<\/w:pPr>/, '');
  const re = /<w:r[ >][\s\S]*?<\/w:r>/g;
  let m;
  while ((m = re.exec(body))) {
    const r = m[0];
    const rpr = (r.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/) || [])[1] || '';
    const fmt = {
      b: on(rpr, 'b'),
      i: on(rpr, 'i'),
      u: /<w:u w:val="(?!none)/.test(rpr),
    };
    const img = r.match(/r:embed="([^"]+)"/);
    if (img) runs.push({ img: img[1] });
    let t = '';
    const tre = /<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>|<w:t\/>|<w:tab\/>|<w:br\/>|<w:br [^>]*\/>|<w:cr\/>|<w:noBreakHyphen\/>|<w:softHyphen\/>|<w:sym [^>]*\/>/g;
    let tm;
    while ((tm = tre.exec(r))) {
      const x = tm[0];
      if (x === '<w:tab/>') t += '\t';
      else if (x.startsWith('<w:br') || x === '<w:cr/>') t += '\n';
      else if (x === '<w:noBreakHyphen/>') t += '-';
      else if (x === '<w:softHyphen/>') t += '';
      else if (x.startsWith('<w:sym')) {
        const c = x.match(/w:char="([0-9A-Fa-f]+)"/);
        t += c ? `[sym:${c[1]}]` : '';
      } else if (tm[1] !== undefined) t += decode(tm[1]);
    }
    if (!t) continue;
    const last = runs[runs.length - 1];
    if (last && !last.img && last.b === fmt.b && last.i === fmt.i && last.u === fmt.u) last.t += t;
    else runs.push({ t, ...fmt });
  }
  return {
    kind: 'p',
    style: (ppr.match(/<w:pStyle w:val="([^"]+)"/) || [])[1] || null,
    list: numId && numId !== '0' ? { numId: +numId, ilvl: +(ilvl || 0) } : null,
    center: /<w:jc w:val="center"/.test(ppr),
    runs,
  };
}

function blocksOf(s) {
  const out = [];
  const re = /<w:p[ >]|<w:p\/>|<w:tbl>|<w:sdt>/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[0] === '<w:tbl>') {
      const end = matchEnd(s, m.index, 'w:tbl');
      out.push(table(s.slice(m.index, end)));
      re.lastIndex = end;
    } else if (m[0] === '<w:sdt>') {
      const end = matchEnd(s, m.index, 'w:sdt');
      const inner = (s.slice(m.index, end).match(/<w:sdtContent>([\s\S]*)<\/w:sdtContent>/) || [])[1] || '';
      out.push(...blocksOf(inner));
      re.lastIndex = end;
    } else if (m[0] === '<w:p/>') {
      out.push({ kind: 'p', style: null, list: null, center: false, runs: [] });
    } else {
      const end = matchEnd(s, m.index, 'w:p');
      out.push(paragraph(s.slice(m.index, end)));
      re.lastIndex = end;
    }
  }
  return out;
}

function table(tbl) {
  const rows = [];
  const rre = /<w:tr[ >]/g;
  let rm;
  while ((rm = rre.exec(tbl))) {
    const rend = matchEnd(tbl, rm.index, 'w:tr');
    const tr = tbl.slice(rm.index, rend);
    rre.lastIndex = rend;
    const cells = [];
    const cre = /<w:tc[ >]/g;
    let cm;
    while ((cm = cre.exec(tr))) {
      const cend = matchEnd(tr, cm.index, 'w:tc');
      cells.push(blocksOf(tr.slice(cm.index, cend).replace(/^<w:tc[ >]/, ' ')));
      cre.lastIndex = cend;
    }
    rows.push(cells);
  }
  return { kind: 'tbl', rows };
}

export function readDocx(file) {
  // A text PDF (History P1): read by pdf-blocks.py into the same blocks.
  if (/.pdf$/i.test(file)) {
    const out = execFileSync('python', ['-I', '-X', 'utf8', path.join(path.dirname(fileURLToPath(import.meta.url)), 'pdf-blocks.py'), file], { maxBuffer: 1 << 28 });
    return { ...JSON.parse(out.toString('utf8')), files: {} };
  }
  const files = readZip(file);
  const xml = files['word/document.xml'].toString('utf8');
  const body = xml.match(/<w:body>([\s\S]*)<\/w:body>/)[1];
  return { blocks: blocksOf(body), files };
}

/** Plain text of a block (tables: cells joined by ' | ', rows by '\n'). */
export function textOf(block) {
  if (!block) return '';
  if (block.kind === 'p') return block.runs.map((r) => r.t || '').join('');
  return block.rows.map((row) => row.map((cell) => cell.map(textOf).join('\n')).join(' | ')).join('\n');
}
