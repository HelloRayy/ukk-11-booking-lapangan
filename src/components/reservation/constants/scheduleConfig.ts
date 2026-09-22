// PERAN FILE: Konfigurasi jam operasional dan waktu acuan kalender reservasi
import {
  isDevMode,
  jamSimulasi,
  menitSimulasi,
  TIME_SLOTS,
} from '../../../constants/operationalHours'

export { isDevMode, jamSimulasi, menitSimulasi, TIME_SLOTS }

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
