# Panduan & Strategi Menjelaskan Backend ke Penguji UKK

Dokumen ini adalah sontekan (*cheat sheet*) resmi bagi siswa SMK untuk menjelaskan arsitektur **Backend dan Basis Data** proyek **Aplikasi Booking Lapangan Badminton** di hadapan penguji UKK RPL / PPLG.

---

## 1. Peta Arsitektur: "Frontend vs Backend di Aplikasi Ini"

Ketika penguji meminta Anda menunjukkan arsitektur aplikasi, tunjukkan alur 3 lapis (*3-Tier Modern Architecture*) berikut:

```
[ FRONTEND LAYER ]
- React 19 + TypeScript + Tailwind CSS v4
- Lokasi: src/components/ (Landing Page, Kalender Reservasi, Dashboard Kasir)
       │
       ▼  (Panggilan Fungsi Async / Data Flow)
[ BACKEND SERVICE LAYER ]
- Service Repository / Controller Layer
- Lokasi:
  ├── src/types/database.ts  -> Model Schema & Tipe Data
  ├── src/lib/supabase.ts    -> Inisialisasi Koneksi & Auth
  └── src/lib/api.ts         -> Query Builder, CRUD, Validasi Bentrok, Realtime WS
       │
       ▼  (HTTPS RESTful API & WebSocket Realtime)
[ DATABASE LAYER (CLOUD DATABASE) ]
- PostgreSQL di Supabase Cloud Platform
- Tabel Relasi:
  ├── lapangan  (Master Data: id, nama_lapangan, tarif_per_jam, status)
  └── bookings  (Transaksi: id, lapangan_id [FK], nama_penyewa, no_hp, jam_slots, total_bayar, status)
```

---

## 2. Tiga Berkas Kunci Backend yang Wajib Dibuka Saat Sidang

Jika penguji berkata: *"Coba buka kodingan backend kamu!"*, langsung buka **3 berkas berikut secara berurutan**:

### 1. `src/types/database.ts` (Model / Skema Data)
- **Fungsi**: Mendefinisikan struktur tabel database secara ketat (*strict typing*).
- **Poin yang Dijelaskan ke Penguji**:
  - Kolom `no_hp` bertipe `string` (bukan integer) agar angka `0` di awal nomor HP tidak terpotong.
  - Kolom `jam_slots` bertipe `string[]` (PostgreSQL text array) untuk menyimpan kumpulan jam yang dipesan sekaligus (contoh: `['10:00', '11:00']`).
  - Kolom `sisa_bayar` untuk mendukung skema pembayaran fleksibel (DP 50% vs Lunas).

### 2. `src/lib/supabase.ts` (Inisialisasi Client)
- **Fungsi**: Membuka koneksi aman ke server PostgreSQL menggunakan variabel lingkungan (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`).
- **Poin yang Dijelaskan ke Penguji**:
  - Kredensial rahasia tersimpan aman di berkas `.env` dan tidak di-*hardcode* di dalam kode program.

### 3. `src/lib/api.ts` (API Controller & Query Builder)
- **Fungsi**: Berisi 10 fungsi backend yang mengeksekusi perintah SQL secara modular.
- **Poin yang Dijelaskan ke Penguji**:
  - **Seksi 1 (CRUD Master Lapangan)**: `getLapangan`, `createLapangan`, `updateLapangan`, `deleteLapangan`.
  - **Seksi 2 (Algoritma Anti-Bentrok)**: `getBookedSlots()` yang memeriksa apakah slot jam sudah pernah diambil oleh orang lain.
  - **Seksi 3 (Operasional Kasir)**: `getAllBookings()` dengan relasi `JOIN` otomatis (`.select('*, lapangan(*)')`), serta `updateStatusBooking()` untuk aksi pelunasan kasir.
  - **Seksi 4 (Realtime WebSocket)**: `subscribeToBookings()` yang menggunakan fitur CDC (*Change Data Capture*) PostgreSQL untuk memperbarui layar kasir secara live tanpa reload.

---

## 3. Bocoran 5 Pertanyaan Penguji UKK & Cara Jawab Santai

### Q1: "Mana server backend kamu? Kok tidak pakai Express.js atau Laravel?"
> **Jawaban**:
> *"Proyek ini mengadopsi arsitektur modern **Backend-as-a-Service (BaaS)** berbasis cloud PostgreSQL (Supabase). Semua fungsi controller dan query database dipusatkan di berkas `src/lib/api.ts`. Keuntungannya, latensi lebih cepat, keamanan data dilindungi oleh enkripsi SSL dan PostgreSQL Row Level Security (RLS), serta menghemat biaya server fisik."*

---

### Q2: "Bagaimana cara sistem kamu mencegah dua orang booking jam yang sama (bentrok jadwal)?"
> **Jawaban**:
> *"Logikanya ada di fungsi `getBookedSlots()` pada berkas `src/lib/api.ts`. Sebelum user mengonfirmasi booking, sistem melakukan query ke tabel `bookings` untuk tanggal dan lapangan yang bersangkutan dengan mengecualikan status yang sudah 'Batal'. Jam yang sudah ada di database langsung dikunci (disabled) di antarmuka frontend sehingga tidak bisa diklik oleh user lain."*

---

### Q3: "Bagaimana relasi antar tabel di basis data kamu?"
> **Jawaban**:
> *"Relasinya adalah **One-to-Many** antara tabel `lapangan` dan tabel `bookings`. Kolom `bookings.lapangan_id` berperan sebagai **Foreign Key** yang merujuk pada `lapangan.id`. Satu lapangan bisa memiliki banyak riwayat transaksi booking. Kita juga menerapkan validasi di fungsi `deleteLapangan()` agar data lapangan tidak bisa dihapus sembarangan jika masih memiliki transaksi aktif."*

---

### Q4: "Bagaimana rumus perhitungan DP 50% dan sisa bayar di sistem ini?"
> **Jawaban**:
> *"Kalkulasinya otomatis dihitung saat reservasi:*
> - *`total_bayar = durasi_jam * tarif_per_jam`*
> - *Jika user memilih DP 50%: `nominal_dibayar = total_bayar * 0.5`, dan `sisa_bayar = total_bayar - nominal_dibayar`.*
> - *Ketika penyewa datang ke kasir untuk main, kasir menekan tombol 'Lunasi' yang memanggil fungsi `updateStatusBooking()`, mengubah status menjadi 'Lunas', dan mengubah `sisa_bayar` menjadi Rp 0."*

---

### Q5: "Apa tipe data kolom jam dan tanggal di database?"
> **Jawaban**:
> *"Untuk tanggal main menggunakan tipe `DATE` (format string ISO `YYYY-MM-DD`). Sedangkan untuk jam menggunakan PostgreSQL Text Array `string[]` agar dalam satu transaksi bisa langsung menampung sewa lebih dari 1 jam (misal 2 jam: `['10:00', '11:00']`) tanpa perlu membuat banyak baris transaksi duplikat."*

---

## 4. Rangkuman Struktur Folder Proyek yang Rapi

```
src/
├── lib/               -> [BACKEND] Koneksi Supabase & Fungsi Query Database (api.ts)
├── types/             -> [BACKEND] Tipe Data & Skema Database (database.ts)
├── constants/         -> [CONFIG]  Jam Operasional & Pengaturan Mode Dev Demo UKK
├── utils/             -> [HELPER]  Rumus Hitung Biaya & Format Rupiah
├── components/        -> [FRONTEND UI]
│   ├── blanca/        -> Landing page promosi arena badminton
│   ├── reservation/   -> Halaman kalender interaktif sisi penyewa
│   ├── cashier/       -> Dashboard tabel & kontrol operasional kasir
│   └── ui/            -> Primitif komponen UI (Button, Input, Checkbox)
```
