// PERAN FILE: Helper murni untuk memetakan data booking dari Supabase ke kartu kalender
import type { Booking as DbBooking } from '../../../types/database'
import type { BookingItem, Court } from '../types'
import { getInitials } from './formatters'

export const COURT_STYLE_MAP: Record<number, { type: string; image: string }> = {
  1: {
    type: 'Panoramic Glass',
    image: '/assets/courts/court-1.webp',
  },
  2: {
    type: 'Pro Championship',
    image: '/assets/courts/court-2.webp',
  },
  3: {
    type: 'VIP Indoor AC',
    image: '/assets/courts/court-3.webp',
  },
  4: {
    type: 'Training Ground',
    image: '/assets/courts/court-4.webp',
  },
}

/**
 * Mengubah array transaksi dari database Supabase menjadi daftar BookingItem untuk kalender.
 * Slot jam yang bersambung (misal: 14:00, 15:00, 16:00) otomatis digabung menjadi satu kartu jadwal.
 */
export function mapDbBookingsToItems(
  dbBookings: DbBooking[],
  targetDate: string,
  courtList: Court[],
): BookingItem[] {
  // Hanya ambil booking pada tanggal target dan status bukan 'Batal'
  const matching = dbBookings.filter(
    (b) => b.tgl_main === targetDate && b.status !== 'Batal',
  )

  const items: BookingItem[] = []

  matching.forEach((b) => {
    const slots = b.jam_slots || []
    if (slots.length === 0) return

    // 1. Urutkan slot jam dari yang paling awal
    const sorted = [...slots].sort((x, y) => parseInt(x, 10) - parseInt(y, 10))

    // 2. Kelompokkan slot jam yang bersambung (contiguous)
    const contiguousGroups: string[][] = []
    let currentGroup: string[] = [sorted[0]]

    for (let i = 1; i < sorted.length; i++) {
      const prevH = parseInt(sorted[i - 1].split(':')[0], 10)
      const currH = parseInt(sorted[i].split(':')[0], 10)
      if (currH === prevH + 1) {
        currentGroup.push(sorted[i])
      } else {
        contiguousGroups.push(currentGroup)
        currentGroup = [sorted[i]]
      }
    }
    contiguousGroups.push(currentGroup)

    const courtObj = courtList.find((c) => String(c.id) === String(b.lapangan_id))
    const courtName = courtObj?.name || b.lapangan?.nama_lapangan || `Court ${b.lapangan_id}`
    const initials = getInitials(b.nama_penyewa)

    // 3. Buat satu BookingItem untuk setiap rentang jam yang bersambung
    contiguousGroups.forEach((grp, idx) => {
      const startTime = grp[0]
      const lastSlot = grp[grp.length - 1]
      const lastH = parseInt(lastSlot.split(':')[0], 10) + 1
      const endTime = `${lastH < 10 ? '0' : ''}${lastH}:00`

      items.push({
        id: `db-${b.id}-${idx}`,
        invoiceNumber: `INV-${b.id}`,
        createdAt: b.created_at || 'Baru saja',
        courtId: b.lapangan_id,
        courtName,
        customerName: b.nama_penyewa,
        customerWhatsapp: b.no_hp,
        customerEmail: 'penyewa@example.com',
        date: b.tgl_main,
        startTime,
        endTime,
        status: 'booked',
        paymentType: b.tipe_bayar,
        totalPrice: b.total_bayar,
        paidAmount: b.nominal_dibayar,
        remainingAmount: b.sisa_bayar,
        notes: `Booking transaksi #${b.id}`,
        avatarInitials: initials,
      })
    })
  })

  return items
}
