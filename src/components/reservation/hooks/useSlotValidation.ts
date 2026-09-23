// PERAN FILE: Custom Hook Khusus Validasi Jam Lampau & Tabrakan Jadwal (Anti-Bentrok)
import { useCallback } from 'react'
import type { BookingItem, SlotRangeSelection } from '../types'
import { CALENDAR_CURRENT_TIME } from '../constants/scheduleConfig'
import { getTodayISODate } from '../utils/formatters'

interface SlotValidationProps {
  selectedDate: string
  bookings: BookingItem[]
  selectedSlot: SlotRangeSelection | null
}

export function useSlotValidation({
  selectedDate,
  bookings,
  selectedSlot,
}: SlotValidationProps) {
  // 1. Pengecekan apakah suatu jam slot sudah lewat dari jam sekarang
  const isPastSlot = useCallback(
    (time: string): boolean => {
      const today = getTodayISODate()
      if (selectedDate < today) return true
      if (selectedDate > today) return false

      const slotHour = parseInt(time.split(':')[0], 10)
      if (slotHour < CALENDAR_CURRENT_TIME.hour) return true
      if (slotHour === CALENDAR_CURRENT_TIME.hour && CALENDAR_CURRENT_TIME.minute > 0) return true
      return false
    },
    [selectedDate],
  )

  // 2. Cari transaksi booking pada lapangan dan jam tertentu (Cek Bentrok)
  const getSlotBooking = useCallback(
    (courtId: number | string, time: string): BookingItem | undefined => {
      const targetHour = parseInt(time.split(':')[0], 10)
      return bookings.find((b) => {
        if (String(b.courtId) !== String(courtId)) return false
        const startHour = parseInt(b.startTime.split(':')[0], 10)
        const endHour = parseInt(b.endTime.split(':')[0], 10)
        return targetHour >= startHour && targetHour < endHour
      })
    },
    [bookings],
  )

  // 3. Cek apakah suatu slot termasuk dalam rentang pilihan aktif calon penyewa
  const isSlotInRange = useCallback(
    (courtId: number | string, time: string): boolean => {
      if (!selectedSlot || String(selectedSlot.courtId) !== String(courtId)) return false
      return selectedSlot.selectedHours.includes(time)
    },
    [selectedSlot],
  )

  return {
    isPastSlot,
    getSlotBooking,
    isSlotInRange,
  }
}
