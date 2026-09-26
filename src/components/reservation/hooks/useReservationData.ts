// PERAN FILE: Custom Hook Khusus Mengambil Data Lapangan & Booking dari Supabase (Realtime)
import { useState, useEffect } from 'react'
import type { Court, BookingItem } from '../types'
import type { Booking as DbBooking } from '../../../types/database'
import { getLapangan, getAllBookings, subscribeToBookings } from '../../../lib/api'
import { FIXTURE_COURTS } from '../__mocks__/scheduleFixtures'
import { COURT_STYLE_MAP, mapDbBookingsToItems } from '../utils/bookingMapper'

interface ReservationDataProps {
  selectedDate: string
}

export function useReservationData({ selectedDate }: ReservationDataProps) {
  const [courts, setCourts] = useState<Court[]>([])
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [allDbBookings, setAllDbBookings] = useState<DbBooking[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 1. Ambil data lapangan dan riwayat booking saat pertama kali dimuat
  useEffect(() => {
    let isMounted = true

    async function initializeData() {
      try {
        setIsLoading(true)
        const [dbCourts, dbBookings] = await Promise.all([
          getLapangan().catch((err) => {
            console.warn('Gagal memuat data lapangan Supabase:', err)
            return []
          }),
          getAllBookings().catch((err) => {
            console.warn('Gagal memuat data bookings Supabase:', err)
            return []
          }),
        ])

        if (!isMounted) return

        // Format data lapangan
        if (dbCourts && dbCourts.length > 0) {
          const mapped: Court[] = dbCourts.map((c) => ({
            id: c.id,
            name: c.nama_lapangan,
            type: COURT_STYLE_MAP[c.id]?.type || 'Standard Court',
            image:
              COURT_STYLE_MAP[c.id]?.image ||
              '/assets/courts/court-1.webp',
            pricePerHour: c.tarif_per_jam,
          }))
          setCourts(mapped)
        } else {
          setCourts(FIXTURE_COURTS)
        }

        if (dbBookings && dbBookings.length > 0) {
          setAllDbBookings(dbBookings)
        }
      } catch (err) {
        console.warn('Gagal menginisialisasi jadwal reservasi:', err)
        if (isMounted) setCourts(FIXTURE_COURTS)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    initializeData()

    // 2. Langganan Supabase Realtime (otomatis refresh jika kasir batalkan/lunasi)
    const unsubscribe = subscribeToBookings(async () => {
      try {
        const freshBookings = await getAllBookings()
        if (isMounted) {
          setAllDbBookings(freshBookings)
        }
      } catch (err) {
        console.warn('Gagal sinkronisasi realtime booking:', err)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  // 3. Sinkronkan booking ke grid kalender saat tanggal, data DB, atau lapangan berubah
  useEffect(() => {
    if (allDbBookings.length > 0) {
      const mapped = mapDbBookingsToItems(allDbBookings, selectedDate, courts)
      setBookings(mapped)
    } else {
      setBookings([])
    }
  }, [selectedDate, allDbBookings, courts])

  return {
    courts,
    bookings,
    allDbBookings,
    isLoading,
    setAllDbBookings,
    setBookings,
  }
}
