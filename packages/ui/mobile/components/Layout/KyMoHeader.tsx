// components/layout/KyMoHeader.tsx
"use client";

import React from "react";

type KyMoHeaderProps = {
  title: string;

  /** 버튼 노출 여부 제어 (기본값: true) */
  showBack?: boolean;
  showHome?: boolean;
  showCancel?: boolean;
  showMenu?: boolean;
  hideTitle?: boolean;
};

export default function KyMoHeader({
  title,
  showBack = false,
  showHome = false,
  showCancel = false,
  showMenu = false,
  hideTitle = false,
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

  const titleClassName = [
    "header-title",
    hideTitle && "ky-hide",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className="ky-mo-header">
      {showBack && (
          
      <button
        type="button"
        className="btn-header-back"
        onClick={handleBackClick}
      >
        <span className="ky-hide">뒤로가기</span>
      </button>
        )}

      <h1 className={titleClassName}>{title}</h1>

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
