// PERAN FILE: Pure UI Skeleton Loader & Shimmer State saat Halaman Reservasi Memuat Data Lapangan
import { TIME_SLOTS } from '../constants/scheduleConfig'

export default function ReservationSkeletonLoader() {
  // Simulasi 4 kolom lapangan saat skeleton ditampilkan
  const placeholderCourts = [1, 2, 3, 4]

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#161616] relative select-none font-aeonik">
      {/* 1. SKELETON HEADER KOLOM LAPANGAN */}
      <div className="flex border-b border-[#262626] bg-[#1a1a1a] sticky top-0 z-10">
        {/* Pojok Jam Kiri */}
        <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-r border-[#262626] p-2 text-[#737373]">
          <div className="w-10 h-3 bg-white/10 rounded animate-pulse" />
        </div>

        {/* 4 Kolom Header Lapangan Skeleton */}
        <div className="flex-1 grid grid-cols-4 divide-x divide-[#262626]">
          {placeholderCourts.map((i) => (
            <div key={i} className="py-3 px-4 flex items-center justify-between min-w-0 gap-2">
              <div className="h-4 w-20 sm:w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-3.5 w-16 bg-white/5 rounded hidden md:block shrink-0 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. SKELETON GRID AREA JADWAL JAM */}
      <div className="flex-1 overflow-hidden relative">
        <div className="flex min-w-full">
          {/* Kolom Jam Kiri */}
          <div className="w-20 sm:w-24 shrink-0 border-r border-[#262626] bg-[#141414]/80 flex flex-col">
            {TIME_SLOTS.map((time) => (
              <div
                key={time}
                className="h-[88px] border-b border-[#222222] p-2 flex items-start justify-center"
              >
                <span className="text-[11px] font-mono text-[#555555]">{time}</span>
              </div>
            ))}
          </div>

          {/* 4 Kolom Grid Lapangan dengan Shimmer Placeholder */}
          <div className="flex-1 grid grid-cols-4 divide-x divide-[#222222]">
            {placeholderCourts.map((courtIdx) => (
              <div key={courtIdx} className="flex flex-col">
                {TIME_SLOTS.map((time, slotIdx) => {
                  // Berikan beberapa kartu dummy berdenyut untuk efek visual yang realistis
                  const isMockBooked =
                    (courtIdx === 1 && slotIdx === 2) ||
                    (courtIdx === 2 && slotIdx === 4) ||
                    (courtIdx === 3 && slotIdx === 1) ||
                    (courtIdx === 4 && slotIdx === 5)

                  return (
                    <div
                      key={time}
                      className="h-[88px] border-b border-[#222222] p-1.5 relative overflow-hidden"
                    >
                      {isMockBooked ? (
                        <div className="w-full h-full rounded-[10px] bg-white/[0.04] border border-white/5 p-2 flex flex-col justify-between animate-pulse">
                          <div className="h-3 w-20 bg-white/10 rounded" />
                          <div className="h-2.5 w-12 bg-white/5 rounded" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-[8px] bg-white/[0.01]" />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 3. FLOATING BADGE INDIKATOR LOADING DI TENGAH */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-[#1c1c1c]/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="w-5 h-5 border-2 border-[#f2d953] border-t-transparent rounded-full animate-spin shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white tracking-tight">
                Memuat Arena & Jadwal
              </span>
              <span className="text-[11px] text-[#8e8e8e]">
                Sinkronisasi ketersediaan slot lapangan...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
