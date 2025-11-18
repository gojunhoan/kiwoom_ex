// Button.tsx
import React from "react";
import clsx from "clsx";

type ButtonVariant = "pri" | "sec" | "third" | "outline" | "select";
type ButtonSize = "lg" | "md" | "sm";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabledClassOnly?: boolean;
};

const variantToClass = (v?: ButtonVariant) =>
  v === "pri"
    ? "btn-pri"
    : v === "sec"
    ? "btn-sec"
    : v === "third"
    ? "btn-third"
    : v === "outline"
    ? "btn-outline"
    : v === "select"
    ? "select-box"
    : undefined;

export default function Button({
  className,
  variant = "pri",
  size = "lg",
  disabled,
  disabledClassOnly,
  children,
  ...rest
}: ButtonProps) {
  const visuallyDisabled = disabled || disabledClassOnly;
  const nativeDisabled = disabled && !disabledClassOnly;

  return (
    <button
      className={clsx(
        "btn",
        variantToClass(variant),
        size === "md" && "md",
        size === "sm" && "sm",
        visuallyDisabled && "disabled",
        className
      )}

      disabled={nativeDisabled || undefined}
      aria-disabled={visuallyDisabled || undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
