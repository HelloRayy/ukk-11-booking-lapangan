// PERAN FILE: Kartu 5 - Mini Kalender Jadwal Bulanan Lapangan (Court Schedule)
import { useState } from 'react'
import type { MonthDaySchedule, ScheduleDotStatus } from '../types'

interface Props {
  scheduleData: MonthDaySchedule[]
}

const COURTS_PILLS = ['Court 1', 'Court 2', 'Court 3', 'Court 4']

export default function CourtScheduleCard({ scheduleData }: Props) {
  const [activeCourt, setActiveCourt] = useState('Court 1')

  const getDotStyle = (status: ScheduleDotStatus) => {
    switch (status) {
      case 'booked':
        return 'bg-emerald-600 text-white'
      case 'event':
        return 'bg-amber-400 text-black font-bold'
      case 'maintenance':
        return 'bg-rose-500/80 text-white'
      case 'available':
      default:
        return 'bg-white/5 text-[#8e8e8e] hover:bg-white/10'
    }
  }

  return (
    <div className="rounded-2xl p-5 border border-[#262626] bg-[#1a1a1a] flex flex-col justify-between shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Court Schedule</h3>
          <span className="text-[11px] text-[#8e8e8e]">Monthly availability overview</span>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#8e8e8e]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Court Selector Pills */}
      <div className="flex gap-1.5 mb-3">
        {COURTS_PILLS.map((court) => (
          <button
            key={court}
            type="button"
            onClick={() => setActiveCourt(court)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
              activeCourt === court
                ? 'bg-emerald-600 text-white'
                : 'bg-white/5 text-[#8e8e8e] hover:text-white'
            }`}
          >
            {court}
          </button>
        ))}
      </div>

      {/* Calendar Matrix Grid */}
      <div className="space-y-1">
        {/* Header Hari */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#737373]">
          <span>S</span>
          <span>M</span>
          <span>T</span>
          <span>W</span>
          <span>Th</span>
          <span>F</span>
          <span>Sat</span>
        </div>

        {/* Kotak Angka Tanggal */}
        <div className="grid grid-cols-7 gap-1">
          {scheduleData.slice(0, 31).map((day) => (
            <div
              key={day.dayNumber}
              className={`h-7 rounded-md flex items-center justify-center text-[10px] transition-all cursor-pointer ${getDotStyle(
                day.status
              )}`}
              title={`Tanggal ${day.dayNumber}: ${day.status}`}
            >
              {day.dayNumber}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between text-[9px] text-[#8e8e8e] pt-3 mt-2 border-t border-white/5 gap-2">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> Booked
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-white/20 inline-block" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Event
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Maintenance
        </span>
      </div>
    </div>
  )
}
