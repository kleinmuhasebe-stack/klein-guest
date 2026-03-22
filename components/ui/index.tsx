"use client";
import { cn } from "@/lib/utils";

// ── Topbar ──────────────────────────────────────────────────
export function Topbar({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
      padding: "16px 28px", display: "flex", alignItems: "center", gap: 14,
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 500, flex: 1, letterSpacing: "-0.3px" }}>{title}</h2>
      {children}
    </div>
  );
}

// ── Button ──────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}
export function Btn({ variant = "secondary", size = "md", className, children, style, ...props }: BtnProps) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 6,
    border: "none", borderRadius: 8, cursor: "pointer",
    fontFamily: "DM Sans, sans-serif", fontWeight: 500, transition: "opacity 0.15s",
    padding: size === "sm" ? "6px 12px" : "9px 16px",
    fontSize: size === "sm" ? 12 : 13,
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "var(--accent)", color: "#fff" },
    secondary: { background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", color: "var(--text3)", border: "1px solid var(--border)" },
    danger: { background: "rgba(255,107,107,0.15)", color: "#ff6b6b", border: "1px solid rgba(255,107,107,0.3)" },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      {...props}>{children}</button>
  );
}

// ── Badge ──────────────────────────────────────────────────
export function Badge({ type }: { type: "checked" | "vip" | "pending" | "plus" | "owner" | "manager" | "checkin" }) {
  const styles: Record<string, React.CSSProperties> = {
    checked: { background: "rgba(0,184,148,0.15)", color: "#00b894" },
    vip: { background: "rgba(253,121,168,0.15)", color: "#fd79a8" },
    pending: { background: "rgba(253,203,110,0.15)", color: "#fdcb6e" },
    plus: { background: "rgba(162,155,254,0.15)", color: "#a29bfe" },
    owner: { background: "rgba(108,92,231,0.2)", color: "#a29bfe" },
    manager: { background: "rgba(0,206,201,0.15)", color: "#00cec9" },
    checkin: { background: "rgba(90,90,114,0.3)", color: "#9090a8" },
  };
  const labels: Record<string, string> = {
    checked: "✓ Giriş", vip: "★ VIP", pending: "◌ Bekliyor", plus: "+Misafir",
    owner: "Sahip", manager: "Yönetici", checkin: "Check-in",
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500, ...styles[type] }}>
      {labels[type]}
    </span>
  );
}

// ── Input ──────────────────────────────────────────────────
export function Input({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label style={{ display: "block", fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <input style={{
        width: "100%", background: "var(--surface2)", border: "1px solid var(--border)",
        borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--text)",
      }} {...props} />
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────
export function Select({ label, children, ...props }: { label?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label style={{ display: "block", fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <select style={{
        width: "100%", background: "var(--surface2)", border: "1px solid var(--border)",
        borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--text)", cursor: "pointer",
      }} {...props}>{children}</select>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
        padding: 28, width: 500, maxWidth: "90vw",
      }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ── StatCard ───────────────────────────────────────────────
export function StatCard({ label, value, sub, color, pct }: { label: string; value: number | string; sub?: string; color: string; pct?: number }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
      <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-1px", fontFamily: "DM Mono, monospace", color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{sub}</div>}
      {pct !== undefined && (
        <div style={{ height: 3, borderRadius: 2, background: "var(--surface3)", marginTop: 12 }}>
          <div style={{ height: "100%", borderRadius: 2, background: color, width: `${pct}%`, transition: "width 0.5s" }} />
        </div>
      )}
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const colors = ["#6c5ce722","#00b89422","#fd79a822","#fdcb6e22","#00cec922"];
  const textColors = ["#a29bfe","#00b894","#fd79a8","#fdcb6e","#00cec9"];
  let h = 0; for (const c of name) h += c.charCodeAt(0);
  const i = h % colors.length;
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: colors[i], color: textColors[i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 600, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}
