// PERAN FILE: Kartu 6 - Matriks Sebaran Jam Ramai (Booked by Hour)
import type { HourBookingDensity } from '../types'

interface Props {
  data: HourBookingDensity[]
}

export default function BookedByHourCard({ data }: Props) {
  return (
    <div className="rounded-2xl p-5 border border-[#262626] bg-[#1a1a1a] flex flex-col justify-between shadow-sm xl:col-span-2">
      {/* Header Kartu */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">Booked by hour</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Peak: 17.00 - 19.00
            </span>
          </div>
          <span className="text-[11px] text-[#8e8e8e]">Hourly booking density across all active courts</span>
        </div>

        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8e8e8e]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Matriks Titik Jam Sibuk (06:00 - 22:00) */}
      <div className="pt-4 pb-1">
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-40 px-1">
          {data.map((item) => {
            const isPeak = item.isPeak
            // Buat array titik sejumlah item.dots (1 s/d 7)
            const dotList = Array.from({ length: item.dots })

            return (
              <div
                key={item.hour}
                className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
              >
                {/* Tooltip Hover */}
                <div className="absolute -top-7 hidden group-hover:flex px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] text-white whitespace-nowrap z-20 shadow-lg pointer-events-none">
                  {item.hour}: {item.dots} slot booked
                </div>

                {/* Kolom Titik (Stack vertikal dari bawah ke atas) */}
                <div className="flex flex-col-reverse items-center gap-1.5 pb-2">
                  {dotList.map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                        isPeak
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:scale-125'
                          : 'bg-white/15 group-hover:bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Label Jam di Bawah */}
                <span
                  className={`text-[9px] sm:text-[10px] tracking-tighter sm:tracking-normal transition-colors ${
                    isPeak ? 'text-emerald-400 font-bold' : 'text-[#737373] group-hover:text-white'
                  }`}
                >
                  {item.hour.split(':')[0]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Info Ringkas */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 text-[11px] text-[#8e8e8e]">
        <span>Operating Hours: 06:00 - 23:00</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/20" /> Regular
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Peak Hour
          </span>
        </div>
      </div>
    </div>
  )
}
