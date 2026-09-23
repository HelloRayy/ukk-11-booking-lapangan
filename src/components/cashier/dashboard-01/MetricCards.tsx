// PERAN FILE: Komponen 4 Kartu KPI Metrik ala Shadcn UI
import { DollarSign, CalendarCheck, Activity, CreditCard } from 'lucide-react'
import type { MetricCardItem } from './mockData'

interface MetricCardsProps {
  metrics: MetricCardItem[]
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const renderIcon = (type: MetricCardItem['icon']) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className="w-4 h-4 text-emerald-400" />
      case 'bookings':
        return <CalendarCheck className="w-4 h-4 text-[#f2d953]" />
      case 'courts':
        return <Activity className="w-4 h-4 text-blue-400" />
      case 'unpaid':
        return <CreditCard className="w-4 h-4 text-rose-400" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-5 shadow-xs flex flex-col justify-between hover:border-white/20 transition-all group"
        >
          {/* Baris Atas: Judul Metrik & Icon */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8e8e8e] uppercase tracking-wider">
              {item.title}
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
              {renderIcon(item.icon)}
            </div>
          </div>

          {/* Baris Bawah: Angka Nilai Utama & Indikator Tren */}
          <div className="mt-3">
            <div className="text-2xl font-black text-white tracking-tight">
              {item.value}
            </div>
            <p className="text-[11px] text-[#8e8e8e] mt-1 flex items-center gap-1.5">
              <span
                className={`font-semibold ${
                  item.trendPositive ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {item.trend}
              </span>
              <span>{item.description}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
