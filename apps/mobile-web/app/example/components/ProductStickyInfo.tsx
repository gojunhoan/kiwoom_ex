
"use client";

import { useEffect, useRef, useState } from "react";

interface ProductStickyInfoProps {
  title: string;
  rate: string;
  limit: string;
  limitText?: string; // 선택적 데이터
}

export default function ProductStickyInfo({
  title,
  rate,
  limit,
  limitText
}: ProductStickyInfoProps) {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // sentinel이 화면 상단 밖으로 나가서 안 보이면(sticky 상태 진입)
        // entry.boundingClientRect.y < 0 조건을 추가하여 
        // 스크롤을 내려서 안 보이는 건지 확실히 체크
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.y < 56);
      },
      {
        threshold: 0,
        // 중요: sticky가 top: 5.6rem에 걸리므로, 그보다 약간 위에서 감지하도록 설정
        // 만약 헤더 높이가 5.6rem이라면 rootMargin을 "-57px 0px 0px 0px" 등으로 조정 필요
        rootMargin: "-56px 0px 0px 0px", 
      }
    );

    observer.observe(sentinelEl);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 1. Sticky 감지용 투명 센티넬 (실제 높이 1px) */}
      <div ref={sentinelRef} className="sticky-sentinel" />

      {/* 2. 실제 Sticky 영역 */}
      <div className={`product-sticky-info-area ${isSticky ? "is-sticky" : ""}`}>
        <div className="inner-content">
          <h2 className="tit">{title}</h2>
          
          <div className="info-wrap">
            {/* 적용(예상)금리 */}
            <div className="info-row">
              <span className="label">적용(예상)금리</span>
              <strong className="value emphasize">{rate}</strong>
            </div>

            {/* 대출가능 금액 */}
            <div className="info-row">
              <span className="label">대출가능 금액</span>
              <div className="value-group">
                <strong className="value">최대 {limit}</strong>
                {limitText && <span className="value-text">{limitText}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}