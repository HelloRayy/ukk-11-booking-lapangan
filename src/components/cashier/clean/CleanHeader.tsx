import { useState, useEffect } from 'react'
import {
  CalendarDays,
  Receipt,
  LayoutDashboard,
  Settings,
  RefreshCw,
  Plus,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '../../ui/button'

export type CashierTab = 'schedule' | 'bookings' | 'overview'

interface CleanHeaderProps {
  currentTab: CashierTab
  onTabChange: (tab: CashierTab) => void
  onOpenWalkin: () => void
  onOpenCourtManager: () => void
  onRefresh: () => void
  isLoading?: boolean
}

export function CleanHeader({
  currentTab,
  onTabChange,
  onOpenWalkin,
  onOpenCourtManager,
  onRefresh,
  isLoading = false,
}: CleanHeaderProps) {
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      setTimeStr(`${h}:${m}:${s} WIB`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-16 shrink-0 border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6 flex items-center justify-between gap-4 select-none">
      {/* 1. Brand & Tab Navigation */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold text-sm">
            B
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-100 leading-none">Blanca Arena</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Kasir</p>
          </div>
        </div>

        {/* Tab Buttons (Segmented Controls) */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => onTabChange('schedule')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentTab === 'schedule'
                ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Jadwal</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('bookings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentTab === 'bookings'
                ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Transaksi</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              currentTab === 'overview'
                ? 'bg-zinc-800 text-zinc-100 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Ringkasan</span>
          </button>
        </nav>
      </div>

      {/* 2. Actions & Utilities */}
      <div className="flex items-center gap-2.5">
        {/* Realtime Clock */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{timeStr || 'Memuat...'}</span>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100"
          title="Sinkronkan Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sinkron</span>
        </Button>

        {/* Master Lapangan Modal Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCourtManager}
          className="h-8 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100"
          title="Kelola Lapangan"
        >
          <Settings className="w-3.5 h-3.5 mr-1.5" />
          <span>Lapangan</span>
        </Button>

        {/* Booking Baru (Primary Action) */}
        <Button
          size="sm"
          onClick={onOpenWalkin}
          className="h-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Booking Baru</span>
        </Button>

        {/* External Link ke Web Reservasi */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center justify-center h-8 w-8 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100 transition-colors"
          title="Lihat Halaman Publik"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </header>
  )
}
