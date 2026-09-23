// PERAN FILE: Komponen Visualisasi Jadwal Lapangan Interaktif Kasir (Grid 4 Court x Slot Jam)
import { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
} from 'lucide-react'
import type { Booking, Lapangan } from '../../../types/database'
import BookingDetailSheet from './BookingDetailSheet'
import { formatSlotRange } from '../../../lib/utils'

interface CourtScheduleGridProps {
  bookings: Booking[]
  courts: Lapangan[]
  loading: boolean
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onRefresh: () => void
  onOpenManualModalWithSlot?: (courtId: number, date: string, hour: string) => void
}

const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
]

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

  // Indexing pencarian booking berdasarkan [courtId_hour]
  const bookingSlotMap = useMemo(() => {
    const map = new Map<string, Booking>()
    dateBookings.forEach((b) => {
      const slots = b.jam_slots || []
      slots.forEach((slotTime) => {
        const key = `${b.lapangan_id}_${slotTime}`
        map.set(key, b)
      })
    })
    return map
  }, [dateBookings])

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  return (
    <div className="flex flex-col h-full bg-[oklch(0.1932_0.002_230.81)] text-[oklch(0.9235_0.001733_230.685)] select-none">
      {/* 1. Control Toolbar Atas (Navigasi Tanggal, Filter Cepat, & Aksi Kasir) */}
      <div className="shrink-0 p-4 border-b border-[oklch(0.2593_0.0033_230.84)] flex flex-wrap items-center justify-between gap-3 bg-[oklch(0.18_0.002_230.81)]">
        {/* Navigasi Tanggal */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.16_0.002_230.81)] p-0.5">
            <button
              type="button"
              onClick={() => handleShiftDate(-1)}
              className="p-1 rounded text-[oklch(0.7_0.002_230.81)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
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
              className="p-1 rounded text-[oklch(0.7_0.002_230.81)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Hari Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Date Chips */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSelectedDate(getLocalDateString(0))}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer border ${
                selectedDate === getLocalDateString(0)
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold'
                  : 'bg-[oklch(0.16_0.002_230.81)] border-[oklch(0.2593_0.0033_230.84)] text-[oklch(0.75_0.002_230.81)] hover:text-white hover:bg-white/5'
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(getLocalDateString(1))}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer border ${
                selectedDate === getLocalDateString(1)
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold'
                  : 'bg-[oklch(0.16_0.002_230.81)] border-[oklch(0.2593_0.0033_230.84)] text-[oklch(0.75_0.002_230.81)] hover:text-white hover:bg-white/5'
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
              className="h-8 px-2.5 text-xs rounded-md bg-[oklch(0.16_0.002_230.81)] border border-[oklch(0.2593_0.0033_230.84)] text-white focus:outline-none focus:border-emerald-400/60 cursor-pointer"
            />
          </div>
        </div>

        {/* Legend & Aksi */}
        <div className="flex items-center gap-3">
          {/* Legend Badges */}
          <div className="hidden lg:flex items-center gap-3 text-xs text-[oklch(0.75_0.002_230.81)] pr-3 border-r border-[oklch(0.2593_0.0033_230.84)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Lunas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>DP 50%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded border border-[#444] bg-[#1a1a1a]" />
              <span>Tersedia</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="h-8 px-2.5 rounded-md bg-[oklch(0.16_0.002_230.81)] border border-[oklch(0.2593_0.0033_230.84)] text-[oklch(0.75_0.002_230.81)] hover:text-white hover:bg-white/5 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Muat Ulang Jadwal"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenManualModalWithSlot?.(courts[0]?.id || 1, selectedDate, '08:00')}
            className="h-8 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Booking Walk-in</span>
          </button>
        </div>
      </div>

      {/* 2. Bar Ringkasan Okupansi Tanggal Ini */}
      <div className="shrink-0 px-5 py-2.5 bg-[oklch(0.17_0.002_230.81)] border-b border-[oklch(0.2593_0.0033_230.84)] flex flex-wrap items-center justify-between text-xs gap-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-[oklch(0.6_0.002_230.81)]">Pemesanan:</span>
            <span className="font-semibold text-white">{dateMetrics.totalBookings} transaksi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[oklch(0.6_0.002_230.81)]">Jam Terpakai:</span>
            <span className="font-semibold text-emerald-400">{dateMetrics.totalHours} jam</span>
            <span className="text-[10px] text-[oklch(0.55_0.002_230.81)]">
              ({dateMetrics.occupancyRate}% okupansi)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="text-[oklch(0.6_0.002_230.81)]">Omzet Hari Ini:</span>
            <span className="font-bold text-white">{formatRupiah(dateMetrics.totalRevenue)}</span>
          </div>
          {dateMetrics.pendingRemaining > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[oklch(0.6_0.002_230.81)]">Sisa DP Kasir:</span>
              <span className="font-bold text-amber-400">
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
          <div className="sticky top-0 z-20 flex bg-[oklch(0.175_0.002_230.81)] border-b border-[oklch(0.2593_0.0033_230.84)] shadow-xs">
            {/* Kolom Waktu Sudut Kiri */}
            <div className="w-20 shrink-0 p-3 text-center border-r border-[oklch(0.2593_0.0033_230.84)] text-xs font-semibold text-[oklch(0.65_0.002_230.81)]">
              Jam
            </div>

            {/* Kolom 4 Lapangan */}
            <div
              style={{ gridTemplateColumns: `repeat(${courts.length || 4}, minmax(0, 1fr))` }}
              className="flex-1 grid divide-x divide-[oklch(0.2593_0.0033_230.84)]"
            >
              {(courts.length > 0
                ? courts
                : [
                    { id: 1, nama_lapangan: 'Court 1', status: 'Aktif' as const, tarif_per_jam: 50000 },
                    { id: 2, nama_lapangan: 'Court 2', status: 'Aktif' as const, tarif_per_jam: 50000 },
                    { id: 3, nama_lapangan: 'Court 3', status: 'Aktif' as const, tarif_per_jam: 50000 },
                    { id: 4, nama_lapangan: 'Court 4', status: 'Aktif' as const, tarif_per_jam: 50000 },
                  ]
              ).map((court) => (
                <div key={court.id} className="p-3 text-center">
                  <div className="text-xs font-bold text-white tracking-tight">
                    {court.nama_lapangan}
                  </div>
                  <div className="text-[10px] text-[oklch(0.6_0.002_230.81)] mt-0.5 flex items-center justify-center gap-1.5">
                    <span className="text-emerald-400 font-medium">
                      {formatRupiah(court.tarif_per_jam)}/jam
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Baris-baris Jam Operasional */}
          <div className="divide-y divide-[oklch(0.2593_0.0033_230.84)]/50">
            {TIME_SLOTS.map((hour) => {
              const activeCourtsList =
                courts.length > 0
                  ? courts
                  : [
                      { id: 1, nama_lapangan: 'Court 1' },
                      { id: 2, nama_lapangan: 'Court 2' },
                      { id: 3, nama_lapangan: 'Court 3' },
                      { id: 4, nama_lapangan: 'Court 4' },
                    ]

              return (
                <div key={hour} className="flex min-h-[68px]">
                  {/* Kolom Jam di Sisi Kiri */}
                  <div className="w-20 shrink-0 flex items-center justify-center border-r border-[oklch(0.2593_0.0033_230.84)] text-xs font-mono text-[oklch(0.65_0.002_230.81)] bg-[oklch(0.185_0.002_230.81)]/50">
                    {hour}
                  </div>

                  {/* Grid 4 Kolom Lapangan */}
                  <div
                    style={{ gridTemplateColumns: `repeat(${activeCourtsList.length}, minmax(0, 1fr))` }}
                    className="flex-1 grid divide-x divide-[oklch(0.2593_0.0033_230.84)]/40"
                  >
                    {activeCourtsList.map((court) => {
                      const key = `${court.id}_${hour}`
                      const booking = bookingSlotMap.get(key)

                      if (booking) {
                        const isLunas = booking.status === 'Lunas'
                        const isDP = booking.tipe_bayar === 'DP' || booking.status === 'Booked'
                        const sisa = booking.sisa_bayar || 0

                        return (
                          <div
                            key={court.id}
                            onClick={() => setSelectedBookingForSheet(booking)}
                            className={`p-2 transition-all cursor-pointer relative group flex flex-col justify-between ${
                              isLunas
                                ? 'bg-emerald-950/30 border-l-2 border-emerald-500 hover:bg-emerald-950/50'
                                : 'bg-amber-950/30 border-l-2 border-amber-400 hover:bg-amber-950/50'
                            }`}
                            title={`Klik untuk rincian & pelunasan: INV-${booking.id} - ${booking.nama_penyewa}`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[10px] font-mono text-[oklch(0.7_0.002_230.81)] truncate">
                                  INV-{String(booking.id).padStart(4, '0')}
                                </span>
                                <span className="text-xs font-semibold text-white truncate">
                                  {booking.nama_penyewa}
                                </span>
                              </div>

                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium shrink-0 ${
                                  isLunas
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {isLunas ? 'Lunas' : 'DP 50%'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-[oklch(0.65_0.002_230.81)] mt-1">
                              <span>{formatSlotRange(booking.jam_slots)}</span>
                              {isDP && sisa > 0 && (
                                <span className="text-amber-400 font-semibold">
                                  Sisa {formatRupiah(sisa)}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      }

                      {/* Slot Kosong / Tersedia */}
                      return (
                        <div
                          key={court.id}
                          onClick={() =>
                            onOpenManualModalWithSlot?.(court.id, selectedDate, hour)
                          }
                          className="p-2 transition-colors cursor-pointer group hover:bg-white/[0.04] flex items-center justify-center relative min-h-[64px]"
                          title={`Slot tersedia. Klik untuk booking walk-in jam ${hour}`}
                        >
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded transition-opacity">
                            <Plus className="w-3 h-3" />
                            <span>+ Walk-in</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
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
