"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CheckinPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [activeEvent, setActiveEvent] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase.from("events").select("id,name,emoji").order("date", { ascending: false })
      .then(({ data }) => { setEvents(data || []); if (data && data[0]) setActiveEvent(data[0].id); });
  }, []);

  useEffect(() => {
    if (!activeEvent) return;
    supabase.from("guests").select("*").eq("event_id", activeEvent).order("first_name")
      .then(({ data }) => setGuests(data || []));

    const channel = supabase.channel(`checkin:${activeEvent}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "guests", filter: `event_id=eq.${activeEvent}` }, payload => {
        setGuests(prev => prev.map(g => g.id === payload.new.id ? payload.new : g));
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeEvent]);

  async function toggleCheckin(g: any) {
    const checked_in = !g.checked_in;
    await supabase.from("guests").update({ checked_in, checked_in_at: checked_in ? new Date().toISOString() : null }).eq("id", g.id);
    setGuests(guests.map(x => x.id === g.id ? { ...x, checked_in, checked_in_at: checked_in ? new Date().toISOString() : null } : x));
  }

  const results = search.length > 1 ? guests.filter(g => `${g.first_name} ${g.last_name}`.toLowerCase().includes(search.toLowerCase())) : [];
  const checked = guests.filter(g => g.checked_in).length;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 20 }}>
        <select value={activeEvent} onChange={e => setActiveEvent(e.target.value)}
          style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#f0f0f8", cursor: "pointer" }}>
          {events.map(e => <option key={e.id} value={e.id}>{e.emoji} {e.name}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, maxWidth: 900 }}>
        <div>
          <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "#5a5a72", marginBottom: 8 }}>Check-in Durumu</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: "#00b894", fontFamily: "DM Mono, monospace" }}>
              {checked} <span style={{ fontSize: 18, color: "#5a5a72" }}>/ {guests.length}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "#1a1a24", marginTop: 12 }}>
              <div style={{ height: "100%", borderRadius: 3, background: "#00b894", width: `${guests.length ? Math.round(checked / guests.length * 100) : 0}%`, transition: "width 0.5s" }} />
            </div>
          </div>

          <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>MİSAFİR ARA</div>
            <input type="text" placeholder="Ad veya soyad..." value={search} onChange={e => setSearch(e.target.value)} autoFocus
              style={{ width: "100%", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "12px 16px", fontSize: 15, color: "#f0f0f8", outline: "none", boxSizing: "border-box", marginBottom: 12 }} />

            {search.length > 1 && results.map(g => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #2a2a3a" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{g.first_name} {g.last_name}</div>
                  <div style={{ fontSize: 12, color: "#5a5a72" }}>{g.table_name || "Masa yok"} · {g.status.toUpperCase()}</div>
                </div>
                <button onClick={() => toggleCheckin(g)} style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  border: g.checked_in ? "1px solid rgba(0,184,148,0.3)" : "1px solid #6c5ce7",
                  background: g.checked_in ? "rgba(0,184,148,0.15)" : "#6c5ce7",
                  color: g.checked_in ? "#00b894" : "#fff", fontFamily: "DM Sans, sans-serif", fontWeight: 500
                }}>
                  {g.checked_in ? "✓ Giriş Yapıldı" : "Check-in Yap"}
                </button>
              </div>
            ))}

            {search.length <= 1 && (
              <div>
                <div style={{ fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>SON GİRİŞLER</div>
                {guests.filter(g => g.checked_in).sort((a, b) => (b.checked_in_at || "").localeCompare(a.checked_in_at || "")).slice(0, 8).map(g => (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #2a2a3a" }}>
                    <div style={{ flex: 1, fontSize: 13 }}>{g.first_name} {g.last_name}</div>
                    <span style={{ fontSize: 12, color: "#00b894", fontFamily: "DM Mono, monospace" }}>
                      {g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16 }}>QR CHECK-IN</div>
          <div style={{ background: "#fff", borderRadius: 10, padding: 14, display: "inline-block", marginBottom: 14 }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || "https://klein-guest.vercel.app"}/checkin/${activeEvent}`)}`}
              alt="QR Code" width={160} height={160} />
          </div>
          <div style={{ fontSize: 12, color: "#5a5a72" }}>Misafirler bu kodu tarayarak check-in yapabilir</div>
        </div>
      </div>
    </div>
  );
}
