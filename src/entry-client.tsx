import React, { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import 'antd/dist/antd.less';

const EntryClient = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (process.env.SSR === 'true') {
  hydrateRoot(document.getElementById('root') as Element, EntryClient);
} else {
  const root = createRoot(document.getElementById('root') as Element);
  root.render(EntryClient);
}
