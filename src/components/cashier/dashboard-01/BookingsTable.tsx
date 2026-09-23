// PERAN FILE: Tabel Transaksi Kasir Menggunakan Komponen Resmi Shadcn UI (Table, Button, Input, Badge)
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
    const text = encodeURIComponent(`Halo Kak ${name}, kami dari pengelola Gelora Arena terkait booking lapangan Anda.`)
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank')
  }

  // Label Dot Color Generator berdasarkan Lapangan
  const getLabelDotColor = (courtName: string) => {
    if (courtName.toLowerCase().includes('badminton')) return 'bg-cyan-400'
    if (courtName.toLowerCase().includes('futsal')) return 'bg-emerald-400'
    if (courtName.toLowerCase().includes('vinyl')) return 'bg-amber-400'
    return 'bg-pink-400'
  }

  return (
    <div className="space-y-3 animate-fadeIn p-4 sm:p-6 select-none relative font-sans text-[#ededed]">
      {/* Overlay Dropdown */}
      {activeMenuId !== null && (
        <div
          role="presentation"
          onClick={() => setActiveMenuId(null)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      {/* Top Filter Bar Menggunakan Shadcn Input & Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-3.5 h-3.5 text-[#71767b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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

          {/* Segmented Status Filter */}
          <div className="flex items-center gap-1 bg-[#131417] border border-[#22242a] rounded-md p-0.5">
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
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedStatus === tab.value
                    ? 'bg-[#22242a] text-white font-semibold'
                    : 'text-[#8a8f98] hover:text-[#ededed]'
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
            className="shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Walk-in</span>
          </Button>
        </div>
      </div>

      {/* Tabel Menggunakan Shadcn Table Component */}
      <div className="rounded-lg border border-[#1e2025] bg-[#0c0d0e] overflow-hidden shadow-2xl">
        <Table>
          {/* Header Shadcn Table */}
          <TableHeader>
            <TableRow className="border-b border-[#1c1d22] bg-[#0c0d0e] hover:bg-[#0c0d0e]">
              {/* 1. Transaksi / Work items */}
              <TableHead
                onClick={() => handleSort('nama_penyewa')}
                className="cursor-pointer hover:text-white transition-colors min-w-[280px]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white/90">Work items</span>
                  <span className="text-[10px] text-[#555a64] font-mono">({sortedBookings.length})</span>
                </div>
              </TableHead>

              {/* 2. State */}
              <TableHead
                onClick={() => handleSort('status')}
                className="cursor-pointer hover:text-white transition-colors w-32"
              >
                <div className="flex items-center gap-1.5">
                  <CircleDot className="w-3.5 h-3.5 text-[#71767b]" />
                  <span>State</span>
                  <ChevronDown className="w-3 h-3 text-[#555a64]" />
                </div>
              </TableHead>

              {/* 3. Priority / Tagihan */}
              <TableHead
                onClick={() => handleSort('total_bayar')}
                className="cursor-pointer hover:text-white transition-colors w-36"
              >
                <div className="flex items-center gap-1.5">
                  {/* Linear Signal Bars Icon */}
                  <div className="flex items-end gap-0.5 h-3 w-3">
                    <span className="w-0.5 h-1 rounded-xs bg-[#71767b]" />
                    <span className="w-0.5 h-2 rounded-xs bg-[#71767b]" />
                    <span className="w-0.5 h-3 rounded-xs bg-[#71767b]" />
                  </div>
                  <span>Priority</span>
                  <ChevronDown className="w-3 h-3 text-[#555a64]" />
                </div>
              </TableHead>

              {/* 4. Assignees / Lapangan */}
              <TableHead
                onClick={() => handleSort('lapangan')}
                className="cursor-pointer hover:text-white transition-colors w-40"
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#71767b]" />
                  <span>Assignees</span>
                  <ChevronDown className="w-3 h-3 text-[#555a64]" />
                </div>
              </TableHead>

              {/* 5. Labels / Jadwal Main */}
              <TableHead
                onClick={() => handleSort('tgl_main')}
                className="cursor-pointer hover:text-white transition-colors min-w-[200px]"
              >
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#71767b]" />
                  <span>Labels</span>
                  <ChevronDown className="w-3 h-3 text-[#555a64]" />
                </div>
              </TableHead>

              {/* 6. Settings / Options */}
              <TableHead className="text-right w-12 px-3">
                <div className="flex items-center justify-end text-[#71767b]">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body Shadcn Table */}
          <TableBody>
            {loading && bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-[#71767b]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#8a8f98]" />
                    <span>Memuat data transaksi...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center text-[#71767b]">
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
                    className="cursor-pointer group h-10 border-b border-[#18191d]"
                  >
                    {/* 1. Identifier (Mono) + Title (Penyewa & No HP) */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-[#71767b] font-medium tracking-wide shrink-0">
                          {invoiceCode}
                        </span>
                        <span className="text-[#ededed] text-xs font-medium group-hover:text-white transition-colors truncate">
                          {item.nama_penyewa}
                        </span>
                        {item.no_hp && (
                          <span className="text-[11px] text-[#555a64] font-mono hidden md:inline">
                            • {item.no_hp}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* 2. State (Linear-style Status) */}
                    <TableCell className="whitespace-nowrap">
                      {isLunas ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#38c793]" />
                          <span className="text-[#38c793] text-xs font-normal">Done</span>
                        </div>
                      ) : isBatal ? (
                        <div className="flex items-center gap-2">
                          <XCircle className="w-3.5 h-3.5 text-[#e5484d]" />
                          <span className="text-[#e5484d] text-xs font-normal">Canceled</span>
                        </div>
                      ) : isDP ? (
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#f1a83b] flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f1a83b]" />
                          </span>
                          <span className="text-[#f1a83b] text-xs font-normal">In Progress</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#71767b] shrink-0" />
                          <span className="text-[#8a8f98] text-xs font-normal">Todo</span>
                        </div>
                      )}
                    </TableCell>

                    {/* 3. Priority / Tagihan (Linear Signal Bars / Urgent Badge) */}
                    <TableCell className="whitespace-nowrap">
                      {!isLunas && !isBatal && sisa > 0 ? (
                        <div className="flex items-center gap-2">
                          {/* Urgent Icon */}
                          <div className="w-3.5 h-3.5 rounded-xs border border-[#e5484d] flex items-center justify-center text-[9px] text-[#e5484d] font-bold">
                            !
                          </div>
                          <span className="text-[#e5484d] text-xs font-medium">
                            Sisa {formatRupiah(sisa)}
                          </span>
                        </div>
                      ) : isLunas ? (
                        <div className="flex items-center gap-2">
                          {/* Low 1 Bar Icon */}
                          <div className="flex items-end gap-0.5 h-3 w-3">
                            <span className="w-0.5 h-1 rounded-xs bg-[#3b82f6]" />
                            <span className="w-0.5 h-2 rounded-xs bg-[#22242a]" />
                            <span className="w-0.5 h-3 rounded-xs bg-[#22242a]" />
                          </div>
                          <span className="text-[#8a8f98] text-xs font-normal">
                            {formatRupiah(item.total_bayar)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-end gap-0.5 h-3 w-3">
                            <span className="w-0.5 h-1 rounded-xs bg-[#555a64]" />
                            <span className="w-0.5 h-2 rounded-xs bg-[#22242a]" />
                            <span className="w-0.5 h-3 rounded-xs bg-[#22242a]" />
                          </div>
                          <span className="text-[#555a64] text-xs font-normal">Batal</span>
                        </div>
                      )}
                    </TableCell>

                    {/* 4. Assignees / Lapangan */}
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="outline" className="border-[#22242a] bg-[#131417] text-[#c5c8d0] gap-1.5 py-0.5 px-2 font-normal">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#1e2025] flex items-center justify-center text-[9px] text-[#ededed]">
                          {courtName.charAt(0)}
                        </span>
                        <span className="truncate">{courtName}</span>
                      </Badge>
                    </TableCell>

                    {/* 5. Labels / Jadwal Main (Dot Tag Linear) */}
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-[#22242a] bg-[#131417] text-[#c5c8d0] gap-1.5 py-0.5 px-2 font-normal">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${getLabelDotColor(
                              courtName
                            )}`}
                          />
                          <span>{item.tgl_main}</span>
                        </Badge>
                        <span className="text-[11px] text-[#555a64]">
                          • {item.jam_slots.join(', ')}
                        </span>
                      </div>
                    </TableCell>

                    {/* 6. Aksi Tiga Titik & Quick Action menggunakan Shadcn Button */}
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

                        {/* Dropdown Menu Tiga Titik */}
                        {activeMenuId === item.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1 w-44 rounded-md border border-[#22242a] bg-[#121316] shadow-2xl p-1 z-30 text-xs text-[#ededed] animate-fadeIn"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBooking(item)
                                setActiveMenuId(null)
                              }}
                              className="w-full text-left px-2 py-1.5 rounded hover:bg-[#1a1b20] transition flex items-center gap-2 cursor-pointer"
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
                                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#1a1b20] transition flex items-center gap-2 cursor-pointer text-[#38c793]"
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
                                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#1a1b20] transition flex items-center gap-2 cursor-pointer text-[#8a8f98]"
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
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-[#1a3826] text-[#38c793] transition flex items-center gap-2 cursor-pointer"
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
                                className="w-full text-left px-2 py-1.5 rounded hover:bg-[#381a1d] text-[#e5484d] transition flex items-center gap-2 cursor-pointer"
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

        {/* Row Baris Bawah: + Add work item persis di screenshot */}
        <div
          onClick={onOpenManualModal}
          className="flex items-center gap-2 py-2.5 px-4 text-xs text-[#8a8f98] hover:text-[#ededed] hover:bg-[#141518] cursor-pointer transition-colors border-t border-[#1c1d22]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add work item</span>
        </div>

        {/* Footer Navigasi Baris & Halaman dengan Shadcn Button */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#1c1d22] bg-[#0c0d0e] text-[11px] text-[#71767b]">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-[#131417] border border-[#22242a] rounded px-1.5 py-0.5 text-[#ededed] text-[11px] cursor-pointer focus:outline-none"
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
