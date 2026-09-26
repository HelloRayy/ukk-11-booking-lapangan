// PERAN FILE: Tabel Transaksi Kasir Linear-Style dengan UX Copy Kasir yang Alami
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  ExternalLink,
  ShieldAlert,
  MessageCircle,
  CircleDot,
  Calendar,
  CreditCard,
  MapPin,
  SlidersHorizontal,
  Download,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react'
import type { Booking, Lapangan } from '../../../types/database'
import BookingDetailSheet from './BookingDetailSheet'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../ui/table'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { formatSlotRange } from '../../../lib/utils'

interface BookingsTableProps {
  bookings: Booking[]
  courts?: Lapangan[]
  loading: boolean
  searchKeyword: string
  selectedStatus: string
  onSearchChange: (keyword: string) => void
  onStatusChange: (status: string) => void
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onRefresh: () => void
  onOpenManualModal: () => void
}

type SortField = 'nama_penyewa' | 'lapangan' | 'tgl_main' | 'total_bayar' | 'status'
type SortOrder = 'asc' | 'desc'

export default function BookingsTable({
  bookings,
  courts = [],
  loading,
  searchKeyword,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  onLunasi,
  onBatal,
  onRefresh,
  onOpenManualModal,
}: BookingsTableProps) {
  // State Panel Detail Kanan
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // State Sorting Kolom
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(15)

  // State Menu Tiga Titik & Salin Kontak
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  // Helper Format Rupiah
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  // State Filter Tambahan: Lapangan & Tanggal (Default: 'today' sesuai best practice kasir)
  const [selectedCourt, setSelectedCourt] = useState<string>('Semua')
  const [selectedDate, setSelectedDate] = useState<string>('today')
  const [customDatePicker, setCustomDatePicker] = useState<string>('')

  // State Dropdown Aktif di Toolbar (Status, Lapangan, Tanggal)
  const [openDropdown, setOpenDropdown] = useState<'status' | 'court' | 'date' | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Tutup dropdown saat klik di luar area toolbar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper kalkulasi tanggal lokal WIB (YYYY-MM-DD)
  const getLocalDateString = (offsetDays: number = 0) => {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const date = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${date}`
  }

  // Filter Data Transaksi berdasarkan Lapangan & Tanggal
  const filteredBookingsList = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Filter Lapangan
      if (selectedCourt !== 'Semua' && String(b.lapangan_id) !== selectedCourt) {
        return false
      }

      // 2. Filter Tanggal Main
      if (selectedDate === 'today') {
        if (b.tgl_main !== getLocalDateString(0)) return false
      } else if (selectedDate === 'tomorrow') {
        if (b.tgl_main !== getLocalDateString(1)) return false
      } else if (selectedDate !== 'all') {
        // Specific custom date string (e.g. '2026-09-23')
        if (b.tgl_main !== selectedDate) return false
      }

      return true
    })
  }, [bookings, selectedCourt, selectedDate])

  // Data Terurut
  const sortedBookings = useMemo(() => {
    if (!sortField) return filteredBookingsList

    return [...filteredBookingsList].sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      if (sortField === 'nama_penyewa') {
        aVal = a.nama_penyewa.toLowerCase()
        bVal = b.nama_penyewa.toLowerCase()
      } else if (sortField === 'lapangan') {
        aVal = a.lapangan?.nama_lapangan || ''
        bVal = b.lapangan?.nama_lapangan || ''
      } else if (sortField === 'tgl_main') {
        aVal = a.tgl_main
        bVal = b.tgl_main
      } else if (sortField === 'total_bayar') {
        aVal = a.total_bayar
        bVal = b.total_bayar
      } else if (sortField === 'status') {
        aVal = a.status
        bVal = b.status
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredBookingsList, sortField, sortOrder])

  // Fitur Ekspor Rekap Transaksi ke CSV
  const handleExportCSV = () => {
    if (sortedBookings.length === 0) {
      alert('Tidak ada data transaksi untuk diekspor.')
      return
    }

    const headers = ['ID Invoice', 'Nama Penyewa', 'No HP', 'Lapangan', 'Tanggal Main', 'Slot Jam', 'Total Bayar', 'Sisa Bayar', 'Status']
    const rows = sortedBookings.map((b) => [
      `INV-${String(b.id).padStart(4, '0')}`,
      `"${b.nama_penyewa.replace(/"/g, '""')}"`,
      `'${b.no_hp}`,
      `"${b.lapangan?.nama_lapangan || '-'}"`,
      b.tgl_main,
      `"${formatSlotRange(b.jam_slots)}"`,
      b.total_bayar,
      b.sisa_bayar,
      b.status,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `rekap-transaksi-${getLocalDateString(0)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(sortedBookings.length / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedBookings = sortedBookings.slice(startIndex, startIndex + rowsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else {
        setSortField(null)
        setSortOrder('asc')
      }
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleCopyPhone = (phone: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    navigator.clipboard.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => setCopiedPhone(null), 2000)
  }

  const handleOpenWhatsApp = (phone: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const cleanPhone = phone.replace(/\D/g, '')
    const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
    const text = encodeURIComponent(`Halo Kak ${name}, kami dari pengelola Blanca Arena terkait booking lapangan Anda.`)
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank')
  }

  // Label Dot Color
  const getLabelDotColor = (courtName: string) => {
    if (courtName.toLowerCase().includes('badminton')) return 'bg-cyan-400'
    if (courtName.toLowerCase().includes('futsal')) return 'bg-amber-400'
    return 'bg-emerald-400'
  }

  return (
    <div className="flex flex-col h-full select-none relative font-aeonik text-[#fafafa]">
      {/* Overlay Dropdown */}
      {activeMenuId !== null && (
        <div
          role="presentation"
          onClick={() => setActiveMenuId(null)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      {/* Top Filter Bar Linear dengan UX Copy Alami & Fitur Kasir Lengkap */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 px-5 py-2.5 border-b border-[#262626] bg-[#181818]">
        {/* Sisi Kiri: Search Input & Badge Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#8e8e8e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                onSearchChange(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari transaksi, penyewa, no HP..."
              className="pl-8 h-8 text-xs bg-[#141414] border-[#262626] text-white placeholder:text-[#666] focus:border-[#f2d953]/60"
            />
          </div>

          {(selectedStatus !== 'Semua' || selectedCourt !== 'Semua' || selectedDate !== 'all') && (
            <button
              type="button"
              onClick={() => {
                onStatusChange('Semua')
                setSelectedCourt('Semua')
                setSelectedDate('all')
                setCurrentPage(1)
              }}
              className="text-[11px] text-[#8e8e8e] hover:text-white px-2 py-1 rounded bg-white/5 whitespace-nowrap transition-colors cursor-pointer"
              title="Reset semua filter"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Sisi Kanan: Dropdowns & Action Buttons (Terletak di Kanan Samping Button Refresh) */}
        <div ref={dropdownRef} className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
          {/* 1. Dropdown Filter Status (Pengganti Tab Switch) */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              className={`h-8 text-xs gap-1.5 px-2.5 bg-[#141414] border transition-all cursor-pointer ${
                openDropdown === 'status'
                  ? 'border-[#f2d953] ring-1 ring-[#f2d953]/30 bg-[#1c1c1c] text-white shadow-xs'
                  : selectedStatus !== 'Semua'
                  ? 'border-[#f2d953]/60 text-white font-medium hover:bg-white/5'
                  : 'border-[#262626] text-[#8e8e8e] hover:bg-white/5'
              }`}
            >
              <CircleDot className={`w-3.5 h-3.5 ${openDropdown === 'status' ? 'text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
              <span>Status: <strong className="font-semibold text-white">{selectedStatus}</strong></span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'status' ? 'rotate-180 text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
            </Button>

            {openDropdown === 'status' && (
              <div className="absolute right-0 top-full mt-1.5 w-48 py-1.5 px-1 rounded-xl border border-[#333333] bg-[#1a1a1a] shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-[#737373] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
                  <span>Filter Status</span>
                </div>
                {[
                  { label: 'Semua Status', value: 'Semua' },
                  { label: 'Belum Lunas (DP)', value: 'Belum Lunas' },
                  { label: 'Lunas', value: 'Lunas' },
                  { label: 'Batal', value: 'Batal' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      onStatusChange(item.value)
                      setOpenDropdown(null)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                      selectedStatus === item.value
                        ? 'bg-[#f2d953]/15 text-[#f2d953] font-semibold'
                        : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedStatus === item.value && (
                      <Check className="w-3.5 h-3.5 text-[#f2d953]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Dropdown Filter Lapangan (Fitur Tambahan) */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenDropdown(openDropdown === 'court' ? null : 'court')}
              className={`h-8 text-xs gap-1.5 px-2.5 bg-[#141414] border transition-all cursor-pointer ${
                openDropdown === 'court'
                  ? 'border-[#f2d953] ring-1 ring-[#f2d953]/30 bg-[#1c1c1c] text-white shadow-xs'
                  : selectedCourt !== 'Semua'
                  ? 'border-[#f2d953]/60 text-white font-medium hover:bg-white/5'
                  : 'border-[#262626] text-[#8e8e8e] hover:bg-white/5'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${openDropdown === 'court' ? 'text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
              <span>
                {selectedCourt === 'Semua'
                  ? 'Semua Lapangan'
                  : courts.find((c) => String(c.id) === selectedCourt)?.nama_lapangan || 'Lapangan'}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'court' ? 'rotate-180 text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
            </Button>

            {openDropdown === 'court' && (
              <div className="absolute right-0 top-full mt-1.5 w-52 py-1.5 px-1 rounded-xl border border-[#333333] bg-[#1a1a1a] shadow-2xl z-30 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
                <div className="px-2.5 py-1 text-[10px] font-semibold text-[#737373] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
                  <span>Filter Lapangan</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourt('Semua')
                    setOpenDropdown(null)
                    setCurrentPage(1)
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    selectedCourt === 'Semua'
                      ? 'bg-[#f2d953]/15 text-[#f2d953] font-semibold'
                      : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>Semua Lapangan</span>
                  {selectedCourt === 'Semua' && (
                    <Check className="w-3.5 h-3.5 text-[#f2d953]" />
                  )}
                </button>
                {courts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCourt(String(c.id))
                      setOpenDropdown(null)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                      selectedCourt === String(c.id)
                        ? 'bg-[#f2d953]/15 text-[#f2d953] font-semibold'
                        : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{c.nama_lapangan}</span>
                    {selectedCourt === String(c.id) && (
                      <Check className="w-3.5 h-3.5 text-[#f2d953]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Dropdown Filter Tanggal (Default: Hari Ini + Date Picker) */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
              className={`h-8 text-xs gap-1.5 px-2.5 bg-[#141414] border transition-all cursor-pointer ${
                openDropdown === 'date'
                  ? 'border-[#f2d953] ring-1 ring-[#f2d953]/30 bg-[#1c1c1c] text-white shadow-xs'
                  : selectedDate !== 'all'
                  ? 'border-[#f2d953]/60 text-white font-medium hover:bg-white/5'
                  : 'border-[#262626] text-[#8e8e8e] hover:bg-white/5'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${openDropdown === 'date' ? 'text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
              <span>
                {selectedDate === 'all'
                  ? 'Semua Tanggal'
                  : selectedDate === 'today'
                  ? `Hari Ini (${getLocalDateString(0)})`
                  : selectedDate === 'tomorrow'
                  ? `Besok (${getLocalDateString(1)})`
                  : selectedDate}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === 'date' ? 'rotate-180 text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
            </Button>

            {openDropdown === 'date' && (
              <div className="absolute right-0 top-full mt-1.5 w-56 p-2 rounded-xl border border-[#333333] bg-[#1a1a1a] shadow-2xl z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1 text-[10px] font-semibold text-[#737373] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
                  <span>Filter Tanggal</span>
                </div>
                {[
                  { label: 'Hari Ini (Default)', value: 'today' },
                  { label: 'Besok', value: 'tomorrow' },
                  { label: 'Semua Tanggal', value: 'all' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item.value)
                      setOpenDropdown(null)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                      selectedDate === item.value
                        ? 'bg-[#f2d953]/15 text-[#f2d953] font-semibold'
                        : 'text-[#d1d1d1] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedDate === item.value && (
                      <Check className="w-3.5 h-3.5 text-[#f2d953]" />
                    )}
                  </button>
                ))}

                <div className="pt-2 mt-1.5 border-t border-[#262626] px-1 pb-1">
                  <span className="text-[10px] text-[#8e8e8e] block mb-1.5 font-medium">
                    Pilih Tanggal Tertentu:
                  </span>
                  <input
                    type="date"
                    value={customDatePicker}
                    onChange={(e) => {
                      const val = e.target.value
                      setCustomDatePicker(val)
                      if (val) {
                        setSelectedDate(val)
                        setOpenDropdown(null)
                        setCurrentPage(1)
                      }
                    }}
                    className="w-full h-8 px-2 text-xs bg-[#141414] border border-[#2e2e2e] rounded-lg text-white focus:outline-none focus:border-[#f2d953] transition-colors cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Fitur Ekspor CSV (Fitur Tambahan Praktis Kasir) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 text-xs gap-1.5 px-2.5 bg-[#141414] border-[#262626] text-[#8e8e8e] hover:text-white hover:bg-white/5 cursor-pointer"
            title="Ekspor CSV rekap transaksi"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Ekspor</span>
          </Button>

          {/* 5. Button Refresh (Sesuai Posisi Permintaan User di Samping Filter) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            title="Refresh data transaksi"
            className="h-8 text-xs gap-1.5 px-2.5 bg-[#141414] border-[#262626] text-[#8e8e8e] hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#f2d953]' : ''}`} />
            <span>Refresh</span>
          </Button>

          {/* 6. Primary Action Button Walk-in */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onOpenManualModal}
            className="h-8 text-xs gap-1.5 px-3.5 font-bold bg-[#f2d953] hover:bg-[#ffe359] text-[#161616] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Walk-in</span>
          </Button>
        </div>
      </div>

      {/* Tabel Data Full Width Tanpa Box Terjepit */}
      <div className="flex-1 overflow-x-auto min-h-0 bg-[#161616]">
        <Table>
          {/* Header Shadcn Table dengan UX Copy Kontekstual Kasir */}
          <TableHeader>
            <TableRow className="border-b border-[#262626] bg-[#181818] hover:bg-[#181818]">
              {/* 1. Kolom Penyewa & Invoice (Sortable A-Z / Z-A) */}
              <TableHead
                onClick={() => handleSort('nama_penyewa')}
                className="cursor-pointer hover:text-white transition-colors min-w-[280px] pl-5 select-none"
                title="Klik untuk mengurutkan nama penyewa"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-semibold transition-colors ${sortField === 'nama_penyewa' ? 'text-[#f2d953]' : 'text-white/90'}`}>
                    Penyewa
                  </span>
                  <span className="text-xs text-[#8e8e8e]">({sortedBookings.length})</span>
                  {sortField === 'nama_penyewa' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5 text-[#f2d953]" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-[#f2d953]" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-[#555555] opacity-50 hover:opacity-100" />
                  )}
                </div>
              </TableHead>

              {/* 2. Kolom Status (Clean Header Tanpa Fake Arrow) */}
              <TableHead className="w-36 select-none">
                <div className="flex items-center gap-1.5 text-[#8e8e8e]">
                  <CircleDot className="w-3.5 h-3.5" />
                  <span>Status</span>
                </div>
              </TableHead>

              {/* 3. Kolom Tagihan (Sortable Nominal) */}
              <TableHead
                onClick={() => handleSort('total_bayar')}
                className="cursor-pointer hover:text-white transition-colors w-40 select-none"
                title="Klik untuk mengurutkan nominal tagihan"
              >
                <div className="flex items-center gap-1.5">
                  <CreditCard className={`w-3.5 h-3.5 ${sortField === 'total_bayar' ? 'text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
                  <span className={`font-medium transition-colors ${sortField === 'total_bayar' ? 'text-[#f2d953]' : 'text-[#8e8e8e]'}`}>
                    Tagihan
                  </span>
                  {sortField === 'total_bayar' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5 text-[#f2d953]" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-[#f2d953]" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-[#555555] opacity-50 hover:opacity-100" />
                  )}
                </div>
              </TableHead>

              {/* 4. Kolom Lapangan (Clean Header Tanpa Fake Arrow) */}
              <TableHead className="w-40 select-none">
                <div className="flex items-center gap-1.5 text-[#8e8e8e]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Lapangan</span>
                </div>
              </TableHead>

              {/* 5. Kolom Jadwal Main (Sortable Tanggal/Jam) */}
              <TableHead
                onClick={() => handleSort('tgl_main')}
                className="cursor-pointer hover:text-white transition-colors min-w-[220px] select-none"
                title="Klik untuk mengurutkan tanggal/jam main"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className={`w-3.5 h-3.5 ${sortField === 'tgl_main' ? 'text-[#f2d953]' : 'text-[#8e8e8e]'}`} />
                  <span className={`font-medium transition-colors ${sortField === 'tgl_main' ? 'text-[#f2d953]' : 'text-[#8e8e8e]'}`}>
                    Jadwal Main
                  </span>
                  {sortField === 'tgl_main' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5 text-[#f2d953]" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-[#f2d953]" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 text-[#555555] opacity-50 hover:opacity-100" />
                  )}
                </div>
              </TableHead>

              {/* 6. Settings / Options */}
              <TableHead className="text-right w-14 pr-5 select-none">
                <div className="flex items-center justify-end text-[#8e8e8e]">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body Shadcn Table */}
          <TableBody>
            {loading && bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-[#8e8e8e]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#f2d953]" />
                    <span>Memuat data transaksi...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-[#8e8e8e]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-xs">
                      {selectedDate === 'all'
                        ? 'Tidak ada data transaksi yang cocok dengan pencarian / filter ini.'
                        : `Tidak ada transaksi untuk ${
                            selectedDate === 'today'
                              ? `hari ini (${getLocalDateString(0)})`
                              : selectedDate === 'tomorrow'
                              ? `besok (${getLocalDateString(1)})`
                              : `tanggal ${selectedDate}`
                          }.`}
                    </p>
                    {selectedDate !== 'all' && (
                      <button
                        type="button"
                        onClick={() => setSelectedDate('all')}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#f2d953] hover:text-[#ffe359] text-xs font-medium border border-[#f2d953]/20 transition-colors cursor-pointer"
                      >
                        Tampilkan Semua Tanggal
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedBookings.map((item) => {
                const isLunas = item.status === 'Lunas'
                const isBatal = item.status === 'Batal'
                const isDP = item.status === 'Booked' || item.tipe_bayar === 'DP'
                const sisa = item.sisa_bayar || 0
                const courtName = item.lapangan?.nama_lapangan || `Court ${item.lapangan_id}`
                const invoiceCode = `INV-${String(item.id).padStart(4, '0')}`

                return (
                  <TableRow
                    key={item.id}
                    onClick={() => setSelectedBooking(item)}
                    className="cursor-pointer group h-10 border-b border-[#262626]/60 hover:bg-white/[0.04]"
                  >
                    {/* 1. Identifier (Sans) + Title (Penyewa & No HP) */}
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#8e8e8e] font-medium tracking-wide shrink-0">
                          {invoiceCode}
                        </span>
                        <span className="text-[#fafafa] text-xs font-medium group-hover:text-white transition-colors truncate">
                          {item.nama_penyewa}
                        </span>
                        {item.no_hp && (
                          <span className="text-xs text-[#555555] hidden md:inline">
                            • {item.no_hp}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* 2. Status (UX Copy Alami: Lunas, DP 50%, Batal, Booked) */}
                    <TableCell className="whitespace-nowrap">
                      {isLunas ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-xs font-medium">Lunas</span>
                        </div>
                      ) : isBatal ? (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-rose-400 text-xs font-medium">Batal</span>
                        </div>
                      ) : isDP ? (
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#f2d953] flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
                          </span>
                          <span className="text-[#f2d953] text-xs font-medium">DP 50%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#555555] shrink-0" />
                          <span className="text-[#8e8e8e] text-xs font-medium">Booked</span>
                        </div>
                      )}
                    </TableCell>

                    {/* 3. Tagihan (Nominal Total atau Sisa Pelunasan) */}
                    <TableCell className="whitespace-nowrap">
                      {!isLunas && !isBatal && sisa > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-xs border border-[#f2d953]/30 bg-[#f2d953]/10 flex items-center justify-center text-[9px] text-[#f2d953] font-bold shrink-0">
                            !
                          </div>
                          <span className="text-[#f2d953] text-xs font-semibold">
                            Sisa {formatRupiah(sisa)}
                          </span>
                        </div>
                      ) : isLunas ? (
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="text-[#fafafa] text-xs font-medium">
                            {formatRupiah(item.total_bayar)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[#555555] text-xs font-normal">
                            - Batal
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* 4. Lapangan (Badge Pill Sesuai Referensi Pengguna) */}
                    <TableCell className="whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 py-0.5 px-2 bg-[#141414] text-[#fafafa] text-xs rounded-md border border-[#262626] h-[20.3125px] leading-snug transition-all">
                        <span className="flex items-center justify-center w-3.5 h-3.5 bg-white/10 text-emerald-400 text-xs font-bold rounded-full leading-snug transition-all">
                          {courtName.charAt(0)}
                        </span>
                        <span className="leading-snug transition-all">{courtName}</span>
                      </div>
                    </TableCell>

                    {/* 5. Jadwal Main */}
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 py-0.5 px-2 bg-[#141414] text-[#fafafa] text-xs rounded-md border border-[#262626] h-[20.3125px] leading-snug transition-all">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${getLabelDotColor(
                              courtName
                            )}`}
                          />
                          <span className="leading-snug transition-all">{item.tgl_main}</span>
                        </div>
                        <span
                          className="text-xs text-[#8e8e8e] font-medium"
                          title={`Durasi: ${item.durasi_jam} Jam (${item.jam_slots.join(', ')})`}
                        >
                          • {formatSlotRange(item.jam_slots)}
                        </span>
                      </div>
                    </TableCell>

                    {/* 6. Aksi Tiga Titik & Quick Action */}
                    <TableCell className="text-right pr-5">
                      <div className="flex items-center justify-end gap-1 relative">
                        {!isLunas && !isBatal && (
                          <Button
                            type="button"
                            variant="emerald"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onLunasi(item.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Lunasi sisa pembayaran"
                          >
                            Lunasi
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveMenuId(activeMenuId === item.id ? null : item.id)
                          }}
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>

                        {/* Dropdown Menu Tiga Titik */}
                        {activeMenuId === item.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-[#262626] bg-[#181818] shadow-2xl p-1 z-30 text-xs text-[#fafafa] animate-fadeIn"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBooking(item)
                                setActiveMenuId(null)
                              }}
                              className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 transition flex items-center gap-2 cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                              <span>Detail Transaksi</span>
                            </button>

                            {item.no_hp && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    handleOpenWhatsApp(item.no_hp, item.nama_penyewa, e)
                                    setActiveMenuId(null)
                                  }}
                                  className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 transition flex items-center gap-2 cursor-pointer text-emerald-400"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Kirim WhatsApp</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    handleCopyPhone(item.no_hp, e)
                                    setActiveMenuId(null)
                                  }}
                                  className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 transition flex items-center gap-2 cursor-pointer text-[#8e8e8e] hover:text-white"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>
                                    {copiedPhone === item.no_hp ? 'Tersalin!' : 'Salin Nomor HP'}
                                  </span>
                                </button>
                              </>
                            )}

                            {!isLunas && !isBatal && (
                              <button
                                type="button"
                                onClick={() => {
                                  onLunasi(item.id)
                                  setActiveMenuId(null)
                                }}
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-emerald-600/20 text-emerald-400 transition flex items-center gap-2 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Tandai Lunas</span>
                              </button>
                            )}

                            {!isBatal && (
                              <button
                                type="button"
                                onClick={() => {
                                  onBatal(item.id)
                                  setActiveMenuId(null)
                                }}
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-rose-600/20 text-rose-400 transition flex items-center gap-2 cursor-pointer"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Batalkan Booking</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Row Baris Bawah: + Tambah Transaksi (Walk-in) */}
        <div
          onClick={onOpenManualModal}
          className="flex items-center gap-2 py-2.5 px-5 text-xs text-[#8e8e8e] hover:text-[#f2d953] hover:bg-white/5 cursor-pointer transition-colors border-t border-[#262626]"
        >
          <Plus className="w-3.5 h-3.5 text-[#f2d953]" />
          <span>+ Tambah Transaksi (Walk-in)</span>
        </div>
      </div>

      {/* Footer Navigasi Baris & Halaman Full Width */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-[#262626] bg-[#181818] text-xs text-[#8e8e8e] shrink-0">
        <div className="flex items-center gap-2">
          <span>Baris per halaman:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="bg-[#141414] border border-[#262626] rounded-lg px-2 py-1 text-white text-xs cursor-pointer focus:outline-none"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="flex items-center gap-1 ml-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Detail Panel Sheet saat baris diklik */}
      <BookingDetailSheet
        booking={selectedBooking}
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        onLunasi={onLunasi}
        onBatal={onBatal}
      />
    </div>
  )
}
