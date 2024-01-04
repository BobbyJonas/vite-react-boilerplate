import React from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import BasicLayout from '@/layouts/BasicLayout';
import HomePage from './pages/Home';
import NotFoundPage from '@/pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        path: '/index',
        element: <HomePage />,
      },
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
