// PERAN FILE: Komponen Visualisasi Jadwal Lapangan Interaktif Kasir (Grid Lapangan x Spanning Slot Jam)
import { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  Phone,
} from 'lucide-react'
import type { Booking, Lapangan } from '../../../types/database'
import BookingDetailSheet from './BookingDetailSheet'
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

const SLOT_HEIGHT = DEFAULT_SLOT_HEIGHT // 88px per 1 jam slot kalender
const BASE_HOUR = BASE_OPERATIONAL_HOUR // Jam operasional awal: 08:00

/**
 * Helper murni untuk menggabungkan jam_slots yang bersambung menjadi satu kartu spanning kontinu
 * Contoh: ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
 * Menjadi: 1 kartu kontinu dari jam 15:00 s.d 22:00 (durasi 7 jam)
 */
function getCourtSpanningCards(bookings: Booking[]): SpanningBookingCard[] {
  const cards: SpanningBookingCard[] = []

  bookings.forEach((b) => {
    const slots = b.jam_slots || []
    if (slots.length === 0) return

    // 1. Urutkan slot jam dari yang paling awal
    const sorted = [...slots].sort((x, y) => parseInt(x, 10) - parseInt(y, 10))

    // 2. Kelompokkan slot yang bersambung (contiguous)
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

    // 3. Bangun objek SpanningBookingCard untuk tiap rentang jam yang bersambung
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
  onOpenManualModalWithSlot,
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

  // State tanggal terpilih (default: hari ini)
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString(0))
  // State panel detail transaksi yang sedang dibuka
  const [selectedBookingForSheet, setSelectedBookingForSheet] = useState<Booking | null>(null)

  // Format tanggal dalam bahasa Indonesia untuk header
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

  // Navigasi tanggal mundur/maju 1 hari
  const handleShiftDate = (offset: number) => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    dateObj.setDate(dateObj.getDate() + offset)
    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, '0')
    const d = String(dateObj.getDate()).padStart(2, '0')
    setSelectedDate(`${y}-${m}-${d}`)
  }

  // Filter booking hanya untuk tanggal terpilih dan tidak dibatalkan
  const dateBookings = useMemo(() => {
    return bookings.filter((b) => b.tgl_main === selectedDate && b.status !== 'Batal')
  }, [bookings, selectedDate])

  // Hitung ringkasan metrik untuk tanggal terpilih
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

    const totalAvailableSlots = (courts.length || 4) * TIME_SLOTS.length
    const occupancyRate = totalAvailableSlots > 0 ? Math.round((totalHours / totalAvailableSlots) * 100) : 0

    return { totalBookings, totalHours, totalRevenue, pendingRemaining, occupancyRate }
  }, [dateBookings, courts.length])

  // Hitung kartu spanning kontinu dari data booking hari ini
  const spanningCards = useMemo(() => {
    return getCourtSpanningCards(dateBookings)
  }, [dateBookings])

  // Data lapangan aktif (dengan fallback default jika belum termuat)
  const activeCourtsList = useMemo(() => {
    return courts.length > 0
      ? courts
      : [
          { id: 1, nama_lapangan: 'Court 1', status: 'Aktif' as const, tarif_per_jam: 50000 },
          { id: 2, nama_lapangan: 'Court 2', status: 'Aktif' as const, tarif_per_jam: 50000 },
          { id: 3, nama_lapangan: 'Court 3', status: 'Aktif' as const, tarif_per_jam: 50000 },
          { id: 4, nama_lapangan: 'Court 4', status: 'Aktif' as const, tarif_per_jam: 50000 },
        ]
  }, [courts])

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  // Logika garis waktu berjalan saat ini
  const today = getLocalDateString(0)
  const isToday = selectedDate === today
  const currentTimeTop =
    (CALENDAR_CURRENT_TIME.hour - BASE_HOUR + CALENDAR_CURRENT_TIME.minute / 60) * SLOT_HEIGHT
  const isTimeWithinBounds =
    isToday &&
    CALENDAR_CURRENT_TIME.hour >= BASE_HOUR &&
    CALENDAR_CURRENT_TIME.hour <= 22

  return (
    <div className="flex flex-col h-full bg-[#161616] text-[#fafafa] font-aeonik select-none">
      {/* 1. Control Toolbar Atas (Navigasi Tanggal, Filter Cepat, & Aksi Kasir) */}
      <div className="shrink-0 p-4 border-b border-[#262626] flex flex-wrap items-center justify-between gap-3 bg-[#181818]">
        {/* Navigasi Tanggal */}
        <div className="flex items-center gap-2">
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
              onClick={() => setSelectedDate(getLocalDateString(0))}
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
              onClick={() => setSelectedDate(getLocalDateString(1))}
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
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="h-8 px-2.5 text-xs rounded-lg bg-[#141414] border border-[#262626] text-white focus:outline-none focus:border-[#f2d953]/60 cursor-pointer"
            />
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
            onClick={() => onOpenManualModalWithSlot?.(courts[0]?.id || 1, selectedDate, '08:00')}
            className="h-8 px-3.5 rounded-lg bg-[#f2d953] hover:bg-[#ffe359] text-[#161616] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Booking Walk-in</span>
          </button>
        </div>
      </div>

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

      {/* 3. Area Grid Matriks Kalender (Scrollable) */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[840px] flex flex-col">
          {/* Header Baris Lapangan (Sticky Top) */}
          <div className="sticky top-0 z-20 flex bg-[#1a1a1a] border-b border-[#262626] shadow-xs select-none">
            {/* Kolom Waktu Sudut Kiri */}
            <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-r border-[#262626] p-2 text-[#737373]">
              <div className="flex items-center gap-1.5 text-[#737373]">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium tracking-wider uppercase">Jam</span>
              </div>
            </div>

            {/* Kolom Lapangan */}
            <div
              style={{ gridTemplateColumns: `repeat(${activeCourtsList.length}, minmax(0, 1fr))` }}
              className="flex-1 grid divide-x divide-[#262626]"
            >
              {activeCourtsList.map((court) => (
                <div
                  key={court.id}
                  className="py-3 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors min-w-0 gap-2"
                >
                  <span className="text-sm sm:text-base font-semibold text-white truncate">
                    {court.nama_lapangan}
                  </span>
                  <span className="text-sm font-medium text-[#a3a3a3] hidden sm:block shrink-0">
                    Rp {Math.round(court.tarif_per_jam / 1000)}k/jam
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kontainer Grid Kalender Berpasangan (TimeColumn + Court Columns) */}
          <div className="relative flex">
            {/* Indikator Garis Waktu Berjalan Saat Ini (Z-Index di bawah kartu booking) */}
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

            {/* Kolom Lapangan Independen (Background Slots + Spanning Cards) */}
            <div
              style={{ gridTemplateColumns: `repeat(${activeCourtsList.length}, minmax(0, 1fr))` }}
              className="flex-1 grid divide-x divide-[#222222]"
            >
              {activeCourtsList.map((court) => {
                const courtCards = spanningCards.filter((c) => String(c.courtId) === String(court.id))

                return (
                  <div key={court.id} className="relative">
                    {/* Layer 1: Slot Kosong Per Jam */}
                    <div className="flex flex-col">
                      {TIME_SLOTS.map((hour) => {
                        const slotH = parseInt(hour.split(':')[0], 10)
                        const isPastSlot = isToday && slotH < CALENDAR_CURRENT_TIME.hour

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
                            onClick={() => onOpenManualModalWithSlot?.(court.id, selectedDate, hour)}
                            className={`border-b border-[#222222] transition-colors cursor-pointer group hover:bg-white/[0.02] relative select-none p-1.5 ${
                              isPastSlot ? 'opacity-40 hover:opacity-70' : ''
                            }`}
                            title={`Klik untuk booking walk-in ${court.nama_lapangan} jam ${hour}`}
                          >
                            <div className="w-full h-full rounded-[10px] border border-[#525252] bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-between px-3">
                              <span className="text-xs font-medium text-[#e5e5e5] flex items-center gap-1.5">
                                <Plus className="w-3.5 h-3.5 text-[#f2d953]" />
                                <span>+ Walk-in</span>
                              </span>
                              <span className="text-[11px] font-mono text-[#8e8e8e]">{hour}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Layer 2: Kartu Spanning Kontinu */}
                    {courtCards.map((card) => {
                      const b = card.booking
                      const isLunas = b.status === 'Lunas'
                      const isDP = b.tipe_bayar === 'DP' || b.status === 'Booked'
                      const sisa = b.sisa_bayar || 0
                      const isSelected = selectedBookingForSheet?.id === b.id

                      const topOffset = (card.startDecimal - BASE_HOUR) * SLOT_HEIGHT + 3
                      const cardHeight = Math.max(card.durationHours * SLOT_HEIGHT - 6, 44)
                      const isMultiHour = card.durationHours >= 2

                      return (
                        <div
                          key={card.uniqueKey}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedBookingForSheet(b)
                          }}
                          style={{
                            top: `${topOffset}px`,
                            height: `${cardHeight}px`,
                          }}
                          className={`absolute inset-x-1.5 z-10 p-3 rounded-[10px] bg-[#222222] border transition-all cursor-pointer flex flex-col justify-between group shadow-md select-none font-aeonik active:scale-[0.99] ${
                            isSelected
                              ? 'border-[#f2d953] ring-1 ring-[#f2d953] shadow-[0_0_16px_rgba(242,217,83,0.25)]'
                              : isLunas
                              ? 'border-[#383838] hover:border-emerald-500/60 hover:bg-[#282828]'
                              : 'border-[#383838] hover:border-[#f2d953]/70 hover:bg-[#282828]'
                          }`}
                          title={`Klik untuk rincian & pelunasan: #${String(b.id).padStart(4, '0')} - ${b.nama_penyewa}`}
                        >
                          {/* Header Kartu */}
                          <div>
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[10px] font-mono text-[#737373] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#333333] shrink-0">
                                  #{String(b.id).padStart(4, '0')}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-[#fcfcfc] truncate block group-hover:text-[#f2d953] transition-colors">
                                  {b.nama_penyewa}
                                </span>
                              </div>

                              {/* Status Badge */}
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

                            {/* Baris Jam & Durasi */}
                            <div className="flex items-center gap-1.5 text-xs text-[#8e8e8e]">
                              <Clock className="w-3.5 h-3.5 text-[#737373] shrink-0" />
                              <span className="font-mono text-[#a3a3a3]">
                                {card.startTime} - {card.endTime}
                              </span>
                              <span className="text-[10px] text-[#737373]">
                                ({card.durationHours} Jam)
                              </span>
                            </div>

                            {/* Detail Tambahan Jika Durasi Panjang (>= 2 jam) */}
                            {isMultiHour && b.no_hp && (
                              <div className="flex items-center gap-1.5 text-[11px] text-[#737373] mt-2">
                                <Phone className="w-3 h-3 text-[#555555] shrink-0" />
                                <span className="font-mono">{b.no_hp}</span>
                              </div>
                            )}
                          </div>

                          {/* Footer Finansial Kartu */}
                          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#303030]/60 mt-auto">
                            <span className="text-[11px] text-[#8e8e8e]">
                              {isLunas ? 'Total Lunas' : 'Sisa Tagihan'}
                            </span>
                            {isLunas ? (
                              <span className="text-emerald-400 font-medium text-xs">
                                {formatRupiah(b.total_bayar)}
                              </span>
                            ) : (
                              <span className="text-[#f2d953] font-semibold text-xs">
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

      {/* 4. Panel Detail Transaksi & Pelunasan (Tunai / QRIS) */}
      <BookingDetailSheet
        booking={selectedBookingForSheet}
        isOpen={Boolean(selectedBookingForSheet)}
        onClose={() => setSelectedBookingForSheet(null)}
        onLunasi={(id) => {
          onLunasi(id)
          setSelectedBookingForSheet(null)
        }}
        onBatal={(id) => {
          onBatal(id)
          setSelectedBookingForSheet(null)
        }}
      />
    </div>
  )
}
