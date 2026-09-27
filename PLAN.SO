# PLAN.md - Roadmap Optimasi & Perbaikan Landing Page Blanca

Dokumen ini tersinkronisasi langsung dengan papan tugas **Plane.so**:
> Project: [Plane.so Issues](https://app.plane.so/raditya-rayhan/projects/76885022-0265-405d-8175-25f76a228bd9/issues/) (Workspace: `raditya-rayhan`)

---

## Ringkasan Progres yang Sudah Selesai (Status: Done)

- [x] **#5: Penyesuaian Assets**: Lokalisasi dan kompresi aset gambar raksasa (PNG 10+ MB -> WebP ~500 KB) serta aset lapangan lokal.
- [x] **#7: FAQ Belom sesuai**: Penyesuaian isi konten, tata letak, dan animasi FAQ accordion landing page.
- [x] **#10: Improve footer ui**: Perbaikan styling dan links footer landing page Blanca.
- [x] **#14: Improvisasi ui struk di right panel**: Perbaikan tampilan struk ringkasan pemesanan dan pelunasan di kasir.
- [x] **#24: Mobile /reservasi click overlay**: Perbaikan event bubbling dan overlay klik pada tampilan mobile reservasi.
- [x] **#26: Kompresi Video Difference Gameplay**: Re-encode video gameplay (VP9 & H.264) dari 7+ MB menjadi 1.4 MB hemat bandwidth.
- [x] **#27: Code-Splitting Library Leaflet Maps**: Dynamic import `await import('leaflet')` on-demand saat peta mendekati viewport.
- [x] **Pola Titik GPU Pure CSS**: Mengganti file raster `background-dots.png` dengan `radial-gradient` CSS berkas 0 KB.
- [x] **Mesin Smooth Scroll Lenis**: Memasang `lenis` v1.3.26 untuk pengalaman scrolling inersia 60/120 fps yang mulus tanpa micro-stutter.

---

## Daftar Issue Aktif di Plane.so (Status: Todo)

### 1. Prioritas Tinggi (High Priority)

- [ ] **#33: Penguasaan Alur Supabase Client & CRUD API (Persiapan Sidang UKK)**
  - *Target*: `src/lib/api.ts` & `src/types/database.ts`
  - *Rincian*: Bedah alur pemanggilan data Supabase, pemetaan relasi tabel `lapangan` dan `booking`, serta penanganan error untuk persiapan tanya-jawab penguji UKK.

- [ ] **#34: Bedah Algoritma Validasi Jadwal Anti-Bentrok (Logika Inti UKK)**
  - *Target*: `src/components/reservation/hooks/useSlotValidation.ts`
  - *Rincian*: Pelajari alur validasi `isSlotInRange()`, deteksi bentrok jadwal terisi, dan pemblokiran jam lampau (`isPastSlot`) saat pemesanan multi-jam.

- [ ] **#35: Latihan Simulasi Tanya-Jawab Arsitektur & Tech Stack UKK**
  - *Target*: Dokumen Panduan Wawancara Penguji UKK
  - *Rincian*: Latihan argumentasi teknis: alasan pemilihan React 19 + Vite, Tailwind CSS v4, serta database Supabase PostgreSQL vs database konvensional.

- [ ] **#36: Skenario Live Demo Uji Kompetensi Terstruktur**
  - *Target*: Alur Demonstrasi Sidang UKK
  - *Rincian*: Penyusunan alur demonstrasi 5 menit: Landing page -> Booking publik -> Verifikasi kasir -> Pelunasan QRIS/Tunai -> Pengelolaan master lapangan (CRUD).

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

- [ ] **#37: Validasi Ketat Nomor WhatsApp Indonesia**
  - *Target*: `src/components/reservation/components/inspector/BookingDetailsForm.tsx` & `CourtScheduleGrid.tsx`
  - *Rincian*: Tambahkan validasi regex format nomor telepon Indonesia (`08...` / `+62...`) dengan panjang 10-14 digit untuk mencegah data kotor.

- [ ] **#38: Cetak Struk Digital PDF Langsung di Kasir**
  - *Target*: `src/components/cashier/dashboard-01/BookingDetailSheet.tsx` & `BookingsTable.tsx`
  - *Rincian*: Pasang opsi cetak struk pembayaran resmi PDF langsung dari halaman kasir untuk transaksi yang telah lunas.

- [ ] **#39: Pembuatan Diagram UML & Skema Relasi Database (ERD)**
  - *Target*: Dokumen Arsitektur Sistem UKK
  - *Rincian*: Buat diagram visual Use Case, Activity Diagram alur booking, dan ERD relasi tabel `lapangan` ke `booking` untuk bahan presentasi penguji.

---

### 3. Prioritas Rendah (Low Priority)
- [ ] **#32: Pembersihan Aset Unused Lama di Repo**
  - *Target*: `public/assets/blanca/difference-people.png` (4.2 MB) & `hero-video.mp4` (5.3 MB)
  - *Rincian*: Hapus file aset mentah yang sudah tidak direferensikan untuk merampingkan ukuran repository Git.
