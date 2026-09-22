// PERAN FILE: Komponen kartu statistik ringkasan finansial & transaksi kasir
import type { Booking } from '../../types/database'

interface CashierStatsProps {
  daftarBooking: Booking[]
}

export default function CashierStats({ daftarBooking }: CashierStatsProps) {
  // Hanya hitung transaksi yang tidak dibatalkan
  const activeBookings = daftarBooking.filter((b) => b.status !== 'Batal')

  // Total uang riil yang sudah diterima kasir (DP + Lunas)
  const totalUangMasuk = activeBookings.reduce((sum, b) => sum + (b.nominal_dibayar || 0), 0)

  // Total sisa pembayaran DP yang belum dilunasi (piutang usaha)
  const totalSisaPiutang = activeBookings.reduce((sum, b) => sum + (b.sisa_bayar || 0), 0)

  // Total booking lunas 100%
  const totalLunasCount = activeBookings.filter((b) => b.status === 'Lunas').length

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Total Uang Masuk */}
      <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
          Total Uang Masuk
        </span>
        <span className="text-2xl font-bold text-emerald-600 mt-1 block">
          {formatRupiah(totalUangMasuk)}
        </span>
        <span className="text-xs text-gray-400 mt-1 block">
          DP + Pembayaran Lunas
        </span>
      </div>

      {/* 2. Sisa Piutang DP */}
      <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
          Sisa Tagihan (Piutang)
        </span>
        <span className="text-2xl font-bold text-amber-600 mt-1 block">
          {formatRupiah(totalSisaPiutang)}
        </span>
        <span className="text-xs text-gray-400 mt-1 block">
          Sisa DP menunggu pelunasan
        </span>
      </div>

      {/* 3. Transaksi Aktif */}
      <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
          Aktivitas Booking
        </span>
        <span className="text-2xl font-bold text-gray-900 mt-1 block">
          {activeBookings.length} Transaksi
        </span>
        <span className="text-xs text-gray-400 mt-1 block">
          {totalLunasCount} Lunas • {activeBookings.length - totalLunasCount} DP
        </span>
      </div>
    </div>
  )
}
