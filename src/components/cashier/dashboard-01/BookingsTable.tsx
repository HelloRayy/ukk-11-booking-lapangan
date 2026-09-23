// PERAN FILE: Tabel Transaksi Kasir Minimalis 4 Kolom (Master-Detail dengan Right Panel Sheet)
import { useState } from 'react'
import {
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
} from 'lucide-react'
import type { Booking } from '../../../types/database'
import BookingDetailSheet from './BookingDetailSheet'

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
  // State untuk Panel Detail Sisi Kanan (Right Sheet)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  // Data Terpotong Pagination
  const totalPages = Math.max(1, Math.ceil(bookings.length / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedBookings = bookings.slice(startIndex, startIndex + rowsPerPage)

  const getAvatarBg = (name: string) => {
    const colors = [
      'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'bg-teal-500/20 text-teal-300 border-teal-500/30',
    ]
    const idx = (name.charCodeAt(0) || 0) % colors.length
    return colors[idx]
  }

  return (
    <div className="space-y-5 animate-fadeIn p-6 select-none">
      {/* 1. Header & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Transaksi</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Tombol Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-[#262626] text-xs font-medium transition-all cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Tombol + Walk-in */}
          <button
            type="button"
            onClick={onOpenManualModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Walk-in</span>
          </button>
        </div>
      </div>

      {/* 2. Search Bar & Status Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => {
              onSearchChange(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Cari transaksi..."
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-white/5 border border-[#262626] text-xs text-white placeholder:text-[#737373] focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-lg bg-black/40 border border-[#262626]">
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
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
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

      {/* 3. Tabel Minimalis 4 Kolom (Master Table) */}
      <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#262626] bg-[#141414]/70 text-[#8e8e8e] text-[11px] font-medium">
                <th className="py-3 px-5">Penyewa</th>
                <th className="py-3 px-4">Lapangan</th>
                <th className="py-3 px-4">Status & Tagihan</th>
                <th className="py-3 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]/50">
              {loading && bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-[#8e8e8e]">
                    Memuat data transaksi...
                  </td>
                </tr>
              ) : paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-[#8e8e8e]">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((item) => {
                  const isLunas = item.status === 'Lunas'
                  const isBatal = item.status === 'Batal'
                  const sisa = item.sisa_bayar || 0
                  const courtName = item.lapangan?.nama_lapangan || `Court ${item.lapangan_id}`
                  const initials = item.nama_penyewa
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedBooking(item)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {/* Kolom 1: Penyewa (Avatar + Nama + Jam Ringkas) */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${getAvatarBg(
                              item.nama_penyewa
                            )}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-sm group-hover:text-emerald-400 transition-colors">
                              {item.nama_penyewa}
                            </span>
                            <span className="text-[11px] text-[#8e8e8e] block mt-0.5">
                              {item.tgl_main} • {item.jam_slots.join(', ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kolom 2: Lapangan */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-white font-medium">
                          {courtName}
                        </span>
                      </td>

                      {/* Kolom 3: Status & Tagihan */}
                      <td className="py-3.5 px-4">
                        {isLunas ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Lunas</span>
                          </span>
                        ) : isBatal ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Batal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Sisa {formatRupiah(sisa)}</span>
                          </span>
                        )}
                      </td>

                      {/* Kolom 4: Aksi Cepat */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isLunas && !isBatal && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onLunasi(item.id)
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              <Check className="w-3 h-3" />
                              <span>Lunasi</span>
                            </button>
                          )}

                          <div className="w-7 h-7 rounded-md bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-[#737373] group-hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Footer Pagination Ringkas */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#262626] text-xs text-[#8e8e8e]">
          {/* Sisi Kiri: Entries */}
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="appearance-none bg-white/5 border border-[#333] rounded-md px-2.5 py-1 pr-6 text-white text-xs cursor-pointer focus:outline-none focus:border-white/20"
              >
                <option value={5} className="bg-[#181818]">5</option>
                <option value={10} className="bg-[#181818]">10</option>
                <option value={20} className="bg-[#181818]">20</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#8e8e8e] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span>(Total {bookings.length} transaksi)</span>
          </div>

          {/* Sisi Kanan: Page Navigation */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-md border border-[#333] bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-[#333] bg-white/5 hover:bg-white/10 text-[#8e8e8e] hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-md border border-[#333] bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Right Detail Panel Sheet saat baris diklik */}
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
