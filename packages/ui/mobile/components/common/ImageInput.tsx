'use client';

import React, { forwardRef, useId, ChangeEvent, InputHTMLAttributes } from 'react';

interface MobileImageInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'id'> {
  id?: string;
  label?: string;
  onFileSelect?: (file: File) => void;
}

const MobileImageInput = forwardRef<HTMLInputElement, MobileImageInputProps>(({ 
  id, 
  label = '사진 업로드', 
  onFileSelect, 
  className = '',
  ...props 
}, ref) => {
  const uniqueId = useId();
  const inputId = id || `mobile-upload-${uniqueId}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className={`mobile-input ${className}`}>
      <input
        type="file"
        id={inputId}
        accept="image/*"
        className="mobile-input__file"
        onChange={handleChange}
        ref={ref}
        {...props}
      />
      
      <label htmlFor={inputId} className="mobile-input__label">
        <span className="icon">📷</span>
        <span>{label}</span>
      </label>
    </div>
  );
});

MobileImageInput.displayName = 'MobileImageInput';

export default MobileImageInput;