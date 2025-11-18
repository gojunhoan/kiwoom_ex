"use client";

import { ReactNode, useEffect, useRef } from "react";

type FullPopupProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export default function FullPopup({
  open,
  title,
  children,
  footer,
  onClose,
}: FullPopupProps) {
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
      if (e.key === "Escape") {
        onClose();
      }
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

  return (
    <div
      ref={layerRef}
      className="popup-layer popup-full is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fullPopupTitle"
    >        
      <button
        type="button"
        className="popup-dim"
        onClick={onClose}
        aria-label="팝업 닫기"
      />

      <div className="popup-panel">
        <div className="popup-header">
          <h2 id="fullPopupTitle" className="popup-title">
            {title}
          </h2>
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
