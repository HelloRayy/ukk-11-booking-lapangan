// PERAN FILE: Komponen Sidebar Kasir dengan Gaya Dark Minimalist Selaras /reservasi
import { LayoutDashboard, ReceiptText, Calendar, ArrowUpRight, ShieldCheck, CalendarDays, SlidersHorizontal } from 'lucide-react'

interface SidebarProps {
  currentTab: 'overview' | 'bookings' | 'schedule'
  onTabChange?: (tab: 'overview' | 'bookings' | 'schedule') => void
  onOpenCourtManager?: () => void
}

export default function Sidebar({ currentTab, onTabChange, onOpenCourtManager }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between border-r border-[#262626] bg-[#181818] p-3.5 select-none h-screen text-[#fafafa] font-aeonik">
      {/* 1. Brand & Workspace Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-6 h-6 rounded-md bg-[#f2d953] text-black flex items-center justify-center font-bold text-xs shadow-xs">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white tracking-tight">
              Blanca Arena
            </span>
            <span className="text-[10px] text-[#737373]">Kasir & Resepsionis</span>
          </div>
        </div>

        {/* 2. Menu Navigasi Kasir */}
        <nav className="space-y-0.5">
          <button
            type="button"
            onClick={() => onTabChange?.('overview')}
            className={`w-full flex items-center justify-between gap-1.5 py-1 px-2 rounded-md h-[32px] leading-normal transition-all cursor-pointer outline-none select-none ${
              currentTab === 'overview'
                ? 'bg-white/10 text-white font-semibold shadow-xs'
                : 'text-[#a3a3a3] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 py-px h-[22px] leading-normal transition-all">
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${currentTab === 'overview' ? 'text-[#f2d953]' : 'text-[#737373]'}`} />
              <p className="text-sm font-medium leading-normal transition-all">Overview</p>
            </div>
            <div className="flex items-center gap-1.5 leading-normal transition-all">
              {currentTab === 'overview' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
              )}
            </div>
          </button>

          {/* Tab 2: Jadwal Lapangan (Matriks Visual Kasir) */}
          <button
            type="button"
            onClick={() => onTabChange?.('schedule')}
            className={`w-full flex items-center justify-between gap-1.5 py-1 px-2 rounded-md h-[32px] leading-normal transition-all cursor-pointer outline-none select-none ${
              currentTab === 'schedule'
                ? 'bg-white/10 text-white font-semibold shadow-xs'
                : 'text-[#a3a3a3] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 py-px h-[22px] leading-normal transition-all">
              <CalendarDays className={`w-4 h-4 shrink-0 ${currentTab === 'schedule' ? 'text-[#f2d953]' : 'text-[#737373]'}`} />
              <p className="text-sm font-medium leading-normal transition-all">Jadwal Lapangan</p>
            </div>
            <div className="flex items-center gap-1.5 leading-normal transition-all">
              {currentTab === 'schedule' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
              )}
            </div>
          </button>

          {/* Tab 3: Transaksi Booking */}
          <button
            type="button"
            onClick={() => onTabChange?.('bookings')}
            className={`w-full flex items-center justify-between gap-1.5 py-1 px-2 rounded-md h-[32px] leading-normal transition-all cursor-pointer outline-none select-none ${
              currentTab === 'bookings'
                ? 'bg-white/10 text-white font-semibold shadow-xs'
                : 'text-[#a3a3a3] hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2 py-px h-[22px] leading-normal transition-all">
              <ReceiptText className={`w-4 h-4 shrink-0 ${currentTab === 'bookings' ? 'text-[#f2d953]' : 'text-[#737373]'}`} />
              <p className="text-sm font-medium leading-normal transition-all">Transaksi</p>
            </div>
            <div className="flex items-center gap-1.5 leading-normal transition-all">
              {currentTab === 'bookings' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
              )}
            </div>
          </button>

          {/* Menu Tambahan: Kelola Lapangan (CRUD Master Data Poin 10, 11, 12 UKK) */}
          <button
            type="button"
            onClick={onOpenCourtManager}
            className="w-full flex items-center justify-between gap-1.5 py-1 px-2 rounded-md h-[32px] leading-normal transition-all cursor-pointer outline-none select-none text-[#a3a3a3] hover:bg-white/5 hover:text-white group"
          >
            <div className="flex items-center gap-2 py-px h-[22px] leading-normal transition-all">
              <SlidersHorizontal className="w-4 h-4 text-[#f2d953] group-hover:rotate-45 transition-transform shrink-0" />
              <p className="text-sm font-medium leading-normal transition-all">Kelola Lapangan</p>
            </div>
            <div className="flex items-center gap-1 leading-normal transition-all">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#f2d953]/15 text-[#f2d953] border border-[#f2d953]/30">
                CRUD
              </span>
            </div>
          </button>

          {/* Tautan ke Kalender Publik Pemesan */}
          <a
            href="/reservasi"
            className="w-full flex items-center justify-between gap-1.5 py-1 px-2 rounded-md h-[32px] text-[#a3a3a3] hover:bg-white/5 hover:text-white leading-normal transition-all cursor-pointer outline-none group select-none"
          >
            <div className="flex items-center gap-2 py-px h-[22px] leading-normal transition-all">
              <Calendar className="w-4 h-4 text-[#737373] group-hover:text-white shrink-0 transition-colors" />
              <p className="text-sm font-medium leading-normal transition-all">Kalender Publik</p>
            </div>
            <div className="flex items-center gap-1.5 leading-normal transition-all">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#737373] group-hover:text-white transition-colors" />
            </div>
          </a>
        </nav>
      </div>

      {/* 3. Footer Profil Kasir */}
      <div className="pt-3 border-t border-[#262626] flex items-center justify-between px-2">
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

        <ShieldCheck className="w-3.5 h-3.5 text-[#737373]" />
      </div>
    </aside>
  )
}
