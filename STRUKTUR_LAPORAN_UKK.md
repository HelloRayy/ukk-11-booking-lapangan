# STRUKTUR DOKUMEN PROPOSAL & LAPORAN UKK (RPL / PPLG)

Dokumen ini adalah template susunan resmi laporan / proposal UKK SMK untuk proyek **Aplikasi Booking Lapangan Badminton (Smash Arena)**.

---

## HALAMAN DEPAN (FORMALITAS)
1. **Halaman Judul / Cover**:
   - Judul Proyek: "Rancang Bangun Sistem Informasi Pemesanan Lapangan Badminton Berbasis Web (Smash Arena)"
   - Data Siswa: Nama Lengkap, NIS/NISN, Kompetensi Keahlian (PPLG / RPL).
   - Identitas Sekolah & Tahun Ajaran.
2. **Lembar Pengesahan**:
   - Tanda tangan Pembimbing Internal (Guru Sekolah) & Penguji Eksternal (DUDI / Industri).
3. **Kata Pengantar & Daftar Isi**:
   - Daftar Isi, Daftar Gambar, dan Daftar Tabel.

---

## BAB I: PENDAHULUAN
1. **Latar Belakang**:
   - Masalah pencatatan manual di buku nota (sering jadwal bentrok, antrean kasir, rekap pendapatan rawan selisih).
   - Solusi: Sistem booking terkomputerisasi dengan fitur real-time slot dan simulasi pembayaran QRIS/DP.
2. **Rumusan Masalah**:
   - Bagaimana merancang sistem booking yang mengunci jadwal otomatis agar tidak terjadi bentrok sewa?
   - Bagaimana mempermudah kasir dalam validasi pembayaran DP dan pelunasan di tempat?
3. **Batasan Masalah**:
   - Sistem berfokus pada reservasi lapangan badminton (Arena 1 - 3).
   - Aktor terdiri dari Pelanggan (pemesan online) dan Petugas/Kasir (kelola transaksi & data lapangan).
   - Simulasi pembayaran menggunakan QRIS statis dan opsi Down Payment (DP) 50%.
4. **Tujuan & Manfaat**:
   - Memenuhi syarat kelulusan Uji Kompetensi Keahlian (UKK).
   - Mempercepat proses reservasi dari 10 menit manual menjadi di bawah 1 menit via web.

---

## BAB II: PERENCANAAN PROYEK
1. **Analisis Kebutuhan Sistem**:
   - Perangkat Keras (Hardware): Laptop/PC Admin, Printer Thermal Struk Kasir.
   - Perangkat Lunak (Software): React 19, Tailwind CSS v4, Supabase (PostgreSQL), Vite.
2. **Jadwal Kerja (Time Schedule)**:
   - Rencana kerja 6 minggu (Analisis, Desain Basis Data, Coding Frontend, Modul Kasir, Pengujian, Penyusunan Laporan).
   - Mengacu pada berkas `RAB_DAN_TIME_SCHEDULE_UKK.md`.
3. **Rencana Anggaran Biaya (RAB)**:
   - Estimasi biaya investasi & operasional 1 tahun (Total Rp 4.200.000).
   - Rincian domain, cloud database, printer kasir, dan jasa pengerjaan.

---

## BAB III: PERANCANGAN SISTEM (SISTEM DESIGN)
1. **Alur Kerja Sistem (Flowchart)**:
   - Flowchart Alur Manual vs Alur Terkomputerisasi.
   - Mengacu pada berkas `FLOWCHART_UKK.md`.
2. **Diagram Konteks (Context Diagram)**:
   - Interaksi entitas Pelanggan, Kasir, dan Sistem Booking.
   - Mengacu pada berkas `CONTEXT_DIAGRAM_UKK.md`.
3. **Data Flow Diagram (DFD Level 1)**:
   - Aliran data proses reservasi, validasi pembayaran, dan mutasi jadwal.
   - Mengacu pada berkas `DFD_UKK.md`.
4. **Perancangan Basis Data (ERD & Spesifikasi Tabel)**:
   - Relasi tabel `PETUGAS`, `LAPANGAN`, dan `BOOKING` (1-to-many).
   - Spesifikasi tipe data atribut (UUID, VARCHAR, INT, TIMESTAMP, NUMERIC).
   - Mengacu pada berkas `ERD_UKK.md`.
5. **Perancangan Antarmuka (UI Mockup)**:
   - Wireframe halaman pemesanan (slot selector) dan panel meja kasir.

---

## BAB IV: IMPLEMENTASI & PENGUJIAN
1. **Implementasi Antarmuka & Kode Program**:
   - Struktur komponen frontend (`App.tsx`, `components/`).
   - Kode logika pengecekan bentrok jadwal dan kalkulasi DP 50%.
2. **Fitur CRUD & Master Data**:
   - Bukti fitur Create, Read, Update, Delete, dan Live Search.
3. **Hasil Pengujian Sistem (Black Box Testing)**:
   - Pengujian skenario booking normal, slot sudah terisi, pembayaran DP, dan pembatalan.

---

## BAB V: PENUTUP
1. **Kesimpulan**:
   - Sistem berhasil dibangun sesuai 14 kriteria kisi-kisi UKK.
   - Logika anti-bentrok dan kalkulasi transaksi berjalan 100% otomatis.
2. **Saran**:
   - Pengembangan modul payment gateway otomatis (Midtrans/Xendit) untuk fase berikutnya.

---

## LAMPIRAN
1. Lembar Hasil Pengujian (Black Box).
2. Cuplikan Kode Program Penting (Fungsi anti-bentrok & Supabase client).
3. Dokumentasi Foto Antarmuka Aplikasi.
