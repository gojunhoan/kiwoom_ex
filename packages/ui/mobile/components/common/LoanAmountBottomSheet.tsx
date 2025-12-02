"use client";

import React, { useState } from "react";
import clsx from "clsx";
import BottomSheet from "../popup/BottomSheet";
import TextField from "./TextField";

export type QuickButton = {
  label: React.ReactNode;
  type: "add" | "set";
  value?: number;
};

type LoanAmountBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  initialValue?: number;
  maxLimit?: number;
  quickButtons?: QuickButton[];
};

export default function LoanAmountBottomSheet({
  open,
  onClose,
  onConfirm,
  initialValue = 0,
  maxLimit = 100000000,
  quickButtons: customQuickButtons,
}: LoanAmountBottomSheetProps) {
  const [amount, setAmount] = useState(initialValue);
  
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setAmount(initialValue);
    }
  }

  const formatValue = (val: number) =>
    val === 0 ? "" : val.toLocaleString("ko-KR");

  const handleKeypadClick = (key: string) => {
    let next = amount;

    if (key === "back") {
      next = Math.floor(amount / 10);
    } else if (key === "00") {
      next = amount * 100;
    } else {
      next = amount * 10 + Number(key);
    }

    if (next <= maxLimit) {
      setAmount(next);
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setAmount(Number(val));
  };

  const handleConfirm = () => {
    onConfirm(amount);
    onClose();
  };

  const defaultQuickButtons: QuickButton[] = [
    { label: "+10만원", type: "add", value: 100000 },
    { label: "+50만원", type: "add", value: 500000 },
    { label: "+1000만원", type: "add", value: 10000000 },
    { label: "최대한도", type: "set", value: maxLimit },
  ];
  
  const quickButtons = customQuickButtons || defaultQuickButtons;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="대출신청 금액"
      footer={
        <div className="btn-group">
          <button
            type="button"
            className={clsx("btn btn-pri", amount === 0 && "disabled")}
            onClick={handleConfirm}
          >
            확인
          </button>
        </div>
      }
    >
      <div className="popup-content-inner">
        <TextField
          value={formatValue(amount)}
          onChange={handleTextFieldChange}
          unitText="원"
          placeholder="0"
          className="text-right text-2xl font-bold text-gray-900 caret-transparent"
          wrapperClassName="mb-6"
          inputMode="none"
          readOnly={false}
          quickButtons={quickButtons}
          maxValue={maxLimit}
        />
        
        <div className="ky-num-keypad-wrap select-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "00", 0].map((num) => (
            <div key={num} className="item-num">
              <button
                type="button"
                className="btn-num-keypad"
                onClick={() => handleKeypadClick(String(num))}
              >
                {num}
              </button>
            </div>
          ))}

          <div className="item-num">
            <button
              type="button"
              className="btn-num-keypad"
              onClick={() => handleKeypadClick("back")}
              aria-label="지우기"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <path d="M21 12H7" />
                <path d="M11 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}