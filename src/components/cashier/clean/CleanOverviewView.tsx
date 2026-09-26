import { useMemo } from 'react'
import {
  TrendingUp,
  Receipt,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  CalendarDays,
  ArrowRight,
} from 'lucide-react'
import type { Lapangan, Booking } from '../../../types/database'
import { formatRupiah, formatDisplayDate, getTodayISODate } from '../../../utils/formatters'
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'

interface CleanOverviewViewProps {
  courts: Lapangan[]
  bookings: Booking[]
  onNavigateToSchedule: (date?: string) => void
  onNavigateToBookings: () => void
  onSelectBooking: (booking: Booking) => void
}

export function CleanOverviewView({
  courts,
  bookings,
  onNavigateToSchedule,
  onNavigateToBookings,
  onSelectBooking,
}: CleanOverviewViewProps) {
  const today = getTodayISODate()

  // Calculate high level business metrics
  const metrics = useMemo(() => {
    let totalOmzet = 0
    let totalPiutang = 0
    let totalLunas = 0
    let totalDP = 0
    let todayBookingsCount = 0

    bookings.forEach((b) => {
      if (b.status !== 'Batal') {
        totalOmzet += b.nominal_dibayar || 0
        totalPiutang += b.sisa_bayar || 0
        if (b.status === 'Lunas') totalLunas++
        else if (b.status === 'Booked' && b.sisa_bayar > 0) totalDP++
        if (b.tgl_main === today) todayBookingsCount++
      }
    })

    return {
      totalOmzet,
      totalPiutang,
      totalLunas,
      totalDP,
      todayBookingsCount,
      totalBookings: bookings.length,
    }
  }, [bookings, today])

  // Court utilization stats
  const courtStats = useMemo(() => {
    return courts.map((c) => {
      const courtBookings = bookings.filter((b) => b.lapangan_id === c.id && b.status !== 'Batal')
      const totalHours = courtBookings.reduce((sum, b) => sum + (b.durasi_jam || 1), 0)
      const totalIncome = courtBookings.reduce((sum, b) => sum + (b.nominal_dibayar || 0), 0)

      return {
        ...c,
        bookingsCount: courtBookings.length,
        totalHours,
        totalIncome,
      }
    })
  }, [courts, bookings])

  // 5 Most recent bookings
  const recentBookings = useMemo(() => {
    return [...bookings].slice(0, 5)
  }, [bookings])

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full select-none">
      {/* 1. Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Total Uang Masuk</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">{formatRupiah(metrics.totalOmzet)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-5 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Sisa Piutang (DP)</p>
              <p className="text-xl font-bold text-amber-400 mt-1">{formatRupiah(metrics.totalPiutang)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-5 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Jadwal Hari Ini</p>
              <p className="text-xl font-bold text-zinc-100 mt-1">{metrics.todayBookingsCount} Booking</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <CalendarDays className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-5 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Total Transaksi</p>
              <p className="text-xl font-bold text-zinc-100 mt-1">{metrics.totalBookings}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Receipt className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Court Utilization Cards & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Lapangan Overview */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-100">Status & Pendapatan Lapangan</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToSchedule(today)}
              className="text-xs text-zinc-400 hover:text-zinc-100"
            >
              <span>Lihat Kalender</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courtStats.map((c) => (
              <Card key={c.id} className="p-4 bg-zinc-900/60 border-zinc-800 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">{c.nama_lapangan}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{formatRupiah(c.tarif_per_jam)} / jam</p>
                  </div>
                  <Badge variant={c.status === 'Aktif' ? 'success' : 'secondary'} className="text-[10px]">
                    {c.status}
                  </Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">{c.totalHours} jam terpakai</span>
                  <span className="font-semibold text-emerald-400">{formatRupiah(c.totalIncome)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Transactions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-100">Transaksi Terkini</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToBookings}
              className="text-xs text-zinc-400 hover:text-zinc-100"
            >
              <span>Semua</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          <Card className="bg-zinc-900/60 border-zinc-800 divide-y divide-zinc-800/80">
            {recentBookings.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-500">Belum ada transaksi.</div>
            ) : (
              recentBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onSelectBooking(b)}
                  className="p-3.5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors cursor-pointer select-none"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-100">{b.nama_penyewa}</span>
                    <span className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      INV-{b.id.toString().padStart(4, '0')} &bull; {b.tgl_main}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-zinc-200">
                      {formatRupiah(b.total_bayar)}
                    </span>
                    <span className={`text-[10px] font-medium mt-0.5 ${
                      b.status === 'Lunas' ? 'text-emerald-400' : b.status === 'Batal' ? 'text-zinc-500' : 'text-amber-400'
                    }`}>
                      {b.status === 'Booked' ? 'DP 50%' : b.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
