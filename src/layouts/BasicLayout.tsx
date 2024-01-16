import React, { type FC } from 'react';
import { Layout } from 'antd';

import { Outlet, RouteObject, useNavigate } from 'react-router-dom';

const BasicLayout: FC<{}> = () => {
  const navigate = useNavigate();

  return (
    // <Layout>
    <Outlet />
    // </Layout>
  );
};

export default BasicLayout;
