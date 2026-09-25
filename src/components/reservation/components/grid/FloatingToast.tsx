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
        badgeClass: 'bg-white/10 text-[#a3a3a3] border-white/15',
        icon: (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-[#8e8e8e]">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      }
    }
    if (message.includes('sudah terisi')) {
      return {
        label: 'Terisi',
        badgeClass: 'bg-amber-400/10 text-amber-300 border-amber-400/25',
        icon: (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-amber-400">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ),
      }
    }
    if (message.includes('perawatan')) {
      return {
        label: 'Maintenance',
        badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        icon: (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-amber-400">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        ),
      }
    }
    return {
      label: 'Perhatian',
      badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30',
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-red-400">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    }
  })()

  return (
    <div className="sticky top-4 z-50 h-0 pointer-events-none flex items-start justify-center font-aeonik select-none px-4">
      <div
        className={`pointer-events-auto self-start max-w-max inline-flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full backdrop-blur-xl border shadow-[0_12px_36px_rgba(0,0,0,0.7)] transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-top-3 ${
          isInfo
            ? 'bg-[#181818]/95 border-white/12 text-white'
            : 'bg-[#1c1212]/95 border-red-500/30 text-white'
        }`}
      >
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium tracking-normal shrink-0 ${badgeConfig.badgeClass}`}
        >
          {badgeConfig.icon}
          <span>{badgeConfig.label}</span>
        </span>
        <span className="text-xs font-normal text-[#eaeaea] tracking-tight whitespace-nowrap">
          {message}
        </span>
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
