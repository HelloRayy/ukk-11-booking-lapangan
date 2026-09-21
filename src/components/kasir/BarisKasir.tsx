// PERAN FILE: Menampilkan satu baris data transaksi di tabel kasir beserta tombol aksinya
import type { Booking } from '../../types/database'
import BadgeStatus from './BadgeStatus'

interface Props {
  booking: Booking
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
}

export default function BarisKasir({ booking, onLunasi, onBatal }: Props) {
  const formatRupiah = (nominal: number) => `Rp ${nominal.toLocaleString('id-ID')}`
  const sisa = booking.sisa_bayar || 0
  const isLunas = booking.status === 'Lunas'
  const isBatal = booking.status === 'Batal'

  return (
    <tr className="border-b hover:bg-gray-50">
      {/* 1. Nama & No HP */}
      <td className="p-2 border-r">
        <div className="font-bold">{booking.nama_penyewa}</div>
        <div className="text-xs text-gray-500">{booking.no_hp}</div>
      </td>

      {/* 2. Nama Lapangan */}
      <td className="p-2 border-r">
        {booking.lapangan?.nama_lapangan || `Court ${booking.lapangan_id}`}
      </td>

      {/* 3. Tanggal & Jam Main */}
      <td className="p-2 border-r">
        <div>{booking.tgl_main}</div>
        <div className="text-xs text-gray-600 font-mono">
          {booking.jam_slots.join(', ')} ({booking.durasi_jam} jam)
        </div>
      </td>

      {/* 4. Total Bayar & Tipe Bayar */}
      <td className="p-2 border-r font-mono">
        {formatRupiah(booking.total_bayar)}
        <div className="text-xs text-gray-500">Tipe: {booking.tipe_bayar}</div>
      </td>

      {/* 5. Sisa Bayar (Merah jika masih ada sisa) */}
      <td className="p-2 border-r font-mono font-bold text-red-600">
        {sisa > 0 ? formatRupiah(sisa) : '-'}
      </td>

      {/* 6. Label Status */}
      <td className="p-2 border-r">
        <BadgeStatus status={booking.status} />
      </td>

      {/* 7. Tombol Aksi Kasir */}
      <td className="p-2 space-x-1">
        {!isLunas && !isBatal && (
          <button
            type="button"
            onClick={() => onLunasi(booking.id)}
            className="bg-green-600 text-white px-2 py-1 text-xs rounded hover:bg-green-700 font-bold"
          >
            Lunasi
          </button>
        )}

        {!isBatal && (
          <button
            type="button"
            onClick={() => onBatal(booking.id)}
            className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 text-xs rounded hover:bg-red-100"
          >
            Batal
          </button>
        )}
      </td>
    </tr>
  )
}
