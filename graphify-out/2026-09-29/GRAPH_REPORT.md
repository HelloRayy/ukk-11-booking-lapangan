# Graph Report - ukk-11  (2026-09-29)

## Corpus Check
- 121 files · ~653,809 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .woff2 4, .css 3, .avif 2)

## Summary
- 589 nodes · 1021 edges · 32 communities (27 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49141712`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CourtScheduleGrid.tsx
- BlancaDifference.tsx
- react
- CashierDatePicker.tsx
- dependencies
- BookingDetailSheet.tsx
- ref_ui_dialog
- useBlancaLocations.ts
- compilerOptions
- package.json
- components.json
- compilerOptions
- @playwright/test
- BlancaTechnology.tsx
- costCalculation.ts
- BlancaFaq.tsx
- AGENTS.md - Panduan & Aturan AI Mentor UKK SMK
- scheduleConfig.ts
- Data Flow Diagram (DFD) Lengkap - UKK RPL / PPLG
- api.ts
- tsconfig.json
- 2. Rencana Anggaran Biaya (RAB) Operasional Sistem
- Entity Relationship Diagram (ERD) - UKK RPL / PPLG
- Spesifikasi Standar Kebutuhan Proyek UKK (Rekayasa Perangkat Lunak / PPLG)
- Context Diagram (Diagram Konteks) Resmi UKK
- 1. Flowchart Sistem Manual (Sistem Berjalan Sebelum Komputerisasi)
- STRUKTUR DOKUMEN PROPOSAL & LAPORAN UKK (RPL / PPLG)
- Daftar Issue Aktif di Plane.so (Status: Todo)
- PANDUAN PROYEK & ATURAN AI AGENT (ANTI OVER-ENGINEERING)
- rules/graphify.md
- workflows/graphify.md
- 7. Bocoran 10 Pertanyaan Penguji UKK & Cara Jawab Taktis

## God Nodes (most connected - your core abstractions)
1. `react` - 33 edges
2. `compilerOptions` - 18 edges
3. `BookingItem` - 17 edges
4. `SlotRangeSelection` - 15 edges
5. `getTodayISODate()` - 15 edges
6. `compilerOptions` - 15 edges
7. `Lapangan` - 12 edges
8. `Booking` - 12 edges
9. `lucide-react` - 11 edges
10. `Court` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Q3: "Bagaimana relasi antar tabel di basis data kamu?"` --references--> `deleteLapangan()`  [INFERRED]
  PANDUAN_PENJELASAN_BACKEND_UKK.md → src/lib/api.ts
- `Bagian 1: CRUD Master Lapangan` --references--> `getLapangan()`  [INFERRED]
  PANDUAN_LENGKAP_BELAJAR_CODEBASE_UKK.md → src/lib/api.ts
- `Q10: "Jika ada transaksi yang dibatalkan, apakah slot jamnya bisa dipesan orang lain?"` --references--> `getBookedSlots()`  [INFERRED]
  PANDUAN_LENGKAP_BELAJAR_CODEBASE_UKK.md → src/lib/api.ts
- `Q2: "Bagaimana cara sistem kamu mencegah dua orang booking lapangan dan jam yang sama (bentrok jadwal)?"` --references--> `getBookedSlots()`  [INFERRED]
  PANDUAN_LENGKAP_BELAJAR_CODEBASE_UKK.md → src/lib/api.ts
- `3. `src/lib/api.ts` (API Controller & Query Builder)` --references--> `getBookedSlots()`  [INFERRED]
  PANDUAN_PENJELASAN_BACKEND_UKK.md → src/lib/api.ts

## Import Cycles
- None detected.

## Communities (32 total, 5 thin omitted)

### Community 0 - "CourtScheduleGrid.tsx"
Cohesion: 0.09
Nodes (46): CourtScheduleGrid(), BookingReceiptView(), BookingReceiptViewProps, ActiveSelectionCard(), ActiveSelectionCardProps, BookedSlotCard(), BookedSlotCardProps, FloatingToast() (+38 more)

### Community 1 - "BlancaDifference.tsx"
Cohesion: 0.21
Nodes (8): BlancaDifference(), DifferenceCommunityStory(), DifferenceFeatures(), DifferenceHeading(), DifferenceVideoCard(), COMMUNITY_STORY, COURT_FEATURES, CourtFeature

### Community 2 - "react"
Cohesion: 0.05
Nodes (44): gsap, lenis, react, react-dom, ref_ui_checkbox, src_assets_hero_video, src_components_blanca_blanca, BlancaCta() (+36 more)

### Community 3 - "CashierDatePicker.tsx"
Cohesion: 0.15
Nodes (9): CashierDatePicker(), CashierDatePickerProps, DAY_NAMES, MONTH_NAMES, DAY_NAMES, MONTH_NAMES, ReservationNavbar(), ReservationNavbarProps (+1 more)

### Community 4 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, clsx, gsap, leaflet, lenis, lucide-react, @radix-ui/react-checkbox, react (+7 more)

### Community 5 - "BookingDetailSheet.tsx"
Cohesion: 0.29
Nodes (6): clsx, tailwind-merge, BookingDetailSheet(), BookingDetailSheetProps, formatDateDDMMYYYY(), formatSlotRange()

### Community 8 - "useBlancaLocations.ts"
Cohesion: 0.15
Nodes (15): leaflet, BlancaLocations(), BlancaContactCard(), BlancaContactCardProps, BlancaContactPanel(), BlancaContactPanelProps, BlancaLocationHeader(), BlancaLocationMap() (+7 more)

### Community 9 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 10 - "package.json"
Cohesion: 0.05
Nodes (44): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @playwright/test, pngjs (+36 more)

### Community 11 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+8 more)

### Community 12 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 13 - "@playwright/test"
Cohesion: 0.09
Nodes (16): ref_child_process, ref_fs, ref_path, @playwright/test, pngjs, diffImg, height, localImg (+8 more)

### Community 14 - "BlancaTechnology.tsx"
Cohesion: 0.23
Nodes (9): BlancaTechnology(), TechnologyHeading(), TechnologySlideDetails(), TechnologySlideDetailsProps, TechnologySlideMedia(), TechnologySlideMediaProps, TECHNOLOGY_SLIDES, useTechnologySlider() (+1 more)

### Community 17 - "BlancaFaq.tsx"
Cohesion: 0.27
Nodes (7): BlancaFaq(), FaqAccordionItem(), FaqAccordionItemProps, FaqHeading(), FAQ_DATA, useFaqAccordion(), FaqItem

### Community 18 - "AGENTS.md - Panduan & Aturan AI Mentor UKK SMK"
Cohesion: 0.29
Nodes (6): 1. Aturan Mode Belajar Mandiri (Student-First Mentorship), 3. Aturan Navigasi Codebase Cepat (Wajib Menggunakan Graphify), 4. Aturan Pengujian & Otomasi Browser (Wajib agent-browser Headless), 5. Aturan Git Commit & Push (Gaya Santai Khas Anak SMK), AGENTS.md - Panduan & Aturan AI Mentor UKK SMK, Standar Format Pesan Commit:

### Community 19 - "scheduleConfig.ts"
Cohesion: 0.25
Nodes (8): BASE_OPERATIONAL_HOUR, DEFAULT_SLOT_HEIGHT, DAFTAR_JAM, isDevMode, jamSimulasi, menitSimulasi, OPERATIONAL_HOURS, TIME_SLOTS

### Community 20 - "Data Flow Diagram (DFD) Lengkap - UKK RPL / PPLG"
Cohesion: 0.17
Nodes (11): 1. DFD Level 0 (Diagram Konteks), 2. DFD Level 1 (Dekomposisi Proses Inti), 3. DFD Level 2: Proses 2.0 (Transaksi Booking), 4. DFD Level 2: Proses 3.0 (Pelunasan & Laporan Kasir), 5. Kamus Data (Data Dictionary) Resmi, 6. Cara Ekspor Diagram ke Figma & Laporan Word, 7. Bocoran Pertanyaan Penguji UKK Terkait DFD, A. Arus Data (Data Flows) (+3 more)

### Community 21 - "api.ts"
Cohesion: 0.09
Nodes (39): 2. Aturan Koding & Standar Penilaian UKK, 4. Bedah Backend Controller: `src/lib/api.ts`, Bagian 1: CRUD Master Lapangan, Bagian 2: Transaksi Booking & Cek Bentrok Jadwal, Bagian 3: Operasional Kasir & Pelunasan, Q6: "Bagaimana rumus perhitungan DP dan pelunasan di aplikasi ini?", 3. `src/lib/api.ts` (API Controller & Query Builder), Q4: "Bagaimana rumus perhitungan DP 50% dan sisa bayar di sistem ini?" (+31 more)

### Community 25 - "2. Rencana Anggaran Biaya (RAB) Operasional Sistem"
Cohesion: 0.15
Nodes (12): 1. "Mengapa menggunakan database Supabase dan hosting cloud, apa keuntungannya bagi anggaran biaya?", 1. Time Schedule (Jadwal Kerja Pengerjaan Proyek), 2. "Berapa lama waktu yang kamu butuhkan untuk mengerjakan proyek ini dari nol?", 2. Rencana Anggaran Biaya (RAB) Operasional Sistem, 3. Bocoran Pertanyaan Penguji UKK & Cara Jawabnya, 3. "Jika aplikasi ini dipakai betulan di lapangan badminton, apa biaya rutin yang harus dibayar setiap tahun?", A. Infrastruktur Cloud & Perangkat Lunak (Software & Cloud Hosting), Aplikasi Booking Lapangan Badminton (Blanca Badminton Arena) (+4 more)

### Community 27 - "Entity Relationship Diagram (ERD) - UKK RPL / PPLG"
Cohesion: 0.14
Nodes (13): 1. Diagram PDM / ERD Resmi (Relasi 1-to-Many), 1. "Mengapa menggunakan 2 tabel dan tidak dijadikan 1 tabel saja?", 2. "Apa itu Primary Key dan Foreign Key di diagram kamu?", 2. Penjelasan Relasi Basis Data untuk Sidang UKK, 3. Bocoran Pertanyaan Penguji UKK Terkait ERD, 3. "Mengapa tidak ada tabel petugas/users?", 4. Perbedaan ERD (Konseptual) vs PDM (Fisik), 5. Perbandingan Relasi: 2 Tabel (Riil) vs 3 Tabel (Teori Sekolah) (+5 more)

### Community 28 - "Spesifikasi Standar Kebutuhan Proyek UKK (Rekayasa Perangkat Lunak / PPLG)"
Cohesion: 0.18
Nodes (10): 1. 14 Kriteria Penilaian Baku (Kisi-Kisi Resmi Pra-UKK), 2. Formula Arsitektur Wajib Proyek UKK, 3. Syarat Validasi Input (Boundary & Error Handling), 4. Kriteria Nilai Tambahan (Fitur Nilai Plus), 5. Master Prompt untuk Brainstorming dengan AI Agent Lain, Pilar 1: Entitas Master Data (Tabel 1), Pilar 2: Entitas Transaksi / Aktivitas (Tabel 2), Pilar 3: Logika Mutasi State (Business Logic) (+2 more)

### Community 29 - "Context Diagram (Diagram Konteks) Resmi UKK"
Cohesion: 0.20
Nodes (9): 1. Tautan Langsung Mermaid Live Editor, 2. Kode Diagram Mermaid (Persis Gambar Pengguna), 3. Rincian 9 Aliran Data Baku, 4. Tips Jawaban Sidang jika Penguji Menanyakan "Manager", A. Pelanggan (Pengguna Web), Aplikasi Booking Lapangan Badminton, B. Kasir / Petugas (Operasional Arena), C. Manager (Pimpinan / Pemilik) (+1 more)

### Community 30 - "1. Flowchart Sistem Manual (Sistem Berjalan Sebelum Komputerisasi)"
Cohesion: 0.20
Nodes (9): 1. Flowchart Sistem Manual (Sistem Berjalan Sebelum Komputerisasi), 2. Flowchart Sistem Terkomputerisasi (Aplikasi Web Usulan), Dokumentasi Flowchart Manual & Flowchart Sistem (UKK RPL / PPLG), Kelemahan Sistem Manual untuk Jawaban Sidang:, Keunggulan Sistem Komputerisasi untuk Jawaban Sidang:, Kode Diagram Mermaid, Kode Diagram Mermaid, Tautan Langsung Mermaid Live (Tanpa Kotakan) (+1 more)

### Community 31 - "STRUKTUR DOKUMEN PROPOSAL & LAPORAN UKK (RPL / PPLG)"
Cohesion: 0.22
Nodes (8): BAB I: PENDAHULUAN, BAB II: PERENCANAAN PROYEK, BAB III: PERANCANGAN SISTEM (SISTEM DESIGN), BAB IV: IMPLEMENTASI & PENGUJIAN, BAB V: PENUTUP, HALAMAN DEPAN (FORMALITAS), LAMPIRAN, STRUKTUR DOKUMEN PROPOSAL & LAPORAN UKK (RPL / PPLG)

### Community 32 - "Daftar Issue Aktif di Plane.so (Status: Todo)"
Cohesion: 0.29
Nodes (6): 1. Prioritas Tinggi (High Priority), 2. Prioritas Menengah (Medium Priority), 3. Prioritas Rendah (Low Priority), Daftar Issue Aktif di Plane.so (Status: Todo), PLAN.md - Roadmap Optimasi & Perbaikan Landing Page Blanca, Ringkasan Progres yang Sudah Selesai (Status: Done)

### Community 34 - "PANDUAN PROYEK & ATURAN AI AGENT (ANTI OVER-ENGINEERING)"
Cohesion: 0.33
Nodes (5): 1. Aturan Wajib Anti-Overengineering untuk AI Agent, 2. Struktur Data Standar (Pola 2 Tabel), 3. Konfigurasi Lingkungan (.env), 4. Cara Menjalankan Proyek, PANDUAN PROYEK & ATURAN AI AGENT (ANTI OVER-ENGINEERING)

### Community 38 - "7. Bocoran 10 Pertanyaan Penguji UKK & Cara Jawab Taktis"
Cohesion: 0.05
Nodes (38): 1. Ringkasan Sistem & Arsitektur Proyek, 2. Struktur Direktori Proyek, 3. Skema Basis Data & Model Data, 5. Logika Bisnis & Perhitungan Biaya, 6. Alur Pengguna (User Flow), 7. Bocoran 10 Pertanyaan Penguji UKK & Cara Jawab Taktis, A. Alur Pemesanan oleh Penyewa, A. Tabel `lapangan` (Master Data) (+30 more)

## Knowledge Gaps
- **226 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+221 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 266 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `CourtScheduleGrid.tsx`, `BlancaDifference.tsx`, `CashierDatePicker.tsx`, `BookingDetailSheet.tsx`, `useBlancaLocations.ts`, `package.json`, `BlancaTechnology.tsx`, `BlancaFaq.tsx`, `api.ts`?**
  _High betweenness centrality (0.312) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `api.ts` to `CourtScheduleGrid.tsx`, `package.json`, `CashierDatePicker.tsx`, `BookingDetailSheet.tsx`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `pngjs` connect `@playwright/test` to `package.json`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _226 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CourtScheduleGrid.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08893360160965795 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.0506558118498417 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._