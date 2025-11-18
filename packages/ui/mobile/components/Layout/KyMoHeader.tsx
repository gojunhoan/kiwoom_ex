// components/layout/KyMoHeader.tsx
"use client";

import React from "react";

type KyMoHeaderProps = {
  title: string;

  /** 버튼 노출 여부 제어 (기본값: true) */
  showHome?: boolean;
  showCancel?: boolean;
  showMenu?: boolean;
};

export default function KyMoHeader({
  title,
  showHome = false,
  showCancel = false,
  showMenu = false,
}: KyMoHeaderProps) {
  const handleBackClick = () => {
    history.back();
  };

  const handleHomeClick = () => {
    // 홈 이동
  };

  const handleCancelClick = () => {
    // 취소
  };

  const handleMenuClick = () => {
    // 메뉴 열기
  };

  return (
    <header className="ky-mo-header">
      <button
        type="button"
        className="btn-header-back"
        onClick={handleBackClick}
      >
        <span className="ky-hide">뒤로가기</span>
      </button>

      <h1 className="header-title">{title}</h1>

      <nav className="nav-wrap" aria-label="상단 메뉴">
        {showHome && (
          <button
            type="button"
            className="btn-header-home"
            onClick={handleHomeClick}
          >
            <span className="ky-hide">홈으로</span>
          </button>
        )}

        {showCancel && (
          <button
            type="button"
            className="btn-header-cancel"
            onClick={handleCancelClick}
          >
            <span>취소</span>
          </button>
        )}

        {showMenu && (
          <button
            type="button"
            className="btn-header-menu"
            onClick={handleMenuClick}
          >
            <span className="ky-hide">메뉴</span>
          </button>
        )}
      </nav>
    </header>
  );
}
