// PERAN FILE: Komponen Sidebar Minimalis Kasir ala Shadcn UI
import { LayoutDashboard, ReceiptText, Calendar, ArrowUpRight, ShieldCheck } from 'lucide-react'

interface SidebarProps {
  currentTab: 'overview' | 'bookings'
  onTabChange?: (tab: 'overview' | 'bookings') => void
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between border-r border-[#262626] bg-[#141414] p-4 select-none min-h-[calc(100vh-4rem)]">
      {/* 1. Brand Logo */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-6 h-6 rounded-md bg-white text-[#121212] flex items-center justify-center font-black text-xs">
            B
          </div>
          <span className="text-sm font-bold text-white tracking-tight">BLANCA ARENA</span>
        </div>

        {/* 2. Menu Navigasi Bersih */}
        <nav className="space-y-1">
          <button
            type="button"
            onClick={() => onTabChange?.('overview')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentTab === 'overview'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-[#8e8e8e] hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('bookings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentTab === 'bookings'
                ? 'bg-white/10 text-white font-semibold'
                : 'text-[#8e8e8e] hover:text-white hover:bg-white/5'
            }`}
          >
            <ReceiptText className="w-4 h-4 text-[#f2d953]" />
            <span>Transaksi</span>
          </button>

          <a
            href="/reservasi"
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#8e8e8e] hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#8e8e8e]" />
              <span>Kalender</span>
            </div>
            <ArrowUpRight className="w-3 h-3 text-[#555]" />
          </a>
        </nav>
      </div>

      {/* 3. Footer Profil Kasir */}
      <div className="pt-3 border-t border-[#262626] flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold text-white">
            AK
          </div>
          <div>
            <div className="text-xs font-medium text-white leading-tight">Admin Kasir</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Online</span>
            </div>
          </div>
        </div>

        <ShieldCheck className="w-4 h-4 text-[#555]" />
      </div>
    </aside>
  )
}
