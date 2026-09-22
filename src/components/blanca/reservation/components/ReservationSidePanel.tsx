// PERAN FILE: Pure UI Side Panel Drawer dari Kanan (Persis Mockup Gambar Blanca)
import type { CustomerInfo } from '../types'

interface ReservationSidePanelProps {
  isOpen: boolean
  onClose: () => void
  customerInfo: CustomerInfo
  onUpdateField: <K extends keyof CustomerInfo>(key: K, value: CustomerInfo[K]) => void
  isFormValid: boolean
  isSubmitted: boolean
  onSubmit: (e: React.FormEvent) => void
  onReset: () => void
}

export default function ReservationSidePanel({
  isOpen,
  onClose,
  customerInfo,
  onUpdateField,
  isFormValid,
  isSubmitted,
  onSubmit,
  onReset,
}: ReservationSidePanelProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden font-aeonik"
      role="dialog"
      aria-modal="true"
      aria-labelledby="side-panel-title"
    >
      {/* Backdrop Gelap dengan Blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[6px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Kontainer Drawer Samping Kanan (Putih Khas Mockup Blanca) */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[480px] bg-white text-[#161616] shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300 ease-out">
        {/* Top Bar Navigasi (Back, Progress Dashes, Close Button) */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between shrink-0">
          {/* Tombol Back di Kiri */}
          <button
            type="button"
            onClick={isSubmitted ? onReset : onClose}
            className="w-10 h-10 rounded-[8px] border border-neutral-200 hover:border-black hover:bg-neutral-50 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
            aria-label="Kembali"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Indikator Dashes Tengah (Khas Typeform Mockup Blanca) */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-4 h-[3px] rounded-full bg-neutral-900" />
            <span className="w-4 h-[3px] rounded-full bg-neutral-300" />
            <span className="w-4 h-[3px] rounded-full bg-neutral-300" />
          </div>

          {/* Tombol Close X di Kanan */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-[8px] border border-neutral-200 hover:border-black hover:bg-neutral-50 flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
            aria-label="Tutup panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body Area Formulir (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 flex flex-col justify-between">
          {!isSubmitted ? (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              {/* Header Teks Form */}
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                  Langkah 1 • Data Calon Penyewa
                </span>
                <h2
                  id="side-panel-title"
                  className="text-[28px] sm:text-[32px] font-normal tracking-[-0.5px] leading-tight text-[#161616]"
                >
                  Lengkapi data diri Anda
                </h2>
                <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                  Data ini digunakan pihak arena untuk konfirmasi reservasi jadwal, invoice pembayaran kasir, dan pengiriman e-tiket.
                </p>
              </div>

              {/* 3 Parameter Input Utama */}
              <div className="flex flex-col gap-4">
                {/* 1. Nama Lengkap */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nama_penyewa" className="text-xs font-medium text-neutral-700">
                    Nama Pemesan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="nama_penyewa"
                    type="text"
                    value={customerInfo.nama}
                    onChange={(e) => onUpdateField('nama', e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-3 rounded-[8px] border border-neutral-300 text-[#161616] text-sm sm:text-base placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    required
                  />
                </div>

                {/* 2. Nomor WhatsApp / HP */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="whatsapp_penyewa" className="text-xs font-medium text-neutral-700">
                    Nomor WhatsApp / HP <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="whatsapp_penyewa"
                    type="tel"
                    value={customerInfo.whatsapp}
                    onChange={(e) => onUpdateField('whatsapp', e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-4 py-3 rounded-[8px] border border-neutral-300 text-[#161616] text-sm sm:text-base placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    required
                  />
                  <span className="text-[11px] text-neutral-400">
                    Pastikan nomor terhubung dengan WhatsApp aktif.
                  </span>
                </div>

                {/* 3. Alamat Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email_penyewa" className="text-xs font-medium text-neutral-700">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email_penyewa"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => onUpdateField('email', e.target.value)}
                    placeholder="Contoh: budi@gmail.com"
                    className="w-full px-4 py-3 rounded-[8px] border border-neutral-300 text-[#161616] text-sm sm:text-base placeholder:text-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                    required
                  />
                </div>

                {/* Checkbox Konfirmasi Kebenaran Data */}
                <div className="pt-2">
                  <label
                    htmlFor="confirm_checkbox"
                    className="flex items-start gap-3 p-3.5 rounded-[8px] border border-neutral-200 hover:border-neutral-300 bg-neutral-50/60 cursor-pointer select-none transition-colors"
                  >
                    <input
                      id="confirm_checkbox"
                      type="checkbox"
                      checked={customerInfo.isConfirmed}
                      onChange={(e) => onUpdateField('isConfirmed', e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-black focus:ring-black cursor-pointer accent-black"
                    />
                    <span className="text-xs text-neutral-700 leading-snug">
                      Saya menyatakan bahwa data yang diisi sudah benar dan bersedia dihubungi oleh pihak arena untuk konfirmasi booking.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Button Bawah (Sesuai Layout Mockup Blanca) */}
              <div className="pt-4 mt-auto">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full h-[52px] rounded-[8px] flex items-center justify-between px-3 transition-all duration-200 select-none ${
                    isFormValid
                      ? 'bg-[#161616] text-white hover:bg-black active:scale-[0.99] cursor-pointer shadow-md'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  {/* Kotak Ikon Panah Kiri */}
                  <span
                    className={`w-8 h-8 rounded-[6px] flex items-center justify-center transition-colors ${
                      isFormValid ? 'bg-white/10 text-white' : 'bg-neutral-300/80 text-neutral-400'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </span>

                  {/* Teks Tombol Tengah */}
                  <span className="text-sm font-medium pr-8">
                    Lanjutkan ke Pembayaran
                  </span>

                  <span className="w-8" aria-hidden="true" />
                </button>
              </div>
            </form>
          ) : (
            /* Tampilan Review / Konfirmasi Setelah Data Diisi */
            <div className="flex flex-col gap-6 my-auto text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
                  Data Terverifikasi
                </span>
                <h3 className="text-2xl font-normal text-neutral-900">
                  Data Calon Penyewa Tersimpan
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  (Mode preview antarmuka UI - belum dikirim ke backend)
                </p>
              </div>

              <div className="p-4 rounded-[8px] bg-neutral-50 border border-neutral-200 text-left text-xs flex flex-col gap-2.5 font-mono">
                <div>
                  <span className="text-neutral-400 block text-[10px] font-sans">NAMA PEMESAN:</span>
                  <span className="text-neutral-900 font-semibold text-sm">{customerInfo.nama}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] font-sans">WHATSAPP:</span>
                  <span className="text-neutral-900 font-semibold text-sm">{customerInfo.whatsapp}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] font-sans">EMAIL:</span>
                  <span className="text-neutral-900 font-semibold text-sm">{customerInfo.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onReset}
                className="w-full h-11 rounded-[8px] border border-neutral-300 hover:bg-neutral-100 text-xs font-medium text-neutral-800 transition-all cursor-pointer"
              >
                Ubah / Isi Ulang Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
