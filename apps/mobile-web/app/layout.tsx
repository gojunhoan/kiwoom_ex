import type { Metadata } from "next";
import "../scss/globals.scss";
import "../scss/base.scss";

export const metadata: Metadata = {
  title: "Kiwoom Mobile",
  description: "Publishing docs & components",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}