"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Topbar, Btn, Modal, Input, Select, Card } from "@/components/ui";
import { Event, Role } from "@/types";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props { events: Event[]; orgId: string; role: Role; }

export default function EventsClient({ events: initial, orgId, role }: Props) {
  const [events, setEvents] = useState(initial);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [emoji, setEmoji] = useState("⚡");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const canManage = role === "owner" || role === "manager";

  async function createEvent() {
    if (!name.trim()) return toast.error("Etkinlik adı zorunlu");
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("events").insert({
      org_id: orgId, name, date: date || null, venue: venue || null,
      emoji, created_by: user!.id,
    }).select().single();
    setSaving(false);
    if (error) return toast.error(error.message);
    setEvents([{ ...data, guest_count: 0, checked_in_count: 0 }, ...events]);
    setModal(false); setName(""); setDate(""); setVenue(""); setEmoji("⚡");
    toast.success("Etkinlik oluşturuldu!");
  }

  async function setActive(id: string) {
    await supabase.from("events").update({ is_active: false }).eq("org_id", orgId);
    await supabase.from("events").update({ is_active: true }).eq("id", id);
    setEvents(events.map((e) => ({ ...e, is_active: e.id === id })));
    toast.success("Aktif etkinlik güncellendi");
  }

  return (
    <>
      <Topbar title="Etkinlikler">
        {canManage && <Btn variant="primary" size="sm" onClick={() => setModal(true)}>+ Yeni Etkinlik</Btn>}
      </Topbar>

      <div style={{ padding: "24px 28px" }}>
        {events.length === 0 ? (
          <div style={{ textAlign: "center", padding: 64, color: "var(--text3)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚡</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text2)" }}>Henüz etkinlik yok</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>İlk etkinliğini oluştur</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {events.map((e) => (
              <div key={e.id} style={{
                background: "var(--surface)", border: `1px solid ${e.is_active ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
              }}
                onMouseEnter={(el) => { if (!e.is_active) (el.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; }}
                onMouseLeave={(el) => { (el.currentTarget as HTMLElement).style.borderColor = e.is_active ? "var(--accent)" : "var(--border)"; }}
              >
                <div style={{ height: 72, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                  {e.emoji}
                </div>
                <div style={{ padding: "14px 16px" }}>
                  {e.is_active && (
                    <span style={{ display: "inline-block", background: "rgba(0,184,148,0.15)", color: "#00b894", fontSize: 10, padding: "2px 8px", borderRadius: 10, marginBottom: 8, fontWeight: 600 }}>AKTİF</span>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>{formatDate(e.date)}{e.venue ? ` · ${e.venue}` : ""}</div>
                  <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "var(--text3)" }}>
                    <span><strong style={{ color: "var(--text)" }}>{e.guest_count}</strong> misafir</span>
                    <span><strong style={{ color: "#00b894" }}>{e.checked_in_count}</strong> giriş</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <Btn size="sm" variant="primary" onClick={() => router.push(`/dashboard/guests?event=${e.id}`)}>Listeyi Aç</Btn>
                    {canManage && !e.is_active && (
                      <Btn size="sm" variant="ghost" onClick={() => setActive(e.id)}>Aktif Yap</Btn>
                    )}
                    {e.bugece_url && (
                      <a href={e.bugece_url} target="_blank" rel="noopener noreferrer" style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                        background: "rgba(253,203,110,0.12)", color: "#fdcb6e",
                        border: "1px solid rgba(253,203,110,0.25)", textDecoration: "none",
                      }}>
                        bugece ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Yeni Etkinlik Oluştur">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="ETKİNLİK ADI" placeholder="Gece adı..." value={name} onChange={(e) => setName(e.target.value)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="TARİH" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Select label="EMOJİ" value={emoji} onChange={(e) => setEmoji(e.target.value)}>
              {["⚡","🎵","🎉","🍸","🔥","🌙","💎","🎶","✨","🖤"].map((em) => (
                <option key={em} value={em}>{em}</option>
              ))}
            </Select>
          </div>
          <Input label="MEKAN" placeholder="İstanbul, Turkey..." value={venue} onChange={(e) => setVenue(e.target.value)} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>İptal</Btn>
            <Btn variant="primary" onClick={createEvent} disabled={saving}>{saving ? "Kaydediliyor..." : "Oluştur"}</Btn>
          </div>
        </div>
      </Modal>
    </>
  );
}
