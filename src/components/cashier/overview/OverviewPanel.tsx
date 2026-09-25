// PERAN FILE: Container Utama Overview Panel Dashboard Kasir (Badminton Arena Grid Layout)
import CourtStatisticCard from './components/CourtStatisticCard'
import MostBookedDayCard from './components/MostBookedDayCard'
import UtilizationRateCard from './components/UtilizationRateCard'
import TodoListCard from './components/TodoListCard'
import CourtScheduleCard from './components/CourtScheduleCard'
import BookedByHourCard from './components/BookedByHourCard'
import BookingStatusCard from './components/BookingStatusCard'

import {
  MOCK_COURT_STAT,
  MOCK_WEEKLY_BOOKINGS,
  MOCK_UTILIZATION_COURTS,
  MOCK_TODO_ITEMS,
  MOCK_MONTH_SCHEDULE,
  MOCK_HOURLY_BOOKINGS,
  MOCK_BOOKING_STATUS,
} from './data/overviewMockData'
import type { TodoItem } from './types'

interface OverviewPanelProps {
  onManageCourts?: () => void
  onSelectTodo?: (item: TodoItem) => void
}

export default function OverviewPanel({
  onManageCourts,
  onSelectTodo,
}: OverviewPanelProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Subheader / Lokasi & Jam Terkini */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Overview Panel</h2>
          <p className="text-xs text-[#8e8e8e] mt-0.5">
            Operational dashboard and court booking performance analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Lokasi Selector Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#8e8e8e]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-white font-medium">Blanca Badminton Arena, Hall Utama</span>
          </div>

          {/* Badge Waktu Terakhir Diperbarui */}
          <div className="text-[11px] text-[#737373] hidden sm:block">
            Last updated: Today, 12 March 2026
          </div>
        </div>
      </div>

      {/* Baris 1: 4 Kartu Metrik Ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <CourtStatisticCard
          data={MOCK_COURT_STAT}
          onActionClick={onManageCourts}
        />
        <MostBookedDayCard data={MOCK_WEEKLY_BOOKINGS} />
        <UtilizationRateCard courts={MOCK_UTILIZATION_COURTS} />
        <TodoListCard
          items={MOCK_TODO_ITEMS}
          onItemClick={onSelectTodo}
        />
      </div>

      {/* Baris 2: 3 Kartu Analitik Lebih Lebar (1 col, 2 cols, 1 col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="col-span-1">
          <CourtScheduleCard scheduleData={MOCK_MONTH_SCHEDULE} />
        </div>
        <div className="col-span-1 md:col-span-2 xl:col-span-2">
          <BookedByHourCard data={MOCK_HOURLY_BOOKINGS} />
        </div>
        <div className="col-span-1">
          <BookingStatusCard data={MOCK_BOOKING_STATUS} />
        </div>
      </div>
    </div>
  )
}
