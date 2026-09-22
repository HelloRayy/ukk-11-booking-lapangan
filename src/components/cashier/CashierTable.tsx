// PERAN FILE: Menampilkan tabel daftar booking kasir dengan tombol cetak dan refresh
import type { Booking } from '../../types/database'
import CashierTableRow from './CashierTableRow'

interface Props {
  daftarBooking: Booking[]
  loading: boolean
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onRefresh: () => void
}

export default function CashierTable({
  daftarBooking,
  loading,
  onLunasi,
  onBatal,
  onRefresh,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Header Kasir & Tombol Aksi */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Menu Kasir & Laporan Booking</h2>
          <p className="text-sm text-gray-500">Kelola pelunasan DP dan cetak transaksi.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="border px-3 py-1 text-sm rounded bg-gray-50 hover:bg-gray-100"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-black text-white px-3 py-1 text-sm rounded hover:bg-gray-800"
          >
            Cetak Rekap
          </button>
        </div>
      </div>

      {/* Konten Tabel */}
      {loading ? (
        <div className="p-4 border rounded text-center text-gray-500">Memuat data booking...</div>
      ) : daftarBooking.length === 0 ? (
        <div className="p-4 border rounded text-center text-gray-500">Belum ada transaksi booking.</div>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2 border-r">Nama / No HP</th>
                <th className="p-2 border-r">Lapangan</th>
                <th className="p-2 border-r">Tgl & Jam</th>
                <th className="p-2 border-r">Total</th>
                <th className="p-2 border-r">Sisa Bayar</th>
                <th className="p-2 border-r">Status</th>
                <th className="p-2">Aksi Kasir</th>
              </tr>
            </thead>
            <tbody>
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
