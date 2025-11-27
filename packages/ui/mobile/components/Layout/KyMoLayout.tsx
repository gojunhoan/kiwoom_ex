import React from "react";
import KyMoHeader from "./KyMoHeader";

type KyMoLayoutProps = {
  title: string;
  children: React.ReactNode;
  showBack?: boolean;
  showHome?: boolean;
  showCancel?: boolean;
  showMenu?: boolean;
  hideTitle?: boolean;
  bottom?: React.ReactNode;
};

export default function KyMoLayout({
  title,
  children,
  showBack = true,
  showHome = false,
  showCancel = true,
  showMenu = false,
  hideTitle = false,
  bottom,
}: KyMoLayoutProps) {
  return (
    <div className="ky-mo-wrap">
      <KyMoHeader
        showBack={showBack}
        title={title}
        hideTitle={hideTitle}
        showHome={showHome}
        showCancel={showCancel}
        showMenu={showMenu}
      />

      <main className="ky-mo-container" id="main">
        <div className="ky-mo-contents">
          {children}
        </div>

        {bottom && (
          <div className="bottom-area">
            {bottom}
          </div>
        )}
      </main>
    </div>
  );
}
