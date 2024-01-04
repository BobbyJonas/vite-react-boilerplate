import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import App from './App';

interface IServerSideRenderProps {
  path: string;
}

/**
 * This code is rendering the root component of the React application.
 * Rendering to string due to this render function being used for server-side rendering.
 */
export const render = ({ path }: IServerSideRenderProps) => {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
  return { html };
};
