// PERAN FILE: Tampilan kosong (Empty State) panel kanan saat pengguna belum memilih slot jam
export default function EmptyInspectorView() {
  return (
    <div className="flex flex-col justify-center items-center text-center h-full select-none font-aeonik p-6 animate-in fade-in duration-150">
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#f2d953] mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-white mb-1">Pilih Jam di Kalender</h3>
      <p className="text-xs text-[#737373] max-w-[220px]">
        Klik slot jam kosong untuk memulai reservasi lapangan.
      </p>
    </div>
  )
}
