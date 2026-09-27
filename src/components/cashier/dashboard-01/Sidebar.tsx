// PERAN FILE: Komponen Sidebar Kasir dengan Gaya Dark Minimalist Selaras /reservasi
import { LayoutDashboard, ReceiptText, Calendar, ArrowUpRight, ShieldCheck, CalendarDays, SlidersHorizontal } from 'lucide-react'

interface SidebarProps {
  currentTab: 'overview' | 'bookings' | 'schedule' | 'courts'
  onTabChange?: (tab: 'overview' | 'bookings' | 'schedule' | 'courts') => void
  onOpenCourtManager?: () => void
}

export default function Sidebar({ currentTab, onTabChange, onOpenCourtManager }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col justify-between border-r border-zinc-800/80 bg-zinc-950 p-3.5 select-none h-screen text-zinc-100 font-aeonik">
      {/* 1. Brand & Workspace Bar */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-7 h-7 rounded-md bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-sm shadow-xs">
            B
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-100 tracking-tight">
              Blanca Arena
            </span>
            <span className="text-xs text-zinc-400 font-medium">Kasir & Resepsionis</span>
          </div>
        </div>

        {/* 2. Menu Navigasi Kasir */}
        <nav className="space-y-1">
          <button
            type="button"
            onClick={() => onTabChange?.('overview')}
            className={`w-full flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer outline-none select-none transition-colors group ${
              currentTab === 'overview'
                ? 'bg-zinc-900 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className={`w-4 h-4 shrink-0 transition-colors ${currentTab === 'overview' ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span>Overview</span>
            </div>
            {currentTab === 'overview' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Tab 2: Jadwal Lapangan (Matriks Visual Kasir) */}
          <button
            type="button"
            onClick={() => onTabChange?.('schedule')}
            className={`w-full flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer outline-none select-none transition-colors group ${
              currentTab === 'schedule'
                ? 'bg-zinc-900 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarDays className={`w-4 h-4 shrink-0 transition-colors ${currentTab === 'schedule' ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span>Jadwal Lapangan</span>
            </div>
            {currentTab === 'schedule' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Tab 3: Transaksi Booking */}
          <button
            type="button"
            onClick={() => onTabChange?.('bookings')}
            className={`w-full flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer outline-none select-none transition-colors group ${
              currentTab === 'bookings'
                ? 'bg-zinc-900 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <ReceiptText className={`w-4 h-4 shrink-0 transition-colors ${currentTab === 'bookings' ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span>Transaksi</span>
            </div>
            {currentTab === 'bookings' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Tab 4: Kelola Lapangan (Standalone Page Master Data Poin 10, 11, 12 UKK) */}
          <button
            type="button"
            onClick={() => onTabChange?.('courts')}
            className={`w-full flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer outline-none select-none transition-colors group ${
              currentTab === 'courts'
                ? 'bg-zinc-900 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className={`w-4 h-4 shrink-0 transition-colors ${currentTab === 'courts' ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span>Kelola Lapangan</span>
            </div>
            {currentTab === 'courts' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Tautan ke Kalender Publik Pemesan */}
          <a
            href="/reservasi"
            className="w-full flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 whitespace-nowrap cursor-pointer outline-none select-none transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 shrink-0 transition-colors" />
              <span>Kalender Publik</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </a>
        </nav>
      </div>

      {/* 3. Footer Profil Kasir */}
      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-semibold text-zinc-200">
            AK
          </div>
          <div>
            <div className="text-xs font-medium text-zinc-200 leading-tight">Admin Kasir</div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Online</span>
            </div>
          </div>
        </div>

        <ShieldCheck className="w-4 h-4 text-zinc-500" />
      </div>
    </aside>
  )
}
