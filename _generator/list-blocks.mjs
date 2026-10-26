// Prints every top-level block of a .docx with its index, to write a topic config.
// Usage: node _generator/list-blocks.mjs <file.docx> [width]
import { readDocx, textOf } from './docx.mjs';

const [file, width = '160'] = process.argv.slice(2);
const { blocks } = readDocx(file);
blocks.forEach((b, i) => {
  const tag = b.kind === 'tbl' ? `[TABLE ${b.rows.length}x${b.rows[0]?.length}]` : `${b.style ? `{${b.style}}` : ''}${b.list ? `{list${b.list.numId}}` : ''}`;
  console.log(String(i).padStart(4), tag, JSON.stringify(textOf(b)).slice(0, +width));
});
