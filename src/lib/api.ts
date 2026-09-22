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


