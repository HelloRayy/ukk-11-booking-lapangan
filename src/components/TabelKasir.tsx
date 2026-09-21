// PERAN FILE: Menampilkan daftar seluruh transaksi booking untuk kasir, pelunasan sisa DP, & cetak laporan
import type { Booking } from '../types/database'

interface Props {
  daftarBooking: Booking[]
  loading: boolean
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onRefresh: () => void
}

export default function TabelKasir({
  daftarBooking,
  loading,
  onLunasi,
  onBatal,
  onRefresh,
}: Props) {
  // helper format rupiah simpel
  const formatRupiah = (nominal: number) => `Rp ${nominal.toLocaleString('id-ID')}`

  return (
    <div className="space-y-4">
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
              {daftarBooking.map((item) => {
                const sisa = item.sisa_bayar || 0
                const isBatal = item.status === 'Batal'
                const isLunas = item.status === 'Lunas'

                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 border-r">
                      <div className="font-bold">{item.nama_penyewa}</div>
                      <div className="text-xs text-gray-500">{item.no_hp}</div>
                    </td>
                    <td className="p-2 border-r">
                      {item.lapangan?.nama_lapangan || `Court ${item.lapangan_id}`}
                    </td>
                    <td className="p-2 border-r">
                      <div>{item.tgl_main}</div>
                      <div className="text-xs text-gray-600 font-mono">
                        {item.jam_slots.join(', ')} ({item.durasi_jam} jam)
                      </div>
                    </td>
                    <td className="p-2 border-r font-mono">
                      {formatRupiah(item.total_bayar)}
                      <div className="text-xs text-gray-500">Tipe: {item.tipe_bayar}</div>
                    </td>
                    <td className="p-2 border-r font-mono font-bold text-red-600">
                      {sisa > 0 ? formatRupiah(sisa) : '-'}
                    </td>
                    <td className="p-2 border-r">
                      <span
                        className={`px-2 py-0.5 text-xs rounded font-bold ${
                          isLunas
                            ? 'bg-green-100 text-green-800'
                            : isBatal
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2 space-x-1">
                      {/* Tombol Pelunasan: hanya muncul jika belum lunas dan bukan batal */}
                      {!isLunas && !isBatal && (
                        <button
                          type="button"
                          onClick={() => onLunasi(item.id)}
                          className="bg-green-600 text-white px-2 py-1 text-xs rounded hover:bg-green-700 font-bold"
                        >
                          Lunasi
                        </button>
                      )}

                      {/* Tombol Batalkan: untuk jadwal batal */}
                      {!isBatal && (
                        <button
                          type="button"
                          onClick={() => onBatal(item.id)}
                          className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 text-xs rounded hover:bg-red-100"
                        >
                          Batal
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
