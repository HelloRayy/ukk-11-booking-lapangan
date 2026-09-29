// ============================================================================
// BACKEND SERVICE LAYER: REST API (SUPABASE POSTGRESQL) - VERSI RINGKAS UKK
// ============================================================================
// File ini adalah Backend Controller / API Layer.
// Hanya berisi 3 fungsi inti:
// 1. CRUD Master Lapangan
// 2. Booking & Logika Anti-Bentrok
// 3. Operasional Kasir (Lihat Data & Pelunasan)
// ============================================================================

import { supabase } from './supabase'
import type { Lapangan, Booking, StatusBooking } from '../types/database'

// ----------------------------------------------------------------------------
// 1. MASTER LAPANGAN (CRUD)
// ----------------------------------------------------------------------------

// READ: Ambil seluruh data lapangan
export async function getLapangan(): Promise<Lapangan[]> {
  const { data, error } = await supabase
    .from('lapangan')
    .select('*')
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

// CREATE: Tambah lapangan baru
export async function createLapangan(
  lapanganData: Omit<Lapangan, 'id' | 'created_at'>
): Promise<Lapangan> {
  const { data, error } = await supabase
    .from('lapangan')
    .insert([lapanganData])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// UPDATE: Ubah nama, tarif, atau status lapangan
export async function updateLapangan(
  id: number,
  lapanganData: Partial<Omit<Lapangan, 'id' | 'created_at'>>
): Promise<Lapangan> {
  const { data, error } = await supabase
    .from('lapangan')
    .update(lapanganData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// DELETE: Hapus lapangan
export async function deleteLapangan(id: number): Promise<void> {
  const { error } = await supabase
    .from('lapangan')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

// ----------------------------------------------------------------------------
// 2. TRANSAKSI BOOKING & CEK JADWAL BENTROK
// ----------------------------------------------------------------------------

// CEK BENTROK: Cari jam yang sudah dibooking pada tanggal & lapangan terpilih
export async function getBookedSlots(lapanganId: number, tglMain: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('jam_slots')
    .eq('lapangan_id', lapanganId)
    .eq('tgl_main', tglMain)
    .neq('status', 'Batal')

  if (error) throw new Error(error.message)

  // Gabungkan array jam jadi 1 list (contoh: ['08:00', '09:00', '10:00'])
  return (data || []).flatMap((item: { jam_slots: string[] }) => item.jam_slots)
}

// CREATE: Simpan data pemesanan baru
export async function createBooking(
  bookingData: Omit<Booking, 'id' | 'created_at'>
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ----------------------------------------------------------------------------
// 3. OPERASIONAL KASIR & PELUNASAN
// ----------------------------------------------------------------------------

// READ ALL: Ambil semua transaksi booking + JOIN data lapangan
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, lapangan(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as Booking[]) || []
}

// UPDATE STATUS: Pelunasan sisa bayar atau ubah status transaksi
export async function updateStatusBooking(
  bookingId: number,
  status: StatusBooking,
  sisaBayar: number = 0
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status, sisa_bayar: sisaBayar })
    .eq('id', bookingId)

  if (error) throw new Error(error.message)
}

// SEARCH: Cari nama pemesan atau filter status di tabel kasir
export async function searchBookings(
  keyword: string = '',
  status?: string
): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select('*, lapangan(*)')
    .order('created_at', { ascending: false })

  if (status && status !== 'Semua') {
    query = query.eq('status', status)
  }

  if (keyword.trim()) {
    query = query.ilike('nama_penyewa', `%${keyword.trim()}%`)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data as Booking[]) || []
}

// REALTIME LISTENER: Update otomatis jika data database berubah
export function subscribeToBookings(onUpdate: () => void) {
  const channel = supabase
    .channel('bookings-realtime-sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      () => {
        onUpdate()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
