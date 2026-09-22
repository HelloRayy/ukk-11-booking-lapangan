// PERAN FILE: Bottom Navigation Tab Bar Khas Referensi Tablet/Desktop App
interface BottomNavTabProps {
  bookingCount: number
}

export default function BottomNavTab({ bookingCount }: BottomNavTabProps) {
  return (
    <nav className="h-14 border-t border-[#262626] bg-[#161616] px-6 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-8 text-sm">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          className="text-[#737373] hover:text-white transition-colors cursor-pointer py-1 font-medium"
        >
          Dashboard
        </button>

        {/* Tab 2: Calendar (Active with Blue Underline) */}
        <div className="relative py-4 text-white font-medium flex items-center gap-2 cursor-pointer">
          <span>Calendar</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0091ff]" />
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0091ff]" />
        </div>

        {/* Tab 3: Register / Kasir */}
        <button
          type="button"
          onClick={() => window.location.href = '/'}
          className="text-[#737373] hover:text-white transition-colors cursor-pointer py-1 font-medium"
        >
          Kasir UKK
        </button>

        {/* Tab 4: Messages / Notifikasi Booking */}
        <div className="flex items-center gap-1.5 text-[#737373] hover:text-white transition-colors cursor-pointer py-1 font-medium">
          <span>Bookings</span>
          <span className="px-1.5 py-0.2 rounded-full bg-[#0091ff] text-white text-[10px] font-bold font-mono">
            {bookingCount}
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs text-[#525252] font-mono">
        <span>MODE MOCK FE</span>
        <span>•</span>
        <span>NO BACKEND REQUIRED</span>
      </div>
    </nav>
  )
}
