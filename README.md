# Guestio — Misafir Yönetim Sistemi

Attendium benzeri, **Next.js 14 + Supabase** üzerine kurulu tam özellikli misafir yönetim uygulaması.

## Özellikler

- **Kullanıcı Girişi** — e-posta/şifre ile kayıt ve giriş
- **Çoklu Etkinlik** — sınırsız etkinlik oluştur ve yönet
- **Misafir Listesi** — ekle, düzenle, sil, filtrele, ara
- **Gerçek Zamanlı Check-in** — Supabase Realtime ile çoklu cihaz senkronizasyonu
- **QR Kod** — misafirler QR ile kendi check-in'lerini yapabilir
- **Ekip Yönetimi** — Sahip / Yönetici / Check-in rolleri
- **Import / Export** — CSV ile toplu misafir aktarımı ve indirme
- **İstatistikler** — saatlik dağılım, etkinlik bazlı raporlar

---

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd guestio
npm install
```

### 2. Supabase Projesi Oluştur

1. [supabase.com](https://supabase.com) → New Project
2. **Project Settings → API** sayfasından şunları al:
   - `Project URL`
   - `anon / public key`

### 3. .env.local Dosyasını Düzenle

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJE_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY_BURAYA
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Veritabanını Kur

Supabase Dashboard → **SQL Editor** → Yeni sorgu:

```sql
-- supabase/migrations/001_init.sql dosyasının tamamını yapıştır ve çalıştır
```

### 5. Realtime'ı Aktif Et

Supabase Dashboard → **Database → Replication**:
- `guests` tablosunu Publication'a ekle (zaten SQL'de yapıldı)

### 6. Uygulamayı Başlat

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` aç.

---

## Deploy (Vercel)

```bash
npm install -g vercel
vercel
```

Environment variables'ları Vercel Dashboard'a da ekle.

`NEXT_PUBLIC_APP_URL`'i production URL'in ile güncelle.

---

## Proje Yapısı

```
guestio/
├── app/
│   ├── auth/login/          # Giriş / Kayıt sayfası
│   ├── dashboard/
│   │   ├── page.tsx         # Etkinlikler
│   │   ├── guests/          # Misafir listesi (realtime)
│   │   ├── checkin/         # Hızlı check-in + QR
│   │   ├── stats/           # İstatistikler
│   │   ├── team/            # Ekip yönetimi
│   │   └── import/          # CSV import/export
│   └── checkin/[eventId]/   # Misafire özel QR check-in sayfası (auth yok)
├── components/
│   ├── ui/                  # Paylaşılan bileşenler
│   ├── guests/              # Misafir yönetim bileşeni
│   ├── events/              # Etkinlik bileşeni
│   └── checkin/             # Check-in bileşeni
├── lib/
│   ├── supabase/client.ts   # Browser Supabase client
│   ├── supabase/server.ts   # Server Supabase client
│   └── utils.ts             # Yardımcı fonksiyonlar
├── types/index.ts           # TypeScript tipleri
├── middleware.ts             # Auth yönlendirme
└── supabase/migrations/     # Veritabanı şeması
```

---

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Realtime | Supabase Realtime |
| Deploy | Vercel |
