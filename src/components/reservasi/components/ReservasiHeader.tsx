// PERAN FILE: Header Navigasi untuk Halaman Reservasi Blanca
interface ReservasiHeaderProps {
  onBack: () => void
}

export default function ReservasiHeader({ onBack }: ReservasiHeaderProps) {
  return (
    <header className="w-full border-b border-white/10 bg-[#161616]/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Tombol Kembali ke Landing Page */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-[#fcfcfc] transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Kembali ke Beranda</span>
        </button>

        {/* Brand Label */}
        <div className="text-center">
          <span className="font-aeonik text-lg font-bold tracking-widest text-[#fcfcfc] uppercase">
            BLANCA PADEL
          </span>
          <span className="block text-[11px] text-[#8e8e8e] tracking-wider uppercase">
            Booking & Reservation System
          </span>
        </div>

        {/* Route Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2d953]/10 border border-[#f2d953]/30 text-[#f2d953] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#f2d953] animate-pulse" />
          <span>/reservasi</span>
        </div>
      </div>
    </header>
  )
}
