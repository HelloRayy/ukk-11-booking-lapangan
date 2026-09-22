// PERAN FILE: Baris Header Kolom Lapangan (Clean UI)
import type { Court } from '../types'

interface ScheduleHeaderProps {
  courts: Court[]
}

export default function ScheduleHeader({ courts }: ScheduleHeaderProps) {
  return (
    <div className="flex border-b border-[#262626] bg-[#1a1a1a] sticky top-0 z-10 select-none font-aeonik">
      {/* Kolom Pojok Kiri Atas (Label Jam) */}
      <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-r border-[#262626] p-2 text-[#737373]">
        <div className="flex items-center gap-1.5 text-[#737373]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-[11px] font-medium tracking-wider uppercase">Jam</span>
        </div>
      </div>

      {/* Kolom Header Masing-Masing Lapangan (Clean Typography Tanpa Gambar Berulang) */}
      <div
        style={{ gridTemplateColumns: `repeat(${courts.length || 1}, minmax(0, 1fr))` }}
        className="flex-1 grid divide-x divide-[#262626]"
      >
        {courts.map((court) => (
          <div
            key={court.id}
            className="py-3 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors min-w-0"
          >
            <div className="truncate">
              <span className="text-sm font-semibold text-white block truncate">{court.name}</span>
              <span className="text-[11px] text-[#8e8e8e] block truncate">{court.type}</span>
            </div>
            <span className="text-xs text-[#737373] hidden md:block shrink-0">
              Rp {(court.pricePerHour / 1000).toLocaleString('id-ID')}k/jam
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
