// PERAN FILE: Menampilkan satu baris data transaksi di tabel kasir beserta tombol aksinya
import type { Booking } from '../../types/database'
import StatusBadge from './StatusBadge'

interface Props {
  booking: Booking
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
}

export default function CashierTableRow({ booking, onLunasi, onBatal }: Props) {
  const formatRupiah = (nominal: number) => `Rp ${nominal.toLocaleString('id-ID')}`
  const sisa = booking.sisa_bayar || 0
  const isLunas = booking.status === 'Lunas'
  const isBatal = booking.status === 'Batal'

  // Normalisasi no WhatsApp ke format internasional (62xxxx)
  const cleanPhone = booking.no_hp.replace(/[^0-9]/g, '')
  const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
  const courtName = booking.lapangan?.nama_lapangan || `Court ${booking.lapangan_id}`
  const waMessage = encodeURIComponent(
    `Halo Kak ${booking.nama_penyewa}, konfirmasi booking ${courtName} di Blanca Badminton Arena:\nTanggal: ${booking.tgl_main}\nJam: ${booking.jam_slots.join(', ')}\nTotal: ${formatRupiah(booking.total_bayar)}\nStatus: ${booking.status} (${booking.tipe_bayar})\nSisa Bayar: ${sisa > 0 ? formatRupiah(sisa) : 'Lunas'}.\nTerima kasih!`
  )
  const waUrl = `https://wa.me/${intlPhone}?text=${waMessage}`

  return (
    <tr className="hover:bg-gray-50/80 transition-colors">
      {/* 1. Invoice & Pemesan */}
      <td className="p-3 border-r border-gray-200">
        <span className="text-[10px] font-bold text-blue-600 block">INV-{booking.id}</span>
        <div className="font-bold text-gray-900">{booking.nama_penyewa}</div>
        <div className="text-[11px] text-gray-500">{booking.no_hp}</div>
      </td>

      {/* 2. Nama Lapangan */}
      <td className="p-3 border-r border-gray-200">
        <span className="font-semibold text-gray-800">{courtName}</span>
      </td>

      {/* 3. Tanggal & Jam Main */}
      <td className="p-3 border-r border-gray-200">
        <div className="font-medium text-gray-800">{booking.tgl_main}</div>
        <div className="text-[11px] text-gray-500">
          {booking.jam_slots.join(', ')} ({booking.durasi_jam} jam)
        </div>
      </td>

      {/* 4. Total Bayar & Tipe Bayar */}
      <td className="p-3 border-r border-gray-200">
        <span className="font-bold text-gray-900 block">{formatRupiah(booking.total_bayar)}</span>
        <span className="text-[10px] font-medium text-gray-500">
          Dibayar: {formatRupiah(booking.nominal_dibayar)} ({booking.tipe_bayar})
        </span>
      </td>

      {/* 5. Sisa Bayar */}
      <td className="p-3 border-r border-gray-200 font-bold">
        {sisa > 0 ? (
          <span className="text-red-600">{formatRupiah(sisa)}</span>
        ) : (
          <span className="text-gray-400 font-normal">-</span>
        )}
      </td>

      {/* 6. Label Status */}
      <td className="p-3 border-r border-gray-200">
        <StatusBadge status={booking.status} />
      </td>

      {/* 7. Tombol Aksi Kasir */}
      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
        {/* Tombol WhatsApp */}
        {cleanPhone.length >= 10 && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-semibold cursor-pointer"
            title="Kirim bukti booking ke WhatsApp"
          >
            WA
          </a>
        )}

        {/* Tombol Lunasi */}
        {!isLunas && !isBatal && (
          <button
            type="button"
            onClick={() => onLunasi(booking.id)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors shadow-xs"
          >
            Lunasi
          </button>
        )}

        {/* Tombol Batalkan */}
        {!isBatal && (
          <button
            type="button"
            onClick={() => onBatal(booking.id)}
            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-[11px] font-semibold cursor-pointer transition-colors"
          >
            Batal
          </button>
        )}
      </td>
    </tr>
  )
}
