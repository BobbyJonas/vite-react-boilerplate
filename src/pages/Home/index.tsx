import React, { FC, useEffect } from 'react';
import { Helmet } from '@/components/Helmet';

const HomePage: FC = () => {
  useEffect(() => {
    console.log(1);
  }, []);

  return (
    <div>
      <Helmet>
        <title>首页哈哈</title>
      </Helmet>
      <h1>HomePage</h1>
    </div>
  );
};
export default HomePage;
