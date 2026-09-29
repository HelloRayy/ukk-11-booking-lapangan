// ============================================================================
// MODUL KASIR: TABEL OPERASIONAL TRANSAKSI (PELUNASAN & PEMBATALAN)
// ============================================================================
// File ini dibuat ringkas agar mudah dipelajari untuk sidang UKK.
// 2 Fokus Utama:
// 1. Pencarian nama pemesan & Filter status (Booked / Lunas / Batal)
// 2. Aksi Kasir: Pelunasan sisa bayar DP & Pembatalan sewa
// ============================================================================

import { Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import type { Booking, Lapangan } from '../../../types/database'
import { formatRupiah } from '../../../utils/formatters'

export interface TableInitialFilters {
  date?: string
  status?: string
  rowsPerPage?: number
  sortField?: string
  sortOrder?: string
  onlyUpcoming?: boolean
  timestamp?: number
}

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
  onOpenManualModal?: () => void
  onNavigateToSchedule?: (date?: string, bookingId?: number | string) => void
  initialFilters?: TableInitialFilters | null
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
}: BookingsTableProps) {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 text-zinc-100">
      {/* 1. Baris Kontrol: Pencarian, Filter Status & Tombol Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Input Pencarian Nama Pemesan */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama penyewa..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter Status */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Booked">Booked (Belum Lunas)</option>
            <option value="Lunas">Lunas</option>
            <option value="Batal">Batal</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition"
        >
          <RefreshCw className="w-4 h-4" />
          Segarkan
        </button>
      </div>

      {/* 2. Tabel Data Transaksi Kasir */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400">
              <th className="py-3 px-4 w-20">Invoice</th>
              <th className="py-3 px-4">Nama Penyewa</th>
              <th className="py-3 px-4">Lapangan</th>
              <th className="py-3 px-4">Jadwal Main</th>
              <th className="py-3 px-4">Pembayaran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi Kasir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  Memuat data transaksi...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  Tidak ada transaksi yang cocok.
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const sisa = b.sisa_bayar || 0
                return (
                  <tr key={b.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3 px-4 font-mono text-zinc-400">
                      INV-{b.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-200">{b.nama_penyewa}</div>
                      <div className="text-xs text-zinc-400">{b.no_hp}</div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {b.lapangan?.nama_lapangan || `Lapangan #${b.lapangan_id}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-zinc-200 font-medium">{b.tgl_main}</div>
                      <div className="text-xs text-zinc-400">
                        {Array.isArray(b.jam_slots) ? b.jam_slots.join(', ') : b.jam_slots}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-200">
                        {formatRupiah(b.total_bayar)}
                      </div>
                      {sisa > 0 ? (
                        <div className="text-xs text-amber-400 font-medium">
                          Sisa: {formatRupiah(sisa)}
                        </div>
                      ) : (
                        <div className="text-xs text-emerald-400 font-medium">Lunas</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          b.status === 'Lunas'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                            : b.status === 'Batal'
                            ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {/* Tombol Pelunasan (jika masih berstatus Booked / sisa > 0) */}
                      {b.status === 'Booked' && (
                        <button
                          onClick={() => onLunasi(b.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
                          title="Lunasi Sisa Pembayaran"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Lunasi
                        </button>
                      )}

                      {/* Tombol Batalkan Transaksi */}
                      {b.status !== 'Batal' && (
                        <button
                          onClick={() => onBatal(b.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-rose-950 hover:text-rose-300 text-zinc-400 rounded-lg text-xs font-medium transition"
                          title="Batalkan Booking"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Batal
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
