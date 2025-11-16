import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Kiwoom Mobile",
  description: "Publishing docs & components",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}