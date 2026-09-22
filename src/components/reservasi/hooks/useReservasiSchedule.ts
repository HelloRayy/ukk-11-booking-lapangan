// PERAN FILE: Custom Hook Logic untuk Pengelolaan State Kalender Jadwal & Panel Inspektor
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { BookingItem, Court, EmptySlotSelection, PaymentType, RightPanelMode } from '../types'
import { MOCK_COURTS, TIME_SLOTS, INITIAL_BOOKINGS } from '../data/mockScheduleData'

interface StoredCustomer {
  nama: string
  whatsapp: string
  email: string
  isConfirmed: boolean
}

export function useReservasiSchedule() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS)
  const [panelMode, setPanelMode] = useState<RightPanelMode>('empty')
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<EmptySlotSelection | null>(null)
  const [customer, setCustomer] = useState<StoredCustomer | null>(null)

  // Baca calon penyewa yang disimpan saat submit side panel
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('blanca_customer_info')
      if (raw) {
        setCustomer(JSON.parse(raw))
      }
    } catch (e) {
      console.error('Gagal membaca data customer dari sessionStorage:', e)
    }
  }, [])

  // Cari booking pada lapangan dan jam tertentu
  const getSlotBooking = useCallback(
    (courtId: string, time: string): BookingItem | undefined => {
      const targetHour = parseInt(time.split(':')[0], 10)
      return bookings.find((b) => {
        if (b.courtId !== courtId) return false
        const startHour = parseInt(b.startTime.split(':')[0], 10)
        const endHour = parseInt(b.endTime.split(':')[0], 10)
        return targetHour >= startHour && targetHour < endHour
      })
    },
    [bookings],
  )

  // Aksi ketika mengklik booking yang sudah ada
  const handleSelectBooking = (booking: BookingItem) => {
    setSelectedBooking(booking)
    setSelectedSlot(null)
    setPanelMode('inspect')
  }

  // Aksi ketika mengklik slot kosong
  const handleSelectEmptySlot = (court: Court, startTime: string) => {
    const startHour = parseInt(startTime.split(':')[0], 10)
    const endHour = startHour + 1
    const endTime = `${endHour < 10 ? '0' : ''}${endHour}:00`

    setSelectedSlot({
      courtId: court.id,
      courtName: court.name,
      date: 'Wednesday, Oct 14',
      startTime,
      endTime,
      pricePerHour: court.pricePerHour,
    })
    setSelectedBooking(null)
    setPanelMode('create')
  }

  // Tutup panel kanan
  const handleClosePanel = () => {
    setPanelMode('empty')
    setSelectedBooking(null)
    setSelectedSlot(null)
  }

  // Konfirmasi pembuatan booking baru
  const handleCreateBooking = (paymentType: PaymentType, notes?: string) => {
    if (!selectedSlot) return

    const totalPrice = selectedSlot.pricePerHour
    const paidAmount = paymentType === 'dp' ? totalPrice * 0.5 : totalPrice
    const remainingAmount = totalPrice - paidAmount

    const customerName = customer?.nama || 'Calon Penyewa Baru'
    const customerWhatsapp = customer?.whatsapp || '08123456789'
    const customerEmail = customer?.email || 'penyewa@example.com'

    // Buat inisial nama untuk avatar
    const avatarInitials = customerName
      .split(' ')
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('')

    const newBooking: BookingItem = {
      id: `book-${Date.now()}`,
      courtId: selectedSlot.courtId,
      courtName: selectedSlot.courtName,
      customerName,
      customerWhatsapp,
      customerEmail,
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'booked',
      paymentType,
      totalPrice,
      paidAmount,
      remainingAmount,
      notes: notes || 'Booking via Blanca web reservation.',
      avatarInitials,
    }

    setBookings((prev) => [...prev, newBooking])
    setSelectedBooking(newBooking)
    setSelectedSlot(null)
    setPanelMode('inspect')
  }

  return {
    courts: MOCK_COURTS,
    timeSlots: TIME_SLOTS,
    bookings,
    customer,
    panelMode,
    selectedBooking,
    selectedSlot,
    getSlotBooking,
    handleSelectBooking,
    handleSelectEmptySlot,
    handleClosePanel,
    handleCreateBooking,
  }
}
