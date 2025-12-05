"use client";

import React, { useId, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import Field from "./Field";

type UnitLayout = "none" | "one" | "two";

type QuickButton = {
  label: React.ReactNode;
  type: "add" | "set";
  value?: number;
};

type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode | string | boolean;
  unitText?: string;
  unitLayout?: UnitLayout;
  clearable?: boolean;
  searchable?: boolean;
  btnInner?: boolean;
  btnInnerText?: string;
  wrapperClassName?: string;
  quickButtons?: QuickButton[];
  quickButtonsAriaLabel?: string;
  minValue?: number;
  maxValue?: number;
  required?: boolean;
};

function parseNumber(value: string | undefined | null): number {
  if (!value) return 0;
  const onlyNumber = value.replace(/[^0-9]/g, "");
  if (!onlyNumber) return 0;
  return Number(onlyNumber);
}

function formatNumber(value: number): string {
  if (Number.isNaN(value)) return "";
  return value.toLocaleString("ko-KR");
}

export default function TextField({
  id,
  label,
  hint,
  error,
  unitText,
  unitLayout = "none",
  clearable,
  searchable,
  btnInner,
  btnInnerText = "검색",
  className,
  wrapperClassName,
  onChange,
  onBlur,
  onFocus,
  quickButtons,
  quickButtonsAriaLabel,
  minValue,
  maxValue,
  style: inputStyleProp,
  defaultValue,
  value,
  readOnly,
  required,
  ...inputProps
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const isError = !!error;
  
  const displayMessage = (isError && typeof error !== "boolean") ? error : hint;
  
  const messageId = displayMessage ? `${inputId}-hint` : undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  const innerBtnRef = useRef<HTMLButtonElement>(null);

  const [innerBtnWidth, setInnerBtnWidth] = useState(0);

  useEffect(() => {
    if (btnInner && innerBtnRef.current) {
      setInnerBtnWidth(innerBtnRef.current.offsetWidth);
    } else {
      setInnerBtnWidth(0);
    }
  }, [btnInner, btnInnerText]);

  const isControlled = value !== undefined;

  const initialHasValue = (() => {
    if (isControlled) {
      if (value == null) return false;
      return String(value).length > 0;
    }
    if (defaultValue == null) return false;
    return String(defaultValue).length > 0;
  })();

  const [hasValueState, setHasValueState] = useState<boolean>(initialHasValue);
  const [isGroupFocused, setIsGroupFocused] = useState(false);

  const hasValue = isControlled
    ? value != null && String(value).length > 0
    : hasValueState;

  const isClearEnabled = clearable !== false;

  const onClear = () => {
    const el = inputRef.current;
    if (!el || el.disabled || el.readOnly) return;

    if (isControlled) {
      if (onChange) {
        const event = {
          target: Object.assign(el, { value: "" }),
          currentTarget: Object.assign(el, { value: "" }),
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    } else {
      el.value = "";
      if (onChange) {
        const event = {
          target: el,
          currentTarget: el,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      setHasValueState(false);
    }

    el.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setHasValueState(e.target.value.length > 0);
    }
    onChange?.(e);
  };

  const handleGroupFocus = () => {
    setIsGroupFocused(true);
  };

  const handleGroupBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsGroupFocused(false);
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    onFocus?.(e);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
  };

  const handleQuickButtonClick = (btn: QuickButton) => {
    const el = inputRef.current;
    if (!el || el.disabled || el.readOnly) return;

    const currentNumber = parseNumber(el.value);
    let next = currentNumber;

    if (btn.type === "add" && typeof btn.value === "number") {
      next = currentNumber + btn.value;
    } else if (btn.type === "set" && typeof btn.value === "number") {
      next = btn.value;
    }

    if (typeof minValue === "number") next = Math.max(minValue, next);
    if (typeof maxValue === "number") next = Math.min(maxValue, next);

    const nextStr = formatNumber(next);

    el.value = nextStr;

    if (onChange) {
      const event = {
        target: Object.assign(el, { value: nextStr }),
        currentTarget: Object.assign(el, { value: nextStr }),
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }

    el.focus();

    if (!isControlled) {
      setHasValueState(nextStr.length > 0);
    }
  };

  const groupAriaLabel =
    quickButtonsAriaLabel ||
    (typeof label === "string" ? `${label} 빠른 입력` : "빠른 입력 버튼 그룹");

  let paddingRight: string | undefined;
  let clearRight: string | undefined;

  if (isClearEnabled && hasValue && isGroupFocused && !readOnly) {
    if (btnInner && innerBtnWidth > 0) {
      const rightPos = innerBtnWidth + 16;
      clearRight = `${rightPos}px`;
      paddingRight = `${rightPos - 24}px`;
    } else if (searchable) {
      paddingRight = "6.2rem";
      clearRight = "4.8rem";
    } else if (unitLayout === "one") {
      paddingRight = "4.8rem";
      clearRight = "2.6rem";
    } else if (unitLayout === "two") {
      paddingRight = "6.4rem";
      clearRight = "3.6rem";
    } else {
      paddingRight = "4rem";
      clearRight = "1.6rem";
    }
  } else if (btnInner && innerBtnWidth > 0) {
    paddingRight = `${innerBtnWidth + 16}px`;
  }

  const inputStyle: React.CSSProperties = {
    ...(inputStyleProp || {}),
    ...(paddingRight ? { paddingRight } : null),
  };

  const labelNode = label ? (
    <>
      {label}
      {required && <span className="required" title="필수 입력">*</span>}
    </>
  ) : null;

  return (
    <Field
      id={inputId}
      label={labelNode}
      hint={undefined}
      error={isError}
      className={wrapperClassName}
    >
      <div
        className={clsx(
          "ipt-field",
          unitLayout !== "none" && `unit-${unitLayout}`
        )}
        onFocus={handleGroupFocus}
        onBlur={handleGroupBlur}
      >
        <input
          ref={inputRef}
          id={inputId}
          className={clsx("ipt-text", className)}
          aria-invalid={isError || undefined}
          aria-describedby={messageId}
          required={required}
          onChange={handleChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          style={inputStyle}
          defaultValue={defaultValue}
          value={value}
          readOnly={readOnly}
          {...inputProps}
        />

        {isClearEnabled && hasValue && isGroupFocused && !readOnly && (
          <button
            type="button"
            className="btn-ipt-del"
            aria-label="입력 내용 삭제"
            onMouseDown={(e) => {
              e.preventDefault(); 
            }}
            onClick={onClear}
            style={clearRight ? { right: clearRight } : undefined}
          >
            <span />
          </button>
        )}

        {searchable && (
          <button
            type="button"
            className="btn-ipt-search"
            aria-label="검색"
            tabIndex={-1}
          />
        )}

        {btnInner && (
          <button
            ref={innerBtnRef}
            type="button"
            className="btn md btn-outline gray"
            aria-label={btnInnerText}
            tabIndex={-1}
          >
            {btnInnerText}
          </button>
        )}

        {unitText && (
          <span className="unit" aria-hidden="true">
            {unitText}
          </span>
        )}
      </div>

      {displayMessage && (
        <small id={messageId} className="hint">
          {displayMessage}
        </small>
      )}

      {quickButtons && quickButtons.length > 0 && (
        <div
          className="btn-group quick-input-group"
          role="group"
          aria-label={groupAriaLabel}
        >
          {quickButtons.map((btn, index) => (
            <button
              key={index}
              type="button"
              className="btn sm btn-outline"
              onClick={() => handleQuickButtonClick(btn)}
              disabled={readOnly}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </Field>
  );
}