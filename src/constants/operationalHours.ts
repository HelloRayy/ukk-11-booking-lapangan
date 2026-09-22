// PERAN FILE: Konfigurasi Jam Operasional dan Pengaturan Waktu Simulasi Demo / Dev Mode

// ==========================================
// PENGATURAN MODE SIMULASI (DEV & DEMO UKK)
// ==========================================
// MODE DEV: ubah ke true jika ingin simulasi jam manual (misal testing malam hari / demo UKK)
export const isDevMode = true // true = pakai jam simulasi, false = pakai jam realtime
export const jamSimulasi = 10 // atur jam simulasi di sini (contoh: 10 = jam 10:00 pagi, 18 = jam 18:00 sore)
export const menitSimulasi = 0 // atur menit simulasi (contoh: 0 atau 30)

// ==========================================
// DAFTAR JAM OPERASIONAL LAPANGAN (08:00 - 22:00)
// ==========================================
export const DAFTAR_JAM = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
]

export const OPERATIONAL_HOURS = DAFTAR_JAM
export const TIME_SLOTS = DAFTAR_JAM
