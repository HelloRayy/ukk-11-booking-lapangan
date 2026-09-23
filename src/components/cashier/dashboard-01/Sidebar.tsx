// PERAN FILE: Komponen Sidebar Minimalis Kasir ala Shadcn UI
import { LayoutDashboard, Calendar, ArrowUpRight, ShieldCheck } from 'lucide-react'

interface SidebarProps {
  currentTab: 'overview'
  onTabChange?: (tab: 'overview') => void
}

export default function Sidebar({ currentTab = 'overview' }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-[#262626] bg-[#141414] p-5 select-none min-h-[calc(100vh-4rem)]">
      {/* 1. Header Brand & Nama Arena */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
            B
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">BLANCA ARENA</h2>
            <p className="text-[10px] text-[#8e8e8e]">Cashier & Management</p>
          </div>
        </div>

        {/* 2. Menu Navigasi Sesuai Pilihan Pengguna (Minimalis) */}
        <nav className="space-y-1">
          <button
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'overview'
                ? 'bg-white/10 text-white shadow-xs border border-white/10'
                : 'text-[#8e8e8e] hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Overview</span>
          </button>

          {/* Link ke Kalender Publik */}
          <a
            href="/reservasi"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-[#8e8e8e] hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-[#8e8e8e]" />
              <span>Kalender Publik</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#555]" />
          </a>
        </nav>
      </div>

      {/* 3. Footer Sidebar: Profil Kasir & Status */}
      <div className="pt-4 border-t border-[#262626] flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
            AK
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Admin Kasir</div>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>

        <ShieldCheck className="w-4 h-4 text-[#737373]" />
      </div>
    </aside>
  )
}
