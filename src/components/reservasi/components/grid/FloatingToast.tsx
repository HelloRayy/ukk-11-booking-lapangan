// PERAN FILE: Notifikasi peringatan melayang (Floating Toast) untuk error bentrok jadwal / waktu lampau
interface FloatingToastProps {
  message: string | null
  onClose?: () => void
}

export default function FloatingToast({ message, onClose }: FloatingToastProps) {
  if (!message) return null

  return (
    <div className="sticky top-4 z-50 h-0 pointer-events-none flex justify-center font-aeonik select-none">
      <div className="w-full max-w-md mx-4 p-3 rounded-[10px] bg-red-500/95 text-white text-xs font-medium shadow-2xl backdrop-blur-md flex items-center justify-between pointer-events-auto border border-red-400/30 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-white">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{message}</span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-5 h-5 rounded-full hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-2 cursor-pointer shrink-0"
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
