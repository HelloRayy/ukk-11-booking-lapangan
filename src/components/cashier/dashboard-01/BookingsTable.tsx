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

  // State Filter Tambahan: Lapangan & Tanggal
  const [selectedCourt, setSelectedCourt] = useState<string>('Semua')
  const [selectedDate, setSelectedDate] = useState<string>('all')

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
    <div className="flex flex-col h-full select-none relative font-sans text-[oklch(0.9235_0.001733_230.685)]">
      {/* Overlay Dropdown */}
      {activeMenuId !== null && (
        <div
          role="presentation"
          onClick={() => setActiveMenuId(null)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      {/* Top Filter Bar Linear dengan UX Copy Alami & Fitur Kasir Lengkap */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 px-5 py-2.5 border-b border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.1932_0.002_230.81)]">
        {/* Sisi Kiri: Search Input & Badge Filter */}
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[oklch(0.55_0.002_230.81)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                onSearchChange(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari transaksi, penyewa, no HP..."
              className="pl-8 h-8 text-xs bg-[oklch(0.16_0.002_230.81)] border-[oklch(0.2593_0.0033_230.84)]"
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
              className="text-[11px] text-[oklch(0.65_0.002_230.81)] hover:text-white px-2 py-1 rounded bg-white/5 whitespace-nowrap transition-colors cursor-pointer"
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
              className={`h-8 text-xs gap-1.5 px-2.5 bg-[oklch(0.16_0.002_230.81)] border-[oklch(0.2593_0.0033_230.84)] hover:bg-white/5 cursor-pointer ${
                selectedStatus !== 'Semua' ? 'border-emerald-500/60 text-white font-medium' : 'text-[oklch(0.75_0.002_230.81)]'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5 text-[oklch(0.65_0.002_230.81)]" />
              <span>Status: <strong className="font-semibold text-white">{selectedStatus}</strong></span>
              <ChevronDown className="w-3 h-3 text-[oklch(0.55_0.002_230.81)]" />
            </Button>

            {openDropdown === 'status' && (
              <div className="absolute right-0 top-full mt-1.5 w-44 py-1 rounded-md border border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.18_0.002_230.81)] shadow-xl z-30">
                <div className="px-3 py-1 text-[10px] font-semibold text-[oklch(0.5_0.002_230.81)] uppercase tracking-wider">
                  Filter Status
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
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[oklch(0.85_0.002_230.81)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                  >
                    <span>{item.label}</span>
                    {selectedStatus === item.value && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
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
              className={`h-8 text-xs gap-1.5 px-2.5 bg-[oklch(0.16_0.002_230.81)] border-[oklch(0.2593_0.0033_230.84)] hover:bg-white/5 cursor-pointer ${
                selectedCourt !== 'Semua' ? 'border-cyan-500/60 text-white font-medium' : 'text-[oklch(0.75_0.002_230.81)]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[oklch(0.65_0.002_230.81)]" />
              <span>
                {selectedCourt === 'Semua'
                  ? 'Semua Lapangan'
                  : courts.find((c) => String(c.id) === selectedCourt)?.nama_lapangan || 'Lapangan'}
              </span>
              <ChevronDown className="w-3 h-3 text-[oklch(0.55_0.002_230.81)]" />
            </Button>

            {openDropdown === 'court' && (
              <div className="absolute right-0 top-full mt-1.5 w-48 py-1 rounded-md border border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.18_0.002_230.81)] shadow-xl z-30 max-h-56 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-semibold text-[oklch(0.5_0.002_230.81)] uppercase tracking-wider">
                  Filter Lapangan
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourt('Semua')
                    setOpenDropdown(null)
                    setCurrentPage(1)
                  }}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[oklch(0.85_0.002_230.81)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <span>Semua Lapangan</span>
                  {selectedCourt === 'Semua' && (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[oklch(0.85_0.002_230.81)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                  >
                    <span>{c.nama_lapangan}</span>
                    {selectedCourt === String(c.id) && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Dropdown Filter Tanggal (Fitur Tambahan) */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
              className={`h-8 text-xs gap-1.5 px-2.5 bg-[oklch(0.16_0.002_230.81)] border-[oklch(0.2593_0.0033_230.84)] hover:bg-white/5 cursor-pointer ${
                selectedDate !== 'all' ? 'border-amber-500/60 text-white font-medium' : 'text-[oklch(0.75_0.002_230.81)]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[oklch(0.65_0.002_230.81)]" />
              <span>
                {selectedDate === 'all'
                  ? 'Semua Tanggal'
                  : selectedDate === 'today'
                  ? 'Hari Ini'
                  : 'Besok'}
              </span>
              <ChevronDown className="w-3 h-3 text-[oklch(0.55_0.002_230.81)]" />
            </Button>

            {openDropdown === 'date' && (
              <div className="absolute right-0 top-full mt-1.5 w-40 py-1 rounded-md border border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.18_0.002_230.81)] shadow-xl z-30">
                <div className="px-3 py-1 text-[10px] font-semibold text-[oklch(0.5_0.002_230.81)] uppercase tracking-wider">
                  Filter Tanggal
                </div>
                {[
                  { label: 'Semua Tanggal', value: 'all' },
                  { label: 'Hari Ini', value: 'today' },
                  { label: 'Besok', value: 'tomorrow' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setSelectedDate(item.value)
                      setOpenDropdown(null)
                      setCurrentPage(1)
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-[oklch(0.85_0.002_230.81)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                  >
                    <span>{item.label}</span>
                    {selectedDate === item.value && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Fitur Ekspor CSV (Fitur Tambahan Praktis Kasir) */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 text-xs gap-1.5 px-2.5 bg-[oklch(0.16_0.002_230.81)] border-[oklch(0.2593_0.0033_230.84)] text-[oklch(0.75_0.002_230.81)] hover:text-white hover:bg-white/5 cursor-pointer"
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
            className="h-8 text-xs gap-1.5 px-2.5 bg-[oklch(0.16_0.002_230.81)] border-[oklch(0.2593_0.0033_230.84)] hover:bg-white/5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          {/* 6. Primary Action Button Walk-in */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onOpenManualModal}
            className="h-8 text-xs gap-1.5 px-3 font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Walk-in</span>
          </Button>
        </div>
      </div>

      {/* Tabel Data Full Width Tanpa Box Terjepit */}
      <div className="flex-1 overflow-x-auto min-h-0 bg-[oklch(0.1932_0.002_230.81)]">
        <Table>
          {/* Header Shadcn Table dengan UX Copy Kontekstual Kasir */}
          <TableHeader>
            <TableRow className="border-b border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.1932_0.002_230.81)] hover:bg-[oklch(0.1932_0.002_230.81)]">
              {/* 1. Kolom Penyewa & Invoice */}
              <TableHead
                onClick={() => handleSort('nama_penyewa')}
                className="cursor-pointer hover:text-white transition-colors min-w-[280px] pl-5"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white/90">Penyewa</span>
                  <span className="text-xs text-[oklch(0.55_0.002_230.81)]">({sortedBookings.length})</span>
                </div>
              </TableHead>

              {/* 2. Kolom Status */}
              <TableHead
                onClick={() => handleSort('status')}
                className="cursor-pointer hover:text-white transition-colors w-36"
              >
                <div className="flex items-center gap-1.5">
                  <CircleDot className="w-3.5 h-3.5 text-[oklch(0.65_0.002_230.81)]" />
                  <span>Status</span>
                  <ChevronDown className="w-3 h-3 text-[oklch(0.55_0.002_230.81)]" />
                </div>
              </TableHead>

              {/* 3. Kolom Tagihan (Sebelumnya 'Priority') */}
              <TableHead
                onClick={() => handleSort('total_bayar')}
                className="cursor-pointer hover:text-white transition-colors w-40"
              >
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[oklch(0.65_0.002_230.81)]" />
                  <span>Tagihan</span>
                  <ChevronDown className="w-3 h-3 text-[oklch(0.55_0.002_230.81)]" />
                </div>
              </TableHead>

              {/* 4. Kolom Lapangan (Sebelumnya 'Assignees') */}
              <TableHead
                onClick={() => handleSort('lapangan')}
                className="cursor-pointer hover:text-white transition-colors w-40"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[oklch(0.65_0.002_230.81)]" />
                  <span>Lapangan</span>
                  <ChevronDown className="w-3 h-3 text-[oklch(0.55_0.002_230.81)]" />
                </div>
              </TableHead>

              {/* 5. Kolom Jadwal Main (Sebelumnya 'Labels') */}
              <TableHead
                onClick={() => handleSort('tgl_main')}
                className="cursor-pointer hover:text-white transition-colors min-w-[220px]"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[oklch(0.65_0.002_230.81)]" />
                  <span>Jadwal Main</span>
                  <ChevronDown className="w-3 h-3 text-[oklch(0.55_0.002_230.81)]" />
                </div>
              </TableHead>

              {/* 6. Settings / Options */}
              <TableHead className="text-right w-14 pr-5">
                <div className="flex items-center justify-end text-[oklch(0.65_0.002_230.81)]">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body Shadcn Table */}
          <TableBody>
            {loading && bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-[oklch(0.65_0.002_230.81)]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Memuat data transaksi...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-[oklch(0.65_0.002_230.81)]">
                  Tidak ada transaksi yang cocok.
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
                    className="cursor-pointer group h-10 border-b border-[oklch(0.2593_0.0033_230.84)]/60 hover:bg-white/[0.04]"
                  >
                    {/* 1. Identifier (Sans) + Title (Penyewa & No HP) */}
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[oklch(0.65_0.002_230.81)] font-medium tracking-wide shrink-0">
                          {invoiceCode}
                        </span>
                        <span className="text-[oklch(0.9235_0.001733_230.685)] text-xs font-medium group-hover:text-white transition-colors truncate">
                          {item.nama_penyewa}
                        </span>
                        {item.no_hp && (
                          <span className="text-xs text-[oklch(0.55_0.002_230.81)] hidden md:inline">
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
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          </span>
                          <span className="text-amber-300 text-xs font-medium">DP 50%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[oklch(0.55_0.002_230.81)] shrink-0" />
                          <span className="text-[oklch(0.65_0.002_230.81)] text-xs font-medium">Booked</span>
                        </div>
                      )}
                    </TableCell>

                    {/* 3. Tagihan (Nominal Total atau Sisa Pelunasan) */}
                    <TableCell className="whitespace-nowrap">
                      {!isLunas && !isBatal && sisa > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-xs border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-[9px] text-amber-400 font-bold shrink-0">
                            !
                          </div>
                          <span className="text-amber-300 text-xs font-semibold">
                            Sisa {formatRupiah(sisa)}
                          </span>
                        </div>
                      ) : isLunas ? (
                        <div className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="text-[oklch(0.9235_0.001733_230.685)] text-xs font-medium">
                            {formatRupiah(item.total_bayar)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[oklch(0.55_0.002_230.81)] text-xs font-normal">
                            - Batal
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* 4. Lapangan (Badge Pill Sesuai Referensi Pengguna) */}
                    <TableCell className="whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 py-0.5 px-2 bg-[oklch(0.16_0.002_230.81)] text-[oklch(0.9235_0.001733_230.685)] text-xs rounded-md border border-[oklch(0.2593_0.0033_230.84)] h-[20.3125px] leading-snug transition-all">
                        <span className="flex items-center justify-center w-3.5 h-3.5 bg-[oklab(0.999994_0.0000455678_0.0000200868_/_0.1)] text-[oklch(0.765_0.177_163.223)] text-xs font-bold rounded-full leading-snug transition-all">
                          {courtName.charAt(0)}
                        </span>
                        <span className="leading-snug transition-all">{courtName}</span>
                      </div>
                    </TableCell>

                    {/* 5. Jadwal Main */}
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 py-0.5 px-2 bg-[oklch(0.16_0.002_230.81)] text-[oklch(0.9235_0.001733_230.685)] text-xs rounded-md border border-[oklch(0.2593_0.0033_230.84)] h-[20.3125px] leading-snug transition-all">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${getLabelDotColor(
                              courtName
                            )}`}
                          />
                          <span className="leading-snug transition-all">{item.tgl_main}</span>
                        </div>
                        <span
                          className="text-xs text-[oklch(0.75_0.002_230.81)] font-medium"
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
                            className="absolute right-0 top-full mt-1 w-44 rounded-md border border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.18_0.002_230.81)] shadow-2xl p-1 z-30 text-xs text-[oklch(0.9235_0.001733_230.685)] animate-fadeIn"
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
                                  className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 transition flex items-center gap-2 cursor-pointer text-[oklch(0.65_0.002_230.81)] hover:text-white"
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
          className="flex items-center gap-2 py-2.5 px-5 text-xs text-[oklch(0.65_0.002_230.81)] hover:text-white hover:bg-white/5 cursor-pointer transition-colors border-t border-[oklch(0.2593_0.0033_230.84)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Tambah Transaksi (Walk-in)</span>
        </div>
      </div>

      {/* Footer Navigasi Baris & Halaman Full Width */}
      <div className="flex items-center justify-between px-5 py-2.5 border-t border-[oklch(0.2593_0.0033_230.84)] bg-[oklch(0.1932_0.002_230.81)] text-xs text-[oklch(0.65_0.002_230.81)] shrink-0">
        <div className="flex items-center gap-2">
          <span>Baris per halaman:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="bg-[oklch(0.16_0.002_230.81)] border border-[oklch(0.2593_0.0033_230.84)] rounded px-1.5 py-0.5 text-white text-xs cursor-pointer focus:outline-none"
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
