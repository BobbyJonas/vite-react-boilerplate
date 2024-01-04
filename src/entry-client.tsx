import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import 'antd/dist/antd.less';

const root = createRoot(document.getElementById('root') as Element);

/**
 * Using createRoot instead of hydrateRoot to prevent hydration mismatches.
 */
root.render(
  <StrictMode>
    <BrowserRouter basename="">
      <App />
    </BrowserRouter>
  </StrictMode>
);