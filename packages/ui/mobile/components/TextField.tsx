"use client";

import React, { useId, useRef } from "react";
import clsx from "clsx";
import Field from "./Field";

type UnitLayout = "none" | "one" | "two";

type TextFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode | string | boolean;
  unitText?: string;           // 우측 단위 텍스트
  unitLayout?: UnitLayout;     // .ipt-field.unit-one / unit-two
  clearable?: boolean;         // .btn-ipt-del 표시
  searchable?: boolean;        // .btn-ipt-search 표시
  wrapperClassName?: string;   // .ipt-group 추가 클래스
};

export default function TextField({
  id,
  label,
  hint,
  error,
  unitText,
  unitLayout = "none",
  clearable,
  searchable,
  className,
  wrapperClassName,
  onChange,
  ...inputProps
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);

  const onClear = () => {
    if (inputRef.current) {
      const el = inputRef.current;
      if (!el.disabled && !el.readOnly) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(el, "");
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.focus();
      }
    }
  };

  return (
    <Field id={inputId} label={label} hint={hint} error={error} className={wrapperClassName}>
      <div
        className={clsx(
          "ipt-field",
          unitLayout !== "none" && `unit-${unitLayout}`
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          className={clsx("ipt-text", className)}
          aria-invalid={Boolean(error) || undefined}
          {...inputProps}
        />

        {clearable && (
          <button
            type="button"
            className="btn-ipt-del"
            aria-label="입력 내용 삭제"
            onClick={onClear}
            tabIndex={-1}
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

        {unitText && <span className="unit" aria-hidden="true">{unitText}</span>}
      </div>
    </Field>
  );
}
