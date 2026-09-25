// PERAN FILE: Custom Hook Utama Pengatur Alur Interaksi Kalender & Checkout (Orkestrator)
import { useState, useEffect, useCallback } from 'react'
import type { BookingItem, Court, SlotRangeSelection, PaymentType, RightPanelMode, StoredCustomerInfo } from '../types'
import { TIME_SLOTS, CALENDAR_CURRENT_TIME } from '../constants/scheduleConfig'
import { createBooking } from '../../../lib/api'
import { getTodayISODate, getInitials } from '../utils/formatters'
import { mapDbBookingsToItems } from '../utils/bookingMapper'
import { useReservationData } from './useReservationData'
import { useSlotValidation } from './useSlotValidation'

export { CALENDAR_CURRENT_TIME, TIME_SLOTS } from '../constants/scheduleConfig'

export function useReservationSchedule() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISODate())
  const [panelMode, setPanelMode] = useState<RightPanelMode>('empty')
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotRangeSelection | null>(null)
  const [customer, setCustomer] = useState<StoredCustomerInfo | null>(null)
  const [rangeError, setRangeError] = useState<string | null>(null)

  // 1. Modul Penarikan Data & Realtime Supabase
  const { courts, bookings, allDbBookings, isLoading, setAllDbBookings, setBookings } = useReservationData({ selectedDate })

  // 2. Modul Validasi Jam Lampau & Deteksi Bentrok
  const { isPastSlot, getSlotBooking, isSlotInRange } = useSlotValidation({
    selectedDate,
    bookings,
    selectedSlot,
  })

  // Auto-dismiss pesan notifikasi/error setelah 4 detik
  useEffect(() => {
    if (!rangeError) return
    const timer = setTimeout(() => setRangeError(null), 4000)
    return () => clearTimeout(timer)
  }, [rangeError])

  // Baca data calon penyewa yang disimpan dari localStorage (fallback sessionStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('blanca_customer_info') || sessionStorage.getItem('blanca_customer_info')
      if (raw) setCustomer(JSON.parse(raw))
    } catch (e) {
      console.error('Gagal membaca data customer:', e)
    }
  }, [])

  // 3. Deteksi URL Search Param "?invoice=INV-XXXX" untuk auto-buka struk digital resmi
  useEffect(() => {
    if (isLoading) return

    try {
      const params = new URLSearchParams(window.location.search)
      const invoiceParam = params.get('invoice')?.trim()
      if (!invoiceParam) return

      // Cari di bookings tanggal aktif dulu
      let matched = bookings.find(
        (b) =>
          b.invoiceNumber?.toLowerCase() === invoiceParam.toLowerCase() ||
          b.id.toLowerCase() === invoiceParam.toLowerCase(),
      )

      // Jika belum ketemu di tanggal aktif, cari di seluruh allDbBookings
      if (!matched && allDbBookings && allDbBookings.length > 0) {
        const dbMatch = allDbBookings.find(
          (b) =>
            `inv-${b.id}` === invoiceParam.toLowerCase() ||
            String(b.id).toLowerCase() === invoiceParam.toLowerCase(),
        )
        if (dbMatch) {
          const mappedList = mapDbBookingsToItems([dbMatch], dbMatch.tgl_main, courts)
          if (mappedList.length > 0) {
            matched = mappedList[0]
            if (dbMatch.tgl_main !== selectedDate) {
              setSelectedDate(dbMatch.tgl_main)
            }
          }
        }
      }

      // Fallback ke localStorage jika pencarian offline/terbatas
      if (!matched) {
        const rawLatest = localStorage.getItem('blanca_latest_booking')
        if (rawLatest) {
          const latest: BookingItem = JSON.parse(rawLatest)
          if (
            latest.invoiceNumber?.toLowerCase() === invoiceParam.toLowerCase() ||
            latest.id.toLowerCase() === invoiceParam.toLowerCase()
          ) {
            matched = latest
          }
        }
      }

      if (matched) {
        setSelectedBooking(matched)
        setSelectedSlot(null)
        setPanelMode('receipt')
      }
    } catch (e) {
      console.error('Gagal membaca parameter invoice URL:', e)
    }
  }, [isLoading, bookings, allDbBookings, courts, selectedDate])

  // Aksi ketika user mengklik booking yang sudah ada (Proteksi Privasi Publik - ROADTOUKK-20)
  const handleSelectBooking = (booking: BookingItem) => {
    setSelectedSlot(null)

    const [endH, endM] = booking.endTime.split(':').map(Number)
    const endDecimal = endH + (endM || 0) / 60
    const currentDecimal = CALENDAR_CURRENT_TIME.hour + CALENDAR_CURRENT_TIME.minute / 60
    const today = getTodayISODate()
    const isPastBooking =
      booking.date < today || (booking.date === today && endDecimal <= currentDecimal)

    if (booking.status === 'maintenance') {
      setRangeError(`Lapangan sedang perawatan (${booking.startTime} - ${booking.endTime}).`)
      return
    }

    if (isPastBooking) {
      setRangeError(`Sesi bermain ${booking.startTime} - ${booking.endTime} telah selesai.`)
      return
    }

    // Booking aktif: notifikasi privasi publik tanpa membuka panel rincian orang lain
    setRangeError('Jadwal ini sudah terisi. Silakan pilih slot lain.')
  }

  // Aksi pemilihan slot kosong dengan validasi jam lampau & rentang waktu dinamis
  const handleSelectEmptySlot = (court: Court, clickedTime: string) => {
    setRangeError(null)

    // Validasi jam lampau: DILARANG booking jam yang sudah lewat
    if (isPastSlot(clickedTime)) {
      const today = getTodayISODate()
      const errorMsg =
        selectedDate < today
          ? 'Tanggal yang dipilih sudah lewat.'
          : `Slot jam ${clickedTime} tidak dapat dipilih karena sudah lewat dari jam sekarang (${CALENDAR_CURRENT_TIME.display}).`
      setRangeError(errorMsg)
      return
    }

    const clickedHour = parseInt(clickedTime.split(':')[0], 10)

    // Jika belum ada pilihan, atau user klik di lapangan lain, atau pilihan sebelumnya sudah berupa rentang (>1 jam):
    if (!selectedSlot || String(selectedSlot.courtId) !== String(court.id) || selectedSlot.totalHours > 1) {
      const endHour = clickedHour + 1
      const endTime = `${endHour < 10 ? '0' : ''}${endHour}:00`

      setSelectedSlot({
        courtId: court.id,
        courtName: court.name,
        date: selectedDate,
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

    if (selectedSlot.startHour === clickedHour) return

    // Urutkan rentang min dan max
    const minH = Math.min(selectedSlot.startHour, clickedHour)
    const maxH = Math.max(selectedSlot.startHour, clickedHour)

    const hoursInRange: string[] = []
    let hasCollision = false
    let hasPastHour = false

    // Loop verifikasi setiap jam di dalam rentang
    for (let h = minH; h <= maxH; h++) {
      const timeString = `${h < 10 ? '0' : ''}${h}:00`

      if (isPastSlot(timeString)) {
        hasPastHour = true
        break
      }

      if (getSlotBooking(court.id, timeString)) {
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
      const endHour = clickedHour + 1
      const endTime = `${endHour < 10 ? '0' : ''}${endHour}:00`
      setSelectedSlot({
        courtId: court.id,
        courtName: court.name,
        date: selectedDate,
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

    // Rentang valid: set data rentang jam terpilih
    const totalHours = maxH - minH + 1
    const startTime = `${minH < 10 ? '0' : ''}${minH}:00`
    const finalEndHour = maxH + 1
    const endTime = `${finalEndHour < 10 ? '0' : ''}${finalEndHour}:00`
    const totalPrice = totalHours * court.pricePerHour

    setSelectedSlot({
      courtId: court.id,
      courtName: court.name,
      date: selectedDate,
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
  const handleClosePanel = (expiredMessage?: string) => {
    setPanelMode('empty')
    setSelectedBooking(null)
    setSelectedSlot(null)
    setRangeError(expiredMessage || null)
  }

  // Konfirmasi pembuatan booking baru & simpan ke Supabase
  const handleCreateBooking = async (paymentType: PaymentType, notes?: string) => {
    if (!selectedSlot) return

    const totalPrice = selectedSlot.totalPrice
    const paidAmount = paymentType === 'DP' ? totalPrice * 0.5 : totalPrice
    const remainingAmount = totalPrice - paidAmount

    const customerName = customer?.nama || 'Raditya Rayhan'
    const customerWhatsapp = customer?.whatsapp || '085799799857'
    const customerEmail = customer?.email || 'raditya.rayhan@gmail.com'
    const avatarInitials = getInitials(customerName)

    const now = new Date()
    const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`
    const createdAt = `${now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`

    const courtIdNum =
      typeof selectedSlot.courtId === 'number'
        ? selectedSlot.courtId
        : parseInt(String(selectedSlot.courtId).replace('court-', ''), 10) || 1

    try {
      const savedBooking = await createBooking({
        lapangan_id: courtIdNum,
        nama_penyewa: customerName,
        no_hp: customerWhatsapp,
        tgl_main: selectedSlot.date,
        jam_slots: selectedSlot.selectedHours,
        durasi_jam: selectedSlot.totalHours,
        total_bayar: totalPrice,
        nominal_dibayar: paidAmount,
        sisa_bayar: remainingAmount,
        tipe_bayar: paymentType,
        status: 'Booked',
      })

      const newBookingItem: BookingItem = {
        id: `db-${savedBooking.id}`,
        invoiceNumber: `INV-${savedBooking.id}`,
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
        notes: notes || 'Booking lapangan via Blanca Badminton Arena.',
        avatarInitials,
      }

      setAllDbBookings((prev) => [savedBooking, ...prev])
      setBookings((prev) => [...prev, newBookingItem])
      setSelectedBooking(newBookingItem)
      setSelectedSlot(null)
      setPanelMode('receipt')
      try {
        localStorage.setItem('blanca_latest_booking', JSON.stringify(newBookingItem))
      } catch (err) {
        console.error('Gagal menyimpan booking ke localStorage:', err)
      }
    } catch (error) {
      console.error('Gagal menyimpan booking ke Supabase:', error)
      const fallbackBooking: BookingItem = {
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
        notes: notes || 'Booking lapangan via Blanca Badminton Arena (Offline).',
        avatarInitials,
      }
      setBookings((prev) => [...prev, fallbackBooking])
      setSelectedBooking(fallbackBooking)
      setSelectedSlot(null)
      setPanelMode('receipt')
    }
  }

  // Ganti tanggal reservasi
  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate)
    setSelectedSlot(null)
    setSelectedBooking(null)
    setPanelMode('empty')
    setRangeError(null)
  }

  const handleClearError = useCallback(() => setRangeError(null), [])

  return {
    courts,
    timeSlots: TIME_SLOTS,
    bookings,
    customer,
    panelMode,
    selectedBooking,
    selectedSlot,
    selectedDate,
    rangeError,
    isLoading,
    currentTime: CALENDAR_CURRENT_TIME,
    getSlotBooking,
    isSlotInRange,
    isPastSlot,
    handleSelectBooking,
    handleSelectEmptySlot,
    handleClosePanel,
    handleCreateBooking,
    handleClearError,
    handleDateChange,
  }
}
