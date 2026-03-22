-- ============================================================
-- Klein Phönix — Bugece.co Event Seed Data
-- Supabase SQL Editor'da çalıştır
-- NOT: Önce bir kullanıcı oluşturup org_id'yi aşağıya yaz
-- ============================================================

-- 1. Önce hesabınla giriş yap ve dashboard'a gir
-- 2. Supabase SQL Editor'da şunu çalıştır:
--    SELECT id FROM organizations LIMIT 1;
-- 3. Çıkan org_id'yi aşağıdaki DO bloğuna yaz

DO $$
DECLARE
  v_org_id uuid;
  v_user_id uuid;
  v_event_id uuid;
BEGIN
  -- Org ve user bilgilerini al
  SELECT o.id, o.owner_id INTO v_org_id, v_user_id
  FROM organizations o LIMIT 1;

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Önce uygulamaya giriş yapıp organizasyon oluştur!';
  END IF;

  -- ── YAKLAŞAN ETKİNLİKLER ──────────────────────────────────

  INSERT INTO events (org_id, name, date, venue, emoji, description, bugece_url, is_active, created_by)
  VALUES
    (v_org_id, '4SHANBE SOORI AT KLEIN PHÖNIX', '2026-03-17', 'Klein Phönix, Maslak', '🌙',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/4shanbe-soori-at-klein-phonix-03-17-26--341895fe', false, v_user_id),

    (v_org_id, 'Hex Events: TH;EN + TMZ Brothers + Space Vamp b2b Mahbod', '2026-03-19', 'Klein Phönix, Maslak', '⚡',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/hex-events-then-tmz-brothers-space-vamp-b2b-mahbod-or-klein-phonix-03-19-26--36ad3d0c', false, v_user_id),

    (v_org_id, 'Denis Horvat + Aladag + Corn&Cotton', '2026-03-20', 'Klein Phönix, Maslak', '🎵',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/denis-horvat-aladag-cornandcotton-or-klein-phonix-03-20-26--248b069c', true, v_user_id),

    (v_org_id, 'THE FALLS PRESENTS: BRINA KNAUSS', '2026-03-21', 'Klein Phönix, Maslak', '🔥',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/the-falls-presents-brina-knauss-03-21-26--626bde2c', false, v_user_id),

    (v_org_id, 'LVBEL C5', '2026-03-25', 'Klein Phönix, Maslak', '🎶',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/lvbel-c5-or-klein-phonix-03-25-26--c4fdbd2e', false, v_user_id),

    (v_org_id, 'DJ FERE - Nowruz Party By VIP EVENT', '2026-03-26', 'Klein Phönix, Maslak', '🎉',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/dj-fere-nowruz-party-by-vip-event-03-26-26--b291279e', false, v_user_id),

    (v_org_id, 'album release party: FOR YOUR SOUL ONLY by Orkun Bozdemir', '2026-03-27', 'Klein Phönix, Maslak', '🖤',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/album-release-party-for-your-soul-only-by-orkun-bozdemir-or-klein-phonix-03-27-26--e7f04b1e', false, v_user_id),

    (v_org_id, 'Avangart Tabldot', '2026-03-28', 'Klein Phönix, Maslak', '✨',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/avangart-tabldot-or-klein-phonix-03-28-26--fe52173a', false, v_user_id),

    (v_org_id, 'Coeus + Atsou + Opposition', '2026-04-03', 'Klein Phönix, Maslak', '⚡',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/coeus-atsou-opposition-or-klein-phonix-04-03-26--db0cdb7d', false, v_user_id),

    (v_org_id, 'Josh Gigante + Cure-Shot + Koray T b2b Junior', '2026-04-04', 'Klein Phönix, Maslak', '🎵',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/josh-gigante-cure-shot-koray-t-b2b-junior-or-klein-phonix-04-04-26--d7d00feb', false, v_user_id),

    (v_org_id, 'Alive Presents: Desiree + Black Batu + Mertkan AKD b2b Can Balta', '2026-04-10', 'Klein Phönix, Maslak', '🍸',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/alive-presents-desiree-black-batu-mertkan-akd-b2b-can-balta-or-klein-phonix-04-10-26--52718478', false, v_user_id),

    (v_org_id, 'Kevin de Vries + Avis Vox + Krey + Alexandr Grecov + HZR', '2026-04-11', 'Klein Phönix, Maslak', '🔥',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/kevin-de-vries-avis-vox-krey-alexandr-grecov-hzr-or-klein-phonix-04-11-26--ee7caa0f', false, v_user_id),

    (v_org_id, 'MoBlack', '2026-04-17', 'Klein Phönix, Maslak', '🎶',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/moblack-or-klein-phonix-04-17-26--9c0eb3f9', false, v_user_id),

    (v_org_id, 'People Like Us', '2026-04-18', 'Klein Phönix, Maslak', '💎',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/people-like-us-or-klein-phonix-04-18-26--37b5e106', false, v_user_id),

    (v_org_id, 'Scenarios: Emanuel Satie + Maga + Sean Doron', '2026-05-02', 'Klein Phönix, Maslak', '⚡',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/scenarios-emanuel-satie-maga-sean-doron-or-klein-phonix-05-02-26--42b5b401', false, v_user_id),

    (v_org_id, 'Cincity + RBØR + Cure-Shot', '2026-05-08', 'Klein Phönix, Maslak', '🎵',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/cincity-rbor-cure-shot-or-klein-phonix-05-08-26--2e36b448', false, v_user_id),

    (v_org_id, 'Sueños de Esperanza Presents: Enzo Siffredi (One Man Show)', '2026-05-23', 'Klein Phönix, Maslak', '🌙',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/suenos-de-esperanza-presents-enzo-siffredi-one-man-show-05-23-26--ec5505af', false, v_user_id),

    (v_org_id, 'THE FALLS PRESENTS: ANNA', '2026-05-29', 'Klein Phönix, Maslak', '🔥',
     'Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/the-falls-presents-anna-05-29-26--a11383df', false, v_user_id);

  -- ── GEÇMİŞ ETKİNLİKLER ────────────────────────────────────

  INSERT INTO events (org_id, name, date, venue, emoji, description, bugece_url, is_active, created_by)
  VALUES
    (v_org_id, 'Betical + Doruk + Claudius + Calypsis', '2026-03-14', 'Klein Phönix, Maslak', '🎵',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/betical-doruk-claudius-calypsis-or-klein-phonix-03-14-26--41f251d3', false, v_user_id),

    (v_org_id, 'Maxi Meraki + Hemi + Emir S + Kantel', '2026-03-13', 'Klein Phönix, Maslak', '⚡',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/maxi-meraki-hemi-emir-s-kantel-or-klein-phonix-03-13-26--440e8ad6', false, v_user_id),

    (v_org_id, 'THE FALLS PRESENTS: GOOM GUM', '2026-03-07', 'Klein Phönix, Maslak', '🔥',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/the-falls-presents-goom-gum-03-07-26--1990777a', false, v_user_id),

    (v_org_id, 'Meltem Hayırlı', '2026-03-06', 'Klein Phönix, Maslak', '🎶',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/meltem-hayirli-or-klein-phonix-03-06-26--9d1da1ed', false, v_user_id),

    (v_org_id, 'Andrea Oliva + People Like Us + Bite The Dust', '2026-01-31', 'Klein Phönix, Maslak', '💎',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/andrea-oliva-people-like-us-bite-the-dust-or-klein-phonix-01-31-26--e317fe38', false, v_user_id),

    (v_org_id, 'Pan-Pot + Ferhat Albayrak + Pina Tesla', '2026-01-24', 'Klein Phönix, Maslak', '⚡',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/pan-pot-ferhat-albayrak-pina-tesla-or-klein-phonix-01-24-26--454189ff', false, v_user_id),

    (v_org_id, 'Space Motion + Franc Fala + Gaia Ekho', '2026-01-23', 'Klein Phönix, Maslak', '🌙',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/space-motion-franc-fala-gaia-ekho-or-klein-phonix-01-23-26--fef83d80', false, v_user_id),

    (v_org_id, 'Andre Soueid + Kadebostany + Aphrodisias + Tayfun & Mith', '2026-01-17', 'Klein Phönix, Maslak', '🎵',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/andre-soueid-kadebostany-aphrodisias-tayfun-and-mith-or-klein-phonix-01-17-26--d6310319', false, v_user_id),

    (v_org_id, 'Overdaze Presents: 8Kays + Murat Uncuoğlu B2B Alican + Faruk', '2026-01-16', 'Klein Phönix, Maslak', '🎉',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/overdaze-presents-8kays-murat-uncuoglu-b2b-alican-faruk-or-klein-phonix-01-16-26--0126b8f8', false, v_user_id),

    (v_org_id, 'Arena Fight Nights — AFN VOL.002', '2026-01-11', 'Klein Phönix, Maslak', '🔥',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/arena-fight-nights-afn-vol002-01-11-26--c833ef23', false, v_user_id),

    (v_org_id, 'NoNameLeft | Klein Phönix // EXTIMA', '2026-01-10', 'Klein Phönix, Maslak', '⚡',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/nonameleft-or-klein-phonix-extima-01-10-26--d28141b6', false, v_user_id),

    (v_org_id, 'Stasi Sanlin + 1TWO + TMZ Brothers', '2026-01-09', 'Klein Phönix, Maslak', '🎵',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/stasi-sanlin-1two-tmz-brothers-or-klein-phonix-01-09-26--764b2df6', false, v_user_id),

    (v_org_id, 'Glowal', '2026-01-03', 'Klein Phönix, Maslak', '💎',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/glowal-or-klein-phonix-01-03-26--b243a72e', false, v_user_id),

    (v_org_id, 'Pôngo | Klein Phönix // Hex Event', '2026-01-02', 'Klein Phönix, Maslak', '🌙',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/pongo-or-klein-phonix-hex-event-01-02-26--c44f257d', false, v_user_id),

    (v_org_id, 'ALIVE Presents: BASET // NEW YEAR''s Eve', '2025-12-31', 'Klein Phönix, Maslak', '🎉',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/alive-presents-baset-new-years-eve-12-31-25--878dbd6a', false, v_user_id),

    (v_org_id, 'Cristoph + Bussi + Farah | Focus & Rezonate', '2025-12-27', 'Klein Phönix, Maslak', '⚡',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/cristoph-bussi-farah-or-klein-phonix-focus-and-rezonate-12-27-25--3dc9a3bb', false, v_user_id),

    (v_org_id, 'Marino Canal + Monnarsh + Krey', '2025-12-26', 'Klein Phönix, Maslak', '🎵',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/marino-canal-monnarsh-krey-or-klein-phonix-12-26-25--29edb664', false, v_user_id),

    (v_org_id, 'Defence Promotions Fight Night', '2025-12-21', 'Klein Phönix, Maslak', '🔥',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/defence-promotions-fight-night-12-21-25--7817a350', false, v_user_id),

    (v_org_id, 'Undercatt + Manthem + Aryou Sepassi', '2025-12-20', 'Klein Phönix, Maslak', '💎',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/undercatt-manthem-aryou-sepassi-or-klein-phonix-12-20-25--b64a24f5', false, v_user_id),

    (v_org_id, 'Adam Beyer', '2025-12-19', 'Klein Phönix, Maslak', '⚡',
     'Geçmiş etkinlik — Bugece.co''dan aktarıldı', 'https://bugece.co/tr/event/adam-beyer-or-klein-phonix-12-19-25--80cd0517', false, v_user_id);

  RAISE NOTICE '✓ % etkinlik başarıyla eklendi!', 38;
END $$;
