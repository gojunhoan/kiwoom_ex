"use client";
import React, { useState, useRef, useEffect, useLayoutEffect, useId } from 'react';

type Direction = 'top' | 'bottom' | 'left' | 'right';
interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  triggerType?: 'click' | 'hover';
  defaultDirection?: Direction;
  hasCloseBtn?: boolean;
}

export const Tooltip = ({
  children,
  content,
  triggerType = 'click',
  defaultDirection = 'top',
  hasCloseBtn = true,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState<Direction>(defaultDirection);
  const [offsetStyle, setOffsetStyle] = useState<React.CSSProperties>({});
  
  const uniqueId = useId();
  const tooltipId = `tooltip-${uniqueId}`;
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const adjustPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;
    
    // ... (위치 계산 로직은 동일하므로 생략, CSS 변수 사용) ...
    // 로직은 이전 답변과 100% 동일합니다.
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newDirection = defaultDirection;
    if (defaultDirection === 'top' && triggerRect.top - tooltipRect.height < 0) newDirection = 'bottom';
    else if (defaultDirection === 'bottom' && triggerRect.bottom + tooltipRect.height > viewportHeight) newDirection = 'top';
    else if (defaultDirection === 'left' && triggerRect.left - tooltipRect.width < 0) newDirection = 'right';
    else if (defaultDirection === 'right' && triggerRect.right + tooltipRect.width > viewportWidth) newDirection = 'left';
    setDirection(newDirection);

    let xOffset = 0;
    const currentLeft = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
    const currentRight = currentLeft + tooltipRect.width;
    const padding = 16;

    if (currentLeft < padding) xOffset = padding - currentLeft;
    else if (currentRight > viewportWidth - padding) xOffset = (viewportWidth - padding) - currentRight;

    setOffsetStyle({ '--tooltip-offset': `${xOffset}px` } as React.CSSProperties);
  };

  useLayoutEffect(() => { if (isVisible) adjustPosition(); }, [isVisible, defaultDirection]);

  // Event handlers... (동일)
  const toggleTooltip = () => setIsVisible(!isVisible);
  const openTooltip = () => setIsVisible(true);
  const closeTooltip = () => setIsVisible(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeTooltip(); };
    if (isVisible) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isVisible]);

  const triggerProps: any = {
    ref: triggerRef,
    'aria-describedby': isVisible ? tooltipId : undefined,
    'aria-expanded': isVisible,
  };

  if (triggerType === 'click') triggerProps.onClick = toggleTooltip;
  else {
    triggerProps.onMouseEnter = openTooltip; triggerProps.onMouseLeave = closeTooltip;
    triggerProps.onFocus = openTooltip; triggerProps.onBlur = closeTooltip;
  }

  return (
    // [Global] ui-tooltip-wrapper
    <div className="ui-tooltip-wrapper">
      <div {...triggerProps} className="inline-block cursor-pointer">
        {children}
      </div>

      <div
        id={tooltipId}
        ref={tooltipRef}
        role="tooltip"
        // [Global] ui-tooltip-body, visible 등 클래스 조합
        className={`ui-tooltip-body ${direction} ${isVisible ? 'visible' : ''}`}
        style={offsetStyle}
        onMouseEnter={triggerType === 'hover' ? openTooltip : undefined}
        onMouseLeave={triggerType === 'hover' ? closeTooltip : undefined}
      >
        <div className="tooltip-content">{content}</div>
        {hasCloseBtn && (
          <button type="button" className="close-btn" onClick={(e) => { e.stopPropagation(); closeTooltip(); }}>✕</button>
        )}
      </div>
    </div>
  );
};