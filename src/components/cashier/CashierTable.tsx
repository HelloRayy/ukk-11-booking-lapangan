// PERAN FILE: Menampilkan tabel daftar booking kasir dengan search bar, filter status, dan tombol aksi
import type { Booking } from '../../types/database'
import CashierTableRow from './CashierTableRow'
import CashierStats from './CashierStats'

interface Props {
  daftarBooking: Booking[]
  totalSemuaBooking: Booking[]
  loading: boolean
  searchKeyword: string
  selectedStatus: string
  onSearchChange: (keyword: string) => void
  onStatusChange: (status: string) => void
  onOpenManualModal: () => void
  onOpenCourtModal: () => void
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onRefresh: () => void
}

const STATUS_FILTERS = ['Semua', 'Belum Lunas', 'Lunas', 'Batal']

export default function CashierTable({
  daftarBooking,
  totalSemuaBooking,
  loading,
  searchKeyword,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  onOpenManualModal,
  onOpenCourtModal,
  onLunasi,
  onBatal,
  onRefresh,
}: Props) {
  return (
    <div className="space-y-6">
      {/* 1. Header Kasir & Tombol Navigasi / Aksi Utama */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Portal Kasir & Pengelola Lapangan</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Internal Admin
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola transaksi walk-in, pelunasan sisa DP, pembatalan, dan master data lapangan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Aksi Tambah Booking Manual */}
          <button
            type="button"
            onClick={onOpenManualModal}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            + Booking Manual (Walk-in)
          </button>

          {/* Tombol Aksi Kelola Lapangan */}
          <button
            type="button"
            onClick={onOpenCourtModal}
            className="px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            Kelola Lapangan
          </button>

          {/* Tombol Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            title="Muat ulang data dari database"
          >
            Refresh
          </button>

          {/* Tombol Cetak Rekap */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            Cetak Rekap
          </button>
        </div>
      </div>

      {/* 2. Kartu Statistik Finansial Kasir */}
      <CashierStats daftarBooking={totalSemuaBooking} />

      {/* 3. Baris Kontrol: Search Bar (Poin 13) & Filter Status */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Search Bar Live (Poin 13 Kisi-kisi) */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Cari nama penyewa, nomor HP, atau invoice..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-blue-500 shadow-xs"
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Tab Filter Status */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(st)}
              className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                selectedStatus === st
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tabel Daftar Booking */}
      {loading ? (
        <div className="p-8 border border-gray-200 rounded-xl text-center text-gray-500 text-xs">
          Memuat data transaksi...
        </div>
      ) : daftarBooking.length === 0 ? (
        <div className="p-8 border border-gray-200 rounded-xl text-center text-gray-500 text-xs">
          Tidak ada data transaksi yang sesuai dengan filter atau kata kunci.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="p-3 border-r border-gray-200">Invoice / Pemesan</th>
                <th className="p-3 border-r border-gray-200">Lapangan</th>
                <th className="p-3 border-r border-gray-200">Jadwal Main</th>
                <th className="p-3 border-r border-gray-200">Total Tagihan</th>
                <th className="p-3 border-r border-gray-200">Sisa Bayar</th>
                <th className="p-3 border-r border-gray-200">Status</th>
                <th className="p-3 text-right">Aksi Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {daftarBooking.map((item) => (
                <CashierTableRow
                  key={item.id}
                  booking={item}
                  onLunasi={onLunasi}
                  onBatal={onBatal}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
