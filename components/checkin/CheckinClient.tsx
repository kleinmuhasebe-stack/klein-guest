"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Topbar, Btn, Avatar, Badge } from "@/components/ui";
import { Guest, Event } from "@/types";
import { formatTime } from "@/lib/utils";
import QRCode from "qrcode.react";
import toast from "react-hot-toast";

interface Props {
  guests: Guest[];
  event: Pick<Event, "id" | "name" | "emoji" | "is_active" | "date">;
  events: Pick<Event, "id" | "name" | "emoji" | "is_active" | "date">[];
}

export default function CheckinClient({ guests: initial, event, events }: Props) {
  const [guests, setGuests] = useState(initial);
  const [search, setSearch] = useState("");
  const supabase = createClient();
  const router = useRouter();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Realtime
  useEffect(() => {
    const channel = supabase.channel(`checkin:${event.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "guests", filter: `event_id=eq.${event.id}` }, (payload) => {
        setGuests((prev) => prev.map((g) => g.id === (payload.new as Guest).id ? payload.new as Guest : g));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guests", filter: `event_id=eq.${event.id}` }, (payload) => {
        setGuests((prev) => [payload.new as Guest, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [event.id]);

  const results = search.length > 1
    ? guests.filter((g) => `${g.first_name} ${g.last_name}`.toLowerCase().includes(search.toLowerCase()))
    : [];

  const checkedIn = guests.filter((g) => g.checked_in).length;

  async function doCheckin(guest: Guest) {
    const checked_in = !guest.checked_in;
    const { error } = await supabase.from("guests").update({
      checked_in, checked_in_at: checked_in ? new Date().toISOString() : null,
    }).eq("id", guest.id);
    if (error) return toast.error(error.message);
    setSearch("");
    toast.success(checked_in ? `✓ ${guest.first_name} ${guest.last_name} giriş yaptı!` : "Check-in geri alındı");
  }

  return (
    <>
      <Topbar title="Hızlı Check-in">
        <select value={event.id} onChange={(e) => router.push(`/dashboard/checkin?event=${e.target.value}`)}
          style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
          {events.map((e) => <option key={e.id} value={e.id}>{e.emoji} {e.name}</option>)}
        </select>
      </Topbar>

      <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, maxWidth: 1100 }}>
        {/* Left: search check-in */}
        <div>
          {/* Progress bar */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text3)" }}>Check-in Durumu</div>
                <div style={{ fontSize: 32, fontWeight: 600, fontFamily: "DM Mono, monospace", color: "#00b894" }}>
                  {checkedIn} <span style={{ fontSize: 18, color: "var(--text3)" }}>/ {guests.length}</span>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, fontFamily: "DM Mono, monospace", color: "var(--accent2)" }}>
                %{guests.length ? Math.round(checkedIn / guests.length * 100) : 0}
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "var(--surface2)" }}>
              <div style={{ height: "100%", borderRadius: 3, background: "#00b894", width: `${guests.length ? Math.round(checkedIn / guests.length * 100) : 0}%`, transition: "width 0.5s" }} />
            </div>
          </div>

          {/* Search */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>MİSAFİR ARA</div>
            <input
              type="text" placeholder="Ad veya soyad yaz..." value={search}
              onChange={(e) => setSearch(e.target.value)} autoFocus
              style={{
                width: "100%", background: "var(--surface2)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "12px 16px", fontSize: 16, color: "var(--text)",
              }}
            />

            {search.length > 1 && (
              <div style={{ marginTop: 12 }}>
                {results.length === 0 ? (
                  <div style={{ padding: "16px 0", color: "var(--text3)", fontSize: 13 }}>Misafir bulunamadı</div>
                ) : results.map((g) => (
                  <div key={g.id} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 0",
                    borderBottom: "1px solid var(--border)",
                  }}>
                    <Avatar name={`${g.first_name} ${g.last_name}`} size={36} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{g.first_name} {g.last_name}</div>
                      <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                        {g.table_name || "Masa yok"} · {g.status.toUpperCase()}
                        {g.checked_in && <span style={{ color: "#00b894" }}> · {formatTime(g.checked_in_at)} giriş</span>}
                      </div>
                    </div>
                    <button onClick={() => doCheckin(g)} style={{
                      padding: "8px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                      border: `1px solid ${g.checked_in ? "rgba(0,184,148,0.3)" : "var(--accent)"}`,
                      background: g.checked_in ? "rgba(0,184,148,0.15)" : "var(--accent)",
                      color: g.checked_in ? "#00b894" : "#fff",
                      fontFamily: "DM Sans, sans-serif", fontWeight: 500,
                    }}>
                      {g.checked_in ? "✓ Giriş Yapıldı" : "Check-in Yap"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recent check-ins */}
            {search.length <= 1 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>SON GİRİŞLER</div>
                {guests.filter((g) => g.checked_in).sort((a, b) => (b.checked_in_at || "").localeCompare(a.checked_in_at || "")).slice(0, 8).map((g) => (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <Avatar name={`${g.first_name} ${g.last_name}`} size={28} />
                    <div style={{ flex: 1, fontSize: 13 }}>{g.first_name} {g.last_name}</div>
                    <span style={{ fontSize: 12, color: "#00b894", fontFamily: "DM Mono, monospace" }}>{formatTime(g.checked_in_at)}</span>
                  </div>
                ))}
                {guests.filter((g) => g.checked_in).length === 0 && (
                  <div style={{ color: "var(--text3)", fontSize: 13, padding: "8px 0" }}>Henüz giriş yok</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: QR Code */}
        <div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 20 }}>QR KOD CHECK-IN</div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, display: "inline-block", marginBottom: 16 }}>
              <QRCode
                value={`${appUrl}/checkin/${event.id}`}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, marginBottom: 4 }}>{event.emoji} {event.name}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 20 }}>Misafirler bu kodu tarayarak check-in yapabilir</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <Btn size="sm" variant="ghost" onClick={() => {
                const canvas = document.querySelector("canvas");
                if (canvas) { const a = document.createElement("a"); a.download = "qr-checkin.png"; a.href = canvas.toDataURL(); a.click(); }
              }}>QR İndir</Btn>
              <Btn size="sm" variant="ghost" onClick={() => window.print()}>Yazdır</Btn>
            </div>
          </div>

          {/* Stats mini */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, marginTop: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>HIZLI İSTATİSTİK</div>
            {[
              { label: "Toplam Misafir", value: guests.length, color: "var(--accent2)" },
              { label: "Giriş Yapıldı", value: checkedIn, color: "#00b894" },
              { label: "Bekliyor", value: guests.length - checkedIn, color: "#fdcb6e" },
              { label: "VIP", value: guests.filter((g) => g.status === "vip").length, color: "#fd79a8" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--text3)" }}>{s.label}</span>
                <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "DM Mono, monospace", color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
