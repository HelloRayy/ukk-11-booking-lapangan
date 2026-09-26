# PLAN.md - Roadmap Optimasi & Perbaikan Landing Page Blanca

Dokumen ini tersinkronisasi langsung dengan papan tugas **Plane.so**:
> Project: [Plane.so Issues](https://app.plane.so/raditya-rayhan/projects/76885022-0265-405d-8175-25f76a228bd9/issues/) (Workspace: `raditya-rayhan`)

---

## Ringkasan Progres yang Sudah Selesai

- [x] **Lokalisasi Gambar Lapangan**: Mengganti seluruh pemanggilan eksternal `images.unsplash.com` ke file lokal WebP (`/assets/courts/court-{1..4}.webp`) untuk mencegah lag dan error 404.
- [x] **Kompresi Aset Gambar Raksasa**: Mengonversi `tech-carbon`, `del-mar-front`, `coronado-front` dari PNG 10+ MB menjadi WebP hemat ~500 KB (hemat 90%+).
- [x] **Pola Titik GPU Pure CSS**: Mengganti file raster `background-dots.png` dengan `radial-gradient` CSS berkas 0 KB.
- [x] **Mesin Smooth Scroll Lenis**: Memasang `lenis` v1.3.26 untuk pengalaman scrolling inersia 60/120 fps yang mulus tanpa micro-stutter.

---

## Daftar Issue Aktif di Plane.so (Status: Todo)

### 1. Prioritas Tinggi (High Priority)
- [ ] **#26: Kompresi Video Difference Gameplay (7.0 MB -> 1.5 MB)**
  - *Target*: `public/assets/blanca/difference-video.webm` & `.mp4`
  - *Rincian*: Re-encode video dengan CRF 30 / VP9 (target <1.5 MB) agar tidak membebani transfer network saat user scroll ke section Difference.

- [ ] **#27: Code-Splitting Library Leaflet Maps (On-Demand)**
  - *Target*: `src/components/blanca/locations/hooks/useBlancaLocations.ts`
  - *Rincian*: Ubah static import `leaflet` menjadi dynamic import `await import('leaflet')` ketika section peta terdeteksi di viewport agar initial bundle JS lebih ramping.

---

### 2. Prioritas Menengah (Medium Priority)
- [ ] **#28: Preload Font Kritis di Head HTML**
  - *Target*: `index.html`
  - *Rincian*: Tambahkan `<link rel="preload" href="/fonts/AeonikPro-Regular.woff2" as="font" type="font/woff2" crossorigin>` untuk mengeliminasi Flash of Unstyled Text (FOUT).

- [ ] **#29: Kelengkapan Meta Tags Open Graph & Mobile Theme Color**
  - *Target*: `index.html`
  - *Rincian*: Lengkapi meta tags Open Graph (`og:title`, `og:description`, `og:image`) untuk preview share WhatsApp/Instagram dan tambahkan `<meta name="theme-color" content="#161616">` agar status bar smartphone menyatu.

- [ ] **#30: Aksesibilitas Accordion FAQ (WAI-ARIA Standards)**
  - *Target*: `src/components/blanca/faq/components/FaqAccordionItem.tsx`
  - *Rincian*: Pasang atribut WAI-ARIA `aria-expanded` dan `aria-controls` pada accordion FAQ serta pastikan navigasi keyboard Enter/Space berfungsi penuh sesuai standar penilaian UKK.

---

### 3. Prioritas Rendah (Low Priority)
- [ ] **#31: Focus Ring Estetis untuk Navigasi Keyboard**
  - *Target*: Tombol CTA dan tautan navigasi di `HeaderNav.tsx` dan `BlancaCta.tsx`
  - *Rincian*: Tambahkan `focus-visible:ring-2 focus-visible:ring-[#f2d953]` agar navigasi keyboard (Tab key) terlihat jelas dan profesional saat disidang penguji UKK.

- [ ] **#32: Pembersihan Aset Unused Lama di Repo**
  - *Target*: `public/assets/blanca/difference-people.png` (4.2 MB) & `hero-video.mp4` (5.3 MB)
  - *Rincian*: Hapus file aset mentah yang sudah tidak direferensikan untuk merampingkan ukuran repository Git.
