import React from "react";
import clsx from "clsx";

type FieldProps = {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode | string | boolean;
  className?: string;
  children: React.ReactNode;
  /** address, error 등 .ipt-group에 붙일 보조 클래스 */
  variantClassName?: string;
};

export default function Field({
  id,
  label,
  hint,
  error,
  className,
  children,
  variantClassName,
}: FieldProps) {
  const hasError = Boolean(error);
  return (
    <div
      className={clsx(
        "ipt-group",
        variantClassName,
        hasError && "error",
        className
      )}
    >
      {label && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {(hint || hasError) && (
        <small className="hint" aria-live="polite">
          {hasError ? error : hint}
        </small>
      )}
    </div>
  );
}
