// PERAN FILE: Data Mock khusus Frontend Dashboard Overview Panel (Terpisah dari Backend)
import type {
  CourtStatData,
  DayBookingStat,
  UtilizationCourtData,
  TodoItem,
  MonthDaySchedule,
  HourBookingDensity,
  BookingStatusBreakdown,
} from '../types'

// 1. Data Mock Lapangan Aktif
export const MOCK_COURT_STAT: CourtStatData = {
  activeCount: 5,
  totalCount: 6,
  imageUrl: '/assets/courts/court-1.webp',
}

// 2. Data Mock Hari Paling Banyak Dipesan (Most Booked Day)
export const MOCK_WEEKLY_BOOKINGS: DayBookingStat[] = [
  { dayLabel: 'S', count: 18 },
  { dayLabel: 'M', count: 22 },
  { dayLabel: 'T', count: 25 },
  { dayLabel: 'W', count: 42, isPeak: true }, // Rabu paling padat
  { dayLabel: 'Th', count: 20 },
  { dayLabel: 'F', count: 28 },
  { dayLabel: 'Sat', count: 32 },
]

// 3. Data Mock Tingkat Utilisasi Lapangan (Utilization Rate)
export const MOCK_UTILIZATION_COURTS: UtilizationCourtData[] = [
  { courtName: 'Court 1', rate: 45 },
  { courtName: 'Court 2', rate: 58 },
  { courtName: 'Court 3', rate: 82 },
  { courtName: 'Court 4', rate: 65 },
  { courtName: 'Court 5', rate: 74 },
  { courtName: 'Court 6', rate: 52 },
]

// 4. Data Mock Daftar Tugas Kasir (To do List)
export const MOCK_TODO_ITEMS: TodoItem[] = [
  {
    id: 'td-1',
    title: 'Unpaid booking',
    subtitle: 'Court 3 - 3:00 PM (45 min left)',
    badgeText: '2 Unpaid',
    badgeVariant: 'unpaid',
  },
  {
    id: 'td-2',
    title: 'Reschedule Request',
    subtitle: 'Court 3 - 3 reschedule request',
    badgeText: '3 request',
    badgeVariant: 'request',
  },
  {
    id: 'td-3',
    title: 'Block Court',
    subtitle: 'Court 2 - 3 times block',
    badgeText: '3 slots',
    badgeVariant: 'block',
  },
  {
    id: 'td-4',
    title: 'Schedule Conflict',
    subtitle: 'Hafizi • Court 3',
    badgeText: 'Warning',
    badgeVariant: 'conflict',
  },
]

// 5. Data Mock Kalender Bulanan Mini (Court Schedule)
export const MOCK_MONTH_SCHEDULE: MonthDaySchedule[] = [
  { dayNumber: 1, status: 'available' },
  { dayNumber: 2, status: 'booked' },
  { dayNumber: 3, status: 'available' },
  { dayNumber: 4, status: 'available' },
  { dayNumber: 5, status: 'available' },
  { dayNumber: 6, status: 'available' },
  { dayNumber: 7, status: 'available' },
  { dayNumber: 8, status: 'booked' },
  { dayNumber: 9, status: 'available' },
  { dayNumber: 10, status: 'booked' },
  { dayNumber: 11, status: 'available' },
  { dayNumber: 12, status: 'booked' },
  { dayNumber: 13, status: 'available' },
  { dayNumber: 14, status: 'available' },
  { dayNumber: 15, status: 'booked' },
  { dayNumber: 16, status: 'available' },
  { dayNumber: 17, status: 'available' },
  { dayNumber: 18, status: 'event' },
  { dayNumber: 19, status: 'booked' },
  { dayNumber: 20, status: 'booked' },
  { dayNumber: 21, status: 'available' },
  { dayNumber: 22, status: 'booked' },
  { dayNumber: 23, status: 'event' },
  { dayNumber: 24, status: 'booked' },
  { dayNumber: 25, status: 'available' },
  { dayNumber: 26, status: 'booked' },
  { dayNumber: 27, status: 'available' },
  { dayNumber: 28, status: 'booked' },
  { dayNumber: 29, status: 'maintenance' },
  { dayNumber: 30, status: 'booked' },
  { dayNumber: 31, status: 'available' },
]

// 6. Data Mock Sebaran Jam Sibuk (Booked by Hour)
export const MOCK_HOURLY_BOOKINGS: HourBookingDensity[] = [
  { hour: '06:00', dots: 1 },
  { hour: '07:00', dots: 2 },
  { hour: '08:00', dots: 2 },
  { hour: '09:00', dots: 3 },
  { hour: '10:00', dots: 3 },
  { hour: '11:00', dots: 2 },
  { hour: '12:00', dots: 3 },
  { hour: '13:00', dots: 2 },
  { hour: '14:00', dots: 4 },
  { hour: '15:00', dots: 4 },
  { hour: '16:00', dots: 5 },
  { hour: '17:00', dots: 6, isPeak: true },
  { hour: '18:00', dots: 7, isPeak: true },
  { hour: '19:00', dots: 6, isPeak: true },
  { hour: '20:00', dots: 4 },
  { hour: '21:00', dots: 3 },
  { hour: '22:00', dots: 2 },
]

// 7. Data Mock Status Transaksi Keseluruhan (Booking Status)
export const MOCK_BOOKING_STATUS: BookingStatusBreakdown = {
  total: 120,
  confirmed: 58,
  unpaid: 20,
  rescheduled: 24,
  cancel: 18,
}
