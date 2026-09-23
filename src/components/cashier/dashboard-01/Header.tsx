// PERAN FILE: Komponen Top Header Bar Kasir Linear-Style (Inter Sans Bebas Mono)
import { Search, Bell, Menu } from 'lucide-react'

interface HeaderProps {
  currentTab: 'overview' | 'bookings'
  searchKeyword?: string
  onSearchChange?: (val: string) => void
  onToggleMobileSidebar?: () => void
}

export default function Header({
  currentTab,
  searchKeyword = '',
  onSearchChange,
  onToggleMobileSidebar,
}: HeaderProps) {
  return (
    <header className="h-[44px] shrink-0 border-b border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.1932_0.002_230.81)] px-5 flex items-center justify-between gap-4 select-none text-[oklch(0.9235_0.001733_230.685)]">
      {/* 1. Sisi Kiri: Breadcrumb Linear (... 💻 road-to-ukk / Work items) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1 rounded-md bg-white/5 text-[oklch(0.65_0.002_230.81)] hover:text-white cursor-pointer"
        >
          <Menu className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[oklch(0.65_0.002_230.81)]">...</span>
          <span className="font-medium text-[oklch(0.9235_0.001733_230.685)]">
            Blanca Arena
          </span>
          <span className="text-[oklch(0.4_0.002_230.81)]">/</span>
          <span className="text-white font-semibold">
            {currentTab === 'overview' ? 'Overview' : 'Transaksi'}
          </span>
        </div>
      </div>

      {/* 2. Sisi Kanan: Search Input & Shortcut */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block w-52 md:w-60">
          <Search className="w-3.5 h-3.5 text-[oklch(0.55_0.002_230.81)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Cari transaksi..."
            className="w-full h-7 pl-8 pr-10 rounded-md bg-[oklch(0.16_0.002_230.81)] border border-[oklch(0.2593_0.0033_230.84)] text-xs text-[oklch(0.9235_0.001733_230.685)] placeholder:text-[oklch(0.55_0.002_230.81)] focus:outline-none focus:border-[oklch(0.35_0.0033_230.84)] transition-colors"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/10 text-[oklch(0.65_0.002_230.81)] pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Notifikasi & Profile Avatar */}
        <button
          type="button"
          className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 border border-[oklch(0.2593_0.0033_230.84)] flex items-center justify-center text-[oklch(0.65_0.002_230.81)] hover:text-white transition-colors relative cursor-pointer"
          title="Notifikasi"
        >
          <Bell className="w-3 h-3" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
        </button>

        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400">
          AK
        </div>
      </div>
    </header>
  )
}
