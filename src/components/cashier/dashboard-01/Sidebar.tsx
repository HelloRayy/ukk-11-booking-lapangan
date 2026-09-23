// PERAN FILE: Komponen Sidebar Kasir Linear-Style (Full Height & Inter Sans)
import { LayoutDashboard, ReceiptText, Calendar, ArrowUpRight, ShieldCheck } from 'lucide-react'

interface SidebarProps {
  currentTab: 'overview' | 'bookings'
  onTabChange?: (tab: 'overview' | 'bookings') => void
}

export default function Sidebar({ currentTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between border-r border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.1932_0.002_230.81)] p-3.5 select-none h-screen text-[oklch(0.9235_0.001733_230.685)]">
      {/* 1. Brand & Workspace Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs shadow-xs">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white tracking-tight">
              Blanca Arena
            </span>
            <span className="text-[10px] text-[oklch(0.65_0.002_230.81)]">Kasir & Reservasi</span>
          </div>
        </div>

        {/* 2. Menu Navigasi Linear */}
        <nav className="space-y-0.5">
          <button
            type="button"
            onClick={() => onTabChange?.('overview')}
            className={`w-full flex items-center justify-between gap-1.5 py-1 px-2 rounded-md h-[30px] leading-normal transition-all cursor-pointer outline-none select-none ${
              currentTab === 'overview'
                ? 'bg-[oklch(1_0_0_/_0.08)] text-white shadow-xs'
                : 'text-[oklch(0.8455_0.0035_230.72)] hover:bg-[oklch(1_0_0_/_0.05)] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 py-px h-[22px] leading-normal transition-all">
              <LayoutDashboard className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-sm font-medium leading-normal transition-all">Overview</p>
            </div>
            <div className="flex items-center gap-1.5 leading-normal transition-all">
              {currentTab === 'overview' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onTabChange?.('bookings')}
            className={`w-full flex items-center justify-between gap-1.5 py-1 px-2 rounded-md h-[30px] leading-normal transition-all cursor-pointer outline-none select-none ${
              currentTab === 'bookings'
                ? 'bg-[oklch(1_0_0_/_0.08)] text-white shadow-xs'
                : 'text-[oklch(0.8455_0.0035_230.72)] hover:bg-[oklch(1_0_0_/_0.05)] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 py-px h-[22px] leading-normal transition-all">
              <ReceiptText className="w-4 h-4 text-[#f2d953] shrink-0" />
              <p className="text-sm font-medium leading-normal transition-all">Transaksi</p>
            </div>
            <div className="flex items-center gap-1.5 leading-normal transition-all">
              {currentTab === 'bookings' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
              )}
            </div>
          </button>

          <a
            href="/reservasi"
            className="w-full flex items-center justify-between gap-1.5 py-1 px-2 rounded-md h-[30px] text-[oklch(0.8455_0.0035_230.72)] hover:bg-[oklch(1_0_0_/_0.05)] hover:text-white leading-normal transition-all cursor-pointer outline-none group select-none"
          >
            <div className="flex items-center gap-2 py-px h-[22px] leading-normal transition-all">
              <Calendar className="w-4 h-4 text-[oklch(0.65_0.002_230.81)] group-hover:text-white shrink-0 transition-colors" />
              <p className="text-sm font-medium leading-normal transition-all">Kalender Publik</p>
            </div>
            <div className="flex items-center gap-1.5 leading-normal transition-all">
              <ArrowUpRight className="w-3.5 h-3.5 text-[oklch(0.45_0.002_230.81)] group-hover:text-white transition-colors" />
            </div>
          </a>
        </nav>
      </div>

      {/* 3. Footer Profil Kasir Linear */}
      <div className="pt-3 border-t border-[oklch(0.2593_0.0033_230.84)] flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">
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

        <ShieldCheck className="w-3.5 h-3.5 text-[oklch(0.45_0.002_230.81)]" />
      </div>
    </aside>
  )
}
