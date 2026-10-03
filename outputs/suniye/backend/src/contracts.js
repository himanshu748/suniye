import { z } from 'zod';

export class PublicError extends Error {
  constructor(code, message, status = 503) { super(message); this.code = code; this.status = status; }
}

export const readInput = z.object({
  requestId: z.uuid(), language: z.literal('hi'), mode: z.enum(['read', 'explain']),
  text: z.string().trim().min(1).max(12000).optional(),
  image: z.string().max(4_200_000).optional(),
  wantAudio: z.boolean().default(false),
}).strict().refine(x => Number(Boolean(x.text)) + Number(Boolean(x.image)) === 1, 'Supply text or image');

export const extracted = z.object({
  kind: z.enum(['reading', 'retake']),
  originalText: z.string().max(12000), description: z.string().max(600),
  retakeReason: z.string().max(600),
}).strict().superRefine((x, ctx) => {
  if (x.kind === 'reading' && !x.originalText.trim() && !x.description.trim()) ctx.addIssue({code:'custom', message:'Empty reading'});
  if (x.kind === 'retake' && !x.retakeReason.trim()) ctx.addIssue({code:'custom', message:'Missing retake instruction'});
});

export const reading = z.object({
  kind: z.enum(['reading', 'retake']), originalText: z.string(), spokenText: z.string(),
  isExplanation: z.boolean(), isDescription: z.boolean(), retakeReason: z.string(),
  audioBase64: z.string().optional(),
});

export const preferences = z.object({
  language: z.literal('hi'), speed: z.number().min(0.5).max(1.2),
  textScale: z.number().min(1).max(1.6), placement: z.enum(['left', 'right']),
}).strict();

export function validateImage(data) {
  const match = /^data:image\/(jpeg|png);base64,([A-Za-z0-9+/]+={0,2})$/.exec(data);
  if (!match || match[2].length % 4 !== 0) throw new PublicError('INVALID_IMAGE', 'चित्र दोबारा लें।', 400);
  const b = Buffer.from(match[2], 'base64');
  if (b.length > 3_000_000 || b.length < 24 || b.toString('base64') !== match[2]) throw new PublicError('INVALID_IMAGE', 'चित्र बहुत बड़ा है या खुल नहीं रहा।', 400);
  let w = 0, h = 0;
  if (match[1] === 'png') {
    if (!b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || b.toString('ascii',12,16) !== 'IHDR') throw new PublicError('INVALID_IMAGE', 'चित्र दोबारा लें।', 400);
    w = b.readUInt32BE(16); h = b.readUInt32BE(20);
  } else {
    if (b[0] !== 255 || b[1] !== 216 || b[b.length-2] !== 255 || b[b.length-1] !== 217) throw new PublicError('INVALID_IMAGE', 'चित्र दोबारा लें।', 400);
    let p = 2;
    while (p + 8 < b.length) {
      if (b[p++] !== 255) break;
      while (b[p] === 255) p++;
      const marker = b[p++];
      if (marker === 217 || marker === 218) break;
      if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
      const n = b.readUInt16BE(p);
      if (n < 2 || p + n > b.length) break;
      if ([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) { if(n<8||p+7>b.length)break;h=b.readUInt16BE(p+3); w=b.readUInt16BE(p+5); break; }
      p += n;
    }
  }
  if (!w || !h || w > 4096 || h > 4096 || w*h > 12_000_000) throw new PublicError('INVALID_IMAGE', 'छोटा और साफ़ चित्र लें।', 400);
  return { width:w, height:h, bytes:b.length };
}

export function parseExtraction(text) {
  try {
    const json = text.trim().replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const x = extracted.parse(JSON.parse(json));
    return { ...x, originalText:x.originalText.trim(), description:x.description.trim(), retakeReason:x.retakeReason.trim() };
  } catch { throw new PublicError('UNREADABLE', 'यह साफ़ पढ़ नहीं पाया। पास से दोबारा चित्र लें।', 422); }
}
