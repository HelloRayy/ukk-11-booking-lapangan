// PERAN FILE: Kartu 1 - Statistik Lapangan Aktif dengan Visual Lapangan Badminton
import type { CourtStatData } from '../types'

interface Props {
  data: CourtStatData
  onActionClick?: () => void
}

export default function CourtStatisticCard({ data, onActionClick }: Props) {
  return (
    <div className="relative rounded-2xl overflow-hidden p-5 flex flex-col justify-between border border-[#2a382f] bg-gradient-to-br from-[#0c2f1f] via-[#092418] to-[#061910] min-h-[220px] shadow-lg group">
      {/* Background Graphic Decor */}
      <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
      <div className="absolute right-3 top-3 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      </div>

      {/* Header Kartu */}
      <div className="relative z-10">
        <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
          Arena Status
        </span>
        <h3 className="text-xl font-bold text-white mt-1">Court Statistic</h3>
      </div>

      {/* Footer Pill: Active Court Count & Tombol Arrow */}
      <div className="relative z-10 flex items-center justify-between mt-6 p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
        <div className="flex items-center gap-2.5 px-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="text-[11px] text-[#8e8e8e]">Active Court</div>
            <div className="text-sm font-bold text-white">
              {data.activeCount}/{data.totalCount} <span className="text-xs font-normal text-[#8e8e8e]">court active</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onActionClick}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Lihat detail lapangan"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
