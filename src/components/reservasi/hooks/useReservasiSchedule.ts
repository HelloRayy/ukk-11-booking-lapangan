// PERAN FILE: Custom Hook State Kalender Jadwal dengan Integrasi Supabase & Form LP (User POV)
import { useState, useEffect, useCallback } from 'react'
import type { BookingItem, Court, SlotRangeSelection, PaymentType, RightPanelMode, StoredCustomerInfo } from '../types'
import { MOCK_COURTS, TIME_SLOTS, INITIAL_BOOKINGS } from '../data/mockScheduleData'
import { getLapangan, getAllBookings, createBooking } from '../../../lib/api'
import { getTodayISODate, getInitials } from '../utils/formatters'
import type { Booking as DbBooking } from '../../../types/database'

// Jam acuan kalender saat ini (sinkron dengan indikator garis biru 10:40)
export const CALENDAR_CURRENT_TIME = {
  hour: 10,
  minute: 40,
  display: '10:40',
}

const COURT_STYLE_MAP: Record<number, { type: string; image: string }> = {
  1: {
    type: 'Panoramic Glass',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
  },
  2: {
    type: 'Pro Championship',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
  },
  3: {
    type: 'VIP Indoor AC',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
  },
  4: {
    type: 'Training Ground',
    image: 'https://images.unsplash.com/photo-1521537634581-0dced2fedc2a?auto=format&fit=crop&w=600&q=80',
  },
}

// Konversi data booking dari tabel Supabase ke struktur BookingItem tampilan kalender
function mapDbBookingsToItems(
  dbBookings: DbBooking[],
  targetDate: string,
  courtList: Court[],
): BookingItem[] {
  const matching = dbBookings.filter(
    (b) => b.tgl_main === targetDate && b.status !== 'Batal',
  )

  const items: BookingItem[] = []

  matching.forEach((b) => {
    const slots = b.jam_slots || []
    if (slots.length === 0) return

    // Kelompokkan slot jam yang bersambung (contiguous)
    const sorted = [...slots].sort((x, y) => parseInt(x, 10) - parseInt(y, 10))
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

export function useReservasiSchedule() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISODate())
  const [courts, setCourts] = useState<Court[]>(MOCK_COURTS)
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS)
  const [allDbBookings, setAllDbBookings] = useState<DbBooking[]>([])
  const [panelMode, setPanelMode] = useState<RightPanelMode>('empty')
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<SlotRangeSelection | null>(null)
  const [customer, setCustomer] = useState<StoredCustomerInfo | null>(null)
  const [rangeError, setRangeError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Auto-dismiss pesan error setelah 4 detik
  useEffect(() => {
    if (!rangeError) return
    const timer = setTimeout(() => {
      setRangeError(null)
    }, 4000)
    return () => clearTimeout(timer)
  }, [rangeError])

  // Baca data calon penyewa yang disimpan saat submit formulir Landing Page
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

  // 1. Ambil data lapangan aktif dari Supabase saat awal mount
  useEffect(() => {
    let isMounted = true

    async function loadCourts() {
      try {
        const dbCourts = await getLapangan()
        if (isMounted && dbCourts && dbCourts.length > 0) {
          const mapped: Court[] = dbCourts.map((c) => ({
            id: c.id,
            name: c.nama_lapangan,
            type: COURT_STYLE_MAP[c.id]?.type || 'Standard Court',
            image:
              COURT_STYLE_MAP[c.id]?.image ||
              'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=600&q=80',
            pricePerHour: c.tarif_per_jam,
          }))
          setCourts(mapped)
        }
      } catch (err) {
        console.warn('Gagal memuat data lapangan Supabase, menggunakan mock courts:', err)
      }
    }

    loadCourts()
    return () => {
      isMounted = false
    }
  }, [])

  // 2. Ambil data seluruh transaksi booking dari Supabase
  useEffect(() => {
    let isMounted = true

    async function loadBookings() {
      try {
        setIsLoading(true)
        const data = await getAllBookings()
        if (isMounted) {
          setAllDbBookings(data)
        }
      } catch (err) {
        console.warn('Gagal memuat data bookings Supabase, menggunakan initial bookings:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadBookings()
    return () => {
      isMounted = false
    }
  }, [])

  // 3. Sinkronkan booking ke grid saat selectedDate, allDbBookings, atau courts berubah
  useEffect(() => {
    if (allDbBookings.length > 0) {
      const mapped = mapDbBookingsToItems(allDbBookings, selectedDate, courts)
      setBookings(mapped)
    } else {
      const fallback = INITIAL_BOOKINGS.filter((b) => b.date === selectedDate)
      setBookings(fallback.length > 0 ? fallback : [])
    }
  }, [selectedDate, allDbBookings, courts])

  // Fungsi pengecekan apakah suatu jam slot sudah lewat dari jam sekarang
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

  // Cari booking pada lapangan dan jam tertentu
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

  // Cek apakah suatu slot termasuk dalam rentang pilihan aktif
  const isSlotInRange = useCallback(
    (courtId: number | string, time: string): boolean => {
      if (!selectedSlot || String(selectedSlot.courtId) !== String(courtId)) return false
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

    // 1. Validasi waktu lampau: DILARANG booking < dari jam sekarang (10:40 jika hari ini)
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

    // Jika belum ada pilihan, atau user klik di lapangan berbeda, atau pilihan sebelumnya sudah berupa rentang (>1 jam):
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

    // Jika user mengklik slot jam yang sama persis:
    if (selectedSlot.startHour === clickedHour) {
      return
    }

    // Urutkan nilai min dan max secara otomatis
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

    // Rentang valid: otomatis rangkum seluruh jam terpilih
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

  // Konfirmasi pembuatan booking baru oleh calon penyewa (User POV) & simpan ke Supabase
  const handleCreateBooking = async (paymentType: PaymentType, notes?: string) => {
    if (!selectedSlot) return

    const totalPrice = selectedSlot.totalPrice
    const paidAmount = paymentType === 'DP' ? totalPrice * 0.5 : totalPrice
    const remainingAmount = totalPrice - paidAmount

    const customerName = customer?.nama || 'Calon Penyewa'
    const customerWhatsapp = customer?.whatsapp || '08123456789'
    const customerEmail = customer?.email || 'penyewa@example.com'

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
        notes: notes || 'Booking lapangan via Blanca Padel.',
        avatarInitials,
      }

      setAllDbBookings((prev) => [savedBooking, ...prev])
      setBookings((prev) => [...prev, newBookingItem])
      setSelectedBooking(newBookingItem)
      setSelectedSlot(null)
      setPanelMode('receipt')
    } catch (error) {
      console.error('Gagal menyimpan booking ke Supabase:', error)
      // Fallback lokal agar UX tetap lancar jika offline
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
        notes: notes || 'Booking lapangan via Blanca Padel (Offline).',
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

  // Hapus pesan error bentrok/waktu lampau
  const handleClearError = useCallback(() => {
    setRangeError(null)
  }, [])

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

