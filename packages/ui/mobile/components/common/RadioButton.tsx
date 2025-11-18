"use client";

import React, { useState, useId, KeyboardEvent } from "react";
import clsx from "clsx";

export type RadioButtonOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type RadioButtonGroupProps = {
  name?: string;
  options: RadioButtonOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  layoutClassName?: string;
  roleGroupLabel?: string;
};

export function RadioButtonGroup({
  name,
  options,
  value,
  defaultValue,
  onChange,
  className,
  layoutClassName,
  roleGroupLabel,
}: RadioButtonGroupProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : internalValue;

  const groupId = useId();

  const handleSelect = (val: string, disabled?: boolean) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = options.findIndex((opt) => opt.value === selectedValue);
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else {
      return;
    }

    const next = options[nextIndex];
    if (!next.disabled) {
      handleSelect(next.value, next.disabled);
    }
  };

  return (
    <div
      className={clsx(
        "check-group",
        "check-type--box",
        layoutClassName,
        className
      )}
      role="radiogroup"
      aria-label={roleGroupLabel}
      aria-labelledby={roleGroupLabel ? undefined : groupId}
      onKeyDown={handleKeyDown}
    >
      {options.map((opt, index) => {
        const checked = opt.value === selectedValue;

        return (
          <div className="check-item" key={opt.value}>
            <button
              type="button"
              role="radio"
              aria-checked={checked}
              aria-disabled={opt.disabled || undefined}
              className={clsx("radio-btn", checked && "checked")}
              onClick={() => handleSelect(opt.value, opt.disabled)}
              disabled={opt.disabled}
            >
              <span>{opt.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
