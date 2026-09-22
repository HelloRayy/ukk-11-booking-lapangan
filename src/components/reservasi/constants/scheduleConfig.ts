// PERAN FILE: Konfigurasi jam operasional dan waktu acuan kalender reservasi
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

// Jam acuan kalender saat ini (sinkron dengan indikator garis biru 10:40)
export const CALENDAR_CURRENT_TIME = {
  hour: 10,
  minute: 40,
  display: '10:40',
}

export const BASE_OPERATIONAL_HOUR = 8 // Jam buka operasional 08:00
export const DEFAULT_SLOT_HEIGHT = 88 // Tinggi baku pixel per 1 jam slot
