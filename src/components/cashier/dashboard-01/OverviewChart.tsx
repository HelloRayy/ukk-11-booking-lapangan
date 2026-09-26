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
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 shadow-2xl text-xs select-none">
        <p className="text-zinc-400">{item.month} 2026</p>
        <p className="font-bold text-zinc-100 text-sm mt-0.5">
          Rp {item.total.toLocaleString('id-ID')}
        </p>
      </div>
    )
  }
  return null
}

export default function OverviewChart({ data }: OverviewChartProps) {
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-xs flex flex-col justify-between h-full">
      {/* 1. Header Kartu */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-100 tracking-tight">Overview</h3>
      </div>

      {/* 2. Komponen Recharts Resmi Shadcn */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            {/* Grid Horizontal Garis Halus */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
              vertical={false}
            />

            {/* Sumbu X (Nama Bulan) */}
            <XAxis
              dataKey="month"
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />

            {/* Sumbu Y (Nilai Rupiah) */}
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val: number) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
            />

            {/* Tooltip Hover Tanpa Animasi Mengikuti Kursor */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
              isAnimationActive={false}
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
