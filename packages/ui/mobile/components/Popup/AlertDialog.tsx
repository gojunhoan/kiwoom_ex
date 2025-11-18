"use client";

import { ReactNode, useEffect, useRef } from "react";

type AlertDialogProps = {
  open: boolean;
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export default function AlertDialog({
  open,
  title = "알림",
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const prevActive = document.activeElement as HTMLElement | null;
    const layer = layerRef.current;
    const firstFocusable = layer?.querySelector<HTMLButtonElement>("button");

    firstFocusable?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel ? onCancel() : onConfirm();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      prevActive?.focus();
    };
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else onConfirm();
  };

  return (
    <div
      ref={layerRef}
      className="popup-layer popup-alert is-open"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alertTitle"
      aria-describedby="alertMessage"
    >
      <div className="popup-dim" aria-hidden="true" />

      <div className="popup-panel">
        <div className="popup-header">
          <h2 id="alertTitle" className="popup-title">
            {title}
          </h2>
        </div>

        <div id="alertMessage" className="popup-body">
          {message}
        </div>

        <div className="popup-footer">
          <div className="btn-group">
            {onCancel && (
              <button
                type="button"
                className="btn md btn-third"
                onClick={handleCancel}
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              className="btn md btn-pri"
              onClick={handleConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
