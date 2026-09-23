// PERAN FILE: Container Tampilan Overview Kasir ala Shadcn Dashboard-01 Terhubung Riil ke Supabase
import { useMemo } from 'react'
import MetricCards from './MetricCards'
import OverviewChart from './OverviewChart'
import RecentBookings from './RecentBookings'
import type { MetricCardItem, ChartMonthData, RecentBookingItem } from './mockData'
import type { Booking, Lapangan } from '../../../types/database'
import { formatSlotRange } from '../../../lib/utils'
import { Calendar, Download, RefreshCw } from 'lucide-react'

interface DashboardOverviewProps {
  bookings: Booking[]
  courts: Lapangan[]
  loading?: boolean
}

export default function DashboardOverview({
  bookings = [],
  courts = [],
  loading = false,
}: DashboardOverviewProps) {
  // Label Periode Berjalan (misal: "September 2026")
  const currentPeriod = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date())
  }, [])

  // 1. Kalkulasi Metrik KPI Riil dari Database Supabase
  const metrics: MetricCardItem[] = useMemo(() => {
    const validBookings = bookings.filter((b) => b.status !== 'Batal')
    const totalRevenue = validBookings.reduce((sum, b) => sum + (b.nominal_dibayar || 0), 0)
    const unpaidBookings = validBookings.filter((b) => (b.sisa_bayar || 0) > 0)
    const totalUnpaid = unpaidBookings.reduce((sum, b) => sum + (b.sisa_bayar || 0), 0)
    const activeCourtsCount = courts.filter((c) => c.status === 'Aktif').length

    return [
      {
        title: 'Total Pendapatan',
        value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
        description: 'kas masuk riil',
        trend: `${validBookings.length} transaksi`,
        trendPositive: true,
        icon: 'revenue',
      },
      {
        title: 'Total Booking',
        value: `${validBookings.length} Transaksi`,
        description: 'jadwal aktif',
        trend: `${courts.length} lapangan`,
        trendPositive: true,
        icon: 'bookings',
      },
      {
        title: 'Lapangan Aktif',
        value: `${activeCourtsCount} / ${courts.length || 1}`,
        description: 'lapangan operasional',
        trend: 'Siap Pakai',
        trendPositive: true,
        icon: 'courts',
      },
      {
        title: 'Sisa Tagihan DP',
        value: `Rp ${totalUnpaid.toLocaleString('id-ID')}`,
        description: `${unpaidBookings.length} transaksi belum lunas`,
        trend: unpaidBookings.length > 0 ? 'Perlu Pelunasan' : 'Semua Lunas',
        trendPositive: unpaidBookings.length === 0,
        icon: 'unpaid',
      },
    ]
  }, [bookings, courts])

  // 2. Kalkulasi Data Grafik Batang Bulanan Riil dari Transaksi Database
  const chartData: ChartMonthData[] = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const totalsByMonth: Record<number, number> = {}

    for (let i = 0; i < 12; i++) {
      totalsByMonth[i] = 0
    }

    bookings.forEach((b) => {
      if (b.status === 'Batal') return
      const rawDate = b.tgl_main || b.created_at || ''
      const date = new Date(rawDate)
      if (!isNaN(date.getTime())) {
        const m = date.getMonth()
        totalsByMonth[m] = (totalsByMonth[m] || 0) + (b.nominal_dibayar || b.total_bayar || 0)
      }
    })

    return monthNames.map((name, idx) => ({
      month: name,
      total: totalsByMonth[idx] || 0,
      formatted: `Rp ${(totalsByMonth[idx] || 0).toLocaleString('id-ID')}`,
    }))
  }, [bookings])

  // 3. Kalkulasi Daftar 5 Transaksi Terkini Riil dari Supabase
  const recentBookings: RecentBookingItem[] = useMemo(() => {
    const avatarColors = [
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'bg-rose-500/10 text-rose-400 border-rose-500/20',
    ]

    return bookings.slice(0, 5).map((b, idx) => ({
      id: String(b.id),
      customerName: b.nama_penyewa,
      email: b.no_hp || 'Tanpa nomor HP',
      courtName: b.lapangan?.nama_lapangan || `Lapangan ${b.lapangan_id}`,
      schedule: `${b.tgl_main} • ${formatSlotRange(b.jam_slots)}`,
      amount: b.nominal_dibayar || b.total_bayar,
      status: b.status === 'Lunas' ? ('Lunas' as const) : b.status === 'Batal' ? ('Batal' as const) : ('DP' as const),
      avatarColor: avatarColors[idx % avatarColors.length],
    }))
  }, [bookings])

  return (
    <div className="space-y-6 animate-fadeIn p-6">
      {/* 1. Baris Judul & Filter Rentang Tanggal ala Shadcn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Sinkronisasi...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Pill Rentang Waktu Dinamis */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-[#262626] text-xs text-white">
            <Calendar className="w-3.5 h-3.5 text-[#8e8e8e]" />
            <span>{currentPeriod}</span>
          </div>

          {/* Tombol Unduh Laporan */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* 2. Empat Kartu KPI Metrik Utama Terhubung Riil */}
      <MetricCards metrics={metrics} />

      {/* 3. Grid Dua Kolom Khas Shadcn Dashboard-01 */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Kolom Kiri (Lebih Lebar): Overview Bar Chart */}
        <div className="lg:col-span-4">
          <OverviewChart data={chartData} />
        </div>

        {/* Kolom Kanan: Recent Bookings */}
        <div className="lg:col-span-3">
          <RecentBookings bookings={recentBookings} />
        </div>
      </div>
    </div>
  )
}
