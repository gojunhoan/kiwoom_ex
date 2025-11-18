import React, { useId } from "react";
import clsx from "clsx";

export type RadioProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: React.ReactNode;
  beforeLabel?: React.ReactNode;
  afterLabel?: React.ReactNode;
  className?: string;
};

export function Radio({
  id,
  label,
  beforeLabel,
  afterLabel,
  className,
  ...rest
}: RadioProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={clsx("check-item", className)}>
      <input id={inputId} className="input" type="radio" {...rest} />
      <label htmlFor={inputId}>
        {beforeLabel}
        <span className="tit">{label}</span>
        {afterLabel}
      </label>
    </div>
  );
}

type RadioGroupProps = {
  children: React.ReactNode;
  className?: string;
  variantClassName?: string; // "check-type--box" 등
  layoutClassName?: string;
  roleGroupLabel?: string;
};

export function RadioGroup({
  children,
  className,
  variantClassName,
  layoutClassName,
  roleGroupLabel,
}: RadioGroupProps) {
  return (
    <div
      className={clsx("check-group", variantClassName, layoutClassName, className)}
      role="radiogroup"
      aria-label={roleGroupLabel}
    >
      {children}
    </div>
  );
}
