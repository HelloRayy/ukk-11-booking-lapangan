// PERAN FILE: Konfigurasi jam operasional dan waktu acuan kalender reservasi

// MODE DEV: ubah ke true jika ingin simulasi jam manual (misal testing malam hari / demo UKK)
export const isDevMode = true // true = pakai jam simulasi, false = pakai jam realtime
export const jamSimulasi = 6 // atur jam simulasi di sini (contoh: 6 = jam 06:00, 10 = jam 10:00 pagi)
export const menitSimulasi = 0 // atur menit simulasi (contoh: 0 atau 30)

export const TIME_SLOTS: string[] = [
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

// Fungsi mendapatkan waktu kalender acuan (mendukung Dev Mode & Realtime)
export function getCalendarCurrentTime() {
  const now = new Date()
  const hour = isDevMode ? jamSimulasi : now.getHours()
  const minute = isDevMode ? menitSimulasi : now.getMinutes()
  const display = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

  return {
    isDevMode,
    hour,
    minute,
    display,
  }
}

// Objek jam acuan kalender saat ini (sinkron dengan indikator garis biru dan validasi waktu lampau)
export const CALENDAR_CURRENT_TIME = getCalendarCurrentTime()

export const BASE_OPERATIONAL_HOUR = 8 // Jam buka operasional 08:00
export const DEFAULT_SLOT_HEIGHT = 88 // Tinggi baku pixel per 1 jam slot
