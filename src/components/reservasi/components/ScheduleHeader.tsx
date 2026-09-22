// PERAN FILE: Baris Header Kolom Lapangan Khas Referensi Aplikasi Kalender
import type { Court } from '../types'

interface ScheduleHeaderProps {
  courts: Court[]
}

export default function ScheduleHeader({ courts }: ScheduleHeaderProps) {
  return (
    <div className="flex border-b border-[#262626] bg-[#1a1a1a] sticky top-0 z-10 select-none">
      {/* Kolom Pojok Kiri Atas (Penyeimbang Label Jam) */}
      <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-r border-[#262626] p-2 text-[#737373]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>

      {/* Kolom Header Masing-Masing Lapangan */}
      <div className="flex-1 grid grid-cols-4 divide-x divide-[#262626]">
        {courts.map((court) => (
          <div
            key={court.id}
            className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
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

            {/* Status Lampu Operasional */}
            <span
              className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
              title="Lapangan Aktif Beroperasi"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
