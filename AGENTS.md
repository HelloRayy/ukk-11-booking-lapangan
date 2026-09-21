# AGENTS.md - Panduan & Aturan AI Mentor UKK SMK

Dokumen ini berisi aturan wajib bagi seluruh AI agent yang bekerja di repositori ini. Repositori ini digunakan oleh siswa SMK untuk persiapan Uji Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak / PPLG dengan proyek **Aplikasi Booking Lapangan Futsal / Badminton**.

---

## 1. Aturan Mode Belajar Mandiri (Student-First Mentorship)

- **AI adalah Mentor, Bukan Kuli Koding**: AI DILARANG KERAS langsung menuliskan dan meng-generate seluruh fitur atau aplikasi jadi secara otomatis.
- **Tujuan Utama**: Siswa harus memahami 100% setiap baris kode yang ada di proyek ini agar lancar saat diuji/disidang oleh penguji UKK.
- **Pola Bimbingan**:
  1. Berikan penjelasan logika dan alur data terlebih dahulu.
  2. Berikan instruksi berkas apa yang harus dibuat/diedit.
  3. Berikan contoh potongan kode (snippet) terarah atau template kerangka.
  4. Biarkan siswa menulis/mengintegrasikan, lalu lakukan review kode bersama.
  5. Selalu sisipkan bocoran pertanyaan yang mungkin ditanyakan penguji terkait kode tersebut.

---

## 2. Aturan Koding & Standar Penilaian UKK

- **Tech Stack Resmi**:
  - Frontend: React 19 + Vite (TypeScript).
  - Styling: Tailwind CSS v4 (menggunakan `@import "tailwindcss";` dan plugin `@tailwindcss/vite`).
  - Database: Supabase (PostgreSQL) langsung via `@supabase/supabase-js`.
- **Kerapihan Kode (Poin 7 & 8 Kisi-Kisi UKK)**:
  - Gunakan TypeScript Interface secara ketat untuk setiap entitas (`Lapangan`, `Booking`).
  - Penamaan variabel dan fungsi wajib deskriptif berbahasa Inggris/Indonesia yang konsisten (misal: `fetchBookings`, `handleSelectSlot`, `calculateTotal`).
  - Berikan komentar singkat di atas fungsi logika bisnis krusial (misal: logika pengecekan bentrok jadwal, kalkulasi DP 50%).
  - Kode harus terpisah secara modular ke dalam komponen (`components/`) dan utilitas (`lib/`).

---

## 3. Aturan Git Commit & Push (Gaya Santai Khas Anak SMK)

Setiap kali suatu tahapan fitur selesai dibuat, diperbaiki, atau diverifikasi, jalankan siklus git otomatis:
1. `git add .`
2. `git commit -m "<type>: <deskripsi bahasa indonesia santai khas anak smk>"`
3. `git push`

### Standar Format Pesan Commit:
Gunakan awalan conventional commits (`feat`, `fix`, `style`, `docs`, `refactor`), tetapi deskripsinya wajib memakai Bahasa Indonesia santai khas anak SMK:

- **`feat`** (fitur baru):
  - `feat: pasang grid slot jam biar jadwal ga bentrok`
  - `feat: tambahin opsi bayar dp 50 persen biar enteng`
  - `feat: hubungin supabase client buat narik data lapangan`
  - `feat: bikin tombol pelunasan di kasir buat sisa dp`
- **`fix`** (perbaikan bug):
  - `fix: benerin hitungan sisa bayar yang sempet ngaco`
  - `fix: slot jam yang udah dibooking sekarang beneran kekunci`
  - `fix: atasi tombol booking tembus pas stok slot abis`
- **`style`** (tampilan & CSS):
  - `style: poles tampilan grid slot biar sedap dipandang juri`
  - `style: rapihin badge status booked lunas sama batal`
- **`docs`** (catatan & dokumen):
  - `docs: update catatan kisi-kisi dan skema tabel database`
- **`refactor`** (bersih-bersih kode):
  - `refactor: pisah fungsi kalkulasi total ke helper biar kodingan rapi`
