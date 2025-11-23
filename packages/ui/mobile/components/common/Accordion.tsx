"use client";
import React, { useState, useId } from 'react';

interface AccordionItem {
  label: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIndex?: number[];
}

export const Accordion = ({ 
  items, 
  allowMultiple = false, 
  defaultOpenIndex = [] 
}: AccordionProps) => {
  const [openIndices, setOpenIndices] = useState<number[]>(defaultOpenIndex);
  const baseId = useId();

  const toggleItem = (index: number) => {
    setOpenIndices((prev) => {
      const isOpen = prev.includes(index);
      if (isOpen) return prev.filter((i) => i !== index);
      return allowMultiple ? [...prev, index] : [index];
    });
  };

  return (
    <div className="ui-accordion">
      {items.map((item, i) => {
        const isOpen = openIndices.includes(i);
        const headerId = `${baseId}-header-${i}`;
        const panelId = `${baseId}-panel-${i}`;

        return (
          // [Global] acc-item, is-open
          <div key={i} className={`acc-item ${isOpen ? 'is-open' : ''}`}>
            <h3>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                // [Global] acc-trigger
                className="acc-trigger"
                onClick={() => toggleItem(i)}
              >
                <span>{item.label}</span>
                <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </h3>

            <div 
              className={`acc-content-wrapper ${isOpen ? 'open' : ''}`}
              role="region" 
              aria-labelledby={headerId}
              id={panelId}
            >
              <div className="acc-body">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};