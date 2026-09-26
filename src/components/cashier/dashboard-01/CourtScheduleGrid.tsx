// PERAN FILE: Visualisasi Kalender Lapangan Kasir Terpadu (Grid Lapangan + ActiveSelectionCard + Right Panel Inspector)
import { useState, useMemo, useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  RefreshCw,
  Clock,
  Phone,
  User,
  Check,
  X,
  ChevronDown,
  QrCode,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  Copy,
  CheckCircle2,
  CalendarDays,
  ShieldAlert,
} from 'lucide-react'
import { createBooking } from '../../../lib/api'
import type { Booking, Lapangan, TipeBayar, StatusBooking } from '../../../types/database'
import {
  TIME_SLOTS,
  BASE_OPERATIONAL_HOUR,
  DEFAULT_SLOT_HEIGHT,
  CALENDAR_CURRENT_TIME,
} from '../../reservation/constants/scheduleConfig'

interface CourtScheduleGridProps {
  bookings: Booking[]
  courts: Lapangan[]
  loading: boolean
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onRefresh: () => void
  onOpenManualModalWithSlot?: (courtId: number, date: string, hour: string) => void
}

interface SpanningBookingCard {
  uniqueKey: string
  booking: Booking
  courtId: number
  startTime: string
  endTime: string
  durationHours: number
  startDecimal: number
  endDecimal: number
}

interface SelectedSlotRange {
  courtId: number
  courtName: string
  date: string
  startHour: number
  endHour: number
  startTime: string
  endTime: string
  selectedHours: string[]
  totalHours: number
  pricePerHour: number
  totalPrice: number
}

const SLOT_HEIGHT = DEFAULT_SLOT_HEIGHT // 88px per 1 jam slot kalender
const BASE_HOUR = BASE_OPERATIONAL_HOUR // Jam operasional awal: 08:00

/**
 * Helper murni untuk menggabungkan jam_slots yang bersambung menjadi satu kartu spanning kontinu
 */
function getCourtSpanningCards(bookings: Booking[]): SpanningBookingCard[] {
  const cards: SpanningBookingCard[] = []

  bookings.forEach((b) => {
    const slots = b.jam_slots || []
    if (slots.length === 0) return

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

    contiguousGroups.forEach((grp, idx) => {
      const startTime = grp[0]
      const lastSlot = grp[grp.length - 1]
      const startH = parseInt(startTime.split(':')[0], 10)
      const lastH = parseInt(lastSlot.split(':')[0], 10)
      const endH = lastH + 1
      const endTime = `${endH < 10 ? '0' : ''}${endH}:00`
      const durationHours = grp.length

      cards.push({
        uniqueKey: `${b.id}-${idx}`,
        booking: b,
        courtId: b.lapangan_id,
        startTime,
        endTime,
        durationHours,
        startDecimal: startH,
        endDecimal: endH,
      })
    })
  })

  return cards
}

export default function CourtScheduleGrid({
  bookings,
  courts,
  loading,
  onLunasi,
  onBatal,
  onRefresh,
}: CourtScheduleGridProps) {
  // Helper tanggal lokal YYYY-MM-DD
  const getLocalDateString = (offsetDays: number = 0) => {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const date = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${date}`
  }

  // State Tanggal Terpilih
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString(0))

  // State Seleksi Slot Aktif di Grid (Walk-in creation flow)
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlotRange | null>(null)

  // State Booking Terpilih untuk Inspeksi / Pelunasan (Inspect flow)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // State Pesan Toast Bentrok / Error
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // State Pencarian Jadwal Lapangan Kasir
  const [searchQuery, setSearchQuery] = useState('')

  // Form State untuk Walk-in di Right Panel
  const [customerName, setCustomerName] = useState('')
  const [customerWhatsapp, setCustomerWhatsapp] = useState('')
  const [paymentType, setPaymentType] = useState<TipeBayar>('DP')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  // State QRIS Pelunasan Kasir
  const [isQrisActive, setIsQrisActive] = useState(false)
  const [qrisSecondsLeft, setQrisSecondsLeft] = useState(900) // 15 menit
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false)
  const paymentDropdownRef = useRef<HTMLDivElement>(null)

  // Tutup payment dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target as Node)) {
        setIsPaymentDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Timer QRIS
  useEffect(() => {
    if (!isQrisActive) return
    const timer = setInterval(() => {
      setQrisSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsQrisActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isQrisActive])

  // Reset Form saat selectedSlot berubah
  useEffect(() => {
    if (selectedSlot) {
      setSelectedBooking(null)
      setIsQrisActive(false)
      setFormError(null)
      if (!customerName) setCustomerName('Walk-in Kasir')
      if (!customerWhatsapp) setCustomerWhatsapp('08')
    }
  }, [selectedSlot])

  // Reset saat selectedBooking berubah
  useEffect(() => {
    if (selectedBooking) {
      setSelectedSlot(null)
      setIsQrisActive(false)
    }
  }, [selectedBooking])

  // Navigasi Tanggal
  const handleShiftDate = (offset: number) => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    dateObj.setDate(dateObj.getDate() + offset)
    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const d = String(dateObj.getDate()).padStart(2, '0')
    setSelectedDate(`${y}-${m}-${d}`)
    setSelectedSlot(null)
    setSelectedBooking(null)
  }

  // Format Tanggal Judul Header
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

  // Filter Bookings untuk Tanggal Terpilih (kecuali yang berstatus Batal)
  const dateBookings = useMemo(() => {
    return bookings.filter((b) => b.tgl_main === selectedDate && b.status !== 'Batal')
  }, [bookings, selectedDate])

  // Pengecekan Hasil Pencarian pada Tanggal Terpilih
  const searchFilteredBookingIds = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase().trim()
    const matchedIds = new Set<number>()
    dateBookings.forEach((b) => {
      const nameMatch = b.nama_penyewa?.toLowerCase().includes(q)
      const phoneMatch = b.no_hp?.toLowerCase().includes(q)
      const idMatch = String(b.id).includes(q)
      const courtMatch = b.lapangan?.nama_lapangan?.toLowerCase().includes(q)
      if (nameMatch || phoneMatch || idMatch || courtMatch) {
        matchedIds.add(b.id)
      }
    })
    return matchedIds
  }, [searchQuery, dateBookings])

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

  // Daftar Lapangan Aktif
  const activeCourtsList = useMemo(() => {
    return courts.length > 0
      ? courts
      : [
          { id: 1, nama_lapangan: 'Court 1 (Badminton)', status: 'Aktif' as const, tarif_per_jam: 50000 },
          { id: 2, nama_lapangan: 'Court 2 (Badminton)', status: 'Aktif' as const, tarif_per_jam: 50000 },
          { id: 3, nama_lapangan: 'Court 3 (Futsal)', status: 'Aktif' as const, tarif_per_jam: 120000 },
          { id: 4, nama_lapangan: 'Court 4 (Futsal)', status: 'Aktif' as const, tarif_per_jam: 120000 },
        ]
  }, [courts])

  // Spanning Cards untuk Hari Terpilih
  const spanningCards = useMemo(() => {
    return getCourtSpanningCards(dateBookings)
  }, [dateBookings])

  // Peta Cek Cepat Slot Terisi: key = `${courtId}_${hour}`
  const occupiedSlotsMap = useMemo(() => {
    const set = new Set<string>()
    dateBookings.forEach((b) => {
      ;(b.jam_slots || []).forEach((slot) => {
        set.add(`${b.lapangan_id}_${slot}`)
      })
    })
    return set
  }, [dateBookings])

  // Metrik Tanggal Ini
  const dateMetrics = useMemo(() => {
    const totalBookings = dateBookings.length
    let totalHours = 0
    let totalRevenue = 0
    let pendingRemaining = 0

    dateBookings.forEach((b) => {
      totalHours += b.durasi_jam || b.jam_slots?.length || 0
      totalRevenue += b.total_bayar || 0
      pendingRemaining += b.sisa_bayar || 0
    })

    const totalAvailableSlots = (activeCourtsList.length || 4) * TIME_SLOTS.length
    const occupancyRate = totalAvailableSlots > 0 ? Math.round((totalHours / totalAvailableSlots) * 100) : 0

    return { totalBookings, totalHours, totalRevenue, pendingRemaining, occupancyRate }
  }, [dateBookings, activeCourtsList.length])

  // Format Rupiah
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  // Logika Garis Waktu Berjalan Realtime
  const today = getLocalDateString(0)
  const isToday = selectedDate === today
  const currentTimeTop =
    (CALENDAR_CURRENT_TIME.hour - BASE_HOUR + CALENDAR_CURRENT_TIME.minute / 60) * SLOT_HEIGHT
  const isTimeWithinBounds =
    isToday &&
    CALENDAR_CURRENT_TIME.hour >= BASE_HOUR &&
    CALENDAR_CURRENT_TIME.hour <= 22

  /**
   * Logika Klik Slot Kosong (Mirip Reservasi):
   * 1. Jika belum ada slot dipilih, atau memilih lapangan lain -> buat seleksi baru 1 jam.
   * 2. Jika klik slot lain di lapangan yang sama -> rentangkan (multi-hour selection)
   *    dengan validasi apakah ada jadwal terisi di tengah rentang tersebut.
   */
  const handleSelectSlot = (court: Lapangan, hourStr: string) => {
    const hourNum = parseInt(hourStr.split(':')[0], 10)

    // Cek apakah slot sudah terisi
    if (occupiedSlotsMap.has(`${court.id}_${hourStr}`)) {
      setToastMessage(`Slot ${hourStr} di ${court.nama_lapangan} sudah dibooking.`)
      setTimeout(() => setToastMessage(null), 3000)
      return
    }

    if (!selectedSlot || selectedSlot.courtId !== court.id) {
      // Buat seleksi baru 1 jam
      const endH = hourNum + 1
      const endStr = `${endH < 10 ? '0' : ''}${endH}:00`
      setSelectedSlot({
        courtId: court.id,
        courtName: court.nama_lapangan,
        date: selectedDate,
        startHour: hourNum,
        endHour: endH,
        startTime: hourStr,
        endTime: endStr,
        selectedHours: [hourStr],
        totalHours: 1,
        pricePerHour: court.tarif_per_jam,
        totalPrice: court.tarif_per_jam,
      })
      return
    }

    // Lapangan sama: jika klik jam yang sama, batalkan seleksi
    if (selectedSlot.startHour === hourNum && selectedSlot.totalHours === 1) {
      setSelectedSlot(null)
      return
    }

    // Rentangkan jam dari min ke max
    const minH = Math.min(selectedSlot.startHour, hourNum)
    const maxH = Math.max(selectedSlot.startHour, hourNum)

    // Cek apakah ada tabrakan jadwal terisi di dalam rentang
    const candidateHours: string[] = []
    let hasCollision = false

    for (let h = minH; h <= maxH; h++) {
      const hStr = `${h < 10 ? '0' : ''}${h}:00`
      if (occupiedSlotsMap.has(`${court.id}_${hStr}`)) {
        hasCollision = true
        break
      }
      candidateHours.push(hStr)
    }

    if (hasCollision) {
      setToastMessage('Rentang jam terhalang oleh booking lain yang sudah terisi.')
      setTimeout(() => setToastMessage(null), 3500)
      return
    }

    const endH = maxH + 1
    const startStr = `${minH < 10 ? '0' : ''}${minH}:00`
    const endStr = `${endH < 10 ? '0' : ''}${endH}:00`
    const totalHours = candidateHours.length

    setSelectedSlot({
      courtId: court.id,
      courtName: court.nama_lapangan,
      date: selectedDate,
      startHour: minH,
      endHour: endH,
      startTime: startStr,
      endTime: endStr,
      selectedHours: candidateHours,
      totalHours,
      pricePerHour: court.tarif_per_jam,
      totalPrice: totalHours * court.tarif_per_jam,
    })
  }

  // Pilih slot pertama yang kosong (Shortcut Quick Walk-in)
  const handleQuickFirstSlot = () => {
    const firstCourt = activeCourtsList[0]
    if (!firstCourt) return

    for (const hour of TIME_SLOTS) {
      const hNum = parseInt(hour.split(':')[0], 10)
      const isPast = isToday && hNum < CALENDAR_CURRENT_TIME.hour
      if (!isPast && !occupiedSlotsMap.has(`${firstCourt.id}_${hour}`)) {
        handleSelectSlot(firstCourt, hour)
        return
      }
    }
  }

  // Submit Booking Walk-in dari Right Panel
  const handleSubmitWalkIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot) return

    if (!customerName.trim()) {
      setFormError('Nama penyewa wajib diisi.')
      return
    }

    const cleanWa = customerWhatsapp.replace(/\D/g, '')
    if (!cleanWa.startsWith('08') || cleanWa.length < 10 || cleanWa.length > 13) {
      setFormError('Nomor WhatsApp wajib berawalan 08 dan memiliki panjang 10-13 digit angka.')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const totalBayar = selectedSlot.totalPrice
      const isLunas = paymentType === 'Lunas'
      const nominalDibayar = isLunas ? totalBayar : Math.round(totalBayar * 0.5)
      const sisaBayar = totalBayar - nominalDibayar
      const finalStatus: StatusBooking = isLunas ? 'Lunas' : 'Booked'

      const newBookingPayload = {
        lapangan_id: selectedSlot.courtId,
        nama_penyewa: customerName.trim(),
        no_hp: cleanWa,
        tgl_main: selectedSlot.date,
        jam_slots: selectedSlot.selectedHours,
        durasi_jam: selectedSlot.totalHours,
        total_bayar: totalBayar,
        nominal_dibayar: nominalDibayar,
        sisa_bayar: sisaBayar,
        tipe_bayar: paymentType,
        status: finalStatus,
      }

      await createBooking(newBookingPayload)

      // Refresh data dari database
      onRefresh()
      setSelectedSlot(null)
      setCustomerName('')
      setCustomerWhatsapp('')
      setNotes('')
      setToastMessage('Booking walk-in berhasil disimpan ke database!')
      setTimeout(() => setToastMessage(null), 3000)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal menyimpan booking walk-in'
      setFormError(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Copy No HP Helper
  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => setCopiedPhone(null), 2000)
  }

  // WhatsApp Chat Link
  const getWhatsAppLink = (phone: string, name: string) => {
    const clean = phone.replace(/\D/g, '')
    const wa = clean.startsWith('0') ? '62' + clean.slice(1) : clean
    const text = encodeURIComponent(`Halo Kak ${name}, kami dari pengelola Blanca Arena terkait booking lapangan Anda.`)
    return `https://wa.me/${wa}?text=${text}`
  }

  return (
    <div className="flex flex-col h-full bg-[#161616] text-[#fafafa] font-aeonik select-none overflow-hidden">
      {/* 1. Control Toolbar Atas */}
      <div className="shrink-0 p-4 border-b border-[#262626] flex flex-wrap items-center justify-between gap-3 bg-[#181818]">
        {/* Navigasi Tanggal & Search Bar Jadwal Lapangan */}
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          <div className="flex items-center rounded-lg border border-[#262626] bg-[#141414] p-0.5">
            <button
              type="button"
              onClick={() => handleShiftDate(-1)}
              className="p-1.5 rounded text-[#8e8e8e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Hari Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-0.5 text-xs font-semibold text-white min-w-[190px] text-center">
              {formattedDateTitle}
            </div>
            <button
              type="button"
              onClick={() => handleShiftDate(1)}
              className="p-1.5 rounded text-[#8e8e8e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Hari Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Date Chips */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setSelectedDate(getLocalDateString(0))
                setSelectedSlot(null)
                setSelectedBooking(null)
              }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer border ${
                selectedDate === getLocalDateString(0)
                  ? 'bg-[#f2d953] border-[#f2d953] text-[#161616] font-bold shadow-xs'
                  : 'bg-[#141414] border-[#262626] text-[#8e8e8e] hover:text-white hover:bg-white/5'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDate(getLocalDateString(1))
                setSelectedSlot(null)
                setSelectedBooking(null)
              }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer border ${
                selectedDate === getLocalDateString(1)
                  ? 'bg-[#f2d953] border-[#f2d953] text-[#161616] font-bold shadow-xs'
                  : 'bg-[#141414] border-[#262626] text-[#8e8e8e] hover:text-white hover:bg-white/5'
              }`}
            >
              Besok
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value)
                  setSelectedSlot(null)
                  setSelectedBooking(null)
                }
              }}
              className="h-8 px-2.5 text-xs rounded-lg bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#f2d953]/60 cursor-pointer"
            />
          </div>

          {/* Search Bar Khusus Jadwal Lapangan Mandiri */}
          <div className="relative w-48 sm:w-56 md:w-64">
            <Search className="w-3.5 h-3.5 text-[#737373] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penyewa, no HP, invoice..."
              className="w-full h-8 pl-8 pr-7 text-xs bg-[#141414] border border-[#282828] rounded-lg text-white placeholder:text-[#666] focus:outline-none focus:border-[#f2d953]/70 focus:ring-1 focus:ring-[#f2d953]/25 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8e8e8e] hover:text-white cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Legend & Aksi */}
        <div className="flex items-center gap-3">
          {/* Legend Badges */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-[#8e8e8e] pr-3 border-r border-[#262626]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Lunas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f2d953]" />
              <span>DP 50%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] border border-[#525252] bg-white/[0.04]" />
              <span>Tersedia</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="h-8 px-2.5 rounded-lg bg-[#141414] border border-[#262626] text-[#8e8e8e] hover:text-white hover:bg-white/5 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Muat Ulang Jadwal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#f2d953]' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleQuickFirstSlot}
            className="h-8 px-3.5 rounded-lg bg-[#f2d953] hover:bg-[#ffe359] text-[#161616] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Booking Walk-in</span>
          </button>
        </div>
      </div>

      {/* Banner Hasil Pencarian Jadwal Lapangan */}
      {searchQuery.trim() && (
        <div className="shrink-0 px-5 py-2 bg-[#1b1a15] border-b border-[#f2d953]/30 flex flex-wrap items-center justify-between text-xs gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#f2d953]" />
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
                }}
                className="px-2.5 py-1 rounded-md bg-[#f2d953] text-[#161616] font-bold text-[11px] hover:bg-[#ffe359] transition-colors cursor-pointer"
              >
                Buka Jadwal {otherDateMatches[0].tgl_main}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Bar Ringkasan Okupansi Tanggal Ini */}
      <div className="shrink-0 px-5 py-2.5 bg-[#141414] border-b border-[#262626] flex flex-wrap items-center justify-between text-xs gap-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-[#8e8e8e]">Pemesanan:</span>
            <span className="font-semibold text-white">{dateMetrics.totalBookings} transaksi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#8e8e8e]">Jam Terpakai:</span>
            <span className="font-semibold text-emerald-400">{dateMetrics.totalHours} jam</span>
            <span className="text-[10px] text-[#737373]">
              ({dateMetrics.occupancyRate}% okupansi)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-[#8e8e8e]">Omzet Hari Ini:</span>
            <span className="font-semibold text-white">{formatRupiah(dateMetrics.totalRevenue)}</span>
          </div>
          {dateMetrics.pendingRemaining > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[#8e8e8e]">Sisa DP Kasir:</span>
              <span className="font-semibold text-[#f2d953]">
                {formatRupiah(dateMetrics.pendingRemaining)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-[#222222] border border-[#f2d953]/50 text-white text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <AlertTriangle className="w-4 h-4 text-[#f2d953] shrink-0" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#8e8e8e] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. Area Utama: Schedule Grid di Kiri, Right Panel Inspector di Kanan */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* SISI KIRI: Kalender Grid Jadwal Lapangan */}
        <div className="flex-1 overflow-auto relative">
          <div className="min-w-[800px] flex flex-col">
            {/* Header Baris Lapangan (Sticky Top) */}
            <div className="sticky top-0 z-20 flex bg-[#1a1a1a] border-b border-[#262626] shadow-xs select-none">
              <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-r border-[#262626] p-2 text-[#737373]">
                <div className="flex items-center gap-1.5 text-[#737373]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium tracking-wider uppercase">Jam</span>
                </div>
              </div>

              <div
                style={{ gridTemplateColumns: `repeat(${activeCourtsList.length}, minmax(0, 1fr))` }}
                className="flex-1 grid divide-x divide-[#262626]"
              >
                {activeCourtsList.map((court) => (
                  <div
                    key={court.id}
                    className="py-3 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors min-w-0 gap-2"
                  >
                    <span className="text-sm font-semibold text-white truncate">
                      {court.nama_lapangan}
                    </span>
                    <span className="text-xs font-medium text-[#a3a3a3] hidden sm:block shrink-0">
                      Rp {Math.round(court.tarif_per_jam / 1000)}k/jam
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kontainer Grid Kalender Berpasangan (TimeColumn + Court Columns) */}
            <div className="relative flex">
              {/* Indikator Garis Waktu Berjalan Saat Ini */}
              {isTimeWithinBounds && (
                <div
                  style={{ top: `${currentTimeTop}px` }}
                  className="absolute left-0 right-0 z-[15] pointer-events-none flex items-center -translate-y-1/2"
                >
                  <div className="w-20 sm:w-24 shrink-0 flex items-center justify-end pr-2 relative">
                    <div className="absolute right-0 w-2 h-[2px] bg-[#0091ff]" />
                    <span className="px-1.5 py-0.5 rounded bg-[#0091ff] text-white text-[10px] font-semibold tracking-tight shadow-md flex items-center gap-1 z-10">
                      <span>{CALENDAR_CURRENT_TIME.display}</span>
                      {CALENDAR_CURRENT_TIME.isDevMode && (
                        <span className="text-[8px] bg-white/20 px-1 rounded font-normal">Dev</span>
                      )}
                    </span>
                  </div>
                  <div className="flex-1 h-[2px] bg-[#0091ff] shadow-[0_0_8px_rgba(0,145,255,0.6)]" />
                </div>
              )}

              {/* Kolom Sumbu Waktu Sisi Kiri */}
              <div className="w-20 sm:w-24 shrink-0 border-r border-[#262626] bg-[#141414] select-none font-mono">
                {TIME_SLOTS.map((hour) => {
                  const slotH = parseInt(hour.split(':')[0], 10)
                  const isPastHour = isToday && slotH < CALENDAR_CURRENT_TIME.hour
                  return (
                    <div
                      key={hour}
                      style={{ height: `${SLOT_HEIGHT}px` }}
                      className={`p-3 text-right text-xs font-mono border-b border-[#222222] flex items-start justify-end ${
                        isPastHour ? 'text-[#444444]' : 'text-[#8e8e8e]'
                      }`}
                    >
                      {hour}
                    </div>
                  )
                })}
              </div>

              {/* Kolom Lapangan Independen */}
              <div
                style={{ gridTemplateColumns: `repeat(${activeCourtsList.length}, minmax(0, 1fr))` }}
                className="flex-1 grid divide-x divide-[#222222]"
              >
                {activeCourtsList.map((court) => {
                  const courtCards = spanningCards.filter((c) => String(c.courtId) === String(court.id))
                  const isThisCourtSelected = selectedSlot && selectedSlot.courtId === court.id

                  return (
                    <div key={court.id} className="relative">
                      {/* Layer 1: Slot Kosong Per Jam */}
                      <div className="flex flex-col">
                        {TIME_SLOTS.map((hour) => {
                          const slotH = parseInt(hour.split(':')[0], 10)
                          const isPastSlot = isToday && slotH < CALENDAR_CURRENT_TIME.hour
                          const isOccupied = occupiedSlotsMap.has(`${court.id}_${hour}`)
                          const isSlotInActiveRange =
                            isThisCourtSelected &&
                            selectedSlot.selectedHours.includes(hour)

                          return (
                            <div
                              key={hour}
                              style={{
                                height: `${SLOT_HEIGHT}px`,
                                ...(isPastSlot
                                  ? {
                                      backgroundImage:
                                        'repeating-linear-gradient(-45deg, #131313, #131313 8px, #181818 8px, #181818 16px)',
                                    }
                                  : {}),
                              }}
                              onClick={() => {
                                if (!isPastSlot && !isOccupied) {
                                  handleSelectSlot(court, hour)
                                }
                              }}
                              className={`border-b border-[#222222] transition-colors cursor-pointer group hover:bg-white/[0.02] relative select-none p-1.5 ${
                                isPastSlot ? 'opacity-40 hover:opacity-70' : ''
                              } ${isSlotInActiveRange ? 'bg-[#f2d953]/5' : ''}`}
                              title={
                                isOccupied
                                  ? `Sudah terisi (${court.nama_lapangan} - ${hour})`
                                  : `Klik untuk pilih slot ${court.nama_lapangan} jam ${hour}`
                              }
                            >
                              {!isOccupied && !isSlotInActiveRange && (
                                <div className="w-full h-full rounded-[10px] border border-[#525252]/40 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-between px-3">
                                  <span className="text-xs font-medium text-[#e5e5e5] flex items-center gap-1.5">
                                    <Plus className="w-3 h-3 text-[#f2d953]" />
                                    <span>Pilih Slot</span>
                                  </span>
                                  <span className="text-[11px] text-[#737373] font-mono">
                                    {hour}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Layer 2: ActiveSelectionCard */}
                      {isThisCourtSelected && selectedSlot && (
                        <div
                          style={{
                            top: `${(selectedSlot.startHour - BASE_HOUR) * SLOT_HEIGHT + 3}px`,
                            height: `${selectedSlot.totalHours * SLOT_HEIGHT - 6}px`,
                          }}
                          className="absolute inset-x-1.5 z-20 p-3 rounded-[10px] bg-[#1e1e1e] border-2 border-[#f2d953] ring-2 ring-[#f2d953]/25 shadow-[0_0_24px_rgba(242,217,83,0.25)] flex flex-col justify-between group select-none animate-in fade-in zoom-in-95 duration-150"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-xs sm:text-sm font-bold text-white truncate block">
                                {customerName || 'Walk-in Kasir'}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#f2d953] text-[#161616]">
                                  Dipilih
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedSlot(null)
                                  }}
                                  className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-[#8e8e8e] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                  title="Batalkan pilihan"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-[#d1d1d1]">
                              <Clock className="w-3.5 h-3.5 text-[#f2d953] shrink-0" />
                              <span className="font-mono font-medium">
                                {selectedSlot.startTime} - {selectedSlot.endTime}
                              </span>
                              <span className="text-[10px] text-[#8e8e8e]">
                                ({selectedSlot.totalHours} Jam)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#303030]/80 mt-auto">
                            <span className="text-[10px] text-[#8e8e8e]">Total Estimasi</span>
                            <span className="text-[#f2d953] font-bold text-xs font-mono">
                              {formatRupiah(selectedSlot.totalPrice)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Layer 3: Spanning Booking Cards (Jadwal Terisi) */}
                      {courtCards.map((card) => {
                        const topOffset = (card.startDecimal - BASE_HOUR) * SLOT_HEIGHT + 3
                        const cardHeight = card.durationHours * SLOT_HEIGHT - 6
                        const b = card.booking
                        const isLunas = b.status === 'Lunas'
                        const sisa = b.sisa_bayar || 0
                        const isMultiHour = card.durationHours >= 2
                        const isInspected = selectedBooking?.id === b.id

                        // Logika Highlighting Pencarian Jadwal Lapangan
                        const isSearchActive = Boolean(searchFilteredBookingIds !== null)
                        const isMatchedSearch = isSearchActive && searchFilteredBookingIds!.has(b.id)
                        const isDimmedBySearch = isSearchActive && !isMatchedSearch

                        return (
                          <div
                            key={card.uniqueKey}
                            style={{
                              top: `${topOffset}px`,
                              height: `${cardHeight}px`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedBooking(b)
                            }}
                            className={`absolute inset-x-1.5 z-10 p-3 rounded-[10px] border transition-all duration-150 cursor-pointer flex flex-col justify-between group shadow-md hover:shadow-xl font-aeonik select-none ${
                              isMatchedSearch
                                ? 'bg-[#282416] border-[#f2d953] ring-2 ring-[#f2d953] shadow-[0_0_24px_rgba(242,217,83,0.45)] z-30 scale-[1.01]'
                                : isDimmedBySearch
                                ? 'opacity-20 hover:opacity-50'
                                : isInspected
                                ? 'bg-[#222222] border-[#f2d953] ring-2 ring-[#f2d953]/30 shadow-[0_0_20px_rgba(242,217,83,0.2)]'
                                : isLunas
                                ? 'bg-[#181f1a] hover:bg-[#1c261e] border-emerald-500/40 hover:border-emerald-400/80 shadow-[0_0_12px_rgba(16,185,129,0.06)]'
                                : 'bg-[#201d16] hover:bg-[#282319] border-[#f2d953]/40 hover:border-[#f2d953]/80 shadow-[0_0_12px_rgba(242,217,83,0.08)]'
                            }`}
                            title={`Klik untuk rincian booking #${b.id} (${b.nama_penyewa})`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-[#8e8e8e] border border-white/5 shrink-0">
                                    #{b.id < 10 ? `00${b.id}` : b.id}
                                  </span>
                                  <span className="text-xs sm:text-sm font-semibold text-[#fcfcfc] truncate block group-hover:text-[#f2d953] transition-colors">
                                    {b.nama_penyewa}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {isMatchedSearch && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f2d953] text-[#161616] font-bold animate-pulse">
                                      Cocok
                                    </span>
                                  )}
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-1 ${
                                      isLunas
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-[#f2d953]/15 text-[#f2d953] border border-[#f2d953]/30'
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isLunas ? 'bg-emerald-400' : 'bg-[#f2d953]'
                                      }`}
                                    />
                                    <span>{isLunas ? 'Lunas' : 'DP 50%'}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 text-xs text-[#8e8e8e]">
                                <Clock className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                                <span className="font-mono text-[#a3a3a3]">
                                  {card.startTime} - {card.endTime}
                                </span>
                                <span className="text-[10px] text-[#737373]">
                                  ({card.durationHours} Jam)
                                </span>
                              </div>

                              {isMultiHour && b.no_hp && (
                                <div className="flex items-center gap-1.5 text-[11px] text-[#737373] mt-2">
                                  <Phone className="w-3 h-3 text-[#555555] shrink-0" />
                                  <span className="font-mono">{b.no_hp}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#303030]/60 mt-auto">
                              <span className="text-[11px] text-[#8e8e8e]">
                                {isLunas ? 'Total Lunas' : 'Sisa Tagihan'}
                              </span>
                              {isLunas ? (
                                <span className="text-emerald-400 font-medium text-xs">
                                  {formatRupiah(b.total_bayar)}
                                </span>
                              ) : (
                                <span className="text-[#f2d953] font-semibold text-xs font-mono">
                                  {formatRupiah(sisa)}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SISI KANAN: DOCKED RIGHT PANEL INSPECTOR (Mirip Reservasi Tanpa Modal Overlay) */}
        <aside
          aria-label="Panel Operasional Kasir"
          className="hidden lg:flex lg:w-[380px] xl:w-[420px] bg-[#1a1a1a] border-l border-[#262626] p-5 flex-col justify-between overflow-y-auto select-none font-aeonik shrink-0 z-20"
        >
          {/* KONDISI 1: FORM WALK-IN (Saat slot kosong dipilih di grid) */}
          {selectedSlot ? (
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Header Form */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#262626] mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#f2d953] animate-pulse" />
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Booking Walk-in Kasir
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="p-1 rounded text-[#8e8e8e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Batalkan Pilihan"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Ringkasan Slot Lapangan Terpilih */}
                <div className="p-3.5 rounded-xl bg-[#141414] border border-[#282828] mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8e8e8e]">Lapangan</span>
                    <span className="text-xs font-semibold text-white">
                      {selectedSlot.courtName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8e8e8e]">Tanggal</span>
                    <span className="text-xs font-medium text-white font-mono">
                      {selectedSlot.date}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8e8e8e]">Waktu Bermain</span>
                    <span className="text-xs font-bold text-[#f2d953] font-mono">
                      {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.totalHours} Jam)
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#262626]">
                    <span className="text-xs text-[#8e8e8e]">Tarif per Jam</span>
                    <span className="text-xs text-[#a3a3a3] font-mono">
                      {formatRupiah(selectedSlot.pricePerHour)}
                    </span>
                  </div>
                </div>

                {/* Form Input Detail Pelanggan */}
                <form id="walkin-form" onSubmit={handleSubmitWalkIn} className="space-y-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-[#8e8e8e] block mb-1">
                      Nama Penyewa <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#666] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full h-9 pl-9 pr-3 text-xs bg-[#141414] border border-[#282828] rounded-lg text-white focus:outline-none focus:border-[#f2d953] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8e8e8e] block mb-1">
                      Nomor WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[#666] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={customerWhatsapp}
                        onChange={(e) => setCustomerWhatsapp(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="w-full h-9 pl-9 pr-3 text-xs font-mono bg-[#141414] border border-[#282828] rounded-lg text-white focus:outline-none focus:border-[#f2d953] transition-colors"
                      />
                    </div>
                    <span className="text-[10px] text-[#666] mt-1 block">
                      Wajib berawalan 08 (10-13 digit).
                    </span>
                  </div>

                  {/* Skema Pembayaran dengan Dropdown Mewah Ber-UI Sesuai Request User */}
                  <div ref={paymentDropdownRef} className="relative">
                    <label className="text-[11px] font-semibold text-[#8e8e8e] block mb-1">
                      Skema Pembayaran Kasir <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                      className={`w-full h-9 px-3 text-xs rounded-lg bg-[#141414] border flex items-center justify-between transition-all cursor-pointer ${
                        isPaymentDropdownOpen
                          ? 'border-[#f2d953] ring-1 ring-[#f2d953]/30 bg-[#1c1c1c] text-white shadow-xs'
                          : 'border-[#282828] text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className={`w-3.5 h-3.5 ${isPaymentDropdownOpen ? 'text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
                        <span className="font-semibold">
                          {paymentType === 'DP' ? 'DP 50% (Bayar Separuh)' : 'Lunas 100% (Langsung Selesai)'}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isPaymentDropdownOpen ? 'rotate-180 text-[#f2d953]' : 'text-[#8e8e8e]'
                        }`}
                      />
                    </button>

                    {isPaymentDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 p-1.5 rounded-xl border border-[#333333] bg-[#1a1a1a] shadow-2xl z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentType('DP')
                            setIsPaymentDropdownOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                            paymentType === 'DP'
                              ? 'bg-[#f2d953]/15 text-[#f2d953] font-semibold'
                              : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div>
                            <span className="block font-semibold">DP 50%</span>
                            <span className="text-[10px] text-[#8e8e8e] block">
                              Penyewa membayar setengah, sisa dilunasi sebelum tanding
                            </span>
                          </div>
                          {paymentType === 'DP' && <Check className="w-3.5 h-3.5 text-[#f2d953]" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPaymentType('Lunas')
                            setIsPaymentDropdownOpen(false)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                            paymentType === 'Lunas'
                              ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                              : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div>
                            <span className="block font-semibold">Lunas 100%</span>
                            <span className="text-[10px] text-[#8e8e8e] block">
                              Penyewa langsung membayar tagihan penuh di kasir
                            </span>
                          </div>
                          {paymentType === 'Lunas' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#8e8e8e] block mb-1">
                      Catatan Tambahan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Sewa rompi & shuttlecock"
                      className="w-full h-8 px-3 text-xs bg-[#141414] border border-[#282828] rounded-lg text-white focus:outline-none focus:border-[#f2d953] transition-colors"
                    />
                  </div>

                  {formError && (
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Rincian Finansial & Tombol Submit */}
              <div className="pt-3 border-t border-[#262626] mt-4 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#8e8e8e]">
                    <span>Total Tagihan:</span>
                    <span className="font-mono text-white font-medium">
                      {formatRupiah(selectedSlot.totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#8e8e8e]">
                    <span>Bayar Sekarang ({paymentType}):</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {formatRupiah(
                        paymentType === 'Lunas'
                          ? selectedSlot.totalPrice
                          : Math.round(selectedSlot.totalPrice * 0.5)
                      )}
                    </span>
                  </div>
                  {paymentType === 'DP' && (
                    <div className="flex items-center justify-between text-[#8e8e8e]">
                      <span>Sisa Bayar di Kasir:</span>
                      <span className="font-mono text-[#f2d953] font-semibold">
                        {formatRupiah(
                          selectedSlot.totalPrice - Math.round(selectedSlot.totalPrice * 0.5)
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  form="walkin-form"
                  disabled={isSubmitting}
                  className="w-full h-10 rounded-xl bg-[#f2d953] hover:bg-[#ffe359] text-[#161616] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Konfirmasi & Simpan Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : selectedBooking ? (
            /* KONDISI 2: INSPECT BOOKING (Saat kartu booking yang sudah ada diklik) */
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Header Inspeksi */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#262626] mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                      #{selectedBooking.id < 10 ? `00${selectedBooking.id}` : selectedBooking.id}
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Rincian Reservasi
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBooking(null)
                      setIsQrisActive(false)
                    }}
                    className="p-1 rounded text-[#8e8e8e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Tutup Panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Status Transaksi Badge */}
                <div className="mb-4">
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      selectedBooking.status === 'Lunas'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : selectedBooking.status === 'Batal'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-[#f2d953]/10 border-[#f2d953]/30 text-[#f2d953]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedBooking.status === 'Lunas'
                            ? 'bg-emerald-400'
                            : selectedBooking.status === 'Batal'
                            ? 'bg-red-400'
                            : 'bg-[#f2d953]'
                        }`}
                      />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {selectedBooking.status === 'Lunas'
                          ? 'Sudah Lunas'
                          : selectedBooking.status === 'Batal'
                          ? 'Dibatalkan'
                          : 'Uang Muka (DP 50%)'}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold">
                      {selectedBooking.tipe_bayar}
                    </span>
                  </div>
                </div>

                {/* Detail Informasi Penyewa */}
                <div className="p-3.5 rounded-xl bg-[#141414] border border-[#282828] mb-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-[#8e8e8e] block uppercase tracking-wider">
                        Nama Penyewa
                      </span>
                      <span className="text-sm font-bold text-white">
                        {selectedBooking.nama_penyewa}
                      </span>
                    </div>
                    {selectedBooking.lapangan && (
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-[#a3a3a3] font-medium">
                        {selectedBooking.lapangan.nama_lapangan}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#262626] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8e8e8e] block uppercase tracking-wider">
                        Kontak WhatsApp
                      </span>
                      <span className="text-xs font-mono text-[#d1d1d1]">
                        {selectedBooking.no_hp}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(selectedBooking.no_hp)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
                        title="Salin No HP"
                      >
                        {copiedPhone === selectedBooking.no_hp ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={getWhatsAppLink(selectedBooking.no_hp, selectedBooking.nama_penyewa)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
                        title="Buka Chat WhatsApp"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#262626] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8e8e8e]">Tanggal Main:</span>
                      <span className="font-mono text-white font-medium">
                        {selectedBooking.tgl_main}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8e8e8e]">Slot Jam:</span>
                      <span className="font-mono text-[#f2d953] font-semibold">
                        {(selectedBooking.jam_slots || []).join(', ')} ({selectedBooking.durasi_jam} Jam)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-tampilan QRIS Pelunasan jika kasir memilih QRIS */}
                {isQrisActive ? (
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#f2d953]/40 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-[#f2d953]" />
                        <span className="text-xs font-bold text-white">QRIS Dinamis Kasir</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8e8e8e]">
                        {Math.floor(qrisSecondsLeft / 60)}:
                        {String(qrisSecondsLeft % 60).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-lg flex flex-col items-center justify-center max-w-[180px] mx-auto shadow-inner">
                      <div className="w-32 h-32 bg-black flex items-center justify-center text-white text-[10px] text-center p-2 rounded">
                        <span>[QRIS CODE BLANCA ARENA #{selectedBooking.id}]</span>
                      </div>
                      <span className="text-[9px] text-black font-mono font-bold mt-1.5">
                        NMID: ID1020304050
                      </span>
                    </div>

                    <div className="text-center text-xs">
                      <span className="text-[#8e8e8e] block">Nominal Pelunasan:</span>
                      <span className="text-emerald-400 font-bold font-mono text-sm">
                        {formatRupiah(selectedBooking.sisa_bayar)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsQrisActive(false)}
                        className="flex-1 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[#8e8e8e] hover:text-white text-xs transition-colors cursor-pointer"
                      >
                        Kembali
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onLunasi(selectedBooking.id)
                          setIsQrisActive(false)
                          setSelectedBooking(null)
                          setToastMessage('Pelunasan QRIS berhasil dikonfirmasi!')
                          setTimeout(() => setToastMessage(null), 3000)
                        }}
                        className="flex-1 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                      >
                        Konfirmasi Lunas
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Rincian Biaya Transaksi */
                  <div className="p-3.5 rounded-xl bg-[#141414] border border-[#282828] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#8e8e8e]">
                      <span>Total Tagihan:</span>
                      <span className="font-mono text-white font-semibold">
                        {formatRupiah(selectedBooking.total_bayar)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#8e8e8e]">
                      <span>Sudah Dibayar:</span>
                      <span className="font-mono text-emerald-400 font-medium">
                        {formatRupiah(selectedBooking.nominal_dibayar)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#262626]">
                      <span className="text-[#8e8e8e]">Sisa Tagihan Kasir:</span>
                      <span
                        className={`font-mono font-bold ${
                          selectedBooking.sisa_bayar > 0 ? 'text-[#f2d953]' : 'text-emerald-400'
                        }`}
                      >
                        {formatRupiah(selectedBooking.sisa_bayar)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons di Bawah */}
              {!isQrisActive && (
                <div className="pt-3 border-t border-[#262626] mt-4 space-y-2">
                  {selectedBooking.sisa_bayar > 0 && selectedBooking.status !== 'Batal' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onLunasi(selectedBooking.id)
                          setSelectedBooking(null)
                          setToastMessage('Pelunasan Tunai berhasil dikonfirmasi!')
                          setTimeout(() => setToastMessage(null), 3000)
                        }}
                        className="h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pelunasan Tunai</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsQrisActive(true)
                          setQrisSecondsLeft(900)
                        }}
                        className="h-9 rounded-xl bg-[#222222] hover:bg-[#282828] border border-[#f2d953]/50 text-[#f2d953] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Bayar QRIS</span>
                      </button>
                    </div>
                  )}

                  {selectedBooking.status !== 'Batal' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Yakin batalkan booking #${selectedBooking.id} (${selectedBooking.nama_penyewa})?`)) {
                          onBatal(selectedBooking.id)
                          setSelectedBooking(null)
                          setToastMessage('Booking berhasil dibatalkan.')
                          setTimeout(() => setToastMessage(null), 3000)
                        }
                      }}
                      className="w-full h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Batalkan Transaksi</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* KONDISI 3: IDLE STATE (Belum ada slot atau booking yang dipilih) */
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3.5 border-b border-[#262626] mb-6">
                  <div className="w-2 h-2 rounded-full bg-[#555]" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Panel Operasional Kasir
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-[#141414] border border-[#262626] space-y-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#f2d953]">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Panduan Input Cepat:</h4>
                  <ul className="text-xs text-[#8e8e8e] space-y-2 list-disc pl-4">
                    <li>
                      <strong className="text-[#d1d1d1]">Booking Walk-in:</strong> Klik slot jam kosong pada kolom lapangan di sebelah kiri.
                    </li>
                    <li>
                      <strong className="text-[#d1d1d1]">Multi-Jam:</strong> Klik slot awal lalu klik slot akhir di lapangan yang sama untuk merentang waktu.
                    </li>
                    <li>
                      <strong className="text-[#d1d1d1]">Pelunasan Kasir:</strong> Klik kartu booking yang sudah ada untuk memproses sisa DP via Tunai atau QRIS.
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleQuickFirstSlot}
                  className="w-full h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-[#2e2e2e] text-[#d1d1d1] hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#f2d953]" />
                  <span>Pilih Slot Kosong Pertama</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#121212] border border-[#222] text-[11px] text-[#666] text-center">
                Sistem Reservasi Terintegrasi Supabase &copy; 2026
              </div>
            </div>
          )}
        </aside>

        {/* DRAWER RESPONSIVE KHUSUS MOBILE (< lg) */}
        {(selectedSlot || selectedBooking) && (
          <div className="fixed inset-0 z-40 flex flex-col justify-end lg:hidden">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
              onClick={() => {
                setSelectedSlot(null)
                setSelectedBooking(null)
                setIsQrisActive(false)
              }}
            />
            <div className="relative z-50 bg-[#1a1a1a] border-t border-[#2e2e2e] rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

              {selectedSlot ? (
                /* Mobile Walk-in Form */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                    <h3 className="text-sm font-bold text-white">
                      Booking Walk-in ({selectedSlot.courtName})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot(null)}
                      className="p-1 rounded text-[#8e8e8e] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-[#f2d953] font-mono">
                    {selectedSlot.date} | {selectedSlot.startTime} - {selectedSlot.endTime} ({selectedSlot.totalHours} Jam)
                  </div>

                  <form onSubmit={handleSubmitWalkIn} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nama Penyewa"
                      className="w-full h-9 px-3 text-xs bg-[#141414] border border-[#282828] rounded-lg text-white"
                    />
                    <input
                      type="tel"
                      required
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      placeholder="No WhatsApp (08...)"
                      className="w-full h-9 px-3 text-xs font-mono bg-[#141414] border border-[#282828] rounded-lg text-white"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentType('DP')}
                        className={`h-8 rounded-lg text-xs font-semibold border ${
                          paymentType === 'DP'
                            ? 'bg-[#f2d953] text-[#161616] border-[#f2d953]'
                            : 'bg-[#141414] text-[#8e8e8e] border-[#282828]'
                        }`}
                      >
                        DP 50%
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType('Lunas')}
                        className={`h-8 rounded-lg text-xs font-semibold border ${
                          paymentType === 'Lunas'
                            ? 'bg-emerald-400 text-[#161616] border-emerald-400'
                            : 'bg-[#141414] text-[#8e8e8e] border-[#282828]'
                        }`}
                      >
                        Lunas 100%
                      </button>
                    </div>

                    {formError && (
                      <div className="text-red-400 text-xs">{formError}</div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 rounded-xl bg-[#f2d953] text-[#161616] font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Konfirmasi Simpan'}
                    </button>
                  </form>
                </div>
              ) : selectedBooking ? (
                /* Mobile Inspect Booking */
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
                    <h3 className="text-sm font-bold text-white">
                      Rincian #{selectedBooking.id} ({selectedBooking.nama_penyewa})
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="p-1 rounded text-[#8e8e8e] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs space-y-1.5 text-[#8e8e8e]">
                    <div>Lapangan: <span className="text-white">{selectedBooking.lapangan?.nama_lapangan}</span></div>
                    <div>Waktu: <span className="font-mono text-[#f2d953]">{(selectedBooking.jam_slots || []).join(', ')}</span></div>
                    <div>Sisa Bayar: <span className="font-mono text-white font-bold">{formatRupiah(selectedBooking.sisa_bayar)}</span></div>
                  </div>

                  {selectedBooking.sisa_bayar > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onLunasi(selectedBooking.id)
                        setSelectedBooking(null)
                      }}
                      className="w-full h-10 rounded-xl bg-emerald-500 text-white font-bold text-xs"
                    >
                      Pelunasan Tunai
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
