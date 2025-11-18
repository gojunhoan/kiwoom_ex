"use client";

import { ReactNode, useEffect, useRef } from "react";

type BottomSheetProps = {
  open: boolean;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export default function BottomSheet({
  open,
  title,
  children,
  footer,
  onClose,
}: BottomSheetProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const prevActive = document.activeElement as HTMLElement | null;
    const layer = layerRef.current;
    const firstFocusable = layer?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    firstFocusable?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      prevActive?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const titleId = title ? "bottomSheetTitle" : undefined;

  return (
    <div
      ref={layerRef}
      className="popup-layer popup-bottom is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="popup-dim"
        onClick={onClose}
        aria-label="팝업 닫기"
      />

      <div className="popup-panel">
        <div className="popup-header">
          {title && (
            <h2 id={titleId} className="popup-title">
              {title}
            </h2>
          )}

          <button
            type="button"
            className="popup-close"
            onClick={onClose}
          >
            <span className="ky-hide">닫기</span>
          </button>
        </div>

        <div className="popup-body">{children}</div>

        {footer && <div className="popup-footer">{footer}</div>}
      </div>
    </div>
  );
}
