// The looks' contact sheets — several `osy test --pixels` shots laid side by side with a caption each, photographed into
// one JPEG. Used for the design record (Docs/OsySharp/design/looks/) and the package's README pictures.
//
//   node kits/ui-looks/docs/contact-sheet.mjs <sheet.json> <out.jpg>
//
// sheet.json: { "title": "…", "columns": 5, "width": 2400, "dark": false,
//               "panels": [ { "image": "<absolute png path>", "caption": "Ledger", "note": "the document desk" }, … ] }
//
// Playwright comes from osy-client (the same browser the pixel tier photographs with), so nothing new is installed.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '../../../osy-client/package.json'));
const { chromium } = require('playwright');

const [, , specPath, outPath] = process.argv;
if (!specPath || !outPath) { console.error('usage: node contact-sheet.mjs <sheet.json> <out.jpg>'); process.exit(2); }
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const cols = spec.columns ?? spec.panels.length;
const width = spec.width ?? 2400;
const ink = spec.dark ? '#E9EAEE' : '#16181D';
const ground = spec.dark ? '#0B0C0F' : '#EDEDEA';
const muted = spec.dark ? '#9298A3' : '#5D636E';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const panels = spec.panels.map((p) => {
  const data = readFileSync(p.image).toString('base64');
  return `<figure><img src="data:image/png;base64,${data}"><figcaption><b>${esc(p.caption)}</b>${p.note ? ` <span>${esc(p.note)}</span>` : ''}</figcaption></figure>`;
}).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; }
  body { background: ${ground}; color: ${ink}; font: 15px/1.4 -apple-system, "Helvetica Neue", Arial, sans-serif; padding: 28px; width: ${width}px; }
  h1 { font-size: 20px; font-weight: 600; margin-bottom: 18px; letter-spacing: -0.01em; }
  h1 span { color: ${muted}; font-weight: 400; }
  .grid { display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: 22px; align-items: start; }
  figure img { width: 100%; display: block; border-radius: 6px; box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 8px 24px -12px rgba(0,0,0,.25); }
  figcaption { margin-top: 9px; font-size: 14px; }
  figcaption span { color: ${muted}; }
</style></head><body>
<h1>${esc(spec.title)}${spec.subtitle ? ` <span>— ${esc(spec.subtitle)}</span>` : ''}</h1>
<div class="grid">${panels}</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: width + 56, height: 800 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: outPath, fullPage: true, type: 'jpeg', quality: 82 });
await browser.close();
console.log('wrote', outPath);
