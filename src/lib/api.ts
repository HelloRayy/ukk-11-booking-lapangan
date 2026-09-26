// ============================================================================
// BACKEND SERVICE LAYER: REST API & DATABASE REPOSITORY (SUPABASE POSTGRESQL)
// ============================================================================
// Berkas ini bertindak sebagai API Controller / Service Repository Layer.
// Menangani seluruh operasi CRUD, query JOIN berelasi, serta algoritma
// pencegahan bentrok jadwal langsung ke basis data PostgreSQL di Supabase.
// ============================================================================

import { supabase } from './supabase'
import type { Lapangan, Booking, StatusBooking } from '../types/database'

// ============================================================================
// 1. MASTER DATA LAPANGAN (CRUD TABEL `lapangan` - Kriteria 10, 11, 12, 14 UKK)
// ============================================================================

/**
 * READ: Mengambil seluruh katalog master lapangan yang terdaftar
 */
export async function getLapangan(): Promise<Lapangan[]> {
  const { data, error } = await supabase
    .from('lapangan')
    .select('*')
    .order('id', { ascending: true })

  if (error) throw new Error(`Gagal mengambil data lapangan: ${error.message}`)
  return data || []
}

/**
 * CREATE: Menambahkan master data lapangan baru oleh Admin (Poin 10 Kisi-Kisi UKK)
 */
export async function createLapangan(
  lapanganData: Omit<Lapangan, 'id' | 'created_at'>
): Promise<Lapangan> {
  const { data, error } = await supabase
    .from('lapangan')
    .insert([lapanganData])
    .select()
    .single()

  if (error) throw new Error(`Gagal menambah lapangan: ${error.message}`)
  return data
}

/**
 * UPDATE: Memperbarui tarif per jam, nama, atau status lapangan (Poin 11 Kisi-Kisi UKK)
 */
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

  if (error) throw new Error(`Gagal mengubah data lapangan: ${error.message}`)
  return data
}

/**
 * DELETE: Menghapus master lapangan dengan validasi integritas referensial (Poin 12 Kisi-Kisi UKK)
 * Catatan: Mencegah penghapusan jika lapangan masih memiliki riwayat booking aktif
 */
export async function deleteLapangan(id: number): Promise<void> {
  // Validasi relasi database: cek apakah ada transaksi aktif pada lapangan ini
  const { data: activeBookings, error: checkError } = await supabase
    .from('bookings')
    .select('id')
    .eq('lapangan_id', id)
    .neq('status', 'Batal')

  if (checkError) throw new Error(`Gagal memeriksa riwayat booking: ${checkError.message}`)

  if (activeBookings && activeBookings.length > 0) {
    throw new Error(
      'Lapangan tidak dapat dihapus karena masih memiliki transaksi booking aktif. Silakan ubah status lapangan menjadi Tutup.'
    )
  }

  const { error } = await supabase
    .from('lapangan')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Gagal menghapus lapangan: ${error.message}`)
}

// ============================================================================
// 2. TRANSAKSI BOOKING & LOGIKA ANTI-BENTROK (TABEL `bookings` - Kriteria 3 & 4)
// ============================================================================

/**
 * VALIDASI JADWAL: Mengecek daftar slot jam yang sudah terisi pada tanggal & lapangan tertentu
 * Logika Bisnis: Mengabaikan status 'Batal' sehingga slot yang dibatalkan bisa dipesan kembali
 */
export async function getBookedSlots(lapanganId: number, tglMain: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('jam_slots')
    .eq('lapangan_id', lapanganId)
    .eq('tgl_main', tglMain)
    .neq('status', 'Batal') // Slot yang dibatalkan tidak dianggap bentrok

  if (error) throw new Error(`Gagal memeriksa jadwal: ${error.message}`)

  // Gabungkan array jam_slots menjadi satu array datar (contoh: ['08:00', '09:00', '10:00'])
  const allBooked = (data || []).flatMap((item: { jam_slots: string[] }) => item.jam_slots)
  return allBooked
}

/**
 * CREATE TRANSAKSI: Menyimpan data reservasi baru dari pemesan / kasir ke database
 */
export async function createBooking(
  bookingData: Omit<Booking, 'id' | 'created_at'>
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single()

  if (error) throw new Error(`Gagal membuat booking: ${error.message}`)
  return data
}

// ============================================================================
// 3. OPERASIONAL KASIR & MANAJEMEN TRANSAKSI (Kriteria 11, 13, 14 UKK)
// ============================================================================

/**
 * READ ALL (JOIN): Mengambil seluruh data transaksi kasir beserta relasi data lapangannya
 * Menggunakan relasi Foreign Key: bookings.lapangan_id -> lapangan.id
 */
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, lapangan(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Gagal mengambil data kasir: ${error.message}`)
  return (data as Booking[]) || []
}

/**
 * UPDATE STATUS: Memperbarui status transaksi (Pelunasan sisa bayar DP atau Pembatalan)
 */
export async function updateStatusBooking(
  bookingId: number,
  status: StatusBooking,
  sisaBayar: number = 0
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status, sisa_bayar: sisaBayar })
    .eq('id', bookingId)

  if (error) throw new Error(`Gagal mengubah status: ${error.message}`)
}

/**
 * SEARCH & FILTER (SQL LEVEL): Mencari dan menyaring transaksi berdasarkan kata kunci atau status
 * Poin 13 Kisi-Kisi UKK: Query efisien tanpa N+1 problem menggunakan operator .ilike dan .or
 */
export async function searchBookings(
  keyword: string = '',
  status?: string
): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select('*, lapangan(*)')
    .order('created_at', { ascending: false })

  // Filter 1: Status transaksi di level database
  if (status && status !== 'Semua') {
    if (status === 'Belum Lunas') {
      query = query.eq('status', 'Booked').gt('sisa_bayar', 0)
    } else {
      query = query.eq('status', status)
    }
  }

  // Filter 2: Kata kunci pencarian (Nama Penyewa, Nomor WhatsApp, atau No Invoice)
  if (keyword.trim()) {
    const q = keyword.trim()
    const numericPart = q.toLowerCase().startsWith('inv-') ? q.slice(4) : q
    const isId = /^\d+$/.test(numericPart)

    if (isId) {
      query = query.or(`id.eq.${numericPart},nama_penyewa.ilike.%${q}%,no_hp.ilike.%${q}%`)
    } else {
      query = query.or(`nama_penyewa.ilike.%${q}%,no_hp.ilike.%${q}%`)
    }
  }

  const { data, error } = await query

  if (error) throw new Error(`Gagal mencari data booking: ${error.message}`)
  return (data as Booking[]) || []
}

// ============================================================================
// 4. WEBSOCKET REALTIME (SINKRONISASI JADWAL LIVE)
// ============================================================================

/**
 * REALTIME LISTENER: Berlangganan perubahan data tabel bookings via WebSocket
 * Setiap ada transaksi baru / pelunasan, UI langsung update otomatis tanpa reload
 */
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
