// PERAN FILE: Komponen Bar Chart Pendapatan ala Shadcn Overview
import type { ChartMonthData } from './mockData'

interface OverviewChartProps {
  data: ChartMonthData[]
}

export default function OverviewChart({ data }: OverviewChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-6 shadow-xs flex flex-col justify-between">
      {/* 1. Header Kartu */}
      <div className="mb-6">
        <h3 className="text-base font-bold text-white tracking-tight">Overview</h3>
        <p className="text-xs text-[#8e8e8e] mt-0.5">
          Tren akumulasi pendapatan sewa lapangan tahun ini
        </p>
      </div>

      {/* 2. Visualisasi Bar Chart Vertikal Responsif */}
      <div className="relative pt-6">
        {/* Garis Grid Horizontal Tipis */}
        <div className="absolute inset-x-0 top-0 flex flex-col justify-between h-48 pointer-events-none opacity-20">
          <div className="border-b border-dashed border-white w-full" />
          <div className="border-b border-dashed border-white w-full" />
          <div className="border-b border-dashed border-white w-full" />
        </div>

        {/* Batang Bar untuk Tiap Bulan */}
        <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-52 relative z-10 px-1">
          {data.map((item, index) => {
            const heightPercent = Math.round((item.value / maxValue) * 100)
            const isCurrentMonth = index === data.length - 1

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
              >
                {/* Tooltip Hover Nilai Nominal */}
                <div className="absolute -top-8 hidden group-hover:flex px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] font-bold text-white whitespace-nowrap shadow-lg pointer-events-none z-20">
                  {item.formatted}
                </div>

                {/* Batang Bar dengan Transisi Halus */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 ${
                    isCurrentMonth
                      ? 'bg-gradient-to-t from-emerald-600 to-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                      : 'bg-white/15 group-hover:bg-white/30'
                  }`}
                />

                {/* Label Bulan */}
                <span
                  className={`text-[10px] mt-2 font-medium transition-colors ${
                    isCurrentMonth ? 'text-emerald-400 font-bold' : 'text-[#737373] group-hover:text-white'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
