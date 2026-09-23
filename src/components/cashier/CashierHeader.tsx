// PERAN FILE: Komponen Header Navigasi & Tombol Aksi Utama Halaman Kasir
interface CashierHeaderProps {
  onOpenManualModal: () => void
  onOpenCourtModal: () => void
  onRefresh: () => void
}

export default function CashierHeader({
  onOpenManualModal,
  onOpenCourtModal,
  onRefresh,
}: CashierHeaderProps) {
  return (
    <div className="space-y-4">
      {/* 1. Bar Navigasi Cepat Penguji (no-print) */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100 no-print">
        <a
          href="/"
          className="text-gray-500 hover:text-gray-900 font-semibold flex items-center gap-1.5 transition-colors"
        >
          ← Kembali ke Beranda Blanca
        </a>
        <a
          href="/reservasi"
          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
        >
          Buka Kalender Pemesan →
        </a>
      </div>

      {/* 2. Judul Portal & Baris Tombol Aksi */}
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

        <div className="flex flex-wrap items-center gap-2 no-print">
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
    </div>
  )
}
