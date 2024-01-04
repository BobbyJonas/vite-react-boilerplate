import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'antd';

import KSWatermark from '@ks/ks-watermark';

export const KSWatermarkKey = Symbol.for('KSWatermark');

export const WatermarkTestPage = () => {
  const [content, setContent] = useState([`快手内部资源, 请勿外传`]);
  const updateWatermark = useCallback(() => {
    (window as any)[KSWatermarkKey]?.resetWatermark();
    try {
      (window as any)[KSWatermarkKey] = new KSWatermark({
        content,
        fillStyle: 'rgba(184, 184, 184, 0.25)',
        refreshTime: 1000,
        position: 'fixed',
      });
    } catch (e) {
      console.error(e);
    }
    setContent([...content, `${Date.now()}`]);
    console.log((window as any)[KSWatermarkKey]);
  }, [content]);

  return (
    <div className="watermark-test">
      <Button onClick={updateWatermark}>更新水印</Button>
    </div>
  );
};

export default WatermarkTestPage;
