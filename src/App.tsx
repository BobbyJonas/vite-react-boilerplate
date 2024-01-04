import React, { FC, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { Spin } from 'antd';

import routes from './routes';

import './styles/global.less';
import './styles/normalize.css';

const App: FC<{}> = () => {
  const elements = useRoutes(routes);

  return elements;
};

export default App;
