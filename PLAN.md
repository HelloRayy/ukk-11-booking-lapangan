# PLAN.md - Roadmap Optimasi & Perbaikan Landing Page Blanca

Dokumen ini berisi daftar rencana kerja (TODO) terstruktur untuk menyempurnakan Landing Page Blanca Badminton Arena dari segi performa, aset, SEO, dan aksesibilitas standar industri & penilaian UKK RPL/PPLG.

---

## Ringkasan Progres Optimasi

- [x] **Lokalisasi Gambar Lapangan**: Mengganti seluruh pemanggilan eksternal `images.unsplash.com` ke file lokal WebP (`/assets/courts/court-{1..4}.webp`) untuk mencegah lag dan error 404.
- [x] **Kompresi Aset Gambar Raksasa**: Mengonversi `tech-carbon`, `del-mar-front`, `coronado-front` dari PNG 10+ MB menjadi WebP hemat ~500 KB (hemat 90%+).
- [x] **Pola Titik GPU Pure CSS**: Mengganti file raster `background-dots.png` dengan `radial-gradient` CSS berkas 0 KB.
- [x] **Mesin Smooth Scroll Lenis**: Memasang `lenis` v1.3.26 untuk pengalaman scrolling inersia 60/120 fps yang mulus tanpa micro-stutter.

---

## 1. Prioritas Tinggi (Performance & Network Assets)

- [ ] **TODO-1.1: Kompresi Video Difference Gameplay (7.0 MB -> 1.5 MB)**
  - *Lokasi Berkas*: `public/assets/blanca/difference-video.webm` dan `difference-video.mp4`
  - *Masalah*: Berkas video sebesar 7 MB masih dimuat saat user scroll ke section Difference.
  - *Solusi*: Re-encode video menggunakan FFmpeg/VP9 dengan CRF 30 (target ukuran ~1.2–1.5 MB) tanpa mengurangi kualitas visual 720p.
  - *Dampak*: Memangkas bobot total halaman lebih dari 5 MB.

- [ ] **TODO-1.2: Code-Splitting Library Leaflet Maps (On-Demand)**
  - *Lokasi Berkas*: `src/components/blanca/locations/hooks/useBlancaLocations.ts`
  - *Masalah*: Leaflet (~150 KB JS + 40 KB CSS) saat ini di-import secara statis di bundle utama aplikasi, padahal peta ada di bagian bawah halaman.
  - *Solusi*: Gunakan dynamic import `const L = await import('leaflet')` di dalam observer `isMapVisible`.
  - *Dampak*: Mempercepat First Contentful Paint (FCP) dan Time to Interactive (TTI) landing page.

- [ ] **TODO-1.3: Preload Font Kritis di Head HTML**
  - *Lokasi Berkas*: `index.html`
  - *Masalah*: Font `AeonikPro-Regular.woff2` baru mulai diunduh setelah berkas CSS selesai diparsing oleh browser.
  - *Solusi*: Tambahkan `<link rel="preload" href="/fonts/AeonikPro-Regular.woff2" as="font" type="font/woff2" crossorigin>` di `<head>`.
  - *Dampak*: Menghilangkan pergeseran teks (Flash of Unstyled Text / FOUT) saat pertama kali halaman terbuka.

---

## 2. Prioritas Menengah (SEO, Mobile & Metadata UKK)

- [ ] **TODO-2.1: Lengkapi Meta Tags Open Graph & Twitter Cards**
  - *Lokasi Berkas*: `index.html`
  - *Masalah*: Link web belum menampilkan preview gambar banner, judul, dan deskripsi saat dibagikan ke WhatsApp / Telegram / media sosial.
  - *Solusi*: Pasang meta tags lengkap (`og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`).
  - *Dampak*: Tampilan profesional saat demo aplikasi di hadapan tim penguji UKK.

- [ ] **TODO-2.2: Warna Address Bar Mobile (Theme Color)**
  - *Lokasi Berkas*: `index.html`
  - *Solusi*: Tambahkan `<meta name="theme-color" content="#161616">` dan `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`.
  - *Dampak*: Di peramban smartphone (Chrome Android / Safari iOS), address bar atas otomatis berwarna hitam gelap menyatu dengan tema website.

- [ ] **TODO-2.3: Bersihkan Aset Lama yang Tidak Dipakai**
  - *Lokasi Berkas*: `public/assets/blanca/difference-people.png` (4.2 MB) & `public/assets/blanca/hero-video.mp4` (5.3 MB)
  - *Solusi*: Hapus aset mentah yang sudah digantikan oleh WebP dan WEBM mini.
  - *Dampak*: Ukuran repository Git lebih ramping dan hemat waktu clone/deploy.

---

## 3. Prioritas Estetika & Aksesibilitas (A11y & Polish)

- [ ] **TODO-3.1: Aksesibilitas Accordion FAQ (WAI-ARIA)**
  - *Lokasi Berkas*: `src/components/blanca/faq/components/FaqAccordionItem.tsx`
  - *Solusi*: Pasang atribut `aria-expanded={isOpen}`, `aria-controls={contentId}`, dan pastikan tombol bisa dibuka-tutup menggunakan tombol keyboard Enter/Space.
  - *Dampak*: Memenuhi poin penilaian aplikasi inklusif pada kisi-kisi UKK.

- [ ] **TODO-3.2: Focus Ring Estetis untuk Navigasi Keyboard**
  - *Lokasi Berkas*: Seluruh tombol CTA dan tautan navigasi di `HeaderNav.tsx` dan `BlancaCta.tsx`
  - *Solusi*: Pasang `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d953] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]`.
  - *Dampak*: Navigasi keyboard (Tab key) terlihat jelas dan elegan tanpa merusak tampilan klik mouse biasa.

- [ ] **TODO-3.3: Indikator Waktu Buka Operasional Real-time di Header**
  - *Lokasi Berkas*: `src/components/blanca/hero/components/DesktopNavLinks.tsx`
  - *Solusi*: Tampilkan badge dinamis kecil "Open Now (07:00 - 23:00)" berdasarkan jam lokal perangkat pengguna.
  - *Dampak*: Memberikan sentuhan interaktif yang mengesankan bagi calon penyewa.
