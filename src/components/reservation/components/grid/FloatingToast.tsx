// PERAN FILE: Notifikasi peringatan melayang (Floating Toast) untuk error bentrok jadwal / waktu lampau
interface FloatingToastProps {
  message: string | null
  onClose?: () => void
}

export default function FloatingToast({ message, onClose }: FloatingToastProps) {
  if (!message) return null

  const isInfo =
    message.includes('sudah terisi') ||
    message.includes('selesai') ||
    message.includes('perawatan')

  const badgeConfig = (() => {
    if (message.includes('selesai')) {
      return {
        label: 'Selesai',
        badgeClass: 'bg-white/10 text-[#a3a3a3] border-white/10',
        dotClass: 'bg-[#8e8e8e]',
      }
    }
    if (message.includes('sudah terisi')) {
      return {
        label: 'Terisi',
        badgeClass: 'bg-[#f2d953]/15 text-[#f2d953] border-[#f2d953]/30',
        dotClass: 'bg-[#f2d953] animate-pulse',
      }
    }
    if (message.includes('perawatan')) {
      return {
        label: 'Maintenance',
        badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        dotClass: 'bg-amber-400',
      }
    }
    return {
      label: 'Peringatan',
      badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30',
      dotClass: 'bg-red-400 animate-pulse',
    }
  })()

  return (
    <div className="sticky top-4 z-50 h-0 pointer-events-none flex justify-center font-aeonik select-none px-4">
      <div
        className={`pointer-events-auto max-w-lg inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full backdrop-blur-xl border shadow-[0_12px_36px_rgba(0,0,0,0.65)] transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-top-3 ${
          isInfo
            ? 'bg-[#181818]/92 border-white/15 text-white'
            : 'bg-[#1c1212]/95 border-red-500/30 text-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${badgeConfig.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badgeConfig.dotClass}`} />
            <span>{badgeConfig.label}</span>
          </span>
          <span className="text-xs font-medium text-[#eaeaea] tracking-tight truncate sm:whitespace-normal">
            {message}
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-5 h-5 rounded-full text-[#8e8e8e] hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors shrink-0 ml-0.5 cursor-pointer"
            aria-label="Tutup notifikasi"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
