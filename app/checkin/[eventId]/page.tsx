"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Guest } from "@/types";
import { formatTime } from "@/lib/utils";

export default function PublicCheckinPage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Guest[]>([]);
  const [success, setSuccess] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("events").select("id, name, emoji, date").eq("id", params.eventId).single()
      .then(({ data }) => setEvent(data));
  }, []);

  useEffect(() => {
    if (search.length < 2) { setResults([]); return; }
    supabase.from("guests").select("*")
      .eq("event_id", params.eventId)
      .or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
      .limit(5)
      .then(({ data }) => setResults(data || []));
  }, [search]);

  async function doCheckin(guest: Guest) {
    if (guest.checked_in) return;
    setLoading(true);
    await supabase.from("guests").update({ checked_in: true, checked_in_at: new Date().toISOString() }).eq("id", guest.id);
    setSuccess({ ...guest, checked_in: true, checked_in_at: new Date().toISOString() });
    setSearch(""); setResults([]);
    setLoading(false);
  }

  if (success) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#00b894" }}>Hoş Geldiniz!</div>
        <div style={{ fontSize: 16, marginTop: 8 }}>{success.first_name} {success.last_name}</div>
        <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>{event?.emoji} {event?.name}</div>
        <button onClick={() => setSuccess(null)} style={{
          marginTop: 24, padding: "10px 24px", background: "var(--accent)", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "DM Sans, sans-serif",
        }}>Başka Misafir</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40 }}>{event?.emoji || "⚡"}</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginTop: 8 }}>{event?.name || "Etkinlik"}</div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>Check-in Sistemi</div>
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <div style={{ fontSize: 12, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>ADINIZI YAZIN</div>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Ad veya soyad..."
            style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", fontSize: 16, color: "var(--text)" }}
            autoFocus
          />

          {results.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {results.map((g) => (
                <div key={g.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{g.first_name} {g.last_name}</div>
                    {g.checked_in && <div style={{ fontSize: 12, color: "#00b894", marginTop: 2 }}>✓ {formatTime(g.checked_in_at)} giriş yapıldı</div>}
                  </div>
                  <button disabled={g.checked_in || loading} onClick={() => doCheckin(g)} style={{
                    padding: "9px 18px", borderRadius: 8, fontSize: 13, cursor: g.checked_in ? "default" : "pointer",
                    background: g.checked_in ? "rgba(0,184,148,0.15)" : "var(--accent)",
                    color: g.checked_in ? "#00b894" : "#fff", border: "none",
                    fontFamily: "DM Sans, sans-serif", fontWeight: 500,
                  }}>
                    {g.checked_in ? "Giriş Yapıldı" : "Check-in"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {search.length >= 2 && results.length === 0 && (
            <div style={{ marginTop: 12, fontSize: 13, color: "var(--text3)", textAlign: "center", padding: "12px 0" }}>
              Misafir listesinde bulunamadı
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
