"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "🗓 Etkinlikler" },
  { href: "/dashboard/guests", label: "👥 Misafirler" },
  { href: "/dashboard/checkin", label: "✓ Check-in" },
  { href: "/dashboard/stats", label: "📊 İstatistikler" },
  { href: "/dashboard/team", label: "🤝 Ekip" },
  { href: "/dashboard/import", label: "↑ Import/Export" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [user, setUser] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (localStorage.getItem("kg_auth") !== "1") {
      window.location.replace("/auth/login");
    } else {
      setUser(localStorage.getItem("kg_user") || "");
      setChecked(true);
    }
  }, []);

  if (!checked) return <div style={{ background: "#0a0a0f", minHeight: "100vh" }} />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "DM Sans, sans-serif" }}>
      <aside style={{ width: 210, background: "#111118", borderRight: "1px solid #2a2a3a", position: "fixed", top: 0, left: 0, height: "100vh", display: "flex", flexDirection: "column", zIndex: 100 }}>
        <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid #2a2a3a" }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#f0f0f8" }}>klein <span style={{ color: "#a29bfe" }}>guest</span></div>
          <div style={{ fontSize: 11, color: "#5a5a72", marginTop: 4 }}>Klein Phönix</div>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {nav.map(({ href, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} style={{
                display: "block", padding: "9px 12px", borderRadius: 8, fontSize: 13,
                textDecoration: "none", marginBottom: 2,
                color: active ? "#a29bfe" : "#9090a8",
                background: active ? "#2d2b5e" : "transparent",
              }}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #2a2a3a" }}>
          <div style={{ fontSize: 12, color: "#5a5a72", marginBottom: 8 }}>👤 {user}</div>
          <button onClick={() => { localStorage.removeItem("kg_auth"); localStorage.removeItem("kg_user"); window.location.replace("/auth/login"); }}
            style={{ width: "100%", padding: "7px 12px", background: "transparent", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12, color: "#5a5a72", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
            Çıkış Yap
          </button>
        </div>
      </aside>
      <main style={{ marginLeft: 210, flex: 1, background: "#0a0a0f", minHeight: "100vh", color: "#f0f0f8" }}>
        {children}
      </main>
    </div>
  );
}
