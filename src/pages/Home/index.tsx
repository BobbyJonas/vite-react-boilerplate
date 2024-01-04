import React, { FC, useEffect } from 'react';

const HomePage: FC = () => {
  useEffect(() => {
    console.log(1);
  }, []);
  return (
    <div>
      <h1>HomePage</h1>
    </div>
  );
};
export default HomePage;
