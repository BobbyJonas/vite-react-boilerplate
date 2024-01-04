// 前端 SSR 服务
import fs from 'node:fs/promises';
import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import sirv from 'sirv';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 4173;
const base = process.env.BASE || '/';

// Create http server
const app = express();

const startServer = async () => {
  // Cached production assets
  const templateHtml = isProduction
    ? await fs.readFile(path.join(__dirname, '../../dist/client/index.html'), 'utf-8')
    : '';
  const ssrManifest = isProduction
    ? await fs.readFile(path.join(__dirname, '../../dist/client/ssr-manifest.json'), 'utf-8')
    : undefined;

  // Add Vite or respective production middlewares
  let vite: any;
  if (!isProduction) {
    const { createServer } = await import('vite');
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    });
    app.use(vite.middlewares);
  } else {
    app.use(compression());
    app.use(cors());
    app.use(base, sirv(path.join(__dirname, '../../dist/client'), { extensions: [] }));
  }

  // Serve HTML
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '');

      let template;
      let render;
      if (!isProduction) {
        // Always read fresh template in development
        template = await fs.readFile(path.join(__dirname, '../../index.html'), 'utf-8');
        template = await vite?.transformIndexHtml(url, template);
        render = (await vite?.ssrLoadModule(path.join(__dirname, '../../src/entry-server.tsx')))
          ?.render;
      } else {
        template = templateHtml;
        render = (await import(path.join(__dirname, '../../dist/server/entry-server.mjs'))).render;
      }

      const rendered = await render(req, res, ssrManifest);

      const html = template
        ?.replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-html-->`, rendered.html ?? '');

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  // Start standalone server if directly running
  if (require.main === module) {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`API server listening on port ${port}`);
    });
  }

  return app;
};

export default startServer();
