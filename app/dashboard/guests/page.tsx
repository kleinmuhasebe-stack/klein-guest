"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GuestsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [activeEvent, setActiveEvent] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", status: "pending", table_name: "", note: "" });
  const supabase = createClient();

  useEffect(() => {
    supabase.from("events").select("id,name,emoji").order("date", { ascending: false })
      .then(({ data }) => { setEvents(data || []); if (data && data[0]) { setActiveEvent(data[0].id); } });
  }, []);

  useEffect(() => {
    if (!activeEvent) return;
    supabase.from("guests").select("*").eq("event_id", activeEvent).order("created_at", { ascending: false })
      .then(({ data }) => setGuests(data || []));
  }, [activeEvent]);

  async function toggleCheckin(g: any) {
    await supabase.from("guests").update({ checked_in: !g.checked_in, checked_in_at: !g.checked_in ? new Date().toISOString() : null }).eq("id", g.id);
    setGuests(guests.map(x => x.id === g.id ? { ...x, checked_in: !g.checked_in } : x));
  }

  async function addGuest() {
    if (!form.first_name) return;
    const { data } = await supabase.from("guests").insert({ ...form, event_id: activeEvent }).select().single();
    if (data) { setGuests([data, ...guests]); setModal(false); setForm({ first_name: "", last_name: "", email: "", phone: "", status: "pending", table_name: "", note: "" }); }
  }

  async function deleteGuest(id: string) {
    if (!confirm("Sil?")) return;
    await supabase.from("guests").delete().eq("id", id);
    setGuests(guests.filter(g => g.id !== id));
  }

  const filtered = guests.filter(g => !search || `${g.first_name} ${g.last_name} ${g.email || ""} ${g.phone || ""}`.toLowerCase().includes(search.toLowerCase()));
  const checked = guests.filter(g => g.checked_in).length;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <select value={activeEvent} onChange={e => setActiveEvent(e.target.value)}
          style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#f0f0f8", cursor: "pointer" }}>
          {events.map(e => <option key={e.id} value={e.id}>{e.emoji} {e.name}</option>)}
        </select>
        <input type="text" placeholder="İsim, email, telefon ara..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#f0f0f8", outline: "none", flex: 1, minWidth: 200 }} />
        <button onClick={() => setModal(true)} style={{ background: "#6c5ce7", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>
          + Misafir Ekle
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Toplam", value: guests.length, color: "#a29bfe" },
          { label: "Check-in", value: checked, color: "#00b894" },
          { label: "VIP", value: guests.filter(g => g.status === "vip").length, color: "#fd79a8" },
          { label: "Bekliyor", value: guests.filter(g => !g.checked_in).length, color: "#fdcb6e" },
        ].map(s => (
          <div key={s.label} style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: s.color, fontFamily: "DM Mono, monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a3a" }}>
              {["MİSAFİR", "İLETİŞİM", "DURUM", "MASA", "İŞLEM"].map(h => (
                <th key={h} style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: "#5a5a72", padding: "11px 16px", textAlign: "left", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#5a5a72", fontSize: 13 }}>Misafir bulunamadı</td></tr>
            ) : filtered.map(g => (
              <tr key={g.id} style={{ borderBottom: "1px solid #2a2a3a" }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{g.first_name} {g.last_name}</td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#5a5a72" }}>{g.email || "—"}<br />{g.phone || ""}</td>
                <td style={{ padding: "12px 16px" }}>
                  {g.checked_in
                    ? <span style={{ background: "rgba(0,184,148,0.15)", color: "#00b894", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>✓ Giriş</span>
                    : g.status === "vip"
                      ? <span style={{ background: "rgba(253,121,168,0.15)", color: "#fd79a8", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>★ VIP</span>
                      : <span style={{ background: "rgba(253,203,110,0.15)", color: "#fdcb6e", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>◌ Bekliyor</span>
                  }
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#5a5a72" }}>{g.table_name || "—"}</td>
                <td style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
                  <button onClick={() => toggleCheckin(g)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer", border: g.checked_in ? "1px solid rgba(0,184,148,0.3)" : "1px solid #2a2a3a", background: g.checked_in ? "rgba(0,184,148,0.15)" : "#1a1a24", color: g.checked_in ? "#00b894" : "#9090a8", fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>
                    {g.checked_in ? "✓ Giriş" : "Check-in"}
                  </button>
                  <button onClick={() => deleteGuest(g.id)} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer", border: "1px solid #2a2a3a", background: "transparent", color: "#ff6b6b", fontFamily: "DM Sans, sans-serif" }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div onClick={() => setModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#111118", border: "1px solid #2a2a3a", borderRadius: 16, padding: 28, width: 480, maxWidth: "90vw" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Yeni Misafir Ekle</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              {[["first_name","AD"],["last_name","SOYAD"],["email","E-POSTA"],["phone","TELEFON"],["table_name","MASA"]].map(([k,l]) => (
                <div key={k}>
                  <label style={{ display: "block", fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 5 }}>{l}</label>
                  <input value={(form as any)[k]} onChange={e => setForm({...form, [k]: e.target.value})}
                    style={{ width: "100%", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#f0f0f8", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 5 }}>DURUM</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  style={{ width: "100%", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#f0f0f8", cursor: "pointer" }}>
                  <option value="pending">Bekliyor</option>
                  <option value="vip">VIP</option>
                  <option value="plus1">+1</option>
                  <option value="plus2">+2</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 5 }}>NOT</label>
              <input value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                style={{ width: "100%", background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, padding: "9px 12px", fontSize: 13, color: "#f0f0f8", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setModal(false)} style={{ padding: "9px 16px", background: "transparent", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 13, color: "#9090a8", cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>İptal</button>
              <button onClick={addGuest} style={{ padding: "9px 16px", background: "#6c5ce7", border: "none", borderRadius: 8, fontSize: 13, color: "#fff", fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans, sans-serif" }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
