// PERAN FILE: Tabel Transaksi Kasir Enterprise Multi-Kolom (Layout Sesuai Referensi Gambar)
import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Copy,
  ExternalLink,
  ShieldAlert,
  MessageCircle,
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

type SortField = 'nama_penyewa' | 'no_hp' | 'lapangan' | 'tgl_main' | 'total_bayar' | 'status'
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
  // 1. State Right Detail Panel Sheet
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // 2. State Checkbox Massal (Selection)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // 3. State Sorting Kolom
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // 4. State Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // 5. State Dropdown Tiga Titik (... menu)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null)

  // Helper Format Rupiah
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  // Helper Sortir Data
  const sortedBookings = useMemo(() => {
    if (!sortField) return bookings

    return [...bookings].sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      if (sortField === 'nama_penyewa') {
        aVal = a.nama_penyewa.toLowerCase()
        bVal = b.nama_penyewa.toLowerCase()
      } else if (sortField === 'no_hp') {
        aVal = a.no_hp || ''
        bVal = b.no_hp || ''
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

  // Data Terpotong Pagination
  const totalPages = Math.max(1, Math.ceil(sortedBookings.length / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedBookings = sortedBookings.slice(startIndex, startIndex + rowsPerPage)

  // Handler Ganti Sortir
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

  // Checkbox: Toggle Satu Baris
  const handleToggleSelectRow = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Checkbox: Toggle Pilih Semua di Halaman Aktif
  const isAllPageSelected =
    paginatedBookings.length > 0 &&
    paginatedBookings.every((item) => selectedIds.includes(item.id))

  const handleToggleSelectAllPage = () => {
    if (isAllPageSelected) {
      const pageIds = paginatedBookings.map((b) => b.id)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      const pageIds = paginatedBookings.map((b) => b.id)
      const combined = Array.from(new Set([...selectedIds, ...pageIds]))
      setSelectedIds(combined)
    }
  }

  // Salin Nomor HP
  const handleCopyPhone = (phone: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    navigator.clipboard.writeText(phone)
    setCopiedPhone(phone)
    setTimeout(() => setCopiedPhone(null), 2000)
  }

  // Buka WhatsApp
  const handleOpenWhatsApp = (phone: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const cleanPhone = phone.replace(/\D/g, '')
    const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
    const text = encodeURIComponent(`Halo Kak ${name}, kami dari pengelola Gelora Arena terkait booking lapangan Anda.`)
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank')
  }

  // Salin Semua Nomor HP yang Dipilih
  const handleCopySelectedPhones = () => {
    const phones = bookings
      .filter((b) => selectedIds.includes(b.id))
      .map((b) => `${b.nama_penyewa}: ${b.no_hp}`)
      .join('\n')
    navigator.clipboard.writeText(phones)
    alert(`Berhasil menyalin ${selectedIds.length} kontak terpilih ke clipboard!`)
  }

  // Helper Warna Avatar
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
    <div className="space-y-4 animate-fadeIn p-6 select-none relative">
      {/* Overlay penutup dropdown jika aktif */}
      {activeMenuId !== null && (
        <div
          role="presentation"
          onClick={() => setActiveMenuId(null)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      {/* 1. Header & Tombol Aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Tabel Transaksi</h1>
          <p className="text-xs text-[#8e8e8e] mt-0.5">
            Kelola jadwal, pelunasan tagihan, dan kontak pelanggan dalam tampilan data terstruktur.
          </p>
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
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
            placeholder="Cari nama, invoice, atau no HP..."
            className="w-full h-8.5 pl-8 pr-3 rounded-lg bg-white/5 border border-[#262626] text-xs text-white placeholder:text-[#737373] focus:outline-none focus:border-white/20 transition-colors"
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
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
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

      {/* 3. Bar Aksi Massal (Muncul jika ada baris dicentang) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{selectedIds.length} booking dipilih</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySelectedPhones}
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Copy className="w-3 h-3" />
              <span>Salin Kontak</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition cursor-pointer"
            >
              Batal Pilih
            </button>
          </div>
        </div>
      )}

      {/* 4. Enterprise Data Table (Layout Persis Gambar Referensi) */}
      <div className="rounded-xl border border-[#262626] bg-[#141414] shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#262626] bg-[#181818] text-[#8e8e8e] text-[11px] font-semibold">
                {/* Kolom 1: Checkbox */}
                <th className="py-3.5 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={handleToggleSelectAllPage}
                    className="w-4 h-4 rounded bg-[#262626] border-[#404040] text-emerald-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                    title="Pilih semua baris pada halaman ini"
                  />
                </th>

                {/* Kolom 2: Customer (Penyewa) */}
                <th
                  onClick={() => handleSort('nama_penyewa')}
                  className="py-3.5 px-4 font-semibold text-white/90 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Customer</span>
                    {sortField === 'nama_penyewa' ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-[#737373]" />
                    )}
                  </div>
                </th>

                {/* Kolom 3: Phone */}
                <th
                  onClick={() => handleSort('no_hp')}
                  className="py-3.5 px-4 font-semibold text-white/90 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Phone</span>
                    {sortField === 'no_hp' ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-[#737373]" />
                    )}
                  </div>
                </th>

                {/* Kolom 4: Lapangan */}
                <th
                  onClick={() => handleSort('lapangan')}
                  className="py-3.5 px-4 font-semibold text-white/90 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Lapangan</span>
                    {sortField === 'lapangan' ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-[#737373]" />
                    )}
                  </div>
                </th>

                {/* Kolom 5: Jadwal & Jam */}
                <th
                  onClick={() => handleSort('tgl_main')}
                  className="py-3.5 px-4 font-semibold text-white/90 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Jadwal Main</span>
                    {sortField === 'tgl_main' ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-[#737373]" />
                    )}
                  </div>
                </th>

                {/* Kolom 6: Balance / Tagihan */}
                <th
                  onClick={() => handleSort('total_bayar')}
                  className="py-3.5 px-4 font-semibold text-white/90 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Balance</span>
                    {sortField === 'total_bayar' ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-[#737373]" />
                    )}
                  </div>
                </th>

                {/* Kolom 7: Status */}
                <th
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-4 font-semibold text-white/90 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    {sortField === 'status' ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-emerald-400" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-[#737373]" />
                    )}
                  </div>
                </th>

                {/* Kolom 8: Aksi */}
                <th className="py-3.5 px-4 text-right font-semibold text-white/90 w-36">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]/50">
              {loading && bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#8e8e8e]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                      <span>Memuat data transaksi...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#8e8e8e]">
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((item) => {
                  const isLunas = item.status === 'Lunas'
                  const isBatal = item.status === 'Batal'
                  const isSelected = selectedIds.includes(item.id)
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
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                        isSelected ? 'bg-white/[0.04]' : ''
                      }`}
                    >
                      {/* 1. Checkbox */}
                      <td
                        onClick={(e) => handleToggleSelectRow(item.id, e)}
                        className="py-3.5 px-3.5 text-center"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded bg-[#262626] border-[#404040] text-emerald-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                        />
                      </td>

                      {/* 2. Customer: Avatar + Nama + Subtitle INV */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-bold shrink-0 ${getAvatarBg(
                              item.nama_penyewa
                            )}`}
                          >
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-xs group-hover:text-emerald-400 transition-colors">
                              {item.nama_penyewa}
                            </span>
                            <span className="text-[10px] text-[#737373] font-mono block mt-0.5">
                              INV-{String(item.id).padStart(4, '0')}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Phone */}
                      <td className="py-3.5 px-4 text-xs font-mono text-[#a3a3a3]">
                        <div className="flex items-center gap-1.5">
                          <span>{item.no_hp || '-'}</span>
                          {item.no_hp && (
                            <button
                              type="button"
                              onClick={(e) => handleCopyPhone(item.no_hp, e)}
                              className="text-[#737373] hover:text-white transition p-0.5 rounded cursor-pointer"
                              title="Salin nomor"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        {copiedPhone === item.no_hp && (
                          <span className="text-[10px] text-emerald-400 block">Tersalin!</span>
                        )}
                      </td>

                      {/* 4. Lapangan Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-white font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{courtName}</span>
                        </span>
                      </td>

                      {/* 5. Jadwal & Jam */}
                      <td className="py-3.5 px-4 text-xs text-[#d4d4d4]">
                        <div className="flex flex-col">
                          <span className="font-medium text-white text-[11px]">
                            {item.tgl_main}
                          </span>
                          <span className="text-[10px] text-[#8e8e8e]">
                            {item.jam_slots.join(', ')} ({item.jam_slots.length} Jam)
                          </span>
                        </div>
                      </td>

                      {/* 6. Tagihan (Balance) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white text-xs">
                            {formatRupiah(item.total_bayar)}
                          </span>
                          {!isLunas && !isBatal && sisa > 0 && (
                            <span className="text-[10px] text-amber-400 font-medium">
                              Sisa {formatRupiah(sisa)}
                            </span>
                          )}
                          {isLunas && (
                            <span className="text-[10px] text-emerald-400 font-medium">
                              Lunas
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 7. Status Pill */}
                      <td className="py-3.5 px-4">
                        {isLunas ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Lunas</span>
                          </span>
                        ) : isBatal ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-medium">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Batal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-medium">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>DP 50%</span>
                          </span>
                        )}
                      </td>

                      {/* 8. Tombol Aksi + Three Dots Dropdown */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 relative">
                          {/* Tombol Cepat: Lunasi (Jika DP) atau Detail */}
                          {!isLunas && !isBatal ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onLunasi(item.id)
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                              title="Lunasi sisa pembayaran"
                            >
                              <Check className="w-3 h-3" />
                              <span>Lunasi</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedBooking(item)
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#333] hover:border-[#555] bg-white/5 hover:bg-white/10 text-white text-[11px] font-medium transition-all cursor-pointer"
                            >
                              <span>Detail</span>
                            </button>
                          )}

                          {/* Tombol Three Dots (...) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveMenuId(activeMenuId === item.id ? null : item.id)
                              }}
                              className="w-7 h-7 rounded-md border border-[#333] bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
                              title="Menu opsi lainnya"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>

                            {/* Dropdown Menu Tiga Titik */}
                            {activeMenuId === item.id && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1.5 w-48 rounded-lg border border-[#262626] bg-[#1a1a1a] shadow-xl p-1.5 z-30 text-xs text-white animate-fadeIn"
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
                                  <span>Buka Panel Detail</span>
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
                                      className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-white/10 transition flex items-center gap-2 cursor-pointer"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Salin Nomor HP</span>
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
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Footer Pagination (Sesuai Referensi Gambar) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#262626] bg-[#161616] text-xs text-[#8e8e8e]">
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
                <option value={50} className="bg-[#181818]">50</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#8e8e8e] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span>Entries (Total {sortedBookings.length} data)</span>
          </div>

          {/* Sisi Kanan: Page Navigation (Numbered Buttons ala Referensi) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-md border border-[#333] bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer transition-colors"
              title="Halaman sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1
              if (
                totalPages > 7 &&
                pageNum !== 1 &&
                pageNum !== totalPages &&
                Math.abs(pageNum - currentPage) > 2
              ) {
                if (Math.abs(pageNum - currentPage) === 3) {
                  return (
                    <span key={pageNum} className="w-5 text-center text-[#737373]">
                      ...
                    </span>
                  )
                }
                return null
              }

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
              className="w-7 h-7 rounded-md border border-[#333] bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer transition-colors"
              title="Halaman berikutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. Right Detail Panel Sheet saat baris diklik */}
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
