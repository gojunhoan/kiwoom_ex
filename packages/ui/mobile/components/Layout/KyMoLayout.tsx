// components/layout/KyMoLayout.tsx
import React from "react";
import KyMoHeader from "./KyMoHeader";

type KyMoLayoutProps = {
  title: string;
  children: React.ReactNode;

  showHome?: boolean;
  showCancel?: boolean;
  showMenu?: boolean;
};

export default function KyMoLayout({
  title,
  children,
  showHome,
  showCancel,
  showMenu,
}: KyMoLayoutProps) {
  return (
    <div className="ky-mo-wrap">
      <KyMoHeader
        title={title}
        showHome={showHome}
        showCancel={showCancel}
        showMenu={showMenu}
      />

      <main className="ky-mo-container" id="main">
        {children}
      </main>
    </div>
  );
}
