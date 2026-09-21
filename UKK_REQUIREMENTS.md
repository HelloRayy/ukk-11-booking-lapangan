# Spesifikasi Standar Kebutuhan Proyek UKK (Rekayasa Perangkat Lunak / PPLG)

Dokumen ini adalah acuan baku kebutuhan proyek (PRD) yang disarikan langsung dari lembar Kisi-Kisi Pra-UKK dan Contoh Studi Kasus resmi. Proyek apa pun yang dirancang untuk UKK WAJIB memenuhi seluruh kriteria dalam dokumen ini agar memperoleh nilai maksimal.

---

## 1. 14 Kriteria Penilaian Baku (Kisi-Kisi Resmi Pra-UKK)

Setiap proyek UKK akan diuji berdasarkan 14 kriteria berikut:

1. **Flowchart Manual**: Diagram alur kerja sistem dibuat runut sesuai logika aplikasi.
2. **Time Schedule**: Jadwal perencanaan waktu pengerjaan proyek (tahap demi tahap).
3. **Perencanaan Biaya (RAB)**: Rincian anggaran biaya pengembangan, hosting, atau operasional.
4. **Entity Relationship Diagram (ERD)**: Diagram relasi basis data antar tabel lengkap dengan kardinalitas (1-to-many).
5. **Context Diagram**: Diagram level konteks yang memperlihatkan aliran data antara sistem dan entitas luar (aktor).
6. **Data Flow Diagram (DFD)**: DFD Level 0 dan Level 1 yang memetakan proses pengolahan data.
7. **Penggunaan Tipe Data**: Pemilihan tipe data yang tepat (misal: integer untuk nominal/stok, text/varchar untuk string, timestamp/date untuk tanggal).
8. **Standar Koding & Best Practices**: Penamaan variabel/fungsi/class deskriptif (camelCase / snake_case), penulisan komentar penjelasan, penggunaan indentasi rapi, dan kode tersusun modular.
9. **Desain UI & Front-End**: Antarmuka bersih, responsif, mudah dipahami pengguna, dan mengikuti standar industri.
10. **Tambah Data (Create)**: Mampu menyimpan data baru dari form ke dalam basis data.
11. **Edit Data (Update)**: Mampu memperbarui data yang ada di dalam basis data.
12. **Hapus Data (Delete)**: Mampu menghapus data dari basis data dengan aman.
13. **Cari Data (Search)**: Fitur pencarian data secara dinamis berdasarkan kata kunci.
14. **Tampil Data (Read)**: Menampilkan daftar data dalam format tabel yang rapi dan terstruktur.

---

## 2. Formula Arsitektur Wajib Proyek UKK

Proyek UKK apapun (baik Toko, Rental, Pengaduan, atau tema lain) harus memiliki 4 pilar arsitektur berikut:

### Pilar 1: Entitas Master Data (Tabel 1)
- Berisi katalog atau inventaris utama yang dikelola oleh Admin.
- Wajib memiliki atribut:
  - ID / Kode Unik (tidak boleh duplikat).
  - Nama Objek / Judul.
  - Kategori / Jenis.
  - Kuantitas Numerik (Stok, Kapasitas, atau Kuota) ATAU Status Ketersediaan (`Tersedia` / `Tidak Tersedia`).
  - Nilai Nominal (Harga, Tarif Sewa, atau Biaya Satuan).

### Pilar 2: Entitas Transaksi / Aktivitas (Tabel 2)
- Berisi pencatatan aksi yang dilakukan oleh Pelanggan / Pengguna / Siswa.
- Wajib berelasi dengan Tabel Master (Foreign Key).
- Wajib memiliki atribut:
  - ID Transaksi.
  - Identitas Aktor (Nama Pelanggan / NIS / Peminjam).
  - Referensi ke Master Data (Item yang dipilih).
  - Tanggal / Waktu Transaksi.
  - Nilai Kalkulasi (Subtotal / Total / Denda).
  - Status Transaksi (misal: `Selesai`, `Dipinjam`, `Lunas`).

### Pilar 3: Logika Mutasi State (Business Logic)
Aplikasi UKK tidak boleh hanya sekadar input teks pasif. Transaksi HARUS mengubah kondisi data di Tabel Master:
- Pada kasus stok: Ketika transaksi dibuat, stok di Tabel Master berkurang secara otomatis (`stok = stok - qty`).
- Pada kasus status: Ketika barang disewa/dipinjam, status barang di Tabel Master berubah menjadi `Disewa` / `Tidak Tersedia`. Ketika dikembalikan, status kembali menjadi `Tersedia`.

### Pilar 4: Kalkulasi Aritmatika Otomatis (Komputasi Numerik)
Sistem wajib melakukan perhitungan matematis otomatis tanpa input manual:
- Perhitungan Total Harga: `total = kuantitas * harga_satuan`.
- Perhitungan Denda / Penalti: `denda = hari_keterlambatan * tarif_denda_per_hari`.
- Perhitungan Biaya Servis / Anggaran: `total_anggaran = jumlah_unit_rusak * biaya_perbaikan`.

---

## 3. Syarat Validasi Input (Boundary & Error Handling)

Sistem wajib menolak input yang tidak valid dan menampilkan pesan kesalahan:
1. **Validasi Ketersediaan**: Jumlah yang diminta/dibeli tidak boleh melebihi stok yang tersedia di database.
2. **Validasi Keunikan**: Kode unik atau ID barang tidak boleh duplikat saat menambah data baru.
3. **Validasi Nilai Positif**: Nilai kuantitas, harga, dan durasi harus berupa angka bulat positif (> 0).
4. **Validasi Wajib Isi**: Kolom-kolom krusial form tidak boleh dikirim dalam kondisi kosong (*empty string*).

---

## 4. Kriteria Nilai Tambahan (Fitur Nilai Plus)

Fitur-fitur opsional yang memberikan nilai A/maksimal di mata penguji:
1. **Pencarian Real-Time (Live Search)**: Filter tabel langsung saat mengetik tanpa reload.
2. **Filter Kategori**: Dropdown filter untuk menyaring data berdasarkan kategori atau status.
3. **Pemisahan Peran (Role-Based Access)**: Tampilan khusus Admin (Kelola Master Data) vs Tampilan Pengguna (Form Transaksi).
4. **Fitur Cetak Laporan (Report / Export)**: Tombol cetak riwayat transaksi ke format PDF atau print preview peramban (`window.print()`).

---

## 5. Master Prompt untuk Brainstorming dengan AI Agent Lain

Salin blok teks di bawah ini ke AI agent lain saat meminta ide proyek:

```text
Bertindaklah sebagai Senior Software Architect dan Penguji UKK SMK (Rekayasa Perangkat Lunak / PPLG).

Saya membutuhkan ide proyek aplikasi web yang:
1. Sederhana dan mudah saya pahami seluruh baris kodenya (90% bobot penilaian adalah pemahaman koding saat sidang).
2. Memiliki arsitektur 2 tabel utama (1 Tabel Master Data + 1 Tabel Transaksi) dengan relasi 1-to-many.
3. Memiliki logika mutasi stok atau status ketersediaan otomatis.
4. Memiliki kalkulasi matematis otomatis (perkalian kuantitas x tarif, atau denda per hari).
5. Memiliki fitur CRUD lengkap (Tambah, Edit, Hapus, Tampil Tabel, dan Live Search).
6. Berikan rancangan:
   - Nama Proyek & Latar Belakang Masalah (1 paragraf)
   - Skema 2 Tabel Database beserta tipe datanya
   - Logika Bisnis & Rumus Kalkulasi Otomatisnya
   - Alur User vs Alur Admin
```
