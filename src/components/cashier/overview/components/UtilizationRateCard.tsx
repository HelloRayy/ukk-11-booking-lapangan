// PERAN FILE: Kartu 3 - Tingkat Utilisasi Lapangan (Utilization Rate)
import type { UtilizationCourtData } from '../types'

interface Props {
  courts: UtilizationCourtData[]
  overallRate?: number
}

export default function UtilizationRateCard({ courts, overallRate = 87.5 }: Props) {
  return (
    <div className="rounded-2xl p-5 border border-[#262626] bg-[#1a1a1a] flex flex-col justify-between min-h-[220px] shadow-sm">
      {/* Header Kartu */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Utilization Rate</h3>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-extrabold text-white">{overallRate}%</span>
            <span className="text-xs text-[#8e8e8e]">overall efficiency</span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8e8e8e]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* SVG Wave Area Curve Chart */}
      <div className="relative pt-4 pb-1">
        {/* Floating Tooltip Pill */}
        <div className="absolute top-2 right-1/4 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
          52%
        </div>

        <svg viewBox="0 0 300 80" className="w-full h-24 overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="utilGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2d953" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f2d953" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path
            d="M 0,70 Q 50,60 100,50 T 200,25 T 300,55 L 300,80 L 0,80 Z"
            fill="url(#utilGradient)"
          />

          {/* Stroke Line */}
          <path
            d="M 0,70 Q 50,60 100,50 T 200,25 T 300,55"
            fill="none"
            stroke="#f2d953"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Point Dot */}
          <circle cx="200" cy="25" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
        </svg>

        {/* Labels Sumbu X Lapangan */}
        <div className="flex justify-between text-[10px] text-[#737373] mt-1 px-1">
          {courts.map((c) => (
            <span key={c.courtName}>{c.courtName}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
