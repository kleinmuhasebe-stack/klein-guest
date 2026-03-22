"use client";
export default function TeamPage() {
  const team = [
    { name: "Salim Arslan", role: "Sahip", color: "#6c5ce7" },
  ];
  return (
    <div style={{ padding: 28 }}>
      <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, overflow: "hidden", maxWidth: 600 }}>
        {team.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: "1px solid #2a2a3a" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: m.color + "22", color: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>
              {m.name.split(" ").map(w => w[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: "#5a5a72" }}>{m.role}</div>
            </div>
            <span style={{ background: "rgba(0,184,148,0.15)", color: "#00b894", fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 500 }}>Aktif</span>
          </div>
        ))}
      </div>
    </div>
  );
}
