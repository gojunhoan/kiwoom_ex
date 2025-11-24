"use client";
import React, { useState, useRef } from "react";
import { RadioButtonGroup } from "./RadioButton";
import Button from "./Button";
import BottomSheet from "../popup/BottomSheet";

// 데이터 타입 정의
export interface OptionType {
  value: string;
  label: string;
}

interface BottomSheetSelectProps {
  title: string;           // 바텀시트 제목 (예: 명의자)
  options: OptionType[];   // 라디오 버튼 옵션 리스트
  placeholder?: string;    // 선택 전 버튼 문구 (기본값: "선택")
  onSelect?: (value: string) => void; // 부모에게 선택된 값 전달용 (선택 사항)
}

export default function BottomSheetSelect({
  title,
  options,
  placeholder = "선택",
  onSelect,
}: BottomSheetSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  const triggerWrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);

    if (onSelect) {
      onSelect(value);
    }

    // 시트가 닫힌 후 래퍼(div)로 포커스 이동하여 접근성 유지
    setTimeout(() => {
      triggerWrapperRef.current?.focus();
    }, 100);
  };

  return (
    <>
      {/* 트리거 버튼 */}
      <div 
        ref={triggerWrapperRef} 
        tabIndex={-1} 
        className="inline-block outline-none" // 디자인에 영향 없도록 인라인 블록 처리
      >
        <Button
          variant="select"
          onClick={() => setIsOpen(true)}
        >
          {/* null check 대신 undefined check (??) 사용 */}
          {selectedValue ?? placeholder}
        </Button>
      </div>

      {/* 바텀 시트 */}
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
      >
        <RadioButtonGroup
          options={options}
          layoutClassName="split-1"
          roleGroupLabel={`${title} 선택`}
          onChange={handleSelect} // 선택 시 핸들러 실행
          value={selectedValue}   // 현재 선택된 값 유지
        />
      </BottomSheet>
    </>
  );
}