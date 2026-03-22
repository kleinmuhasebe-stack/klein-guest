"use client";
import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar, Btn, Select } from "@/components/ui";
import toast from "react-hot-toast";

export default function ImportPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [preview, setPreview] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function loadEvents() {
    if (loaded) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: m } = await supabase.from("org_members").select("org_id").eq("user_id", user.id).single();
    if (!m) return;
    const { data: ev } = await supabase.from("events").select("id, name, emoji").eq("org_id", m.org_id).order("created_at", { ascending: false });
    setEvents(ev || []);
    if (ev && ev.length > 0) setSelectedEvent(ev[0].id);
    setLoaded(true);
  }

  function parseCSV(text: string) {
    const lines = text.trim().split("\n");
    const header = lines[0].split(",").map((h: string) => h.trim().toLowerCase().replace(/\s+/g, "_"));
    return lines.slice(1).map((line: string) => {
      const vals = line.split(",");
      const obj: Record<string, string> = {};
      header.forEach((h: string, i: number) => { obj[h] = (vals[i] || "").trim(); });
      return obj;
    }).filter((row: any) => row.ad || row.first_name);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      setPreview(rows.slice(0, 5));
      toast.success(`${rows.length} satır okundu`);
    };
    reader.readAsText(file, "utf-8");
  }

  async function importGuests() {
    if (!selectedEvent || !fileRef.current?.files?.[0]) return toast.error("Etkinlik ve dosya seç");
    setImporting(true);
    const file = fileRef.current.files[0];
    const text = await file.text();
    const rows = parseCSV(text);
    const guests = rows.map((r: any) => ({
      event_id: selectedEvent,
      first_name: r.ad || r.first_name || r.firstname || "—",
      last_name: r.soyad || r.last_name || r.lastname || "",
      email: r.email || r["e-posta"] || null,
      phone: r.telefon || r.phone || null,
      status: (r.durum || r.status || "pending").toLowerCase().includes("vip") ? "vip" : "pending",
      table_name: r.tablo || r.masa || r.table || null,
      note: r.not || r.note || null,
    }));
    const { error } = await supabase.from("guests").insert(guests);
    setImporting(false);
    if (error) return toast.error(error.message);
    toast.success(`${guests.length} misafir aktarıldı!`);
    setPreview([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function exportAll() {
    if (!selectedEvent) return;
    const { data } = await supabase.from("guests").select("*").eq("event_id", selectedEvent);
    if (!data) return;
    const header = "Ad,Soyad,Email,Telefon,Durum,Masa,Not,Check-in,Saat";
    const rows = data.map((g: any) => [g.first_name, g.last_name, g.email, g.phone, g.status, g.table_name, g.note, g.checked_in ? "Evet" : "Hayır", g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString("tr-TR") : ""].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "misafirler.csv"; a.click();
    toast.success("CSV indirildi");
  }

  const templateCSV = "Ad,Soyad,Email,Telefon,Durum,Masa,Not\nAhmet,Yılmaz,ahmet@mail.com,0555 000 00 00,VIP,Masa 1,Özel misafir";

  return (
    <div onClick={loadEvents}>
      <Topbar title="Import / Export" />
      <div style={{ padding: "24px 28px", maxWidth: 680 }}>
        <div style={{ marginBottom: 20 }}>
          <Select label="ETKİNLİK SEÇ" value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
            {events.map((e: any) => <option key={e.id} value={e.id}>{e.emoji} {e.name}</option>)}
          </Select>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>CSV Import</div>
          <label style={{ display: "block", border: "2px dashed var(--border2)", borderRadius: 10, padding: "28px 20px", textAlign: "center", cursor: "pointer", color: "var(--text3)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>↑</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>CSV dosyası seç</div>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
          </label>
          {preview.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>ÖNİZLEME</div>
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 12, fontSize: 12, fontFamily: "DM Mono, monospace", color: "var(--text2)" }}>
                {preview.map((r: any, i: number) => <div key={i} style={{ padding: "3px 0", borderBottom: "1px solid var(--border)" }}>{Object.values(r).slice(0, 5).join(" · ")}</div>)}
              </div>
              <div style={{ marginTop: 12 }}><Btn variant="primary" onClick={importGuests} disabled={importing}>{importing ? "Aktarılıyor..." : "Listeye Aktar"}</Btn></div>
            </div>
          )}
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Export</div>
          <Btn variant="secondary" onClick={exportAll}>↓ CSV İndir</Btn>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>CSV Format Şablonu</div>
          <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 14, fontFamily: "DM Mono, monospace", fontSize: 12, color: "var(--text3)", lineHeight: 1.9 }}>{templateCSV}</div>
          <div style={{ marginTop: 12 }}>
            <Btn size="sm" variant="ghost" onClick={() => { const blob = new Blob([templateCSV], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "sablon.csv"; a.click(); }}>Şablonu İndir</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
