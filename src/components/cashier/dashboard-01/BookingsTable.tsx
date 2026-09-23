// PERAN FILE: Tabel Operasional Harian Kasir ala Shadcn UI (Aksi Pelunasan & Batal)
import { Search, Plus, RefreshCw, MessageSquare } from 'lucide-react'
import type { Booking } from '../../../types/database'

interface BookingsTableProps {
  bookings: Booking[]
  loading: boolean
  searchKeyword: string
  selectedStatus: string
  onSearchChange: (keyword: string) => void
  onStatusChange: (status: string) => void
  onLunasi: (id: number) => void
  onBatal: (id: number) => void
  onRefresh: () => void
  onOpenManualModal: () => void
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
  onOpenManualModal,
}: BookingsTableProps) {
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`

  return (
    <div className="space-y-6 animate-fadeIn p-6">
      {/* 1. Baris Judul & Tombol Aksi Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Operasional Kasir
          </h1>
          <p className="text-xs text-[#8e8e8e] mt-0.5">
            Tabel verifikasi pemesanan harian, pelunasan sisa DP, dan pembatalan sewa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Tombol Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-[#262626] text-xs font-semibold transition-all cursor-pointer"
            title="Muat ulang data dari Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Tombol + Booking Walk-in */}
          <button
            type="button"
            onClick={onOpenManualModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Booking Walk-in</span>
          </button>
        </div>
      </div>

      {/* 2. Bar Filter & Pencarian */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Input Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama penyewa, nomor invoice, no WA..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-[#262626] text-xs text-white placeholder:text-[#737373] focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Tab Pilihan Filter Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-lg bg-black/40 border border-[#262626]">
          {[
            { label: 'Semua', value: 'Semua' },
            { label: 'Belum Lunas (DP)', value: 'Belum Lunas' },
            { label: 'Lunas', value: 'Lunas' },
            { label: 'Batal', value: 'Batal' },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusChange(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === tab.value
                  ? 'bg-white/15 text-white font-semibold shadow-xs'
                  : 'text-[#8e8e8e] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Kontainer Tabel Modern */}
      <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#262626] bg-[#141414]/60 text-[#8e8e8e] text-[11px] font-semibold">
                <th className="py-3 px-4">Invoice & Penyewa</th>
                <th className="py-3 px-4">Lapangan & Tanggal</th>
                <th className="py-3 px-4">Jam Sewa</th>
                <th className="py-3 px-4">Total Biaya</th>
                <th className="py-3 px-4">Sisa Tagihan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Kasir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]/60">
              {loading && bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8e8e8e]">
                    Memuat data transaksi dari Supabase...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8e8e8e]">
                    Tidak ada transaksi yang cocok dengan filter atau kata kunci pencarian.
                  </td>
                </tr>
              ) : (
                bookings.map((item) => {
                  const sisa = item.sisa_bayar || 0
                  const isLunas = item.status === 'Lunas'
                  const isBatal = item.status === 'Batal'
                  const courtName = item.lapangan?.nama_lapangan || `Court ${item.lapangan_id}`

                  // Normalisasi URL WhatsApp
                  const cleanPhone = (item.no_hp || '').replace(/[^0-9]/g, '')
                  const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
                  const waText = encodeURIComponent(
                    `*KONFIRMASI RESERVASI - BLANCA ARENA*\n` +
                    `No. Invoice: INV-${item.id}\n` +
                    `Penyewa: ${item.nama_penyewa}\n` +
                    `Lapangan: ${courtName}\n` +
                    `Tanggal: ${item.tgl_main}\n` +
                    `Jam: ${item.jam_slots.join(', ')}\n` +
                    `Status: ${item.status} (${isLunas ? 'LUNAS' : `Sisa ${formatRupiah(sisa)}`})\n\n` +
                    `Terima kasih sudah memesan di Blanca Arena!`
                  )
                  const waUrl = `https://wa.me/${intlPhone}?text=${waText}`

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* 1. Invoice & Penyewa */}
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
                          INV-{item.id}
                        </span>
                        <div className="font-bold text-white text-sm mt-0.5">
                          {item.nama_penyewa}
                        </div>
                        <div className="text-[11px] text-[#8e8e8e]">{item.no_hp}</div>
                      </td>

                      {/* 2. Lapangan & Tanggal */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{courtName}</div>
                        <div className="text-[11px] text-[#8e8e8e] mt-0.5">{item.tgl_main}</div>
                      </td>

                      {/* 3. Jam Sewa */}
                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium">
                          {item.jam_slots.join(', ')}
                        </div>
                        <div className="text-[11px] text-[#737373] mt-0.5">
                          {item.durasi_jam} jam durasi
                        </div>
                      </td>

                      {/* 4. Total Biaya */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">
                          {formatRupiah(item.total_bayar)}
                        </span>
                        <span className="text-[10px] text-[#8e8e8e]">
                          Dibayar: {formatRupiah(item.nominal_dibayar)} ({item.tipe_bayar})
                        </span>
                      </td>

                      {/* 5. Sisa Tagihan (Indikator Kunci Kasir) */}
                      <td className="py-3.5 px-4">
                        {sisa > 0 ? (
                          <div>
                            <span className="font-bold text-amber-400 block text-sm">
                              {formatRupiah(sisa)}
                            </span>
                            <span className="text-[10px] text-amber-300/70">
                              Menunggu pelunasan
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#737373]">-</span>
                        )}
                      </td>

                      {/* 6. Status Text Bersih */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isLunas
                                ? 'bg-emerald-500'
                                : isBatal
                                ? 'bg-rose-500'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              isLunas
                                ? 'text-emerald-400'
                                : isBatal
                                ? 'text-rose-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>

                      {/* 7. Tombol Aksi Kasir */}
                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        {/* Tombol Kirim WhatsApp */}
                        {cleanPhone.length >= 9 && (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors"
                            title="Kirim konfirmasi ke WhatsApp penyewa"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WA</span>
                          </a>
                        )}

                        {/* Tombol Utama: Lunasi Sisa DP */}
                        {!isLunas && !isBatal && (
                          <button
                            type="button"
                            onClick={() => onLunasi(item.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95"
                          >
                            Lunasi
                          </button>
                        )}

                        {/* Tombol Batalkan */}
                        {!isBatal && (
                          <button
                            type="button"
                            onClick={() => onBatal(item.id)}
                            className="inline-flex items-center px-2 py-1.5 text-[#737373] hover:text-rose-400 text-xs font-medium cursor-pointer transition-colors"
                          >
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
    </div>
  )
}
