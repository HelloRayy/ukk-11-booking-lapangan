// PERAN FILE: Custom Hook State Kalender Jadwal dengan Multi-Slot Range Selection & Proteksi Waktu Lampau (User POV)
import { useState, useEffect, useCallback } from 'react'
import type { BookingItem, Court, SlotRangeSelection, PaymentType, RightPanelMode } from '../types'
import { MOCK_COURTS, TIME_SLOTS, INITIAL_BOOKINGS } from '../data/mockScheduleData'

interface StoredCustomer {
  nama: string
  whatsapp: string
  email: string
  isConfirmed: boolean
}

// Jam acuan kalender saat ini (sinkron dengan indikator garis biru 10:40)
export const CALENDAR_CURRENT_TIME = {
  hour: 10,
  minute: 40,
  display: '10:40',
}

export function useReservasiSchedule() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS)
  const [panelMode, setPanelMode] = useState<RightPanelMode>('empty')
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotRangeSelection | null>(null)
  const [customer, setCustomer] = useState<StoredCustomer | null>(null)
  const [rangeError, setRangeError] = useState<string | null>(null)

  // Auto-dismiss pesan error setelah 4 detik
  useEffect(() => {
    if (!rangeError) return
    const timer = setTimeout(() => {
      setRangeError(null)
    }, 4000)
    return () => clearTimeout(timer)
  }, [rangeError])

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

  // Fungsi pengecekan apakah suatu jam slot sudah lewat dari jam sekarang (< 10:40)
  const isPastSlot = useCallback((time: string): boolean => {
    const slotHour = parseInt(time.split(':')[0], 10)
    if (slotHour < CALENDAR_CURRENT_TIME.hour) return true
    if (slotHour === CALENDAR_CURRENT_TIME.hour && CALENDAR_CURRENT_TIME.minute > 0) return true
    return false
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

  // Aksi pemilihan slot kosong dengan validasi waktu lampau & logika multi-slot range
  const handleSelectEmptySlot = (court: Court, clickedTime: string) => {
    setRangeError(null)

    // 1. Validasi waktu lampau: DILARANG booking < dari jam sekarang (10:40)
    if (isPastSlot(clickedTime)) {
      setRangeError(
        `Slot jam ${clickedTime} tidak dapat dipilih karena sudah lewat dari jam sekarang (${CALENDAR_CURRENT_TIME.display}).`,
      )
      return
    }

    const clickedHour = parseInt(clickedTime.split(':')[0], 10)

    // Jika belum ada pilihan, atau user klik di lapangan berbeda, atau pilihan sebelumnya sudah berupa rentang (>1 jam):
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

    // Jika user mengklik slot jam yang sama persis:
    if (selectedSlot.startHour === clickedHour) {
      return
    }

    // Urutkan nilai min dan max secara otomatis (misal klik jam 13:00 dan jam 17:00 -> min 13, max 17)
    const minH = Math.min(selectedSlot.startHour, clickedHour)
    const maxH = Math.max(selectedSlot.startHour, clickedHour)

    // Bentuk array seluruh slot jam di antara minH dan maxH
    const hoursInRange: string[] = []
    let hasCollision = false
    let hasPastHour = false

    for (let h = minH; h <= maxH; h++) {
      const timeString = `${h < 10 ? '0' : ''}${h}:00`

      // Validasi waktu lampau di dalam rentang
      if (isPastSlot(timeString)) {
        hasPastHour = true
        break
      }

      // Validasi tabrakan jadwal (collision check)
      const existing = getSlotBooking(court.id, timeString)
      if (existing) {
        hasCollision = true
        break
      }
      hoursInRange.push(timeString)
    }

    if (hasPastHour) {
      setRangeError(`Rentang jam tidak valid karena memuat jam yang sudah lewat (< ${CALENDAR_CURRENT_TIME.display}).`)
      return
    }

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

  // Tutup panel samping kanan (dengan opsi pesan alert jika expired)
  const handleClosePanel = (expiredMessage?: string) => {
    setPanelMode('empty')
    setSelectedBooking(null)
    setSelectedSlot(null)
    if (expiredMessage) {
      setRangeError(expiredMessage)
    } else {
      setRangeError(null)
    }
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

    const now = new Date()
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
    const createdAt = `${now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`

    const newBooking: BookingItem = {
      id: `book-${Date.now()}`,
      invoiceNumber,
      createdAt,
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
    setPanelMode('receipt')
  }

  // Hapus pesan error bentrok/waktu lampau
  const handleClearError = useCallback(() => {
    setRangeError(null)
  }, [])

  return {
    courts: MOCK_COURTS,
    timeSlots: TIME_SLOTS,
    bookings,
    customer,
    panelMode,
    selectedBooking,
    selectedSlot,
    rangeError,
    currentTime: CALENDAR_CURRENT_TIME,
    getSlotBooking,
    isSlotInRange,
    isPastSlot,
    handleSelectBooking,
    handleSelectEmptySlot,
    handleClosePanel,
    handleCreateBooking,
    handleClearError,
  }
}
