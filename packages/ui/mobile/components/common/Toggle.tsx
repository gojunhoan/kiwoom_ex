"use client";
import React, { useId } from 'react';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onText?: string;
  offText?: string;
  showStateText?: boolean;
}

export const Toggle = ({
  label,
  onText = 'ON',
  offText = 'OFF',
  showStateText = false,
  className = '',
  id,
  ...props
}: ToggleProps) => {
  const uniqueId = useId();
  const inputId = id || `toggle-${uniqueId}`;

  return (
    // [Global] ui-toggle-wrapper
    <div className={`ui-toggle-wrapper ${className}`}>
      <label htmlFor={inputId} className="ui-toggle-label">
        <input
          id={inputId}
          type="checkbox"
          role="switch"
          className="switch-input" // [Global]
          {...props}
        />
        
        <span className="switch-track" aria-hidden="true">
          {showStateText && (
            <>
              <span className="inner-text text-on">{onText}</span>
              <span className="inner-text text-off">{offText}</span>
            </>
          )}
        </span>

        {label && <span className="label-text">{label}</span>}
      </label>
    </div>
  );
};