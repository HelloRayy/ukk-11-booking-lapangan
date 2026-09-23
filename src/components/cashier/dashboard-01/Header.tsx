// PERAN FILE: Komponen Top Header Bar Kasir ala Shadcn UI
import { Search, Bell, Menu } from 'lucide-react'

interface HeaderProps {
  currentTab: 'overview' | 'bookings'
  onToggleMobileSidebar?: () => void
}

export default function Header({ currentTab, onToggleMobileSidebar }: HeaderProps) {
  return (
    <header className="h-14 shrink-0 border-b border-[#262626] bg-[#141414]/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 select-none">
      {/* 1. Sisi Kiri: Breadcrumb & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg bg-white/5 text-[#8e8e8e] hover:text-white cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8e8e8e]">Dashboard</span>
          <span className="text-[#555]">/</span>
          <span className="text-white font-medium">
            {currentTab === 'overview' ? 'Overview' : 'Transaksi'}
          </span>
        </div>
      </div>

      {/* 2. Sisi Kanan: Search Input & Profil */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block w-56 md:w-64">
          <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="w-full h-8 pl-8 pr-10 rounded-lg bg-white/5 border border-[#262626] text-xs text-white placeholder:text-[#737373] focus:outline-none focus:border-white/20 transition-colors"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono px-1 py-0.5 rounded bg-white/10 text-[#8e8e8e] pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Notifikasi & Avatar */}
        <button
          type="button"
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-[#8e8e8e] hover:text-white transition-colors relative cursor-pointer"
          title="Notifikasi"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-2 right-2" />
        </button>

        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
          AK
        </div>
      </div>
    </header>
  )
}
