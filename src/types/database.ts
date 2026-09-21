export type StatusLapangan = 'Aktif' | 'Tutup'
export type TipeBayar = 'Lunas' | 'DP'
export type StatusBooking = 'Booked' | 'Lunas' | 'Batal'

export interface Lapangan {
  id: number
  nama_lapangan: string
  tarif_per_jam: number
  status: StatusLapangan
  created_at?: string
}

export interface Booking {
  id: number
  lapangan_id: number
  nama_penyewa: string
  no_hp: string
  tgl_main: string
  jam_slots: string[]
  durasi_jam: number
  total_bayar: number
  nominal_dibayar: number
  sisa_bayar: number
  tipe_bayar: TipeBayar
  status: StatusBooking
  created_at?: string
  lapangan?: Lapangan
}
