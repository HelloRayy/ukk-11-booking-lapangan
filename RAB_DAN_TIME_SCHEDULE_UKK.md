# Perencanaan Biaya (RAB) & Time Schedule - UKK RPL / PPLG
## Aplikasi Booking Lapangan Badminton (Blanca Badminton Arena)

Dokumen ini memenuhi **Kriteria Penilaian No. 2 dan No. 3 Pra-UKK**:
> - Kriteria No. 2: *"Time schedule dibuat"*
> - Kriteria No. 3: *"Perencanaan biaya dibuat"*

---

## 1. Time Schedule (Jadwal Kerja Pengerjaan Proyek)

Pengembangan sistem diselesaikan dalam rentang waktu **6 Minggu** menggunakan metodologi SDLC (*Software Development Life Cycle*):

| No | Tahapan Aktivitas | Minggu 1 | Minggu 2 | Minggu 3 | Minggu 4 | Minggu 5 | Minggu 6 |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **Analisis Kebutuhan & Perancangan** (Wawancara studi kasus, Flowchart, ERD, Context Diagram) | [x] | | | | | |
| 2 | **Setup Basis Data & Desain UI** (Supabase PostgreSQL, Vite React 19, Tailwind CSS v4) | | [x] | | | | |
| 3 | **Pengembangan Halaman Pemesan** (Grid slot lapangan, kalkulasi DP 50%, simulasi QRIS) | | | [x] | | | |
| 4 | **Pengembangan Halaman Kasir** (Tabel transaksi, pelunasan tunai/QRIS, matriks jadwal, cetak struk) | | | | [x] | | |
| 5 | **Pengujian Sistem & Perbaikan Bug** (Validasi bentrok jam, audit domain badminton, localStorage) | | | | | [x] | |
| 6 | **Penyusunan Berkas & Simulasi Sidang** (Dokumentasi UKK, gladi bersih tanya-jawab penguji) | | | | | | [x] |

---

## 2. Rencana Anggaran Biaya (RAB) Operasional Sistem

RAB ini menghitung estimasi biaya riil jika aplikasi dioperasikan secara profesional pada bisnis persewaan lapangan badminton selama **1 Tahun**:

### A. Infrastruktur Cloud & Perangkat Lunak (Software & Cloud Hosting)
- **Domain Resmi (`.id` / `.my.id` 1 Tahun)**: Rp 250.000
- **Hosting Frontend (Vercel / Cloudflare Pages)**: Gratis (Tier Gratis memadai untuk UKK & Operasional Awal)
- **Database Cloud (Supabase PostgreSQL 1 Tahun)**: Rp 0 s/d Rp 450.000 (Pakai Free Tier 500MB sudah cukup menampung ribuan transaksi)
- **Subtotal Software & Hosting**: **Rp 700.000**

### B. Perangkat Keras Kasir (Hardware Kasir Meja Depan)
- **Printer Kasir Thermal Bluetooth/USB (Lebar 58mm/80mm)**: Rp 350.000
- **Kertas Struk Thermal (10 Roll)**: Rp 50.000
- **Subtotal Hardware Kasir**: **Rp 400.000**

### C. Jasa Pengembangan & Pemeliharaan (Development & Maintenance)
- **Jasa Pembuatan Sistem (Developer UKK SMK)**: Rp 2.500.000
- **Pemeliharaan & Pembaruan Sistem (Maintenance 1 Tahun)**: Rp 600.000
- **Subtotal Jasa**: **Rp 3.100.000**

---

### Total Anggaran Biaya (RAB)
- **Total Keseluruhan**: **Rp 4.200.000** *(Empat Juta Dua Ratus Ribu Rupiah)*.

---

## 3. Bocoran Pertanyaan Penguji UKK & Cara Jawabnya

### 1. "Mengapa menggunakan database Supabase dan hosting cloud, apa keuntungannya bagi anggaran biaya?"
> **Jawaban Santai**: *"Karena Supabase dan cloud hosting menyediakan kuota gratis yang sangat besar untuk tahap awal pak/bu. Kita tidak perlu membeli server fisik seharga belasan juta rupiah di arena, sehingga biaya operasional jauh lebih hemat dan anggaran bisa ditekan."*

### 2. "Berapa lama waktu yang kamu butuhkan untuk mengerjakan proyek ini dari nol?"
> **Jawaban Santai**: *"Totalnya 6 minggu pak/bu, mulai dari perancangan diagram alur, perancangan database Supabase, pembuatan tampilan frontend dengan React dan Tailwind, pembuatan modul kasir, hingga pengujian dan perbaikan bug."*

### 3. "Jika aplikasi ini dipakai betulan di lapangan badminton, apa biaya rutin yang harus dibayar setiap tahun?"
> **Jawaban Santai**: *"Biaya rutin tahunan hanya perpanjangan domain web (sekitar Rp 250.000/tahun) dan biaya kertas struk thermal untuk printer kasir pak/bu."*
