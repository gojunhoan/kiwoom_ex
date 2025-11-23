"use client";
import React, { useState, useId } from 'react';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

export const Tabs = ({ type = 'line', items }: { type?: 'line'|'rect'|'round', items: TabItem[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();

  return (
    <div>
      {/* [Global] ui-tabs 클래스 */}
      <div className={`ui-tabs ${type}`} role="tablist">
        {items.map((item, i) => {
          const isActive = activeIndex === i;
          return (
            <button
              key={i}
              id={`${baseId}-tab-${i}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={isActive ? 0 : -1}
              // [Global] tab-item 및 active 클래스
              className={`tab-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        tabIndex={0}
        // [Global] ui-tab-panel 클래스
        className="ui-tab-panel"
      >
        {items[activeIndex].content}
      </div>
    </div>
  );
};