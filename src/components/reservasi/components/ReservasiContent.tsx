// PERAN FILE: Konten Utama Kerangka /reservasi (Clean Setup Sesuai Permintaan)
import type { StoredCustomerInfo } from '../types'

interface ReservasiContentProps {
  customer: StoredCustomerInfo | null
  isLoading: boolean
}

export default function ReservasiContent({ customer, isLoading }: ReservasiContentProps) {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      {/* Kartu Status Rute */}
      <div className="p-8 rounded-[20px] bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
            Route Setup Aktif
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-aeonik font-normal tracking-tight text-[#fcfcfc] mb-3">
          Halaman Reservasi Lapangan
        </h1>
        <p className="text-base text-[#a3a3a3] font-light max-w-2xl leading-relaxed">
          Rute <code className="px-2 py-0.5 rounded bg-white/10 text-white text-sm">/reservasi</code> telah berhasil disiapkan secara modular. Sesuai instruksi, form dan opsi pembayaran belum diisi dan siap untuk tahap pengembangan berikutnya.
        </p>
      </div>

      {/* Tampilan Data Calon Penyewa yang Dikirim dari Side Panel */}
      <div className="p-8 rounded-[20px] bg-white/[0.03] border border-white/10 mb-8">
        <h2 className="text-xl font-aeonik font-medium text-[#fcfcfc] mb-4 flex items-center justify-between">
          <span>Data Calon Penyewa Terhubung</span>
          <span className="text-xs text-[#8e8e8e] font-normal">Sumber: Side Panel</span>
        </h2>

        {isLoading ? (
          <p className="text-sm text-[#8e8e8e]">Memuat data sesi...</p>
        ) : customer ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-[12px] bg-white/[0.04] border border-white/5">
              <span className="text-xs text-[#8e8e8e] block mb-1">NAMA PEMESAN</span>
              <span className="text-base text-[#fcfcfc] font-medium">{customer.nama}</span>
            </div>
            <div className="p-4 rounded-[12px] bg-white/[0.04] border border-white/5">
              <span className="text-xs text-[#8e8e8e] block mb-1">WHATSAPP</span>
              <span className="text-base text-[#fcfcfc] font-medium">{customer.whatsapp}</span>
            </div>
            <div className="p-4 rounded-[12px] bg-white/[0.04] border border-white/5">
              <span className="text-xs text-[#8e8e8e] block mb-1">EMAIL</span>
              <span className="text-base text-[#fcfcfc] font-medium truncate block">{customer.email}</span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-[12px] bg-white/[0.02] border border-dashed border-white/15 text-[#8e8e8e] text-sm">
            Belum ada data calon penyewa dari side panel. Buka beranda dan isi formulir side panel terlebih dahulu, atau akses langsung untuk pengujian rute.
          </div>
        )}
      </div>

      {/* Roadmap Tahapan Alur Reservasi (Indikator Status) */}
      <div className="p-8 rounded-[20px] bg-white/[0.03] border border-white/10">
        <h3 className="text-sm font-semibold tracking-wider uppercase text-[#8e8e8e] mb-6">
          Tahapan Alur Reservasi
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-center gap-4 p-4 rounded-[12px] bg-white/5 border border-white/10">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0">
              1
            </span>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-[#fcfcfc]">Data Calon Penyewa</h4>
              <p className="text-xs text-[#8e8e8e]">Input nama, nomor WhatsApp, dan email via side panel</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-medium">
              Selesai
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-4 p-4 rounded-[12px] bg-white/[0.02] border border-white/5 opacity-60">
            <span className="w-8 h-8 rounded-full bg-white/10 text-[#8e8e8e] flex items-center justify-center text-sm font-bold shrink-0">
              2
            </span>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-[#fcfcfc]">Pilihan Lapangan & Jadwal</h4>
              <p className="text-xs text-[#8e8e8e]">Pilihan lapangan futsal/badminton & grid slot jam</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-white/10 text-[#8e8e8e]">
              Menunggu Setup
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-4 p-4 rounded-[12px] bg-white/[0.02] border border-white/5 opacity-60">
            <span className="w-8 h-8 rounded-full bg-white/10 text-[#8e8e8e] flex items-center justify-center text-sm font-bold shrink-0">
              3
            </span>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-[#fcfcfc]">Opsi Pembayaran</h4>
              <p className="text-xs text-[#8e8e8e]">Bayar DP 50% atau Bayar Lunas</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-white/10 text-[#8e8e8e]">
              Menunggu Setup
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
