// PERAN FILE: Definisi tipe data murni untuk modul Overview Panel Dashboard Kasir
export interface CourtStatData {
  activeCount: number
  totalCount: number
  imageUrl: string
}

export interface DayBookingStat {
  dayLabel: string
  count: number
  isPeak?: boolean
}

export interface UtilizationCourtData {
  courtName: string
  rate: number
}

export interface TodoItem {
  id: string
  title: string
  subtitle: string
  badgeText: string
  badgeVariant: 'unpaid' | 'request' | 'block' | 'conflict'
}

export type ScheduleDotStatus = 'booked' | 'available' | 'event' | 'maintenance'

export interface MonthDaySchedule {
  dayNumber: number
  status: ScheduleDotStatus
}

export interface HourBookingDensity {
  hour: string
  dots: number // 1 s/d 7
  isPeak?: boolean
}

export interface BookingStatusBreakdown {
  total: number
  confirmed: number
  unpaid: number
  rescheduled: number
  cancel: number
}
