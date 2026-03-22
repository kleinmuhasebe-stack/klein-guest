"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Topbar, Btn, Badge, Avatar, Modal, Input, Select, StatCard } from "@/components/ui";
import { Guest, Event, Role, GuestStatus } from "@/types";
import { calcStats, formatTime, guestsToCSV, downloadCSV, statusLabel } from "@/lib/utils";
import toast from "react-hot-toast";

interface Props {
  initialGuests: Guest[];
  events: Pick<Event, "id" | "name" | "date" | "emoji" | "is_active">[];
  activeEventId: string;
  orgId: string;
  role: Role;
}

type Filter = "all" | "checked" | "pending" | "vip" | "plus";

export default function GuestsClient({ initialGuests, events, activeEventId, orgId, role }: Props) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [modal, setModal] = useState(false);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [saving, setSaving] = useState(false);
  // form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<GuestStatus>("pending");
  const [tableName, setTableName] = useState("");
  const [note, setNote] = useState("");

  const supabase = createClient();
  const router = useRouter();
  const canManage = role === "owner" || role === "manager";
  const activeEvent = events.find((e) => e.id === activeEventId);

  // ── Realtime subscription ────────────────────────────────
  useEffect(() => {
    const channel = supabase.channel(`guests:${activeEventId}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "guests",
        filter: `event_id=eq.${activeEventId}`,
      }, (payload) => {
        if (payload.eventType === "INSERT") {
          setGuests((prev) => [payload.new as Guest, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          setGuests((prev) => prev.map((g) => g.id === (payload.new as Guest).id ? payload.new as Guest : g));
        } else if (payload.eventType === "DELETE") {
          setGuests((prev) => prev.filter((g) => g.id !== payload.old.id));
        }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeEventId]);

  // ── Filtering ────────────────────────────────────────────
  const filtered = guests.filter((g) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${g.first_name} ${g.last_name} ${g.email || ""} ${g.phone || ""}`.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" || (filter === "checked" && g.checked_in) ||
      (filter === "pending" && !g.checked_in) || (filter === "vip" && g.status === "vip") ||
      (filter === "plus" && (g.status === "plus1" || g.status === "plus2"));
    return matchSearch && matchFilter;
  });

  const stats = calcStats(guests);

  // ── Check-in ─────────────────────────────────────────────
  async function toggleCheckin(guest: Guest) {
    const checked_in = !guest.checked_in;
    const { error } = await supabase.from("guests").update({
      checked_in,
      checked_in_at: checked_in ? new Date().toISOString() : null,
    }).eq("id", guest.id);
    if (error) return toast.error(error.message);
    toast.success(checked_in ? `✓ ${guest.first_name} giriş yaptı` : "Check-in geri alındı");
  }

  // ── Add / Edit ───────────────────────────────────────────
  function openAdd() {
    setEditGuest(null);
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setStatus("pending"); setTableName(""); setNote("");
    setModal(true);
  }
  function openEdit(g: Guest) {
    setEditGuest(g);
    setFirstName(g.first_name); setLastName(g.last_name);
    setEmail(g.email || ""); setPhone(g.phone || "");
    setStatus(g.status); setTableName(g.table_name || ""); setNote(g.note || "");
    setModal(true);
  }
  async function saveGuest() {
    if (!firstName.trim()) return toast.error("Ad zorunlu");
    setSaving(true);
    const payload = {
      first_name: firstName, last_name: lastName, email: email || null,
      phone: phone || null, status, table_name: tableName || null, note: note || null,
    };
    if (editGuest) {
      const { error } = await supabase.from("guests").update(payload).eq("id", editGuest.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Misafir güncellendi");
    } else {
      const { error } = await supabase.from("guests").insert({ ...payload, event_id: activeEventId });
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Misafir eklendi");
    }
    setSaving(false); setModal(false);
  }
  async function deleteGuest(id: string) {
    if (!confirm("Bu misafiri silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Misafir silindi");
  }

  return (
    <>
      <Topbar title={activeEvent ? `${activeEvent.emoji} ${activeEvent.name}` : "Misafir Listesi"}>
        {/* Event selector */}
        <select
          value={activeEventId}
          onChange={(e) => router.push(`/dashboard/guests?event=${e.target.value}`)}
          style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", fontSize: 13, color: "var(--text)", cursor: "pointer" }}
        >
          {events.map((e) => <option key={e.id} value={e.id}>{e.emoji} {e.name}</option>)}
        </select>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 14 }}>⌕</span>
          <input
            type="text" placeholder="İsim, email, telefon..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px 8px 32px", fontSize: 13, color: "var(--text)", width: 260 }}
          />
        </div>
        <Btn size="sm" variant="ghost" onClick={() => downloadCSV(guestsToCSV(guests), `misafirler-${activeEvent?.name}.csv`)}>↓ Export</Btn>
        <Btn size="sm" variant="primary" onClick={openAdd}>+ Misafir Ekle</Btn>
      </Topbar>

      <div style={{ padding: "24px 28px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          <StatCard label="Toplam" value={stats.total} color="var(--accent2)" pct={100} />
          <StatCard label="Check-in" value={stats.checked_in} sub={`%${stats.total ? Math.round(stats.checked_in / stats.total * 100) : 0} giriş yaptı`} color="#00b894" pct={stats.total ? Math.round(stats.checked_in / stats.total * 100) : 0} />
          <StatCard label="VIP" value={stats.vip} color="#fd79a8" pct={stats.total ? Math.round(stats.vip / stats.total * 100) : 0} />
          <StatCard label="Bekliyor" value={stats.pending} color="#fdcb6e" pct={stats.total ? Math.round(stats.pending / stats.total * 100) : 0} />
        </div>

        {/* Table */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {/* Filter tabs */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Misafirler</span>
            <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "DM Mono, monospace" }}>{filtered.length} / {guests.length}</span>
            <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
              {(["all", "checked", "pending", "vip", "plus"] as Filter[]).map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", border: "none",
                  background: filter === f ? "var(--surface2)" : "transparent",
                  color: filter === f ? "var(--text)" : "var(--text3)",
                  fontFamily: "DM Sans, sans-serif",
                }}>
                  {{ all: "Tümü", checked: "Giriş", pending: "Bekliyor", vip: "VIP", plus: "+1/+2" }[f]}
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["", "MİSAFİR", "İLETİŞİM", "DURUM", "MASA / NOT", "GİRİŞ SAATİ", "İŞLEM"].map((h) => (
                  <th key={h} style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text3)", padding: "11px 16px", textAlign: "left", fontWeight: 500, borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: 48, color: "var(--text3)", fontSize: 13 }}>Misafir bulunamadı</td></tr>
              ) : filtered.map((g) => (
                <tr key={g.id} style={{ borderBottom: "1px solid var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "12px 16px", width: 40 }}>
                    <Avatar name={`${g.first_name} ${g.last_name}`} size={30} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{g.first_name} {g.last_name}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>{g.email || "—"}<br />{g.phone || ""}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge type={g.checked_in ? "checked" : g.status === "vip" ? "vip" : g.status === "plus1" || g.status === "plus2" ? "plus" : "pending"} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>{g.table_name || "—"}</div>
                    {g.note && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{g.note}</div>}
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "DM Mono, monospace", fontSize: 12, color: "var(--text3)" }}>
                    {formatTime(g.checked_in_at)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => toggleCheckin(g)} style={{
                        padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer",
                        border: `1px solid ${g.checked_in ? "rgba(0,184,148,0.3)" : "var(--border)"}`,
                        background: g.checked_in ? "rgba(0,184,148,0.15)" : "var(--surface2)",
                        color: g.checked_in ? "#00b894" : "var(--text3)", fontFamily: "DM Sans, sans-serif", fontWeight: 500,
                      }}>
                        {g.checked_in ? "✓ Giriş" : "Check-in"}
                      </button>
                      {canManage && <>
                        <Btn size="sm" variant="ghost" onClick={() => openEdit(g)}>✎</Btn>
                        <Btn size="sm" variant="danger" onClick={() => deleteGuest(g.id)}>✕</Btn>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editGuest ? "Misafiri Düzenle" : "Yeni Misafir Ekle"}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="AD" placeholder="Ad" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="SOYAD" placeholder="Soyad" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="E-POSTA" type="email" placeholder="email@..." value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="TELEFON" placeholder="0555..." value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="DURUM" value={status} onChange={(e) => setStatus(e.target.value as GuestStatus)}>
              <option value="pending">Bekliyor</option>
              <option value="vip">VIP</option>
              <option value="plus1">+1</option>
              <option value="plus2">+2</option>
            </Select>
            <Input label="MASA / ALAN" placeholder="Masa 5" value={tableName} onChange={(e) => setTableName(e.target.value)} />
          </div>
          <Input label="NOT" placeholder="Özel not..." value={note} onChange={(e) => setNote(e.target.value)} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>İptal</Btn>
            <Btn variant="primary" onClick={saveGuest} disabled={saving}>{saving ? "Kaydediliyor..." : "Kaydet"}</Btn>
          </div>
        </div>
      </Modal>
    </>
  );
}
