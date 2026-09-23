// PERAN FILE: Komponen Tabel Murni Menampilkan Daftar Transaksi Booking Kasir
import type { Booking } from '../../types/database'
import CashierTableRow from './CashierTableRow'

interface CashierTableProps {
  daftarBooking: Booking[]
  loading: boolean
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
}

export default function CashierTable({
  daftarBooking,
  loading,
  onLunasi,
  onBatal,
}: CashierTableProps) {
  if (loading) {
    return (
      <div className="p-8 border border-gray-200 rounded-xl text-center text-gray-500 text-xs bg-white">
        Memuat data transaksi dari Supabase...
      </div>
    )
  }

  if (daftarBooking.length === 0) {
    return (
      <div className="p-8 border border-gray-200 rounded-xl text-center text-gray-500 text-xs bg-white">
        Tidak ada data transaksi yang sesuai dengan filter atau kata kunci pencarian.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-xs bg-white">
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
  )
}
