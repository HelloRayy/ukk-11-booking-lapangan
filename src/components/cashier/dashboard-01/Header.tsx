// PERAN FILE: Komponen Top Header Bar Kasir ala Shadcn UI
import { Search, Bell, Menu } from 'lucide-react'

interface HeaderProps {
  currentTab: 'overview' | 'bookings'
  onToggleMobileSidebar?: () => void
}

export default function Header({ currentTab, onToggleMobileSidebar }: HeaderProps) {
  return (
    <header className="h-16 shrink-0 border-b border-[#262626] bg-[#141414]/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 select-none">
      {/* 1. Sisi Kiri: Breadcrumb & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg bg-white/5 text-[#8e8e8e] hover:text-white cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8e8e8e]">Dashboard</span>
          <span className="text-[#555]">/</span>
          <span className="text-white font-semibold">
            {currentTab === 'overview' ? 'Overview' : 'Operasional (Tabel)'}
          </span>
        </div>
      </div>

      {/* 2. Sisi Tengah/Kanan: Search Bar Input Mockup & Status Kasir */}
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari transaksi, nama pemesan..."
            className="w-full h-9 pl-9 pr-12 rounded-lg bg-white/5 border border-[#262626] text-xs text-white placeholder:text-[#737373] focus:outline-none focus:border-white/20 transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#8e8e8e] pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Tombol Notifikasi & Profil Kasir */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-[#8e8e8e] hover:text-white transition-colors relative cursor-pointer"
            title="Notifikasi Kasir"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-[#141414]" />
          </button>

          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
            AK
          </div>
        </div>
      </div>
    </header>
  )
}
