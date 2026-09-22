// PERAN FILE: Baris Header Kolom Lapangan (Clean UI)
import type { Court } from '../types'

interface ScheduleHeaderProps {
  courts: Court[]
}

export default function ScheduleHeader({ courts }: ScheduleHeaderProps) {
  return (
    <div className="flex border-b border-[#262626] bg-[#1a1a1a] sticky top-0 z-10 select-none font-aeonik">
      {/* Kolom Pojok Kiri Atas */}
      <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-r border-[#262626] p-2 text-[#737373]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
        </svg>
      </div>

      {/* Kolom Header Masing-Masing Lapangan */}
      <div className="flex-1 grid grid-cols-4 divide-x divide-[#262626]">
        {courts.map((court) => (
          <div
            key={court.id}
            className="p-3 flex items-center gap-2.5 hover:bg-white/[0.02] transition-colors min-w-0"
          >
            <img
              src={court.image}
              alt={court.name}
              className="w-8 h-8 rounded-[8px] object-cover border border-white/10 shrink-0"
            />
            <div className="truncate">
              <span className="text-sm font-medium text-white block truncate">{court.name}</span>
              <span className="text-[11px] text-[#8e8e8e] block truncate">{court.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
