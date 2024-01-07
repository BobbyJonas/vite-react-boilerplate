import React from 'react';
import type { Request } from 'express';
import { Helmet } from 'react-helmet';
import ReactDOMServer from 'react-dom/server';
import {
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from 'react-router-dom/server';

import { HelmetServerTagData } from './components/Helmet';
import routes from './routes';

function createFetchRequest(req: Request) {
  let origin = `${req.protocol}://${req?.get('host')}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  let url = new URL(req.originalUrl || req.url, origin);

  let controller = new AbortController();
  req.on('close', () => controller.abort());

  let headers = new Headers();

  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values as string);
      }
    }
  }

  let init = {
    method: req.method,
    headers,
    signal: controller.signal,
    body: undefined,
  } satisfies import('undici-types').RequestInit;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body;
  }

  return new Request(url.href, init);
}

/**
 * This code is rendering the root component of the React application.
 * Rendering to string due to this render function being used for server-side rendering.
 */
export const render = async (req: Request) => {
  let { query, dataRoutes } = createStaticHandler(routes);
  let fetchRequest = createFetchRequest(req);
  let context = await query(fetchRequest);
  if (context instanceof Response) {
    throw context;
  }
  let router = createStaticRouter(dataRoutes, context);
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouterProvider router={router} context={context}></StaticRouterProvider>
    </React.StrictMode>
  );
  const helmet = Helmet.renderStatic();

  const replaceReactHelmetData = (str: string) =>
    str.replaceAll(/ data-react-helmet="true"/g, ` ${HelmetServerTagData}`);
  const head = replaceReactHelmetData(
    helmet.link.toString() + helmet.title.toString() + helmet.meta.toString() || ''
  );
  return { html, head };
};
