// PERAN FILE: Kartu 7 - Donut Chart Status Transaksi (Booking Status)
import type { BookingStatusBreakdown } from '../types'

interface Props {
  data: BookingStatusBreakdown
}

export default function BookingStatusCard({ data }: Props) {
  const total = data.total || 1

  // Hitung persentase untuk Donut Chart SVG
  const confirmedPercent = Math.round((data.confirmed / total) * 100)
  const unpaidPercent = Math.round((data.unpaid / total) * 100)
  const rescheduledPercent = Math.round((data.rescheduled / total) * 100)
  const cancelPercent = Math.max(0, 100 - confirmedPercent - unpaidPercent - rescheduledPercent)

  // Geometri Lingkaran SVG
  const radius = 54
  const circumference = 2 * Math.PI * radius // ~339.29

  const confirmedDash = (confirmedPercent / 100) * circumference
  const unpaidDash = (unpaidPercent / 100) * circumference
  const rescheduledDash = (rescheduledPercent / 100) * circumference
  const cancelDash = (cancelPercent / 100) * circumference

  // Offset akumulatif untuk setiap segmen
  const unpaidOffset = -confirmedDash
  const rescheduledOffset = -(confirmedDash + unpaidDash)
  const cancelOffset = -(confirmedDash + unpaidDash + rescheduledDash)

  return (
    <div className="rounded-2xl p-5 border border-[#262626] bg-[#1a1a1a] flex flex-col justify-between shadow-sm">
      {/* Header Kartu */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Booking Status</h3>
          <span className="text-xs text-emerald-400 font-medium">+25% vs last week</span>
        </div>

        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8e8e8e]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Visual Donut Chart SVG */}
      <div className="relative flex items-center justify-center my-4">
        <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 140 140">
          {/* Background Ring Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#262626"
            strokeWidth="14"
          />

          {/* Segmen 1: Confirmed (Hijau Emerald) */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#10b981"
            strokeWidth="14"
            strokeDasharray={`${confirmedDash} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Segmen 2: Unpaid (Emas / Amber) */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#f2d953"
            strokeWidth="14"
            strokeDasharray={`${unpaidDash} ${circumference}`}
            strokeDashoffset={unpaidOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Segmen 3: Rescheduled (Teal) */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#14b8a6"
            strokeWidth="14"
            strokeDasharray={`${rescheduledDash} ${circumference}`}
            strokeDashoffset={rescheduledOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Segmen 4: Cancel (Rose) */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="#f43f5e"
            strokeWidth="14"
            strokeDasharray={`${cancelDash} ${circumference}`}
            strokeDashoffset={cancelOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>

        {/* Info Angka di Pusat Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[10px] text-[#8e8e8e] uppercase tracking-wider">Total</span>
          <span className="text-2xl font-black text-white leading-none mt-0.5">{data.total}</span>
          <span className="text-[10px] text-[#737373]">Bookings</span>
        </div>
      </div>

      {/* Legenda Kategori Status (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[#8e8e8e]">Confirmed:</span>
          <span className="font-bold text-white ml-auto">{data.confirmed}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f2d953]" />
          <span className="text-[#8e8e8e]">Unpaid:</span>
          <span className="font-bold text-white ml-auto">{data.unpaid}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-400" />
          <span className="text-[#8e8e8e]">Rescheduled:</span>
          <span className="font-bold text-white ml-auto">{data.rescheduled}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span className="text-[#8e8e8e]">Cancelled:</span>
          <span className="font-bold text-white ml-auto">{data.cancel}</span>
        </div>
      </div>
    </div>
  )
}
