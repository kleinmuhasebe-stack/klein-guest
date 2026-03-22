import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GuestStats, Guest, GuestStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(firstName: string, lastName: string) {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}

export function avatarColor(name: string): string {
  const colors = [
    "bg-violet-500/20 text-violet-400",
    "bg-emerald-500/20 text-emerald-400",
    "bg-pink-500/20 text-pink-400",
    "bg-amber-500/20 text-amber-400",
    "bg-cyan-500/20 text-cyan-400",
    "bg-rose-500/20 text-rose-400",
  ];
  let hash = 0;
  for (const c of name) hash += c.charCodeAt(0);
  return colors[hash % colors.length];
}

export function calcStats(guests: Guest[]): GuestStats {
  return {
    total: guests.length,
    checked_in: guests.filter((g) => g.checked_in).length,
    vip: guests.filter((g) => g.status === "vip").length,
    pending: guests.filter((g) => !g.checked_in).length,
    plus: guests.filter((g) => g.status === "plus1" || g.status === "plus2").length,
  };
}

export function statusLabel(status: GuestStatus): string {
  return { pending: "Bekliyor", vip: "VIP", plus1: "+1", plus2: "+2" }[status];
}

export function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(d: string | null): string {
  if (!d) return "Tarih yok";
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });
}

export function guestsToCSV(guests: Guest[]): string {
  const header = "Ad,Soyad,Email,Telefon,Durum,Masa,Not,Check-in,Giriş Saati";
  const rows = guests.map((g) =>
    [g.first_name, g.last_name, g.email, g.phone, g.status, g.table_name, g.note,
      g.checked_in ? "Evet" : "Hayır", formatTime(g.checked_in_at)].join(",")
  );
  return [header, ...rows].join("\n");
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
