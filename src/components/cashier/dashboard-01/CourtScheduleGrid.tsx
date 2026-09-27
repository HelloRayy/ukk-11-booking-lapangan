// PERAN FILE: Visualisasi Kalender Lapangan Kasir Terpadu 1:1 Codebase & UI Reservasi
import { useState, useMemo, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  User,
  Phone,
  Check,
  X,
  ChevronDown,
  QrCode,
  CreditCard,
  Search,
  ArrowRight,
  Receipt,
  ShieldAlert,
  MessageCircle,
} from 'lucide-react'
import { createBooking } from '../../../lib/api'
import type { Booking as DbBooking, Lapangan, StatusBooking } from '../../../types/database'
import { formatDateDDMMYYYY } from '../../../lib/utils'
import CashierDatePicker from './CashierDatePicker'

// Komponen & Hook Baku 1:1 dari Modul Reservasi
import ScheduleHeader from '../../reservation/components/ScheduleHeader'
import ScheduleGrid from '../../reservation/components/ScheduleGrid'
import EmptyInspectorView from '../../reservation/components/inspector/EmptyInspectorView'
import PaymentLoadingView from '../../reservation/components/inspector/PaymentLoadingView'
import QrisPaymentView from '../../reservation/components/QrisPaymentView'
import BookingReceiptView from '../../reservation/components/BookingReceiptView'
import { mapDbBookingsToItems } from '../../reservation/utils/bookingMapper'
import { formatRupiah, getInitials, getTodayISODate } from '../../reservation/utils/formatters'
import { TIME_SLOTS, CALENDAR_CURRENT_TIME } from '../../reservation/constants/scheduleConfig'
import type { Court, BookingItem, SlotRangeSelection, PaymentType, RightPanelMode } from '../../reservation/types'
import { useSlotValidation } from '../../reservation/hooks/useSlotValidation'

interface CourtScheduleGridProps {
  bookings: DbBooking[]
  courts: Lapangan[]
  loading: boolean
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onRefresh: () => void
  onOpenManualModalWithSlot?: (courtId: number, date: string, hour: string) => void
  initialDate?: string | null
  initialBookingId?: number | string | null
}

export default function CourtScheduleGrid({
  bookings,
  courts,
  loading,
  onLunasi,
  onBatal,
  onRefresh,
  initialDate,
  initialBookingId,
}: CourtScheduleGridProps) {
  // State Tanggal Terpilih (Default: Hari Ini YYYY-MM-DD atau initialDate jika diberikan)
  const [selectedDate, setSelectedDate] = useState<string>(() => initialDate || getTodayISODate())

  // State Orkestrasi Panel Kanan 1:1 Reservasi ('empty' | 'inspect' | 'create' | 'receipt')
  const [panelMode, setPanelMode] = useState<RightPanelMode>('empty')
  const [selectedSlot, setSelectedSlot] = useState<SlotRangeSelection | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null)
  const [rangeError, setRangeError] = useState<string | null>(null)

  // Sub-step dalam flow create walk-in ('details' | 'loading' | 'payment')
  const [bookingStep, setBookingStep] = useState<'details' | 'loading' | 'payment'>('details')
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | null>(null)
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
  const [isViewingReceipt, setIsViewingReceipt] = useState(false)

  // State Layar QRIS Pelunasan Kasir
  const [isInspectQrisActive, setIsInspectQrisActive] = useState(false)
  const [inspectQrisSeconds, setInspectQrisSeconds] = useState(900)

  // Form State Admin Kasir (Nama, WA, Catatan, Skema Bayar) - Default Kosong Murni
  const [customerName, setCustomerName] = useState('')
  const [customerWhatsapp, setCustomerWhatsapp] = useState('')
  const [paymentType, setPaymentType] = useState<PaymentType>('DP')
  const [notes, setNotes] = useState('')

  // State Pencarian Jadwal Lapangan (Search Bar)
  const [searchQuery, setSearchQuery] = useState('')

  // Mapping courts Lapangan[] ke Court[] 1:1
  const mappedCourts: Court[] = useMemo(() => {
    if (courts && courts.length > 0) {
      return courts.map((c) => ({
        id: c.id,
        name: c.nama_lapangan,
        type: c.nama_lapangan.toLowerCase().includes('futsal') ? 'Vinyl Flooring' : 'Panoramic Glass',
        image: `/assets/courts/court-${((c.id - 1) % 4) + 1}.webp`,
        pricePerHour: c.tarif_per_jam,
      }))
    }
    return [
      { id: 1, name: 'Court 1', type: 'Panoramic Glass', image: '/assets/courts/court-1.webp', pricePerHour: 50000 },
      { id: 2, name: 'Court 2', type: 'Pro Championship', image: '/assets/courts/court-2.webp', pricePerHour: 50000 },
      { id: 3, name: 'Court 3', type: 'VIP Indoor AC', image: '/assets/courts/court-3.webp', pricePerHour: 50000 },
      { id: 4, name: 'Court 4', type: 'Training Ground', image: '/assets/courts/court-4.webp', pricePerHour: 100000 },
    ]
  }, [courts])

  // Mapping DbBooking[] ke BookingItem[] 1:1
  const mappedBookings: BookingItem[] = useMemo(() => {
    return mapDbBookingsToItems(bookings, selectedDate, mappedCourts)
  }, [bookings, selectedDate, mappedCourts])

  // Validasi Jam Lampau & Bentrok Jadwal
  const { isPastSlot, getSlotBooking, isSlotInRange } = useSlotValidation({
    selectedDate,
    bookings: mappedBookings,
    selectedSlot,
  })

  // Auto-dismiss range error
  useEffect(() => {
    if (!rangeError) return
    const timer = setTimeout(() => setRangeError(null), 4000)
    return () => clearTimeout(timer)
  }, [rangeError])

  // Sinkronisasi tanggal dari navigasi eksternal (Overview / Transaksi)
  useEffect(() => {
    if (initialDate && initialDate !== selectedDate) {
      setSelectedDate(initialDate)
    }
  }, [initialDate])

  // Otomatis sorot & buka inspektor booking saat diarahkan dari navigasi eksternal
  useEffect(() => {
    if (initialBookingId && mappedBookings.length > 0) {
      const match = mappedBookings.find(
        (b) =>
          String(b.id) === String(initialBookingId) ||
          String(b.invoiceNumber).includes(String(initialBookingId))
      )
      if (match) {
        handleSelectBooking(match)
      }
    }
  }, [initialBookingId, mappedBookings, selectedDate])

  // Keyboard shortcut: Escape untuk menutup panel inspektor / batalkan pilihan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panelMode !== 'empty') {
        handleClosePanel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [panelMode])

  // Timer Countdown Layar QRIS Pelunasan Kasir
  useEffect(() => {
    if (!isInspectQrisActive) return
    setInspectQrisSeconds(900)
    const interval = setInterval(() => {
      setInspectQrisSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsInspectQrisActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isInspectQrisActive])

  // Navigasi Tanggal
  const handleShiftDate = (offset: number) => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    dateObj.setDate(dateObj.getDate() + offset)
    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const d = String(dateObj.getDate()).padStart(2, '0')
    setSelectedDate(`${y}-${m}-${d}`)
    handleClosePanel()
  }

  // Format Judul Tanggal Indonesia
  const formattedDateTitle = useMemo(() => {
    try {
      const [year, month, day] = selectedDate.split('-').map(Number)
      const dateObj = new Date(year, month - 1, day)
      return dateObj.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return selectedDate
    }
  }, [selectedDate])

  // Pengecekan Hasil Pencarian pada Tanggal Terpilih
  const searchFilteredBookingIds = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase().trim()
    const matchedIds = new Set<string>()
    mappedBookings.forEach((b) => {
      const nameMatch = b.customerName?.toLowerCase().includes(q)
      const phoneMatch = b.customerWhatsapp?.toLowerCase().includes(q)
      const idMatch = b.invoiceNumber?.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
      const courtMatch = b.courtName?.toLowerCase().includes(q)
      if (nameMatch || phoneMatch || idMatch || courtMatch) {
        matchedIds.add(b.id)
      }
    })
    return matchedIds
  }, [searchQuery, mappedBookings])

  // Pengecekan Hasil Pencarian pada Tanggal Lain (Cross-Date Discovery)
  const otherDateMatches = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase().trim()
    return bookings.filter((b) => {
      if (b.tgl_main === selectedDate || b.status === 'Batal') return false
      const nameMatch = b.nama_penyewa?.toLowerCase().includes(q)
      const phoneMatch = b.no_hp?.toLowerCase().includes(q)
      const idMatch = String(b.id).includes(q)
      return nameMatch || phoneMatch || idMatch
    })
  }, [searchQuery, bookings, selectedDate])

  // Aksi Klik Slot Kosong (1:1 Logika Seleksi Reservasi)
  const handleSelectEmptySlot = (court: Court, clickedTime: string) => {
    setRangeError(null)

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
      setBookingStep('details')
      setIsInspectQrisActive(false)
      setIsViewingReceipt(false)
      setCustomerName('')
      setCustomerWhatsapp('')
      setNotes('')
      setPaymentType('DP')
      return
    }

    if (selectedSlot.startHour === clickedHour) {
      handleClosePanel()
      return
    }

    const minH = Math.min(selectedSlot.startHour, clickedHour)
    const maxH = Math.max(selectedSlot.startHour, clickedHour)

    const hoursInRange: string[] = []
    let hasCollision = false
    let hasPastHour = false

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
    setBookingStep('details')
    setIsInspectQrisActive(false)
    setIsViewingReceipt(false)
  }

  // Aksi Klik Booking Terisi (Untuk Admin Kasir: Langsung Buka Mode Inspeksi & Aksi Pelunasan)
  const handleSelectBooking = (booking: BookingItem) => {
    setSelectedSlot(null)
    setSelectedBooking(booking)
    setIsViewingReceipt(false)
    setIsInspectQrisActive(false)
    setPanelMode('inspect')
  }

  // Tutup Panel Samping Kanan
  const handleClosePanel = () => {
    setPanelMode('empty')
    setSelectedBooking(null)
    setSelectedSlot(null)
    setBookingStep('details')
    setExpiryTimestamp(null)
    setIsViewingReceipt(false)
    setIsInspectQrisActive(false)
    setCustomerName('')
    setCustomerWhatsapp('')
    setNotes('')
  }

  // Flow Eksekusi Simpan Booking Walk-in ke Supabase
  const executeBookingCreation = async (pType: PaymentType, currentNotes?: string) => {
    if (!selectedSlot) return

    const totalBayar = selectedSlot.totalPrice
    const isLunas = pType === 'Lunas'
    const nominalDibayar = isLunas ? totalBayar : Math.round(totalBayar * 0.5)
    const sisaBayar = totalBayar - nominalDibayar
    const finalStatus: StatusBooking = isLunas ? 'Lunas' : 'Booked'

    const cleanWa = customerWhatsapp.replace(/\D/g, '')

    const newDbBooking = await createBooking({
      lapangan_id: Number(selectedSlot.courtId),
      nama_penyewa: customerName.trim() || 'Penyewa Walk-in',
      no_hp: cleanWa || '085700000000',
      tgl_main: selectedSlot.date,
      jam_slots: selectedSlot.selectedHours,
      durasi_jam: selectedSlot.totalHours,
      total_bayar: totalBayar,
      nominal_dibayar: nominalDibayar,
      sisa_bayar: sisaBayar,
      tipe_bayar: pType,
      status: finalStatus,
    })

    // Segarkan data kasir di tabel/overview
    onRefresh()

    // Buat objek BookingItem untuk langsung menampilkan Struk Digital Resmi (1:1 Reservasi)
    const createdItem: BookingItem = {
      id: `db-${newDbBooking.id}`,
      invoiceNumber: `INV-${newDbBooking.id}`,
      createdAt: 'Baru saja',
      courtId: newDbBooking.lapangan_id,
      courtName: selectedSlot.courtName,
      customerName: newDbBooking.nama_penyewa,
      customerWhatsapp: newDbBooking.no_hp,
      customerEmail: 'kasir@blanca.arena',
      date: newDbBooking.tgl_main,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: 'booked',
      paymentType: pType,
      totalPrice: totalBayar,
      paidAmount: nominalDibayar,
      remainingAmount: sisaBayar,
      notes: currentNotes || notes,
      avatarInitials: getInitials(newDbBooking.nama_penyewa),
    }

    setSelectedBooking(createdItem)
    setSelectedSlot(null)
    setPanelMode('receipt')
  }

  // Simpan Langsung (Metode Tunai / Kasir Langsung)
  const handleConfirmCashBooking = async () => {
    setIsVerifyingPayment(true)
    try {
      await executeBookingCreation(paymentType, notes)
    } finally {
      setIsVerifyingPayment(false)
      setBookingStep('details')
    }
  }

  // Lanjut ke Layar QRIS Dinamis 15 Menit
  const handleProceedToQris = () => {
    setBookingStep('loading')
    setTimeout(() => {
      setExpiryTimestamp(Date.now() + 15 * 60 * 1000)
      setBookingStep('payment')
    }, 600)
  }

  // Konfirmasi Pembayaran QRIS Berhasil
  const handleConfirmQrisPayment = async () => {
    setIsVerifyingPayment(true)
    try {
      await new Promise((r) => setTimeout(r, 900))
      await executeBookingCreation(paymentType, notes)
    } finally {
      setIsVerifyingPayment(false)
      setBookingStep('details')
      setExpiryTimestamp(null)
    }
  }

  // Filter Bookings untuk Grid: jika sedang search, filter atau beri highlight
  const bookingsForGrid = useMemo(() => {
    if (!searchFilteredBookingIds) return mappedBookings
    return mappedBookings.map((b) => ({
      ...b,
      // Berikan style khusus jika cocok
    }))
  }, [mappedBookings, searchFilteredBookingIds])

  // Helper kalkulasi sisa & biaya form
  const dpAmount = selectedSlot ? selectedSlot.totalPrice * 0.5 : 0
  const currentPayAmount = selectedSlot
    ? paymentType === 'DP'
      ? dpAmount
      : selectedSlot.totalPrice
    : 0

  // Format ringkas tanggal slot terpilih
  const formattedSlotDate = useMemo(() => {
    if (!selectedSlot) return ''
    try {
      const [y, m, d] = selectedSlot.date.split('-').map(Number)
      const dateObj = new Date(y, m - 1, d)
      return dateObj.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return selectedSlot.date
    }
  }, [selectedSlot])

  // Ekstrak ID asli dari booking terpilih untuk aksi pelunasan kasir
  const selectedDbId = useMemo(() => {
    if (!selectedBooking) return null
    if (selectedBooking.invoiceNumber) {
      const num = parseInt(selectedBooking.invoiceNumber.replace(/\D/g, ''), 10)
      if (!isNaN(num)) return num
    }
    const clean = parseInt(selectedBooking.id.replace(/\D/g, ''), 10)
    return isNaN(clean) ? null : clean
  }, [selectedBooking])

  // Pelunasan Tunai Langsung
  const handleCashPelunasan = async () => {
    if (!selectedDbId || !selectedBooking) return
    setIsVerifyingPayment(true)
    try {
      await onLunasi(selectedDbId)
      setSelectedBooking((prev) =>
        prev
          ? {
              ...prev,
              status: 'Sudah Lunas',
              remainingAmount: 0,
              paidAmount: prev.totalPrice,
            }
          : null
      )
      setIsViewingReceipt(true)
    } finally {
      setIsVerifyingPayment(false)
    }
  }

  // Buka Layar QRIS Pelunasan Kasir
  const handleOpenInspectQris = () => {
    setIsInspectQrisActive(true)
  }

  // Konfirmasi QRIS Pelunasan Kasir Berhasil
  const handleConfirmInspectQris = async () => {
    if (!selectedDbId || !selectedBooking) return
    setIsVerifyingPayment(true)
    try {
      await new Promise((r) => setTimeout(r, 600))
      await onLunasi(selectedDbId)
      setSelectedBooking((prev) =>
        prev
          ? {
              ...prev,
              status: 'Sudah Lunas',
              remainingAmount: 0,
              paidAmount: prev.totalPrice,
            }
          : null
      )
      setIsInspectQrisActive(false)
      setIsViewingReceipt(true)
    } finally {
      setIsVerifyingPayment(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-aeonik select-none overflow-hidden">
      {/* 1. Control Toolbar Atas Minimalis Selaras dengan Tab Transaksi & Overview */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-2.5 border-b border-zinc-800/80 bg-zinc-950">
        {/* Sisi Kiri: Search Bar Terpadu Bersih */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi..."
              className="w-full h-9 pl-9 pr-8 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400/60 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 p-0.5 cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sisi Kanan: Popover Kalender Tanggal, Legend Status & Refresh Icon Button */}
        <div className="flex items-center gap-2.5 justify-end">
          {/* Popover Kalender Tanggal 1:1 Reservasi Ringkas */}
          <CashierDatePicker
            selectedDate={selectedDate}
            onDateChange={(newDate) => {
              setSelectedDate(newDate)
              handleClosePanel()
            }}
            align="right"
          />

          {/* Legend Status Slot Jam Ringkas */}
          <div className="hidden sm:flex items-center gap-3 text-sm text-zinc-300 px-3 border-x border-zinc-800/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Lunas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>DP 50%</span>
            </div>
          </div>

          {/* Tombol Muat Ulang / Refresh Icon Button */}
          <button
            type="button"
            onClick={onRefresh}
            className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Muat Ulang Jadwal"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Banner Hasil Pencarian Jadwal Lapangan */}
      {searchQuery.trim() && (
        <div className="shrink-0 px-5 py-2.5 bg-[#1b1a15] border-b border-[#f2d953]/30 flex flex-wrap items-center justify-between text-sm gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#f2d953]" />
            <span className="text-[#d1d1d1]">
              Hasil pencarian &ldquo;<strong className="text-[#f2d953]">{searchQuery}</strong>&rdquo;:
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f2d953]/15 text-[#f2d953] font-semibold text-[11px] border border-[#f2d953]/30">
              {searchFilteredBookingIds?.size || 0} jadwal cocok di tanggal ini
            </span>
          </div>

          {otherDateMatches.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8e8e8e]">
                Ditemukan juga di tanggal lain ({otherDateMatches[0].tgl_main}):
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedDate(otherDateMatches[0].tgl_main)
                  handleClosePanel()
                }}
                className="px-2.5 py-1 rounded-md bg-[#f2d953] text-[#161616] font-bold text-[11px] hover:bg-[#ffe359] transition-colors cursor-pointer"
              >
                Buka Jadwal {otherDateMatches[0].tgl_main}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Area Utama 1:1 Reservasi (Kalender di Kiri, RightPanel di Kanan) */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Kolom Kiri: Tabel Kalender (Header Lapangan + Grid Jam 1:1) */}
        <div className="flex-1 flex flex-col overflow-x-auto overflow-y-hidden min-w-0 border-r border-zinc-800/80 relative">
          <div className="min-w-[720px] sm:min-w-[780px] flex-1 flex flex-col h-full">
            <ScheduleHeader courts={mappedCourts} />
            <ScheduleGrid
              courts={mappedCourts}
              timeSlots={TIME_SLOTS}
              bookings={bookingsForGrid}
              selectedBooking={selectedBooking}
              selectedSlot={selectedSlot}
              selectedDate={selectedDate}
              customerName={customerName}
              rangeError={rangeError}
              getSlotBooking={getSlotBooking}
              isSlotInRange={isSlotInRange}
              isPastSlot={isPastSlot}
              onSelectBooking={handleSelectBooking}
              onSelectEmptySlot={handleSelectEmptySlot}
              onClearSelection={handleClosePanel}
              onClearError={() => setRangeError(null)}
            />
          </div>
        </div>

        {/* Panel Kanan 1:1 Reservasi (Docked Desktop, Drawer Mobile) */}
        {/* Backdrop Mobile Overlay */}
        {panelMode !== 'empty' && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
            onClick={handleClosePanel}
          />
        )}

        <aside
          aria-label="Panel Reservasi Lapangan"
          className={
            panelMode === 'empty'
              ? 'hidden lg:flex lg:w-[380px] xl:w-[420px] bg-zinc-950 border-l border-zinc-800/80 p-6 flex-col justify-between overflow-y-auto select-none font-sans shrink-0'
              : 'fixed inset-x-0 bottom-0 max-h-[90vh] z-50 rounded-t-2xl border-t border-zinc-800 shadow-2xl bg-zinc-950 p-5 sm:p-6 lg:static lg:inset-auto lg:max-h-none lg:z-auto lg:rounded-none lg:border-t-0 lg:border-l lg:border-zinc-800/80 lg:shadow-none w-full lg:w-[380px] xl:w-[420px] flex flex-col justify-between overflow-y-auto select-none font-sans shrink-0'
          }
        >
          {/* Mobile Handle Indicator */}
          {panelMode !== 'empty' && (
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3 lg:hidden shrink-0" />
          )}

          {/* KONDISI A: EMPTY STATE 1:1 RESERVASI */}
          {panelMode === 'empty' && <EmptyInspectorView />}

          {/* KONDISI B: STRUK DIGITAL RESMI 1:1 RESERVASI */}
          {panelMode === 'receipt' && selectedBooking && (
            <BookingReceiptView
              booking={selectedBooking}
              onClose={handleClosePanel}
            />
          )}

          {/* KONDISI C: INSPECT JADWAL TERISI (Dengan Aksi Admin Kasir) */}
          {panelMode === 'inspect' && selectedBooking && (
            isViewingReceipt ? (
              <BookingReceiptView
                booking={selectedBooking}
                onClose={() => setIsViewingReceipt(false)}
              />
            ) : isInspectQrisActive ? (
              /* Layar Pembayaran QRIS Pelunasan Kasir Dinamis */
              <div className="flex flex-col justify-between h-full animate-in fade-in duration-200 select-none font-aeonik">
                <div className="space-y-4">
                  {/* Top Bar Navigasi */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsInspectQrisActive(false)}
                      className="flex items-center gap-1.5 text-xs text-[#a3a3a3] hover:text-white px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Kembali ke Rincian</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info Pelunasan */}
                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-semibold text-[#f2d953] tracking-wide uppercase block">
                      Pelunasan Kasir
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      QRIS Dinamis #{selectedBooking.invoiceNumber || selectedBooking.id}
                    </h3>
                    <p className="text-xs text-[#8e8e8e]">
                      Atas nama <strong className="text-white font-medium">{selectedBooking.customerName}</strong>
                    </p>
                  </div>

                  {/* QRIS Scan Frame dengan Animasi Garis Scan */}
                  <div className="p-4 rounded-2xl bg-[#1c1c1c] border border-[#2e2e2e] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="relative p-2.5 bg-white rounded-xl shadow-lg">
                      <img
                        src="/assets/quiz-button.png"
                        alt="QRIS Pelunasan"
                        className="w-40 h-40 object-contain"
                      />
                      <div className="absolute inset-x-2.5 top-2.5 h-0.5 bg-emerald-500/80 shadow-[0_0_8px_#10b981] animate-pulse" />
                    </div>

                    {/* Timer Countdown */}
                    <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#a3a3a3]">
                      <Clock className="w-3.5 h-3.5 text-[#f2d953]" />
                      <span>Sisa waktu:</span>
                      <span className="font-bold text-[#f2d953]">
                        {Math.floor(inspectQrisSeconds / 60).toString().padStart(2, '0')}:
                        {(inspectQrisSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Rincian Sisa Tagihan */}
                  <div className="p-3.5 rounded-xl bg-[#202020] border border-[#2a2a2a] space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#8e8e8e]">
                      <span>Nominal Pelunasan:</span>
                      <span className="text-lg font-bold text-[#f2d953]">
                        {formatRupiah(selectedBooking.remainingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#737373] text-[11px] pt-1.5 border-t border-white/5">
                      <span>Status Pembayaran:</span>
                      <span className="text-[#f2d953] font-medium">DP 50% (Perlu Pelunasan)</span>
                    </div>
                  </div>
                </div>

                {/* Tombol Konfirmasi Pembayaran QRIS */}
                <div className="pt-3 border-t border-[#262626] mt-3 space-y-2">
                  <button
                    type="button"
                    disabled={isVerifyingPayment}
                    onClick={handleConfirmInspectQris}
                    className="w-full h-11 rounded-xl bg-[#f2d953] hover:bg-[#ffe359] text-[#161616] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isVerifyingPayment ? 'Memverifikasi...' : 'Konfirmasi QRIS Berhasil'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInspectQrisActive(false)}
                    className="w-full h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[#8e8e8e] hover:text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              /* Inspect Detail Standby */
              <div className="flex flex-col justify-between h-full animate-in fade-in duration-200 select-none font-aeonik">
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Informasi Jadwal
                    </h2>
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                      aria-label="Tutup panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Kartu Ringkasan Terisi (1:1 Style Reservasi) */}
                  <div className="p-4 rounded-xl bg-[#202020] border border-[#2e2e2e] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#8e8e8e]">{selectedBooking.courtName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          selectedBooking.remainingAmount === 0
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#f2d953]/20 text-[#f2d953] border border-[#f2d953]/30'
                        }`}
                      >
                        {selectedBooking.remainingAmount === 0 ? 'Lunas 100%' : 'DP 50%'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] border border-white/10 text-[#f2d953] flex items-center justify-center text-sm font-bold shrink-0">
                        {selectedBooking.avatarInitials || getInitials(selectedBooking.customerName)}
                      </div>
                      <div className="truncate">
                        <span className="text-base font-bold text-white block truncate">
                          {selectedBooking.customerName}
                        </span>
                        <span className="text-xs text-[#8e8e8e] block">
                          {formatDateDDMMYYYY(selectedBooking.date)} • {selectedBooking.startTime}–{selectedBooking.endTime}
                        </span>
                      </div>
                    </div>

                    {/* Rincian Finansial Kasir (Tanpa font-mono) */}
                    <div className="pt-2.5 border-t border-[#2e2e2e] space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[#8e8e8e]">
                        <span>Total Tagihan:</span>
                        <span className="text-white font-semibold">
                          {formatRupiah(selectedBooking.totalPrice)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#8e8e8e]">
                        <span>Sudah Dibayar:</span>
                        <span className="text-emerald-400 font-semibold">
                          {formatRupiah(selectedBooking.paidAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <span className="text-[#8e8e8e]">Sisa Tagihan:</span>
                        <span
                          className={`font-bold ${
                            selectedBooking.remainingAmount > 0 ? 'text-[#f2d953]' : 'text-emerald-400'
                          }`}
                        >
                          {formatRupiah(selectedBooking.remainingAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Tombol Utama Aksi Kasir Terpadu (Bayar, Chat WA, Batal) */}
                <div className="pt-3 border-t border-[#262626] space-y-2.5 mt-3">
                  {/* 1. Tombol Bayar Pelunasan */}
                  {selectedBooking.remainingAmount > 0 && selectedDbId ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isVerifyingPayment}
                        onClick={handleCashPelunasan}
                        className="flex-1 h-10 rounded-xl bg-[#f2d953] hover:bg-[#ffe359] text-[#161616] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>
                          {isVerifyingPayment
                            ? 'Menyimpan...'
                            : `Bayar Pelunasan (${formatRupiah(selectedBooking.remainingAmount)})`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenInspectQris}
                        className="w-10 h-10 rounded-xl bg-[#222222] hover:bg-[#282828] border border-[#383838] hover:border-[#f2d953]/50 text-white hover:text-[#f2d953] flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-98"
                        title="Bayar via QRIS Dinamis"
                      >
                        <QrCode className="w-4 h-4 text-[#f2d953]" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Status: Sudah Lunas</span>
                    </div>
                  )}

                  {/* 2. Tombol Chat WhatsApp */}
                  {(() => {
                    const rawPhone = selectedBooking.customerWhatsapp || ''
                    const cleanPhone = rawPhone.replace(/\D/g, '')
                    const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
                    const waText = encodeURIComponent(
                      `Halo Kak ${selectedBooking.customerName}, kami dari Blanca Badminton Arena terkait reservasi jadwal main Anda:\n` +
                      `• Lapangan: ${selectedBooking.courtName}\n` +
                      `• Tanggal: ${formatDateDDMMYYYY(selectedBooking.date)}\n` +
                      `• Jam: ${selectedBooking.startTime}–${selectedBooking.endTime}\n` +
                      `• Status: ${selectedBooking.remainingAmount > 0 ? `DP 50% (Sisa Tagihan: ${formatRupiah(selectedBooking.remainingAmount)})` : 'Lunas 100%'}\n\n` +
                      `Terima kasih!`
                    )
                    const waUrl = cleanPhone ? `https://wa.me/${waNumber}?text=${waText}` : '#'

                    return (
                      <a
                        href={waUrl}
                        target={cleanPhone ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!cleanPhone) {
                            e.preventDefault()
                            alert('Nomor WhatsApp penyewa tidak tersedia untuk booking ini.')
                          }
                        }}
                        className="w-full h-10 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-98"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Chat WhatsApp ({rawPhone || 'Penyewa'})</span>
                      </a>
                    )
                  })()}

                  {/* 3. Tombol Batalkan Transaksi */}
                  {selectedDbId && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Yakin batalkan booking #${selectedDbId} (${selectedBooking.customerName})? Slot jam akan otomatis dibuka kembali untuk pelanggan lain.`)) {
                          onBatal(selectedDbId)
                          handleClosePanel()
                        }
                      }}
                      className="w-full h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Batalkan Booking</span>
                    </button>
                  )}
                </div>
              </div>
            )
          )}

          {/* KONDISI D: FORM INPUT WALK-IN ADMIN 1:1 DENGAN BOOKINGDETAILSFORM RESERVASI */}
          {panelMode === 'create' && selectedSlot && (
            <div className="flex flex-col justify-between h-full animate-in fade-in duration-150 select-none font-aeonik">
              {/* Sub-Step Loading Animasi */}
              {bookingStep === 'loading' && (
                <PaymentLoadingView
                  title="Menyiapkan Pembayaran"
                  subtitle="Menghubungkan ke sistem QRIS Dinamis..."
                />
              )}

              {/* Sub-Step Layar QRIS Dinamis (1:1 Reservasi) */}
              {bookingStep === 'payment' && expiryTimestamp && (
                <QrisPaymentView
                  selectedSlot={selectedSlot}
                  paymentType={paymentType}
                  notes={notes}
                  expiryTimestamp={expiryTimestamp}
                  onBackToDetails={() => setBookingStep('details')}
                  onConfirmPayment={handleConfirmQrisPayment}
                  onCancelPayment={handleClosePanel}
                />
              )}

              {/* Sub-Step Loading Transisi Pembayaran */}
              {isVerifyingPayment && (
                <PaymentLoadingView
                  title="Memproses Transaksi"
                  subtitle="Menyimpan booking ke Supabase dan menerbitkan struk resmi..."
                />
              )}

              {/* Sub-Step Form Rincian Reservasi (1:1 UI Reservasi, Input Fleksibel untuk Admin) */}
              {bookingStep === 'details' && !isVerifyingPayment && (
                <div className="flex flex-col justify-between h-full">
                  <div className="overflow-y-auto pr-0.5 space-y-4">
                    {/* 1. Header Bersih */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">
                          Rincian Reservasi
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8e8e8e]">
                          <span className="font-semibold text-white">{selectedSlot.courtName}</span>
                          <span>•</span>
                          <span>{formattedSlotDate}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClosePanel}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#a3a3a3] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                        aria-label="Tutup rincian"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 2. Rincian Ringkas Lapangan & Jadwal */}
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-100">{selectedSlot.courtName}</span>
                        <span className="text-zinc-400">
                          {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.totalHours} jam)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/80">
                        <span className="text-zinc-400">Total Tarif</span>
                        <span className="font-bold text-zinc-100">
                          {formatRupiah(selectedSlot.totalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* 3. Pilihan Skema Pembayaran (Segmented Button Bersih) */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-zinc-400 block px-0.5">
                        Skema Bayar
                      </label>
                      <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900 border border-zinc-800 gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setPaymentType('DP')}
                          className={`py-2 px-2.5 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                            paymentType === 'DP'
                              ? 'bg-zinc-800 text-amber-400 font-semibold shadow-xs'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          DP 50% ({formatRupiah(dpAmount)})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentType('Lunas')}
                          className={`py-2 px-2.5 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                            paymentType === 'Lunas'
                              ? 'bg-zinc-800 text-amber-400 font-semibold shadow-xs'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          Lunas ({formatRupiah(selectedSlot.totalPrice)})
                        </button>
                      </div>
                    </div>

                    {/* 4. Form Input Pemesan */}
                    <div className="space-y-3 pt-1">
                      {/* Input Nama Pemesan */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-zinc-400 px-0.5 block">
                          Nama Penyewa
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Nama penyewa"
                            className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Input Nomor WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-zinc-400 px-0.5 block">
                          Nomor WhatsApp
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="tel"
                            value={customerWhatsapp}
                            onChange={(e) => setCustomerWhatsapp(e.target.value.replace(/\D/g, ''))}
                            placeholder="08xxxxxxxxxx"
                            maxLength={13}
                            className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Catatan Sewa */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-zinc-400 px-0.5 block">
                          Catatan (Opsional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Catatan tambahan..."
                          rows={2}
                          className="w-full p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Sticky Footer: Bayar Sekarang & Aksi Admin Kasir */}
                  <div className="pt-3 border-t border-zinc-800 mt-3 space-y-2.5">
                    <div className="flex justify-between items-baseline px-0.5">
                      <div>
                        <span className="text-xs text-zinc-400 block">
                          {paymentType === 'DP' ? 'Bayar Sekarang (DP 50%)' : 'Total Pembayaran'}
                        </span>
                        {paymentType === 'DP' && (
                          <span className="text-[11px] text-zinc-500">
                            Sisa {formatRupiah(dpAmount)} saat main
                          </span>
                        )}
                      </div>
                      <span className="text-lg font-bold text-amber-400 tracking-tight">
                        {formatRupiah(currentPayAmount)}
                      </span>
                    </div>

                    {(() => {
                      const isNameValid = customerName.trim().length >= 3
                      const isWaValid = /^08[0-9]{8,11}$/.test(customerWhatsapp.trim())
                      const isFormComplete = isNameValid && isWaValid

                      return (
                        <div className="space-y-2 pt-1">
                          {/* Tombol Simpan Tunai Kasir */}
                          <button
                            type="button"
                            disabled={!isFormComplete || isVerifyingPayment}
                            onClick={handleConfirmCashBooking}
                            className={`w-full h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                              isFormComplete
                                ? 'bg-amber-400 hover:bg-amber-300 text-zinc-950 cursor-pointer shadow-xs active:scale-[0.98]'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            }`}
                          >
                            <span>Simpan Booking (Kasir)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          {/* Tombol Alternatif QRIS Dinamis */}
                          <button
                            type="button"
                            disabled={!isFormComplete}
                            onClick={handleProceedToQris}
                            className="w-full h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <QrCode className="w-3.5 h-3.5 text-amber-400" />
                            <span>Bayar via QRIS</span>
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
