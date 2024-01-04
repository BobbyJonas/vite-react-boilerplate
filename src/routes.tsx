import React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import BasicLayout from '@/layouts/BasicLayout';
import HomePage from './pages/Home';
import NotFoundPage from '@/pages/NotFound';
import DndTestPage from './pages/DndTest';
import ScrollTestPage from './pages/ScrollTest';
import WatermarkTestPage from './pages/WatermarkTest';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        path: '/index',
        element: <HomePage />,
      },
      { path: '/dnd-test', element: <DndTestPage /> },
      { path: '/scroll-test', element: <ScrollTestPage /> },
      { path: '/watermark-test', element: <WatermarkTestPage /> },
      {
        path: '',
        element: <Navigate to="/index" replace />,
      },
    ],
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '/*',
    element: <Navigate to="/404" replace />,
  },
];

export default routes;
