"use client";

import { useState } from "react";

interface InterestData {
  amount: string;
  period: string;
  method: string;     // "원리금균등" | "원금균등" | "만기일시상환" 등
  payment1: string;   // 메인 금액 (매달 또는 첫달)
  payment2?: string;  // 서브 금액 (마지막달, 필요한 경우만)
  disclaimer?: string;
}

interface LoanInterestInfoProps {
  data: InterestData;
}

export default function LoanInterestInfo({ data }: LoanInterestInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // 상환 방식에 따른 결과 텍스트 렌더링 함수
  const renderResultText = () => {
    switch (data.method) {
      case "원금균등":
        return (
          <>
            첫달은 <span className="amount">{data.payment1}</span>,
            <br className="mobile-break" />
            마지막달은 <span className="amount">{data.payment2}</span>을 갚아야 해요
          </>
        );
      case "만기일시상환":
        return (
          <>
            매달 <span className="amount">{data.payment1}</span>,
            <br className="mobile-break" />
            마지막달은 <span className="amount">{data.payment2}</span>을 갚아야 해요
          </>
        );
      case "원리금균등":
      default:
        return (
          <>
            매달 <span className="amount">{data.payment1}</span>을 갚아야 해요
          </>
        );
    }
  };

  return (
    <div className={`loan-interest-info ${isOpen ? "active" : ""}`}>
      {/* 헤더 영역 */}
      <div className="header-area">
        <button 
          type="button" 
          className="toggle-btn" 
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls="interest-content"
        >
          <span className="tit">내가 낼 이자는 얼마인가요?</span>
          <span className="icon-arrow"></span>
        </button>

        <button type="button" className="calc-link-btn">
          대출계산기로 확인
        </button>
      </div>

      {/* 컨텐츠 영역 */}
      <div 
        id="interest-content" 
        className="content-area"
        aria-hidden={!isOpen}
      >
        <div className="inner-wrapper">
          <div className="result-card">
            {/* 상단 요약 */}
            <p className="description">
              <span className="highlight">{data.amount}</span>{" "}
              <span className="highlight">{data.period}동안</span><br />
              <span className="highlight">{data.method}</span>으로 대출받으면
            </p>
            
            {/* 결과 텍스트 (케이스별 분기) */}
            <p className="result-text">
              {renderResultText()}
            </p>
          </div>

          {data.disclaimer && (
            <div className="disclaimer">
              <span className="icon-info">!</span>
              <p>{data.disclaimer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}