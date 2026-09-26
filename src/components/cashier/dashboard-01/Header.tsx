import { Bell, Menu } from 'lucide-react'

interface HeaderProps {
  currentTab: 'overview' | 'bookings' | 'schedule'
  onToggleMobileSidebar?: () => void
}

export default function Header({
  currentTab,
  onToggleMobileSidebar,
}: HeaderProps) {
  return (
    <header className="h-12 shrink-0 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-5 flex items-center justify-between gap-4 select-none text-zinc-100 font-sans">
      {/* 1. Sisi Kiri: Breadcrumb Kasir */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-100 cursor-pointer border border-zinc-800 transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-600">...</span>
          <span className="font-medium text-zinc-400">
            Blanca Arena
          </span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-100 font-semibold tracking-tight">
            {currentTab === 'overview'
              ? 'Overview'
              : currentTab === 'schedule'
              ? 'Jadwal Lapangan'
              : 'Transaksi'}
          </span>
        </div>
      </div>

      {/* 2. Sisi Kanan: Status Kasir, Notifikasi, & Profile Avatar */}
      <div className="flex items-center gap-3">
        {/* Status Indikator Sistem Kasir */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Kasir Online</span>
        </div>

        {/* Notifikasi & Profile Avatar */}
        <button
          type="button"
          className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors relative cursor-pointer"
          title="Notifikasi"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-2 right-2" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xs font-bold text-amber-400">
          AK
        </div>
      </div>
    </header>
  )
}
