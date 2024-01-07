// 通用的 Helmet 组件 (ssr/nossr)
import React, { useEffect, type FC, type ReactNode } from 'react';
import { Helmet as ReactHelmet, type HelmetProps } from 'react-helmet';

type IHelmetProps = HelmetProps;

export const HelmetServerTagData = 'data-from-server';

export const Helmet: FC<Readonly<IHelmetProps>> = (props) => {
  useEffect(() => {
    if (!import.meta.env.SSR) {
      document.head.querySelectorAll(`[${HelmetServerTagData}]`)?.forEach((el) => el.remove());
    }
  }, []);

  return <ReactHelmet {...props}></ReactHelmet>;
};
