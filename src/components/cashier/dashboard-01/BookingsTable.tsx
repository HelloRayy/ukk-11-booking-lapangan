// PERAN FILE: Tabel Data Transaksi Kasir Mengikuti Layout Referensi (Checkbox, Status Pill, Three-Dots Menu, Pagination)
import { useState } from 'react'
import {
  Search,
  Plus,
  RefreshCw,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  MessageSquare,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import type { Booking } from '../../../types/database'

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
  // State Checkbox Seleksi Baris
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  // State Dropdown Menu Titik Tiga (...)
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null)

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  // Toggle Seleksi Semua Baris
  const isAllSelected = bookings.length > 0 && selectedIds.size === bookings.length
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(bookings.map((b) => b.id)))
    }
  }

  // Toggle Seleksi Satu Baris
  const handleToggleSelectRow = (id: number) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  // Data Terpotong Pagination
  const totalPages = Math.max(1, Math.ceil(bookings.length / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedBookings = bookings.slice(startIndex, startIndex + rowsPerPage)

  // Avatar Colors Helper
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
      {/* 1. Header & Filter Atas */}
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

      {/* 2. Search Bar & Status Pills */}
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

      {/* 3. Kontainer Tabel Mengikuti Layout Gambar Referensi */}
      <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            {/* Header Kolom dengan Sort Indicator */}
            <thead>
              <tr className="border-b border-[#262626] bg-[#141414]/70 text-[#8e8e8e] text-[11px] font-semibold">
                {/* Checkbox Header */}
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded border-[#333] bg-white/5 accent-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-[#555]" />
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <span>Phone</span>
                    <ArrowUpDown className="w-3 h-3 text-[#555]" />
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <span>Court</span>
                    <ArrowUpDown className="w-3 h-3 text-[#555]" />
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <span>Balance</span>
                    <ArrowUpDown className="w-3 h-3 text-[#555]" />
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <span>Total</span>
                    <ArrowUpDown className="w-3 h-3 text-[#555]" />
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <span>Schedule</span>
                    <ArrowUpDown className="w-3 h-3 text-[#555]" />
                  </div>
                </th>
                <th className="py-3 px-3">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-[#555]" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Isi Baris Tabel */}
            <tbody className="divide-y divide-[#262626]/50">
              {loading && bookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-[#8e8e8e]">
                    Memuat data transaksi dari Supabase...
                  </td>
                </tr>
              ) : paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-[#8e8e8e]">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((item) => {
                  const isChecked = selectedIds.has(item.id)
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

                  // WhatsApp URL
                  const cleanPhone = (item.no_hp || '').replace(/[^0-9]/g, '')
                  const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
                  const waText = encodeURIComponent(
                    `*BLANCA ARENA - BUKTI SEWA*\n` +
                    `Invoice: INV-${item.id}\n` +
                    `Penyewa: ${item.nama_penyewa}\n` +
                    `Lapangan: ${courtName}\n` +
                    `Tanggal: ${item.tgl_main} (${item.jam_slots.join(', ')})\n` +
                    `Total: ${formatRupiah(item.total_bayar)}\n` +
                    `Status: ${item.status} (${isLunas ? 'LUNAS' : `Sisa ${formatRupiah(sisa)}`})\n\n` +
                    `Terima kasih sudah memesan!`
                  )
                  const waUrl = `https://wa.me/${intlPhone}?text=${waText}`

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isChecked ? 'bg-white/[0.03]' : ''
                      }`}
                    >
                      {/* 1. Checkbox Baris */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectRow(item.id)}
                          className="w-4 h-4 rounded border-[#333] bg-white/5 accent-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* 2. Customer: Avatar Bulat + Nama */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${getAvatarBg(
                              item.nama_penyewa
                            )}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-white block leading-tight">
                              {item.nama_penyewa}
                            </span>
                            <span className="text-[10px] font-mono text-[#737373]">
                              INV-{item.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Phone */}
                      <td className="py-3 px-3 text-[#d4d4d4] font-medium">
                        {item.no_hp}
                      </td>

                      {/* 4. Court */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-white font-medium">
                          {courtName}
                        </span>
                      </td>

                      {/* 5. Balance (Sisa Tagihan) */}
                      <td className="py-3 px-3">
                        {sisa > 0 ? (
                          <span className="font-bold text-amber-400">
                            {formatRupiah(sisa)}
                          </span>
                        ) : (
                          <span className="text-[#555] font-medium">-</span>
                        )}
                      </td>

                      {/* 6. Total */}
                      <td className="py-3 px-3 font-semibold text-white">
                        {formatRupiah(item.total_bayar)}
                      </td>

                      {/* 7. Schedule */}
                      <td className="py-3 px-3">
                        <div className="text-white text-xs">{item.tgl_main}</div>
                        <div className="text-[10px] text-[#8e8e8e]">
                          {item.jam_slots.join(', ')} ({item.durasi_jam}h)
                        </div>
                      </td>

                      {/* 8. Status Pill Sesuai Gambar Referensi */}
                      <td className="py-3 px-3">
                        {isLunas ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Lunas</span>
                          </span>
                        ) : isBatal ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-semibold">
                            <XCircle className="w-3 h-3 text-rose-400" />
                            <span>Batal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-semibold">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>DP 50%</span>
                          </span>
                        )}
                      </td>

                      {/* 9. Actions Column: Tombol Lunasi, WA, dan Three Dots (...) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 relative">
                          {/* Tombol Lunasi (Mirip tombol + Invoice pada referensi) */}
                          {!isLunas && !isBatal && (
                            <button
                              type="button"
                              onClick={() => onLunasi(item.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-emerald-600 hover:text-white border border-[#333] hover:border-emerald-500/40 text-xs font-medium text-white transition-all cursor-pointer shadow-xs active:scale-95"
                              title="Lunasi sisa pembayaran"
                            >
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Lunasi</span>
                            </button>
                          )}

                          {/* Tombol WhatsApp (Mirip tombol Ledger pada referensi) */}
                          {cleanPhone.length >= 9 && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-[#333] hover:border-white/20 text-xs font-medium text-white transition-colors cursor-pointer"
                              title="Kirim bukti sewa ke WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3 text-emerald-400" />
                              <span>WA</span>
                            </a>
                          )}

                          {/* Tombol More Three Dots (...) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveDropdownId(activeDropdownId === item.id ? null : item.id)
                              }
                              className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 border border-[#333] hover:border-white/20 flex items-center justify-center text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
                              title="Menu opsi lainnya"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu Menu Aksi Tambahan */}
                            {activeDropdownId === item.id && (
                              <div className="absolute right-0 top-8 z-30 w-40 rounded-lg bg-[#181818] border border-[#262626] shadow-xl py-1 text-xs text-left animate-in fade-in duration-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.no_hp)
                                    alert('Nomor HP disalin ke clipboard!')
                                    setActiveDropdownId(null)
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-white hover:bg-white/10 cursor-pointer block"
                                >
                                  Salin No. HP
                                </button>
                                {!isBatal && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveDropdownId(null)
                                      onBatal(item.id)
                                    }}
                                    className="w-full px-3 py-1.5 text-left text-rose-400 hover:bg-rose-500/10 cursor-pointer block"
                                  >
                                    Batalkan Booking
                                  </button>
                                )}
                              </div>
                            )}
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

        {/* 4. Pagination Footer Persis Seperti Gambar Referensi */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#262626] text-xs text-[#8e8e8e]">
          {/* Sisi Kiri: Row Per Page Selector */}
          <div className="flex items-center gap-2">
            <span>Row Per Page</span>
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
            <span>Entries</span>
          </div>

          {/* Sisi Kanan: Page Navigation (1, 2, 3...) */}
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
    </div>
  )
}
