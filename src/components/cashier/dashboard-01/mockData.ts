// PERAN FILE: Data Mock Murni untuk Halaman Kasir ala Shadcn Dashboard-01

export interface MetricCardItem {
  title: string
  value: string
  description: string
  trend: string
  trendPositive: boolean
  icon: 'revenue' | 'bookings' | 'courts' | 'unpaid'
}

export interface ChartMonthData {
  month: string
  value: number // Dalam juta rupiah
  formatted: string
}

export interface RecentBookingItem {
  id: string
  customerName: string
  email: string
  courtName: string
  schedule: string
  amount: number
  status: 'Lunas' | 'DP' | 'Batal'
  avatarColor: string
}

// 1. Data 4 Kartu KPI Ringkasan Metrik
export const MOCK_DASHBOARD_METRICS: MetricCardItem[] = [
  {
    title: 'Total Pendapatan',
    value: 'Rp 14.850.000',
    description: 'dari target bulan ini',
    trend: '+20.1%',
    trendPositive: true,
    icon: 'revenue',
  },
  {
    title: 'Total Booking',
    value: '+128 Slot',
    description: 'seluruh sesi terselesaikan',
    trend: '+15.2%',
    trendPositive: true,
    icon: 'bookings',
  },
  {
    title: 'Lapangan Aktif',
    value: '5 / 6 Lapangan',
    description: '83.3% tingkat utilisasi',
    trend: '+2 lapangan',
    trendPositive: true,
    icon: 'courts',
  },
  {
    title: 'Sisa Piutang DP',
    value: 'Rp 1.450.000',
    description: '4 transaksi siap dilunasi',
    trend: 'Perlu follow-up',
    trendPositive: false,
    icon: 'unpaid',
  },
]

// 2. Data Grafik Pendapatan Bulanan (Shadcn Overview Bar Chart)
export const MOCK_REVENUE_CHART: ChartMonthData[] = [
  { month: 'Jan', value: 3.2, formatted: 'Rp 3.2M' },
  { month: 'Feb', value: 4.8, formatted: 'Rp 4.8M' },
  { month: 'Mar', value: 6.5, formatted: 'Rp 6.5M' },
  { month: 'Apr', value: 5.1, formatted: 'Rp 5.1M' },
  { month: 'May', value: 7.4, formatted: 'Rp 7.4M' },
  { month: 'Jun', value: 8.9, formatted: 'Rp 8.9M' },
  { month: 'Jul', value: 9.6, formatted: 'Rp 9.6M' },
  { month: 'Aug', value: 11.2, formatted: 'Rp 11.2M' },
  { month: 'Sep', value: 10.4, formatted: 'Rp 10.4M' },
  { month: 'Oct', value: 12.8, formatted: 'Rp 12.8M' },
  { month: 'Nov', value: 13.5, formatted: 'Rp 13.5M' },
  { month: 'Dec', value: 14.8, formatted: 'Rp 14.8M' },
]

// 3. Data Transaksi Pemesanan Terkini (Shadcn Recent Sales)
export const MOCK_RECENT_BOOKINGS: RecentBookingItem[] = [
  {
    id: 'INV-1048',
    customerName: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    courtName: 'Court 1 (Panoramic)',
    schedule: 'Hari ini • 19:00 - 21:00',
    amount: 300000,
    status: 'Lunas',
    avatarColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'INV-1049',
    customerName: 'Siti Rahma',
    email: 'siti.rahma@yahoo.com',
    courtName: 'Court 3 (Standard)',
    schedule: 'Hari ini • 16:00 - 18:00',
    amount: 120000,
    status: 'DP',
    avatarColor: 'bg-[#f2d953]/20 text-[#f2d953] border-[#f2d953]/30',
  },
  {
    id: 'INV-1050',
    customerName: 'Dimas Pratama',
    email: 'dimas.pratama@outlook.com',
    courtName: 'Court 2 (VIP Pro)',
    schedule: 'Besok • 08:00 - 10:00',
    amount: 280000,
    status: 'Lunas',
    avatarColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'INV-1051',
    customerName: 'Anisa Maharani',
    email: 'anisa.m@gmail.com',
    courtName: 'Court 1 (Panoramic)',
    schedule: 'Besok • 20:00 - 22:00',
    amount: 300000,
    status: 'DP',
    avatarColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 'INV-1052',
    customerName: 'Reza Fauzi',
    email: 'reza.fauzi@perusahaan.co.id',
    courtName: 'Court 4 (Training)',
    schedule: 'Lusa • 15:00 - 17:00',
    amount: 200000,
    status: 'Lunas',
    avatarColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  },
]
