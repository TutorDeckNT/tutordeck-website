import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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
      assert.doesNotMatch(html, /<script\b/);
      assert.doesNotMatch(html, /href="#\//);
      assert.doesNotMatch(html, /<input\b/);
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
