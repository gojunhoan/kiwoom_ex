import React, { useId } from "react";
import clsx from "clsx";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: React.ReactNode;
  beforeLabel?: React.ReactNode;
  afterLabel?: React.ReactNode;
  className?: string;
};

export function Checkbox({
  id,
  label,
  beforeLabel,
  afterLabel,
  className,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={clsx("check-item", className)}>
      <input id={inputId} className="input" type="checkbox" {...rest} />
      <label htmlFor={inputId}>
        {beforeLabel}
        <span className="tit">{label}</span>
        {afterLabel}
      </label>
    </div>
  );
}

type CheckboxGroupProps = {
  children: React.ReactNode;
  className?: string;
  variantClassName?: string;
  layoutClassName?: string;
  roleGroupLabel?: string;
};

export function CheckboxGroup({
  children,
  className,
  variantClassName,
  layoutClassName,
  roleGroupLabel,
}: CheckboxGroupProps) {
  return (
    <div
      className={clsx("check-group", variantClassName, layoutClassName, className)}
      role="group"
      aria-label={roleGroupLabel}
    >
      {children}
    </div>
  );
}
