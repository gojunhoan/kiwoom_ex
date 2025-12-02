"use client";
import React, { useState, useRef } from "react";
import { RadioButtonGroup } from "./RadioButton";
import Button from "./Button";
import BottomSheet from "../popup/BottomSheet";

export interface OptionType {
  value: string;
  label: string;
}

interface BottomSheetSelectProps {
  title: string;          
  options: OptionType[];  
  placeholder?: string;    
  defaultValue?: string;   
  onSelect?: (value: string) => void; 
}

export default function BottomSheetSelect({
  title,
  options,
  placeholder = "선택",
  defaultValue,
  onSelect,
}: BottomSheetSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(defaultValue);
  const triggerWrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);

    if (onSelect) {
      onSelect(value);
    }
    
    setTimeout(() => {
      triggerWrapperRef.current?.focus();
    }, 100);
  };
  
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <>
      <div 
        ref={triggerWrapperRef} 
        tabIndex={-1} 
        className="inline-block outline-none"
      >
        <Button
          variant="select"
          onClick={() => setIsOpen(true)}
        >          
          {displayLabel}
        </Button>
      </div>
      
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
      >
        <RadioButtonGroup
          options={options}
          layoutClassName="split-1"
          roleGroupLabel={`${title} 선택`}
          onChange={handleSelect}
          value={selectedValue}   
        />
      </BottomSheet>
    </>
  );
}