// PERAN FILE: Container Tampilan Overview Kasir ala Shadcn Dashboard-01
import MetricCards from './MetricCards'
import OverviewChart from './OverviewChart'
import RecentBookings from './RecentBookings'
import {
  MOCK_DASHBOARD_METRICS,
  MOCK_REVENUE_CHART,
  MOCK_RECENT_BOOKINGS,
} from './mockData'
import { Calendar, Download } from 'lucide-react'

export default function DashboardOverview() {
  return (
    <div className="space-y-6 animate-fadeIn p-6">
      {/* 1. Baris Judul & Filter Rentang Tanggal ala Shadcn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Pill Rentang Waktu */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-[#262626] text-xs text-white">
            <Calendar className="w-3.5 h-3.5 text-[#8e8e8e]" />
            <span>Maret 2026</span>
          </div>

          {/* Tombol Unduh Laporan */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Unduh Rekap</span>
          </button>
        </div>
      </div>

      {/* 2. Empat Kartu KPI Metrik Utama */}
      <MetricCards metrics={MOCK_DASHBOARD_METRICS} />

      {/* 3. Grid Dua Kolom Khas Shadcn Dashboard-01 */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Kolom Kiri (Lebih Lebar): Overview Bar Chart */}
        <div className="lg:col-span-4">
          <OverviewChart data={MOCK_REVENUE_CHART} />
        </div>

        {/* Kolom Kanan: Recent Bookings */}
        <div className="lg:col-span-3">
          <RecentBookings bookings={MOCK_RECENT_BOOKINGS} />
        </div>
      </div>
    </div>
  )
}
