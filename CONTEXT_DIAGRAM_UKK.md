# Context Diagram (Diagram Konteks) - UKK RPL / PPLG
## Aplikasi Booking Lapangan Badminton

Dokumen ini memenuhi **Kriteria Penilaian No. 5 Pra-UKK**:
> *"Context Diagram dibuat"*

Diagram Konteks menggambarkan sistem secara global (*lingkup makro / black box*) sebagai satu proses tunggal untuk melihat aliran data masuk dan keluar antara sistem dengan entitas luar (aktor).

---

## 1. Tautan Langsung Mermaid Live Editor
Buka tautan berikut di peramban untuk melihat visualisasi diagram atau mengunduh dalam format SVG / PNG:

**[Buka Context Diagram di Mermaid Live Editor](https://mermaid.live/edit#pako:eNqFU9tum0AQ_ZURUiJbqkl6SW-qIq1jahEwUBarrUwfJmbtrIAlgqVRFOffO2CEcZqqPCzLzJ6Zc84sj8a6SITxGYxNVtyvb7HUEM1iBfScnIDlRXbEOLhLFsLI-hFZocfcffjneH8ssFzmzefMW_U7OIMlt8Jf-wMO43a4aldKBFa0nDPe5RbMY9dWuOrebX5hu7YDLLQ8Rqd6LkHoc4tDtGxauDCi7yuLczjveHCbR9ZiNDo3uy3Y3lc_XFDfLzfl2eXU9x3bm4PLAmJJJKdstrC9yPfG40EbFi45zFjEaAltWjxwrIPIZ5phMrncvTZhhhohELmoUKGCUwhkJm9pd435ruPzEvSNCU6hNrLMsZJNgRt8wJJw30KbHwM7UQ3qrQm22hTgCC3KSiQSCcGzQoOLd6i2qHbPGQ_Q75qeiWhbEFNb_S7kWgDXZZ3CTG6lxuwI_x9v2skORt02ueg9yWqFVevJtChSqbbwHbN0ItWxvAP0fQd1RFZk2EuCUYSl3FAdrlHX1fif9nzoCkRkZIUpGXtKc0juMYNQYDbRMhe7Ie0B9qPZGXElNKYD-g4NqOxRL1hCTnS3-K-in8xGRdHMNRAqIUG6NcRPa9JG_A5j60sYr8DIBd0LmTS_52NTNDb0Ld2xmAKxkWCZxkasnpqTWOuCP6g1ZYi9oEh9l6AWM4nbEvMu_PQHb_kmYg)**

---

## 2. Kode Diagram Mermaid (Salin ke FigJam / Mermaid Live)

```mermaid
flowchart TD
    %% ENTITAS LUAR (EXTERNAL ENTITY)
    PELANGGAN[PELANGGAN / USER]
    KASIR[KASIR / PETUGAS]
    MANAJER[MANAJER / PEMILIK ARENA]

    %% PROSES TUNGGAL (PROCESS 0)
    SISTEM((0. SISTEM INFORMASI<br/>BOOKING LAPANGAN BADMINTON))

    %% ARUS DATA DARI DAN KE PELANGGAN
    PELANGGAN -->|1. Data Pemesanan & Pilihan Jam| SISTEM
    PELANGGAN -->|2. Konfirmasi Pembayaran QRIS| SISTEM
    SISTEM -->|3. Info Ketersediaan Slot Lapangan| PELANGGAN
    SISTEM -->|4. Kode QRIS & Invoice Struk Digital| PELANGGAN

    %% ARUS DATA DARI DAN KE KASIR
    KASIR -->|5. Data Pelunasan & Booking Walk-in| SISTEM
    KASIR -->|6. Data Kelola Lapangan (Tarif & Status)| SISTEM
    SISTEM -->|7. Data Transaksi & Jadwal Real-time| KASIR
    SISTEM -->|8. Struk Cetak Pelunasan Kasir| KASIR

    %% ARUS DATA KE MANAJER
    SISTEM -->|9. Laporan Pendapatan & Okupansi Lapangan| MANAJER
```

---

## 3. Rincian Aliran Data Masuk & Keluar

### A. Entitas `PELANGGAN`
- **Data Masuk (Input)**:
  1. Data Pemesanan (Nama, No WhatsApp, Email, Tanggal, Lapangan, dan Pilihan Slot Jam).
  2. Konfirmasi Pembayaran QRIS (Verifikasi nominal DP 50% atau Lunas).
- **Data Keluar (Output)**:
  1. Info Ketersediaan Slot (Matriks visual jadwal kosong vs terisi).
  2. Kode QRIS dan Struk Digital / Invoice Booking resmi.

### B. Entitas `KASIR / PETUGAS`
- **Data Masuk (Input)**:
  1. Data Pelunasan Sisa DP (Verifikasi pelunasan tunai atau QRIS di meja kasir).
  2. Data Booking Walk-in (Pemesanan langsung di tempat tanpa lewat website).
  3. Data Kelola Lapangan (Penambahan lapangan, pembaruan tarif per jam, ubah status).
- **Data Keluar (Output)**:
  1. Data Transaksi Real-time (Daftar antrean pemesan untuk check-in).
  2. Struk Cetak Pelunasan Fisik (`window.print()`).

### C. Entitas `MANAJER / PEMILIK ARENA`
- **Data Keluar (Output)**:
  1. Laporan Pendapatan (Total uang masuk harian/bulanan dari DP dan pelunasan).
  2. Laporan Okupansi Lapangan (Tingkat keterisian lapangan dan jam-jam paling diminati).

---

## 4. Bocoran Pertanyaan Penguji UKK & Cara Jawabnya

### 1. "Kenapa di Diagram Konteks TIDAK ADA simbol Database (Data Store)?"
> **Jawaban Emas**: *"Karena Diagram Konteks adalah level tertinggi (Level 0 Global) yang memandang sistem sebagai satu kotak hitam (black box). Aturan baku rekayasa perangkat lunak menyatakan bahwa media penyimpanan basis data baru boleh digambarkan pada rincian Data Flow Diagram (DFD) Level 1 pak/bu."*

### 2. "Apa arti lingkaran angka 0 di tengah?"
> **Jawaban Emas**: *"Lingkaran 0 melambangkan Proses Utama sistem yang mencakup seluruh fungsi aplikasi secara terintegrasi."*

### 3. "Siapa saja entitas luar (terminator) di sistem kamu?"
> **Jawaban Emas**: *"Ada 3 entitas luar: Pelanggan (pemesan online), Kasir/Petugas (operasional sewa & pelunasan), dan Manajer/Pemilik (penerima laporan pendapatan)."*
