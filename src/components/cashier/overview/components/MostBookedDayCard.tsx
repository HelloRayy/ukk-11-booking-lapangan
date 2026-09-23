// PERAN FILE: Kartu 2 - Grafik Sebaran Hari Paling Ramai Dipesan (Most Booked Day)
import type { DayBookingStat } from '../types'

interface Props {
  data: DayBookingStat[]
}

export default function MostBookedDayCard({ data }: Props) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="rounded-2xl p-5 border border-[#262626] bg-[#1a1a1a] flex flex-col justify-between min-h-[220px] shadow-sm">
      {/* Header Kartu */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Most Booked Day</h3>
          <span className="text-xs text-emerald-400 font-medium">+25% vs last week</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8e8e8e]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Bar Chart Sederhana Responsif */}
      <div className="flex items-end justify-between gap-2 pt-6 pb-1 h-36">
        {data.map((item) => {
          const heightPercent = Math.round((item.count / maxCount) * 100)
          const isPeak = item.isPeak

          return (
            <div key={item.dayLabel} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              {/* Badge Tooltip Peak Hour */}
              {isPeak && (
                <div className="absolute -top-7 px-2 py-0.5 rounded-md bg-[#0a5c36] border border-emerald-500/40 text-[10px] font-bold text-emerald-200 whitespace-nowrap shadow-md animate-bounce">
                  {item.count} bookings
                </div>
              )}

              {/* Batang Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[18px] rounded-full transition-all duration-300 ${
                  isPeak
                    ? 'bg-gradient-to-t from-amber-600 to-[#f2d953] shadow-[0_0_12px_rgba(242,217,83,0.3)]'
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}
              />

              {/* Label Hari */}
              <span className={`text-xs mt-2 font-medium ${isPeak ? 'text-[#f2d953] font-bold' : 'text-[#8e8e8e]'}`}>
                {item.dayLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
