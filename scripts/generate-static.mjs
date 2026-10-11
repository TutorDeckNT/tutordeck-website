import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { publicPages, renderPage } from '../.static-render/render.js';

const origin = 'https://www.tutordeck.org';
const template = await readFile('dist/index.html', 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const paths = new Map(publicPages.map(page => [page.path.replace(/\/$/, '') || '/', page.path]));

function rewriteLinks(html) {
  return html.replace(/href="([^" ]*)"/g, (match, href) => {
    const route = href.startsWith('#/') ? href.slice(1) : href;
    if (!route.startsWith('/') || route.startsWith('/#') || route.startsWith('//')) return match;
    const clean = paths.get(route.replace(/\/$/, '') || '/');
    // Known public routes are static; app-only routes stay in the root hash app.
    if (clean) return `href="${clean}"`;
    if (/^\/(login|dashboard|verify)(\/|$)/.test(route)) return `href="/#${route}"`;
    return match;
  });
}

for (const page of publicPages) {
  const content = rewriteLinks(renderPage(page.path));
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`);
  html = html.replace('</head>', `<meta name="description" content="${escape(page.description)}" />\n<link rel="canonical" href="${origin}${page.path}" />\n</head>`);
  if (page.path === '/') {
    html = html.replace('<div id="root"></div>', `<div id="public-fallback">${content}</div><div id="root"></div>`);
    // Runs in the head before content paints; OAuth fragments also suppress the fallback.
    html = html.replace('</head>', `<script>if ((location.hash.startsWith('#/') && location.hash !== '#/') || location.hash.includes('access_token=')) document.documentElement.classList.add('app-deep-link');</script>\n</head>`);
  } else {
    // Static pages never initialize the app, authentication, or third-party scripts.
    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, '');
    html = html.replace('<div id="root"></div>', content);
    await mkdir(`dist${page.path}`, { recursive: true });
  }
  await writeFile(page.path === '/' ? 'dist/index.html' : `dist${page.path}index.html`, html);
}

await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPages.map(page => `  <url><loc>${origin}${page.path}</loc></url>`).join('\n')}\n</urlset>\n`);
await rm('.static-render', { recursive: true, force: true });
console.log(`Generated ${publicPages.length} public pages and sitemap.`);
