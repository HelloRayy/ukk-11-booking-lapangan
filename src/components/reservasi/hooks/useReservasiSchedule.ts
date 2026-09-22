// PERAN FILE: Custom Hook State Kalender Jadwal dengan Multi-Slot Range Selection (User POV)
import { useState, useEffect, useMemo, useCallback } from 'react'
import type { BookingItem, Court, SlotRangeSelection, PaymentType, RightPanelMode } from '../types'
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
  const [selectedSlot, setSelectedSlot] = useState<SlotRangeSelection | null>(null)
  const [customer, setCustomer] = useState<StoredCustomer | null>(null)
  const [rangeError, setRangeError] = useState<string | null>(null)

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

  // Cek apakah suatu slot termasuk dalam rentang pilihan aktif
  const isSlotInRange = useCallback(
    (courtId: string, time: string): boolean => {
      if (!selectedSlot || selectedSlot.courtId !== courtId) return false
      return selectedSlot.selectedHours.includes(time)
    },
    [selectedSlot],
  )

  // Aksi ketika user mengklik booking yang sudah ada (hanya melihat info - User POV)
  const handleSelectBooking = (booking: BookingItem) => {
    setSelectedBooking(booking)
    setSelectedSlot(null)
    setRangeError(null)
    setPanelMode('inspect')
  }

  // Aksi pemilihan slot kosong (Logika Range: Klik jam 1 lalu klik jam 5 -> otomatis 1 2 3 4 5)
  const handleSelectEmptySlot = (court: Court, clickedTime: string) => {
    setRangeError(null)
    const clickedHour = parseInt(clickedTime.split(':')[0], 10)

    // Jika belum ada pilihan, atau user klik di lapangan yang berbeda, atau pilihan sebelumnya sudah berupa rentang (>1 jam):
    // Kita mulai pilihan baru 1 slot awal.
    if (!selectedSlot || selectedSlot.courtId !== court.id || selectedSlot.totalHours > 1) {
      const endHour = clickedHour + 1
      const endTime = `${endHour < 10 ? '0' : ''}${endHour}:00`

      setSelectedSlot({
        courtId: court.id,
        courtName: court.name,
        date: 'Wednesday, Oct 14',
        startHour: clickedHour,
        endHour: clickedHour,
        startTime: clickedTime,
        endTime,
        selectedHours: [clickedTime],
        totalHours: 1,
        pricePerHour: court.pricePerHour,
        totalPrice: court.pricePerHour,
      })
      setSelectedBooking(null)
      setPanelMode('create')
      return
    }

    // Jika user mengklik slot jam yang sama persis dengan yang sudah terpilih:
    if (selectedSlot.startHour === clickedHour) {
      // Biarkan tetap terpilih 1 jam
      return
    }

    // Jika user mengklik slot kedua pada lapangan yang sama:
    // Urutkan nilai min dan max secara otomatis (misal klik jam 1 dan jam 5 -> min 1, max 5)
    const minH = Math.min(selectedSlot.startHour, clickedHour)
    const maxH = Math.max(selectedSlot.startHour, clickedHour)

    // Bentuk array seluruh slot jam di antara minH dan maxH
    const hoursInRange: string[] = []
    let hasCollision = false

    for (let h = minH; h <= maxH; h++) {
      const timeString = `${h < 10 ? '0' : ''}${h}:00`
      // Validasi tabrakan jadwal (collision check)
      const existing = getSlotBooking(court.id, timeString)
      if (existing) {
        hasCollision = true
        break
      }
      hoursInRange.push(timeString)
    }

    // Jika ada jadwal orang lain yang bertabrakan di tengah rentang:
    if (hasCollision) {
      setRangeError('Rentang waktu tidak valid karena bertabrakan dengan jadwal yang sudah terisi.')
      // Reset pilihan ke slot yang baru saja diklik
      const endHour = clickedHour + 1
      const endTime = `${endHour < 10 ? '0' : ''}${endHour}:00`
      setSelectedSlot({
        courtId: court.id,
        courtName: court.name,
        date: 'Wednesday, Oct 14',
        startHour: clickedHour,
        endHour: clickedHour,
        startTime: clickedTime,
        endTime,
        selectedHours: [clickedTime],
        totalHours: 1,
        pricePerHour: court.pricePerHour,
        totalPrice: court.pricePerHour,
      })
      return
    }

    // Rentang valid: otomatis rangkum seluruh jam terpilih!
    const totalHours = maxH - minH + 1
    const startTime = `${minH < 10 ? '0' : ''}${minH}:00`
    const finalEndHour = maxH + 1
    const endTime = `${finalEndHour < 10 ? '0' : ''}${finalEndHour}:00`
    const totalPrice = totalHours * court.pricePerHour

    setSelectedSlot({
      courtId: court.id,
      courtName: court.name,
      date: 'Wednesday, Oct 14',
      startHour: minH,
      endHour: maxH,
      startTime,
      endTime,
      selectedHours: hoursInRange,
      totalHours,
      pricePerHour: court.pricePerHour,
      totalPrice,
    })
    setSelectedBooking(null)
    setPanelMode('create')
  }

  // Tutup panel samping kanan
  const handleClosePanel = () => {
    setPanelMode('empty')
    setSelectedBooking(null)
    setSelectedSlot(null)
    setRangeError(null)
  }

  // Konfirmasi pembuatan booking baru oleh calon penyewa (User POV)
  const handleCreateBooking = (paymentType: PaymentType, notes?: string) => {
    if (!selectedSlot) return

    const totalPrice = selectedSlot.totalPrice
    const paidAmount = paymentType === 'dp' ? totalPrice * 0.5 : totalPrice
    const remainingAmount = totalPrice - paidAmount

    const customerName = customer?.nama || 'Calon Penyewa'
    const customerWhatsapp = customer?.whatsapp || '08123456789'
    const customerEmail = customer?.email || 'penyewa@example.com'

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
      notes: notes || 'Booking lapangan via Blanca Padel.',
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
    rangeError,
    getSlotBooking,
    isSlotInRange,
    handleSelectBooking,
    handleSelectEmptySlot,
    handleClosePanel,
    handleCreateBooking,
  }
}
