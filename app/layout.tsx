import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Klein Guest — Misafir Yönetimi",
  description: "Profesyonel etkinlik misafir yönetimi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a24",
              color: "#f0f0f8",
              border: "1px solid #2a2a3a",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
