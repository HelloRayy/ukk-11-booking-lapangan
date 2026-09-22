// PERAN FILE: Tampilan kosong (Empty State) panel kanan saat pengguna belum memilih slot jam
export default function EmptyInspectorView() {
  return (
    <div className="flex flex-col justify-center items-center text-center h-full select-none font-aeonik p-6 animate-in fade-in duration-150">
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#f2d953] mb-3">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-white mb-1">Pilih Jam Bermain</h3>
      <p className="text-xs text-[#8e8e8e] max-w-[240px] leading-relaxed">
        Klik slot jam mulai dan jam selesai pada tabel kalender untuk menentukan jadwal sewa lapangan Anda.
      </p>
    </div>
  )
}
