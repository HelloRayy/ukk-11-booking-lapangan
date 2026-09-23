// PERAN FILE: Komponen Bar Chart Pendapatan Resmi Shadcn UI Menggunakan Recharts
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { ChartMonthData } from './mockData'

interface OverviewChartProps {
  data: ChartMonthData[]
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: ChartMonthData
  }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload
    return (
      <div className="rounded-lg border border-[#262626] bg-[#141414] p-3 shadow-2xl text-xs select-none">
        <p className="text-[#8e8e8e] font-medium">{item.month} 2026</p>
        <p className="font-bold text-white text-sm mt-0.5">
          Rp {item.total.toLocaleString('id-ID')}
        </p>
        <span className="text-[10px] text-emerald-400 font-semibold block mt-1">
          Target Tercapai
        </span>
      </div>
    )
  }
  return null
}

export default function OverviewChart({ data }: OverviewChartProps) {
  return (
    <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* 1. Header Kartu */}
      <div className="mb-6">
        <h3 className="text-base font-bold text-white tracking-tight">Overview</h3>
        <p className="text-xs text-[#8e8e8e] mt-0.5">
          Tren akumulasi pendapatan sewa lapangan tahun berjalan (Recharts)
        </p>
      </div>

      {/* 2. Komponen Recharts Resmi Shadcn */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            {/* Grid Horizontal Garis Halus */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#262626"
              vertical={false}
            />

            {/* Sumbu X (Nama Bulan) */}
            <XAxis
              dataKey="month"
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />

            {/* Sumbu Y (Nilai Rupiah) */}
            <YAxis
              stroke="#737373"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
            />

            {/* Tooltip Hover Modern */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
            />

            {/* Batang Bar Emerald Khas Blanca Arena */}
            <Bar
              dataKey="total"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
