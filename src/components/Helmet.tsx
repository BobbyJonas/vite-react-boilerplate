// 通用的 Helmet 组件 (ssr/nossr)
import React, { useEffect, type FC, type ReactNode } from 'react';
import { Helmet as ReactHelmet, type HelmetProps } from 'react-helmet';

type IHelmetProps = HelmetProps;

export const Helmet: FC<Readonly<IHelmetProps>> = (props): ReactNode => {
  useEffect(() => {
    if (!import.meta.env.SSR) {
      document.head.querySelectorAll('[data-react-helmet="true"]')?.forEach((el) => el.remove());
    }
  }, []);

  return <ReactHelmet {...props}></ReactHelmet>;
};
