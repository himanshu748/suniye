import { readFile, stat } from 'node:fs/promises';
import { extname } from 'node:path';
import { z } from 'zod';
import { PreparationError } from './store.js';

const pageList = z.array(z.string().trim().min(1).max(12000)).min(1).max(10);
export function validatePages(pages) {
  const checked = pageList.safeParse(pages);
  if (!checked.success || checked.data.reduce((n, text) => n + text.length, 0) > 60000) throw new PreparationError('INVALID_PAGES');
  return checked.data;
}
export async function readPages(file) {
  if ((await stat(file)).size > 15_000_000) throw new PreparationError('PDF_TOO_LARGE');
  const bytes = await readFile(file);
  if (extname(file).toLowerCase() === '.json') {
    let data; try { data = JSON.parse(bytes.toString('utf8')); } catch { throw new PreparationError('INVALID_PAGES'); }
    return validatePages(data.pages);
  }
  if (extname(file).toLowerCase() !== '.pdf') throw new PreparationError('PDF_OR_PAGES_REQUIRED');
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const document = await getDocument({ data: new Uint8Array(bytes), isEvalSupported: false, useSystemFonts: false, verbosity: 0 }).promise;
  try {
    if (document.numPages > 10) throw new PreparationError('TOO_MANY_PAGES');
    const pages = [];
    for (let index = 1; index <= document.numPages; index++) {
      const page = await document.getPage(index);
      const content = await page.getTextContent();
      const text = content.items.map(item => item.str + (item.hasEOL ? '\n' : ' ')).join('').trim();
      if (!text || text.includes('\ufffd') || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) throw new PreparationError('PDF_NEEDS_ON_DEVICE_OCR');
      pages.push(text);
    }
    return validatePages(pages);
  } finally { await document.destroy(); }
}
