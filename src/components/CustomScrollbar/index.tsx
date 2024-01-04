import React, { useRef, useEffect, ReactNode, FC } from 'react';
import './index.less';

export interface ITabPanelScrollBarProps {
  children?: ReactNode;
}

const TabPanelScrollBar: FC<Readonly<ITabPanelScrollBarProps>> = ({ children }) => {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const barRefX = useRef<HTMLDivElement>(null);
  const trackRefX = useRef<HTMLDivElement>(null);

  let pendingFrame: number | null = null;

  function handleResize(e: any) {
    console.log(`🚀 ~ file: index.tsx:16 ~ handleResize ~ e:`, e);
    pendingFrame && cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      const contentHeight = scrollWrapperRef.current?.scrollHeight || 0;
      const containerHeight = scrollWrapperRef.current?.offsetHeight || 0;
      const contentWidth = scrollWrapperRef.current?.scrollWidth || 0;
      const containerWidth = scrollWrapperRef.current?.offsetWidth || 0;
      const percentageVisibleY = containerHeight / contentHeight;
      const percentageVisibleX = containerWidth / contentWidth;
      const sliderHeight = percentageVisibleY * containerHeight;
      const sliderWidth = percentageVisibleX * containerWidth;

      const percentageOffsetY =
        (scrollWrapperRef.current?.scrollTop || 0) / (contentHeight - containerHeight);
      console.log(
        `🚀 ~ file: index.tsx:30 ~ pendingFrame=requestAnimationFrame ~ percentageOffsetY:`,
        percentageOffsetY
      );
      const percentageOffsetX =
        (scrollWrapperRef.current?.scrollLeft || 0) / (contentWidth - containerWidth);

      const sliderOffsetY = percentageOffsetY * (containerHeight - sliderHeight);
      const sliderOffsetX = percentageOffsetX * (containerWidth - sliderWidth);

      const hideX = Math.round(percentageVisibleX);
      console.log(`🚀 ~ file: index.tsx:46 ~ pendingFrame=requestAnimationFrame ~ hideX:`, hideX);

      const barXStyle = barRefX.current?.style || ({} as CSSStyleDeclaration);

      barXStyle.opacity = hideX === 1 ? '0' : '1';

      const trackXStyle = trackRefX.current?.style || ({} as CSSStyleDeclaration);

      trackXStyle.cssText = `
        width: ${sliderWidth}px;
        transform: translateX(${sliderOffsetX}px);
      `;
    });
  }

  function setPosition(e: any) {
    console.log(`🚀 ~ file: index.tsx:56 ~ setPosition ~ e:`, e);
    requestAnimationFrame(() => {
      const scroll = scrollWrapperRef.current || ({} as HTMLDivElement);
      const offset = scroll?.scrollTop || 0;
      scroll.scrollTop = offset + 1;
      scroll.scrollTop = offset;
    });
  }

  useEffect(() => {
    setTimeout(() => {
      scrollWrapperRef.current?.addEventListener('scroll', handleResize);
      scrollWrapperRef.current?.addEventListener('mouseenter', setPosition);
      window.addEventListener('resize', handleResize);
    }, 0);
  });

  return (
    <div className="draggable-tab-panel__scroll-bar-viewport">
      <div className={'scroll-bar-wrapper'} ref={scrollWrapperRef}>
        {children}
      </div>
      <div className={'bar-container-x'} ref={barRefX}>
        <div className={'bar'} ref={trackRefX} />
      </div>
    </div>
  );
};

export default TabPanelScrollBar;
