# PANDUAN PROYEK & ATURAN AI AGENT (ANTI OVER-ENGINEERING)

> **PERINGATAN UNTUK SELURUH AI AGENT (Antigravity, Cursor, Copilot, Claude, ChatGPT, dll.)**:  
> Repositori ini digunakan untuk **Uji Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak / PPLG SMK**.  
> **DILARANG KERAS MENULIS KODE YANG OVER-ENGINEERED.**

---

## 1. Aturan Wajib Anti-Overengineering untuk AI Agent

1. **Gaya Kode Tingkat Siswa SMK Pemula**:
   - Jika menulis **PHP**: Wajib gaya prosedural sederhana dengan PDO/MySQLi biasa. **Dilarang keras memakai Class, OOP, Abstract Controller, Repository Pattern, atau Middleware**.
   - Jika menulis **React/TypeScript**: Gunakan React Hooks dasar (`useState`, `useEffect`). **Dilarang keras menambah library state management rumit (Redux, MobX) atau custom router berbelit-belit**.
   - Jika menulis **CSS/UI**: Gunakan Tailwind CSS standar. Jangan menambah library komponen eksternal yang berat.

2. **Batasan Panjang dan Struktur Kode**:
   - Tulis kode langsung pada berkas inti yang bersangkutan.
   - Jangan membuat folder abstraction berlebihan (hindari membuat 5 file hanya untuk 1 fungsi tombol).
   - Setiap file diusahakan di bawah 50 baris kode agar mudah dibaca dan dipahami siswa.

3. **Prinsip "Siswa Harus Paham Setiap Baris"**:
   - Siswa akan diuji secara lisan (sidang 15 menit) oleh asesor BNSP.
   - Jika Anda (AI) menulis fungsi atau istilah asing yang tidak dimengerti siswa, siswa bisa dinyatakan **Belum Kompeten**.
   - Tuliskan kode yang to-the-point: tangkap input -> simpan ke database -> tampilkan ke tabel.

4. **Fokus Hanya pada 4 Pilar Penilaian UKK (FR.IA.04A)**:
   - **Create**: Form input dengan validasi atribut HTML `required`.
   - **Read**: Tabel penampil data menggunakan query `JOIN` antar 2 tabel.
   - **Update**: Tombol pengubah status transaksi.
   - **Delete**: Tombol penghapus data dengan konfirmasi sederhana.

---

## 2. Struktur Data Standar (Pola 2 Tabel)

Setiap kasus UKK hanya menggunakan **2 Tabel**:
- **Tabel 1 (Master)**: Data barang/jasa tetap (`id`, `nama`, `tarif/harga`).
- **Tabel 2 (Transaksi)**: Aktivitas pelanggan (`id`, `master_id` Foreign Key, `nama_pelanggan`, `tanggal`, `status`).

---

## 3. Konfigurasi Lingkungan (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

---

## 4. Cara Menjalankan Proyek

- **React / Vite**:
  ```bash
  npm run dev
  ```
- **PHP Native**:
  ```bash
  php -S localhost:8080
  ```
