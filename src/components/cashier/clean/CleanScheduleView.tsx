import { useState, useMemo, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from 'lucide-react'
import type { Lapangan, Booking } from '../../../types/database'
import { DAFTAR_JAM } from '../../../constants/operationalHours'
import { formatRupiah, formatDisplayDate, getTodayISODate } from '../../../utils/formatters'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Card, CardContent } from '../../ui/card'

interface CleanScheduleViewProps {
  courts: Lapangan[]
  bookings: Booking[]
  selectedDate: string
  onSelectDate: (date: string) => void
  onOpenWalkin: (courtId?: number, hour?: string) => void
  onSelectBooking: (booking: Booking) => void
}

const BASE_HOUR = 8 // 08:00
const SLOT_HEIGHT = 72 // px per 1 jam

export function CleanScheduleView({
  courts,
  bookings,
  selectedDate,
  onSelectDate,
  onOpenWalkin,
  onSelectBooking,
}: CleanScheduleViewProps) {
  const today = getTodayISODate()

  // Realtime clock minutes for current time indicator
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Quick Date Navigation
  const tomorrow = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }, [])

  const handlePrevDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    onSelectDate(d.toISOString().split('T')[0])
  }

  const handleNextDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    onSelectDate(d.toISOString().split('T')[0])
  }

  // Bookings on selected date (excluding cancelled)
  const dateBookings = useMemo(() => {
    return bookings.filter((b) => b.tgl_main === selectedDate && b.status !== 'Batal')
  }, [bookings, selectedDate])

  // Clean KPI stats
  const kpiStats = useMemo(() => {
    let totalSlots = 0
    let totalKas = 0
    let totalPiutang = 0

    dateBookings.forEach((b) => {
      totalSlots += b.durasi_jam || (b.jam_slots ? b.jam_slots.length : 1)
      totalKas += b.nominal_dibayar || 0
      totalPiutang += b.sisa_bayar || 0
    })

    return {
      totalBookings: dateBookings.length,
      totalSlots,
      totalKas,
      totalPiutang,
    }
  }, [dateBookings])

  // Current time position calculation
  const isSelectedDateToday = selectedDate === today
  const isWithinSchedule = currentMinutes >= BASE_HOUR * 60 && currentMinutes <= 22 * 60
  const currentTimeTop = ((currentMinutes - BASE_HOUR * 60) / 60) * SLOT_HEIGHT

  // Convert booking slots to pixel geometry
  const getBookingGeometry = (b: Booking) => {
    const slots = (b.jam_slots || []).map((s) => parseInt(s.split(':')[0], 10)).sort((a, b) => a - b)
    const startHour = slots.length > 0 ? slots[0] : BASE_HOUR
    const endHour = slots.length > 0 ? slots[slots.length - 1] + 1 : startHour + 1
    const totalHours = Math.max(1, endHour - startHour)

    const startTimeStr = `${startHour < 10 ? '0' : ''}${startHour}:00`
    const endTimeStr = `${endHour < 10 ? '0' : ''}${endHour}:00`

    return {
      topOffset: (startHour - BASE_HOUR) * SLOT_HEIGHT + 2,
      cardHeight: totalHours * SLOT_HEIGHT - 4,
      timeRange: `${startTimeStr} - ${endTimeStr}`,
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full select-none">
      {/* 1. Date Navigation & Quick Date Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevDay}
              className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
              title="Hari Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onSelectDate(e.target.value)}
              className="bg-transparent text-xs font-medium text-zinc-100 px-2 outline-hidden cursor-pointer"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
              title="Hari Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={selectedDate === today ? 'default' : 'outline'}
              onClick={() => onSelectDate(today)}
              className="h-8 text-xs rounded-lg"
            >
              Hari Ini
            </Button>
            <Button
              size="sm"
              variant={selectedDate === tomorrow ? 'default' : 'outline'}
              onClick={() => onSelectDate(tomorrow)}
              className="h-8 text-xs rounded-lg"
            >
              Besok
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <CalendarDays className="w-4 h-4 text-zinc-300" />
          <span className="font-semibold text-zinc-100">{formatDisplayDate(selectedDate)}</span>
        </div>
      </div>

      {/* 2. Four Clean KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Booking Hari Ini</p>
              <p className="text-2xl font-bold text-zinc-100 mt-1">{kpiStats.totalBookings}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <CalendarDays className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Slot Terpakai</p>
              <p className="text-2xl font-bold text-zinc-100 mt-1">
                {kpiStats.totalSlots}{' '}
                <span className="text-xs font-normal text-zinc-500">/ {courts.length * DAFTAR_JAM.length} jam</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Kas Diterima</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">{formatRupiah(kpiStats.totalKas)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Piutang Sisa DP</p>
              <p className="text-lg font-bold text-amber-400 mt-1">{formatRupiah(kpiStats.totalPiutang)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Clean Interactive Schedule Grid */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {/* Sticky Header: Courts */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xs sticky top-0 z-10">
          {/* Pojok Jam */}
          <div className="w-16 sm:w-20 shrink-0 p-3 flex items-center justify-center border-r border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400">Jam</span>
          </div>

          {/* Kolom Tiap Lapangan */}
          <div
            className="flex-1 grid divide-x divide-zinc-800"
            style={{ gridTemplateColumns: `repeat(${courts.length || 1}, minmax(0, 1fr))` }}
          >
            {courts.map((court) => (
              <div key={court.id} className="p-3.5 flex flex-col items-start">
                <span className="text-sm font-semibold text-zinc-100">{court.nama_lapangan}</span>
                <span className="text-xs text-zinc-400 mt-0.5">{formatRupiah(court.tarif_per_jam)}/jam</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Body */}
        <div className="relative overflow-x-auto bg-zinc-950/40">
          {/* Garis Penanda Waktu Sekarang */}
          {isSelectedDateToday && isWithinSchedule && (
            <div
              style={{ top: `${currentTimeTop}px` }}
              className="absolute left-0 right-0 z-20 pointer-events-none flex items-center -translate-y-1/2"
            >
              <div className="w-16 sm:w-20 shrink-0 flex items-center justify-end pr-2">
                <span className="px-1.5 py-0.5 rounded-sm bg-red-600 text-white text-[10px] font-bold">
                  LIVE
                </span>
              </div>
              <div className="flex-1 h-[2px] bg-red-500 shadow-xs" />
            </div>
          )}

          <div className="flex">
            {/* Sumbu Waktu Sisi Kiri */}
            <div className="w-16 sm:w-20 shrink-0 flex flex-col divide-y divide-zinc-800/60 border-r border-zinc-800 bg-zinc-950/80">
              {DAFTAR_JAM.map((time) => (
                <div
                  key={time}
                  style={{ height: `${SLOT_HEIGHT}px` }}
                  className="flex items-start justify-center pt-2 text-xs font-mono text-zinc-400 font-medium"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Area Grid Tiap Lapangan */}
            <div
              className="flex-1 grid divide-x divide-zinc-800/60 relative"
              style={{ gridTemplateColumns: `repeat(${courts.length || 1}, minmax(0, 1fr))` }}
            >
              {courts.map((court) => {
                const courtBookings = dateBookings.filter((b) => b.lapangan_id === court.id)

                return (
                  <div key={court.id} className="relative flex flex-col divide-y divide-zinc-800/60">
                    {/* Background Baris Slot Kosong */}
                    {DAFTAR_JAM.map((time) => (
                      <div
                        key={time}
                        style={{ height: `${SLOT_HEIGHT}px` }}
                        onClick={() => onOpenWalkin(court.id, time)}
                        className="group relative cursor-pointer hover:bg-zinc-800/40 transition-colors"
                      >
                        {/* Hover Prompt */}
                        <div className="absolute inset-1.5 rounded-md border border-dashed border-zinc-700 bg-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-3 text-zinc-300">
                          <span className="text-xs font-medium flex items-center gap-1 text-zinc-200">
                            <Plus className="w-3.5 h-3.5" /> Booking
                          </span>
                          <span className="text-xs font-mono text-zinc-400">{time}</span>
                        </div>
                      </div>
                    ))}

                    {/* Kartu Booking Terisi */}
                    {courtBookings.map((b) => {
                      const { topOffset, cardHeight, timeRange } = getBookingGeometry(b)
                      const isLunas = b.status === 'Lunas'

                      return (
                        <div
                          key={b.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectBooking(b)
                          }}
                          style={{
                            top: `${topOffset}px`,
                            height: `${cardHeight}px`,
                          }}
                          className={`absolute inset-x-1.5 z-10 p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all shadow-xs hover:brightness-110 active:scale-[0.99] select-none ${
                            isLunas
                              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                              : 'bg-amber-950/40 border-amber-700/60 text-amber-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              {timeRange}
                            </span>
                            <Badge
                              variant={isLunas ? 'success' : 'warning'}
                              className="text-[10px] px-1.5 py-0 font-medium"
                            >
                              {isLunas ? 'Lunas' : 'DP 50%'}
                            </Badge>
                          </div>

                          <div className="my-auto truncate">
                            <p className="text-sm font-semibold text-zinc-100 truncate flex items-center gap-1">
                              <User className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                              {b.nama_penyewa}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
                            <span className="text-zinc-400 font-mono">
                              INV-{b.id.toString().padStart(4, '0')}
                            </span>
                            <span className="font-semibold text-zinc-100">
                              {b.tipe_bayar === 'DP' ? formatRupiah(b.sisa_bayar) : formatRupiah(b.total_bayar)}
                            </span>
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
    </div>
  )
}
