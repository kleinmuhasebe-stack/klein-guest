"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("events").select("*").order("date", { ascending: false })
      .then(({ data }) => { setEvents(data || []); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: 40, color: "#9090a8" }}>Yükleniyor...</div>;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "#9090a8" }}>Etkinlikler ({events.length})</h2>
      </div>
      {events.length === 0 ? (
        <div style={{ color: "#5a5a72", fontSize: 14 }}>Henüz etkinlik yok</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {events.map((e: any) => (
            <div key={e.id} style={{ background: "#111118", border: e.is_active ? "1px solid #6c5ce7" : "1px solid #2a2a3a", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{e.emoji || "⚡"}</div>
              {e.is_active && <span style={{ display: "inline-block", background: "rgba(0,184,148,0.15)", color: "#00b894", fontSize: 10, padding: "2px 8px", borderRadius: 10, marginBottom: 8, fontWeight: 600 }}>AKTİF</span>}
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{e.name}</div>
              <div style={{ fontSize: 12, color: "#5a5a72" }}>{e.date ? new Date(e.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "Tarih yok"}</div>
              {e.venue && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>{e.venue}</div>}
              {e.bugece_url && (
                <a href={e.bugece_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 12, fontSize: 11, color: "#fdcb6e", textDecoration: "none", border: "1px solid rgba(253,203,110,0.3)", padding: "3px 10px", borderRadius: 6 }}>
                  bugece ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
