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
    <header className="h-[46px] shrink-0 border-b border-[#262626] bg-[#181818] px-5 flex items-center justify-between gap-4 select-none text-[#fafafa] font-aeonik">
      {/* 1. Sisi Kiri: Breadcrumb Kasir */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-md bg-white/5 text-[#a3a3a3] hover:text-white cursor-pointer border border-white/10"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#737373]">...</span>
          <span className="font-medium text-[#a3a3a3]">
            Blanca Arena
          </span>
          <span className="text-[#737373]">/</span>
          <span className="text-white font-semibold">
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
          className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 border border-[#262626] flex items-center justify-center text-[#a3a3a3] hover:text-white transition-colors relative cursor-pointer"
          title="Notifikasi"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953] absolute top-1.5 right-1.5" />
        </button>

        <div className="w-7 h-7 rounded-full bg-[#f2d953]/15 border border-[#f2d953]/30 flex items-center justify-center text-[10px] font-bold text-[#f2d953]">
          AK
        </div>
      </div>
    </header>
  )
}
