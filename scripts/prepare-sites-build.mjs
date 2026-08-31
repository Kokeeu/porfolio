import { mkdir, writeFile } from 'node:fs/promises';

const worker = `
const withPath = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
};

export default {
  async fetch(request, env) {
    if (!env?.ASSETS) {
      return new Response('Static asset binding unavailable', { status: 503 });
    }

    const direct = await env.ASSETS.fetch(request);
    if (direct.status !== 404 || request.method !== 'GET') return direct;

    const url = new URL(request.url);
    const hasExtension = /\\.[a-z0-9]+$/i.test(url.pathname);
    if (hasExtension) return direct;

    const cleanPath = url.pathname.replace(/\\/$/, '');
    const candidates = [cleanPath + '.html', cleanPath + '/index.html'];

    for (const pathname of candidates) {
      const response = await env.ASSETS.fetch(withPath(request, pathname));
      if (response.status !== 404) return response;
    }

    return direct;
  },
};
`;

await mkdir(new URL('../dist/server/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/server/index.js', import.meta.url), worker.trimStart());
