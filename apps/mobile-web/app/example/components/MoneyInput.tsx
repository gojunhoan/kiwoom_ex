"use client";

import React, { useState } from "react";
import LoanAmountBottomSheet, {QuickButton} from "../../../../../packages/ui/mobile/components/common/LoanAmountBottomSheet";

export default function Page() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  
  const maxLimit = 50000000;
    
  const myQuickButtons: QuickButton[] = [
    { label: "+100만원", type: "add", value: 1000000 },
    { label: "+500만원", type: "add", value: 5000000 },
    { label: "+1000만원", type: "add", value: 10000000 },
    { label: "최대금액", type: "set", value: maxLimit },
  ];

  const handleConfirmAmount = (value: number) => {
    setLoanAmount(value);
    console.log("전달받은 금액:", value); 
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="btn money-box"
      >
        <span className="ky-hide">신청 금액</span>
        <span>
          {loanAmount > 0 
            ? `${loanAmount.toLocaleString()}` 
            : ""}
        </span>
        <span className="unit">원</span>
      </button>

      <LoanAmountBottomSheet
        open={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        onConfirm={handleConfirmAmount}
        initialValue={loanAmount}
        maxLimit={maxLimit}
        quickButtons={myQuickButtons}
      />
    </>
  );
}