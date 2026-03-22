"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function StatsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("events").select("*").order("date", { ascending: false }).then(({ data }) => setEvents(data || []));
    supabase.from("guests").select("event_id,status,checked_in,checked_in_at").then(({ data }) => setGuests(data || []));
  }, []);

  const total = guests.length;
  const checked = guests.filter(g => g.checked_in).length;
  const vip = guests.filter(g => g.status === "vip").length;

  const hours: Record<number, number> = {};
  guests.filter(g => g.checked_in_at).forEach(g => {
    const h = new Date(g.checked_in_at).getHours();
    hours[h] = (hours[h] || 0) + 1;
  });
  const hourList = Array.from({ length: 12 }, (_, i) => (20 + i) % 24);
  const maxH = Math.max(...hourList.map(h => hours[h] || 0), 1);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Toplam Etkinlik", value: events.length, color: "#a29bfe" },
          { label: "Toplam Misafir", value: total, color: "#f0f0f8" },
          { label: "Toplam Giriş", value: checked, color: "#00b894" },
          { label: "VIP", value: vip, color: "#fd79a8" },
        ].map(s => (
          <div key={s.label} style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: s.color, fontFamily: "DM Mono, monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>SAATLIK GİRİŞ</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
            {hourList.map(h => (
              <div key={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                <div style={{ width: "100%", borderRadius: "3px 3px 0 0", marginTop: "auto", height: `${Math.max(Math.round((hours[h] || 0) / maxH * 100), 4)}%`, background: (hours[h] || 0) > 0 ? "#6c5ce7" : "#1a1a24" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#5a5a72" }}>
            <span>20:00</span><span>23:00</span><span>02:00</span><span>05:00</span>
          </div>
        </div>

        <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>DURUM DAĞILIMI</div>
          {[
            { label: "Check-in", value: checked, color: "#00b894" },
            { label: "VIP", value: vip, color: "#fd79a8" },
            { label: "Bekliyor", value: total - checked, color: "#fdcb6e" },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "#9090a8" }}>{r.label}</span>
                <span style={{ color: "#5a5a72", fontFamily: "DM Mono, monospace" }}>{r.value}/{total}</span>
              </div>
              <div style={{ height: 5, background: "#1a1a24", borderRadius: 3 }}>
                <div style={{ height: "100%", borderRadius: 3, background: r.color, width: `${total ? Math.round(r.value / total * 100) : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #2a2a3a", fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px" }}>ETKİNLİK RAPORU</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ borderBottom: "1px solid #2a2a3a" }}>
            {["ETKİNLİK","TARİH","MİSAFİR","GİRİŞ","ORAN"].map(h => (
              <th key={h} style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: "#5a5a72", padding: "10px 16px", textAlign: "left", fontWeight: 500 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {events.map(e => {
              const eg = guests.filter(g => g.event_id === e.id);
              const ec = eg.filter(g => g.checked_in).length;
              const pct = eg.length ? Math.round(ec / eg.length * 100) : 0;
              return (
                <tr key={e.id} style={{ borderBottom: "1px solid #2a2a3a" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{e.emoji} {e.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#5a5a72" }}>{e.date || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "DM Mono, monospace" }}>{eg.length}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "DM Mono, monospace", color: "#00b894" }}>{ec}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: "#1a1a24", borderRadius: 2 }}>
                        <div style={{ height: "100%", borderRadius: 2, background: "#6c5ce7", width: `${pct}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: "#5a5a72", fontFamily: "DM Mono, monospace" }}>%{pct}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
