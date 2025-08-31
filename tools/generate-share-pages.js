// Generates share/<id>.html pages with OG/Twitter tags from blogs.json
// Usage: node tools/generate-share-pages.js

const fs = require('fs');
const path = require('path');

function readJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf-8')); }
function readTextSafe(p){ try { return fs.readFileSync(p, 'utf-8').trim(); } catch { return ''; } }

const ROOT = path.resolve(__dirname, '..');
const BLOGS_JSON = path.join(ROOT, 'blogs.json');
const SHARE_DIR = path.join(ROOT, 'share');
const CNAME_PATH = path.join(ROOT, 'CNAME');

function ensureDir(p){ if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function getBaseUrl(){
  const envUrl = process.env.SITE_BASE_URL && process.env.SITE_BASE_URL.trim();
  if (envUrl) return envUrl.replace(/\/$/, '');
  const cname = readTextSafe(CNAME_PATH).split(/\r?\n/).find(Boolean);
  if (cname) return `https://${cname.replace(/\/$/, '')}`;
  return 'https://www.virkat.org';
}

function htmlEscape(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function generateShareHtml({ id, title, description, image, baseUrl }){
  const safeTitle = htmlEscape(title || 'Virkat Blog');
  const safeDesc = htmlEscape(description || 'A Virkat blog post');
  const imagePath = (image || '').replace(/^\//,'');
  const absoluteImage = `${baseUrl}/${imagePath}`;
  const canonical = `${baseUrl}/blogs.html#${encodeURIComponent(id)}`;
  const shareUrl = `${baseUrl}/share/${encodeURIComponent(id)}.html`;
  const readerUrl = `${baseUrl}/reader.html?id=${encodeURIComponent(id)}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle} — Virkat</title>
  <meta name="description" content="${safeDesc}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Virkat" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:url" content="${shareUrl}" />
  <meta property="og:image" content="${absoluteImage}" />
  <meta property="og:image:alt" content="${safeTitle}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${absoluteImage}" />
  <meta http-equiv="refresh" content="0; url=${readerUrl}" />
</head>
<body>
  <p>Redirecting to the article… <a href="${readerUrl}">Open blog</a>.</p>
  <script>window.location.replace('${readerUrl}');</script>
  <noscript><meta http-equiv="refresh" content="0; url=${readerUrl}" /></noscript>
</body>
</html>`;
}

function run(){
  const baseUrl = getBaseUrl();
  const blogs = readJSON(BLOGS_JSON);
  ensureDir(SHARE_DIR);
  let count = 0;
  for (const b of blogs){
    const id = b.id; if (!id) continue;
    const outPath = path.join(SHARE_DIR, `${id}.html`);
    // Respect manual lock: if file contains the marker, skip regeneration
    if (fs.existsSync(outPath)){
      const existing = readTextSafe(outPath);
      if (/<!--\s*SHARE_LOCK\s*-->/.test(existing)){
        console.log(`Skipping locked share page: ${id}.html`);
        continue;
      }
    }
    const html = generateShareHtml({ id, title: b.title, description: b.description, image: b.image, baseUrl });
    fs.writeFileSync(outPath, html, 'utf-8');
    count++;
  }
  console.log(`Generated ${count} share pages in ${SHARE_DIR}`);
}

if (require.main === module) run();
