import { supabase } from './supabase'
import type { Lapangan, Booking, StatusBooking } from '../types/database'

// ambil info lapangan dari supabase
export async function getLapangan(): Promise<Lapangan[]> {
  const { data, error } = await supabase
    .from('lapangan')
    .select('*')
    .order('id', { ascending: true })
  //jika gagal muncul error
  if (error) throw new Error(`Gagal mengambil data lapangan: ${error.message}`)
  return data || []
}

//booking anti nabrak dengan user lain
export async function getBookedSlots(lapanganId: number, tglMain: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('jam_slots')
    .eq('lapangan_id', lapanganId)
    .eq('tgl_main', tglMain)
    .neq('status', 'Batal') // Jadwal yang dibatalkan tidak dianggap bentrok

  if (error) throw new Error(`Gagal memeriksa jadwal: ${error.message}`)

  // Gabungkan seluruh array jam_slots menjadi satu array datar
  const allBooked = (data || []).flatMap((item: { jam_slots: string[] }) => item.jam_slots)
  return allBooked
}

// menyimpan transaksi booking baru ke database
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

// 4. new status booking (Pelunasan di Kasir atau Pembatalan)
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

// 5. ambil seluruh data transaksi booking untuk tabel kasir
export async function getAllBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, lapangan(*)')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Gagal mengambil data kasir: ${error.message}`)
  return (data as Booking[]) || []
}

// 6. langganan perubahan data booking secara realtime
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

// 7. tambah master lapangan baru (Poin 10 Kisi-Kisi UKK)
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

// 8. edit tarif atau status master lapangan (Poin 11 Kisi-Kisi UKK)
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

// 9. hapus master lapangan dari database (Poin 12 Kisi-Kisi UKK)
export async function deleteLapangan(id: number): Promise<void> {
  // Validasi relasi database: cegah hapus lapangan jika ada jadwal booking yang aktif
  const { data: activeBookings, error: checkError } = await supabase
    .from('bookings')
    .select('id')
    .eq('lapangan_id', id)
    .neq('status', 'Batal')

  if (checkError) throw new Error(`Gagal memeriksa riwayat booking: ${checkError.message}`)

  if (activeBookings && activeBookings.length > 0) {
    throw new Error('Lapangan tidak dapat dihapus karena masih memiliki transaksi booking aktif. Nonaktifkan status lapangan menjadi Tutup.')
  }

  const { error } = await supabase
    .from('lapangan')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Gagal menghapus lapangan: ${error.message}`)
}

// 10. cari dan filter transaksi booking (Poin 13 Kisi-Kisi UKK)
export async function searchBookings(
  keyword: string = '',
  status?: StatusBooking | 'Semua'
): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select('*, lapangan(*)')
    .order('created_at', { ascending: false })

  if (status && status !== 'Semua') {
    query = query.eq('status', status)
  }

  if (keyword.trim()) {
    query = query.or(`nama_penyewa.ilike.%${keyword.trim()}%,no_hp.ilike.%${keyword.trim()}%`)
  }

  const { data, error } = await query

  if (error) throw new Error(`Gagal mencari data booking: ${error.message}`)
  return (data as Booking[]) || []
}


