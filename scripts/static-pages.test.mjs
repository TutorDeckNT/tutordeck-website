import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const origin = 'https://www.tutordeck.org';
const pages = [
  ['/', 'Your Academic', 'Official Transcripts.'],
  ['/about/', 'About TutorDeck', 'Our Core Values'],
  ['/leadership-registrar/', 'Leadership Registrar', 'Meet the leaders'],
  ['/chapters/', 'Our Chapters', 'Bridgeland High School'],
  ['/partnerships/', 'Nonprofit Partnerships', 'Diksuchi Foundation'],
  ['/get-involved/', 'Join the Movement', 'Open Interest Form'],
];

test('every sitemap entry has full public HTML and matching metadata', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls, pages.map(([path]) => origin + path));
  const titles = new Set();
  for (const [path, heading, content] of pages) {
    const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}index.html`, 'utf8');
    assert.ok(html.includes(heading), path);
    assert.ok(html.includes(content), path);
    assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), path);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    titles.add(html.match(/<title>([^<]+)<\/title>/)[1]);
    assert.ok(html.includes('Open interactive version'));
    assert.ok(html.includes('mailto:join@tutordeck.org'));
    for (const [target] of pages) assert.ok(html.includes(`href="${target}"`), `${path} links to ${target}`);
    if (path !== '/') {
      if (path === '/leadership-registrar/') {
        assert.deepEqual([...html.matchAll(/<script\b[^>]*>/g)].map(match => match[0]), ['<script src="/public-directory.js" defer>']);
      } else assert.doesNotMatch(html, /<script\b/);
      assert.doesNotMatch(html, /href="#\//);
      if (path !== '/leadership-registrar/') assert.doesNotMatch(html, /<input\b/);
      assert.ok(html.includes(`href="/#${path.slice(0, -1)}"`));
    }
  }
  assert.equal(titles.size, pages.length);
});

test('homepage keeps app entry, with separate fallback and safe fragment guard', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  assert.match(html, /id="public-fallback"/);
  assert.match(html, /id="root"/);
  assert.match(html, /<script type="module"[^>]+src="\/assets\//);
  assert.match(html, /location.hash.startsWith\('#\/'\)/);
  assert.match(html, /access_token=/);
  assert.match(html, /id="modal-portal"/);
  assert.match(html, /href="\/#\/dashboard"/);
  assert.match(html, /Grow the movement. Multiply your impact./);
});

test('robots advertises the deployed sitemap', async () => {
  assert.match(await readFile('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/www\.tutordeck\.org\/sitemap\.xml/);
});

test('fallback fragment guard hides app routes and OAuth, but keeps ordinary anchors', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const guard = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].find(match => match[1].includes('app-deep-link'))[1];
  for (const [hash, expected] of [['', false], ['#/', false], ['#mission', false], ['#/about', true], ['#/dashboard', true], ['#/login', true], ['#/verify/example', true], ['#access_token=test&token_type=bearer', true]]) {
    let hidden = false;
    runInNewContext(guard, { location: { hash }, document: { documentElement: { classList: { add: () => { hidden = true; } } } } });
    assert.equal(hidden, expected, hash);
  }
});


test('public pages avoid CDN assets and include a local preloaded font', async () => {
  for (const [path] of pages) {
    const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}index.html`, 'utf8');
    assert.doesNotMatch(html, /cdnjs.cloudflare.com|cdn.jsdelivr.net|fonts.googleapis.com|fonts.gstatic|dropins.js|grainy-gradients|assets.mixkit|<video\b|<i\b/);
    assert.match(html, /rel="preload" href="\/fonts\/inter-latin.woff2" as="font"/);
    if (path !== '/') assert.doesNotMatch(html, /datePicker[^" ]*\.css/);
  }
});

test('the initial module does not eagerly preload private tools and source maps omit source content', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  assert.doesNotMatch(html, /rel="modulepreload"[^>]*(DashboardPage|ActivityChart|LoginPage|VerificationPage|LogActivityModal|DirectUploader|TutorDeckStudioModal|auth-)/);
  const assets = await readdir('dist/assets');
  for (const file of assets.filter(file => file.endsWith('.js'))) {
    const code = await readFile(`dist/assets/${file}`, 'utf8');
    assert.match(code, /sourceMappingURL=/, file);
    const map = JSON.parse(await readFile(`dist/assets/${file}.map`, 'utf8'));
    assert.ok(!map.sourcesContent || map.sourcesContent.every(source => source === null), file);
  }
});


test('non-hash registrar filters leaders and clears an empty search', async () => {
  const html = await readFile('dist/leadership-registrar/index.html', 'utf8');
  const script = await readFile('dist/public-directory.js', 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  try {
    dom.window.eval(script);
    const document = dom.window.document;
    const search = document.querySelector('#leader-search');
    const visible = () => [...document.querySelectorAll('[data-leader-entry]')].filter(entry => !entry.hidden);
    for (const query of ['Yohaan', 'analytics', 'Bridgeland']) {
      search.value = query;
      search.dispatchEvent(new dom.window.Event('input'));
      assert.ok(visible().length > 0);
      assert.ok(visible().every(entry => entry.dataset.search.toLowerCase().includes(query.toLowerCase())));
    }
    search.value = 'no matching leader';
    search.dispatchEvent(new dom.window.Event('input'));
    assert.equal(visible().length, 0);
    assert.equal(document.querySelector('[data-leader-empty]').hidden, false);
    document.querySelector('[data-leader-clear]').click();
    assert.equal(visible().length, 8);
    assert.equal(document.querySelector('[data-leader-empty]').hidden, true);
    assert.equal(document.activeElement, search);
  } finally { dom.window.close(); }
});

test('non-hash homepage carousel controls scroll in both directions', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const script = await readFile('dist/public-directory.js', 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only' });
  try {
    dom.window.matchMedia = () => ({ matches: true });
    const carousel = dom.window.document.querySelector('#leader-carousel');
    Object.defineProperty(carousel, 'clientWidth', { value: 800 });
    const calls = [];
    carousel.scrollBy = options => calls.push(options);
    dom.window.eval(script);
    dom.window.document.querySelector('[data-leader-direction="1"]').click();
    dom.window.document.querySelector('[data-leader-direction="-1"]').click();
    assert.deepEqual(calls.map(call => call.left), [640, -640]);
    assert.ok(calls.every(call => call.behavior === 'auto'));
    assert.equal(carousel.tabIndex, 0);
  } finally { dom.window.close(); }
});
