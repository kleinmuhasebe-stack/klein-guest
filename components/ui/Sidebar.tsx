"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface Props { orgId: string; orgName: string; userEmail: string; }

const nav = [
  { href: "/dashboard", label: "Etkinlikler", icon: CalIcon },
  { href: "/dashboard/guests", label: "Misafir Listesi", icon: UsersIcon },
  { href: "/dashboard/checkin", label: "Check-in", icon: CheckIcon },
  { href: "/dashboard/stats", label: "İstatistikler", icon: BarIcon },
  { href: "/dashboard/team", label: "Ekip", icon: TeamIcon },
  { href: "/dashboard/import", label: "Import / Export", icon: UploadIcon },
];

export default function Sidebar({ orgId, orgName, userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
    toast.success("Çıkış yapıldı");
  }

  return (
    <aside style={{
      width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)",
      position: "fixed", top: 0, left: 0, height: "100vh", display: "flex", flexDirection: "column", zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.5px" }}>
          klein<span style={{ color: "var(--accent2)" }}> guest</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4, fontFamily: "DM Mono, monospace" }}>
          {orgName}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <div style={sectionStyle}>Yönetim</div>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
              borderRadius: 8, fontSize: 13, textDecoration: "none", marginBottom: 2,
              color: active ? "var(--accent2)" : "var(--text2)",
              background: active ? "var(--accent3)" : "transparent",
              transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--surface2)"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {userEmail}
        </div>
        <button onClick={signOut} style={{
          width: "100%", padding: "7px 12px", background: "transparent", border: "1px solid var(--border)",
          borderRadius: 8, fontSize: 12, color: "var(--text3)", cursor: "pointer", fontFamily: "DM Sans, sans-serif", textAlign: "left",
        }}>
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

const sectionStyle: React.CSSProperties = {
  fontSize: 10, textTransform: "uppercase", letterSpacing: "1.5px",
  color: "var(--text3)", padding: "0 8px", marginBottom: 8, marginTop: 4,
};

function CalIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function UsersIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function CheckIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>; }
function BarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function TeamIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function UploadIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
