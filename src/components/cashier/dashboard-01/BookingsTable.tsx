// PERAN FILE: Tabel Transaksi Kasir Linear-Style Konsisten dengan Desain Blanca Dark Theme
import { useState, useMemo } from 'react'
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
  Tag,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import type { Booking } from '../../../types/database'
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
import { Badge } from '../../ui/badge'

interface BookingsTableProps {
  bookings: Booking[]
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

  // Data Terurut
  const sortedBookings = useMemo(() => {
    if (!sortField) return bookings

    return [...bookings].sort((a, b) => {
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
  }, [bookings, sortField, sortOrder])

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

  // Label Dot Color Konsisten dengan Blanca Theme
  const getLabelDotColor = (courtName: string) => {
    if (courtName.toLowerCase().includes('badminton')) return 'bg-emerald-400'
    if (courtName.toLowerCase().includes('futsal')) return 'bg-[#f2d953]'
    return 'bg-blue-400'
  }

  return (
    <div className="space-y-3.5 animate-fadeIn p-4 sm:p-6 select-none relative font-sans text-white">
      {/* Overlay Dropdown */}
      {activeMenuId !== null && (
        <div
          role="presentation"
          onClick={() => setActiveMenuId(null)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      {/* Top Filter Bar Konsisten Blanca Theme */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                onSearchChange(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari transaksi, penyewa, atau no HP..."
              className="pl-8"
            />
          </div>

          {/* Segmented Status Filter dengan Border & Background Konsisten */}
          <div className="flex items-center gap-1 bg-black/40 border border-[#262626] rounded-lg p-1">
            {[
              { label: 'Semua', value: 'Semua' },
              { label: 'Belum Lunas', value: 'Belum Lunas' },
              { label: 'Lunas', value: 'Lunas' },
              { label: 'Batal', value: 'Batal' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  onStatusChange(tab.value)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatus === tab.value
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-[#8e8e8e] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            title="Refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onOpenManualModal}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Walk-in</span>
          </Button>
        </div>
      </div>

      {/* Tabel Menggunakan Shadcn Table Component & Blanca Dark Border/Surface */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] overflow-hidden shadow-xs">
        <Table>
          {/* Header Shadcn Table */}
          <TableHeader>
            <TableRow className="border-b border-[#262626] bg-[#181818] hover:bg-[#181818]">
              {/* 1. Transaksi / Work items */}
              <TableHead
                onClick={() => handleSort('nama_penyewa')}
                className="cursor-pointer hover:text-white transition-colors min-w-[280px]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white/90">Work items</span>
                  <span className="text-[10px] text-[#737373] font-mono">({sortedBookings.length})</span>
                </div>
              </TableHead>

              {/* 2. State */}
              <TableHead
                onClick={() => handleSort('status')}
                className="cursor-pointer hover:text-white transition-colors w-32"
              >
                <div className="flex items-center gap-1.5">
                  <CircleDot className="w-3.5 h-3.5 text-[#8e8e8e]" />
                  <span>State</span>
                  <ChevronDown className="w-3 h-3 text-[#737373]" />
                </div>
              </TableHead>

              {/* 3. Priority / Tagihan */}
              <TableHead
                onClick={() => handleSort('total_bayar')}
                className="cursor-pointer hover:text-white transition-colors w-36"
              >
                <div className="flex items-center gap-1.5">
                  {/* Signal Bars Icon */}
                  <div className="flex items-end gap-0.5 h-3 w-3">
                    <span className="w-0.5 h-1 rounded-xs bg-[#8e8e8e]" />
                    <span className="w-0.5 h-2 rounded-xs bg-[#8e8e8e]" />
                    <span className="w-0.5 h-3 rounded-xs bg-[#8e8e8e]" />
                  </div>
                  <span>Priority</span>
                  <ChevronDown className="w-3 h-3 text-[#737373]" />
                </div>
              </TableHead>

              {/* 4. Assignees / Lapangan */}
              <TableHead
                onClick={() => handleSort('lapangan')}
                className="cursor-pointer hover:text-white transition-colors w-40"
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#8e8e8e]" />
                  <span>Assignees</span>
                  <ChevronDown className="w-3 h-3 text-[#737373]" />
                </div>
              </TableHead>

              {/* 5. Labels / Jadwal Main */}
              <TableHead
                onClick={() => handleSort('tgl_main')}
                className="cursor-pointer hover:text-white transition-colors min-w-[200px]"
              >
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#8e8e8e]" />
                  <span>Labels</span>
                  <ChevronDown className="w-3 h-3 text-[#737373]" />
                </div>
              </TableHead>

              {/* 6. Settings / Options */}
              <TableHead className="text-right w-12 px-3">
                <div className="flex items-center justify-end text-[#737373]">
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
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Memuat data transaksi...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-[#8e8e8e]">
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
                    className="cursor-pointer group h-10 border-b border-[#262626]/40 hover:bg-white/[0.03]"
                  >
                    {/* 1. Identifier (Mono) + Title (Penyewa & No HP) */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-[#8e8e8e] font-medium tracking-wide shrink-0">
                          {invoiceCode}
                        </span>
                        <span className="text-white text-xs font-semibold group-hover:text-emerald-400 transition-colors truncate">
                          {item.nama_penyewa}
                        </span>
                        {item.no_hp && (
                          <span className="text-[11px] text-[#737373] font-mono hidden md:inline">
                            • {item.no_hp}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* 2. State (Linear-style Status dengan Warna Konsisten Blanca) */}
                    <TableCell className="whitespace-nowrap">
                      {isLunas ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-xs font-medium">Done</span>
                        </div>
                      ) : isBatal ? (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-rose-400 text-xs font-medium">Canceled</span>
                        </div>
                      ) : isDP ? (
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          </span>
                          <span className="text-amber-300 text-xs font-medium">In Progress</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#737373] shrink-0" />
                          <span className="text-[#8e8e8e] text-xs font-medium">Todo</span>
                        </div>
                      )}
                    </TableCell>

                    {/* 3. Priority / Tagihan (Blanca Theme Accent Colors) */}
                    <TableCell className="whitespace-nowrap">
                      {!isLunas && !isBatal && sisa > 0 ? (
                        <div className="flex items-center gap-2">
                          {/* Urgent Icon */}
                          <div className="w-3.5 h-3.5 rounded-xs border border-amber-500/40 bg-amber-500/10 flex items-center justify-center text-[9px] text-amber-400 font-bold">
                            !
                          </div>
                          <span className="text-amber-300 text-xs font-medium">
                            Sisa {formatRupiah(sisa)}
                          </span>
                        </div>
                      ) : isLunas ? (
                        <div className="flex items-center gap-2">
                          {/* Signal Bars */}
                          <div className="flex items-end gap-0.5 h-3 w-3">
                            <span className="w-0.5 h-1 rounded-xs bg-emerald-400" />
                            <span className="w-0.5 h-2 rounded-xs bg-white/20" />
                            <span className="w-0.5 h-3 rounded-xs bg-white/20" />
                          </div>
                          <span className="text-white text-xs font-medium">
                            {formatRupiah(item.total_bayar)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-end gap-0.5 h-3 w-3">
                            <span className="w-0.5 h-1 rounded-xs bg-[#737373]" />
                            <span className="w-0.5 h-2 rounded-xs bg-white/10" />
                            <span className="w-0.5 h-3 rounded-xs bg-white/10" />
                          </div>
                          <span className="text-[#737373] text-xs font-normal">Batal</span>
                        </div>
                      )}
                    </TableCell>

                    {/* 4. Assignees / Lapangan */}
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="outline" className="border-[#262626] bg-white/5 text-white gap-1.5 py-0.5 px-2 font-normal">
                        <span className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center text-[9px] text-emerald-400 font-bold">
                          {courtName.charAt(0)}
                        </span>
                        <span className="truncate">{courtName}</span>
                      </Badge>
                    </TableCell>

                    {/* 5. Labels / Jadwal Main */}
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-[#262626] bg-white/5 text-white gap-1.5 py-0.5 px-2 font-normal">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${getLabelDotColor(
                              courtName
                            )}`}
                          />
                          <span>{item.tgl_main}</span>
                        </Badge>
                        <span className="text-[11px] text-[#8e8e8e]">
                          • {item.jam_slots.join(', ')}
                        </span>
                      </div>
                    </TableCell>

                    {/* 6. Aksi Tiga Titik & Quick Action */}
                    <TableCell className="text-right px-3">
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

                        {/* Dropdown Menu Tiga Titik Sesuai Blanca Palette */}
                        {activeMenuId === item.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-[#262626] bg-[#1a1a1a] shadow-xl p-1.5 z-30 text-xs text-white animate-fadeIn"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBooking(item)
                                setActiveMenuId(null)
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white/10 transition flex items-center gap-2 cursor-pointer"
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
                                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white/10 transition flex items-center gap-2 cursor-pointer text-emerald-400"
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
                                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white/10 transition flex items-center gap-2 cursor-pointer text-[#8e8e8e] hover:text-white"
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
                                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-emerald-600/20 text-emerald-400 transition flex items-center gap-2 cursor-pointer"
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
                                className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-rose-600/20 text-rose-400 transition flex items-center gap-2 cursor-pointer"
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

        {/* Row Baris Bawah: + Add work item konsisten tema */}
        <div
          onClick={onOpenManualModal}
          className="flex items-center gap-2 py-2.5 px-4 text-xs text-[#8e8e8e] hover:text-white hover:bg-white/5 cursor-pointer transition-colors border-t border-[#262626]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add work item</span>
        </div>

        {/* Footer Navigasi Baris & Halaman dengan Blanca Palette */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#262626] bg-[#161616] text-[11px] text-[#8e8e8e]">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-white/5 border border-[#262626] rounded-md px-2 py-0.5 text-white text-[11px] cursor-pointer focus:outline-none"
            >
              <option value={10} className="bg-[#181818]">10</option>
              <option value={15} className="bg-[#181818]">15</option>
              <option value={30} className="bg-[#181818]">30</option>
              <option value={50} className="bg-[#181818]">50</option>
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
