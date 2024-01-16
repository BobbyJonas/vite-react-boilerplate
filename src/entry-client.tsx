import React, { StrictMode, Suspense } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import RecoilNexus from 'recoil-nexus';
import { RecoilRoot } from 'recoil';

import App from './App';

import 'antd/dist/antd.less';

const EntryClient = (
  <StrictMode>
    <RecoilRoot>
      <RecoilNexus />
      <Suspense>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Suspense>
    </RecoilRoot>
  </StrictMode>
);

if (process.env.SSR === 'true') {
  hydrateRoot(document.getElementById('root') as Element, EntryClient);
} else {
  const root = createRoot(document.getElementById('root') as Element);
  root.render(EntryClient);
}
