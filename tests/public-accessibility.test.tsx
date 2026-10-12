import { readFile } from 'node:fs/promises';
import { expect, it } from 'vitest';
import axe from 'axe-core';

for (const path of ['/', '/about/', '/leadership-registrar/', '/chapters/', '/partnerships/', '/get-involved/']) {
  it(`has accessible public markup at ${path}`, async () => {
    const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}index.html`, 'utf8');
    const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)![1];
    document.body.innerHTML = body;
    document.title = html.match(/<title>(.*?)<\/title>/)![1];
    document.documentElement.lang = 'en';
    const result = await axe.run(document, { rules: { 'color-contrast': { enabled: false } } });
    expect(result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
    document.body.innerHTML = '';
  });
}
