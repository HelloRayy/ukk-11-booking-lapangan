import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { formatDisplayDate, getTodayISODate } from '../utils/formatters'

interface ReservationNavbarProps {
  customerName?: string
  selectedDate?: string
  onDateChange?: (date: string) => void
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function ReservationNavbar({ customerName, selectedDate, onDateChange }: ReservationNavbarProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Parse tanggal saat ini untuk navigasi kalender
  const initialDate = useMemo(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-').map(Number)
      if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2])
    }
    return new Date()
  }, [selectedDate])

  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  // Sinkronisasi viewYear/viewMonth jika selectedDate berganti dari luar
  useEffect(() => {
    setViewYear(initialDate.getFullYear())
    setViewMonth(initialDate.getMonth())
  }, [initialDate])

  // Click outside listener dan escape key untuk menutup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleBack = () => {
    window.location.href = '/'
  }

  const displayDate = selectedDate ? formatDisplayDate(selectedDate) : 'Pilih Tanggal'

  // Navigasi bulan
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  // Kalkulasi hari dalam bulan
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()

  const todayStr = getTodayISODate()
  const todayDateObj = new Date()
  todayDateObj.setHours(0, 0, 0, 0)

  // Helper set tanggal cepat
  const handleQuickSelect = (offsetDays: number) => {
    const target = new Date()
    target.setDate(target.getDate() + offsetDays)
    const y = target.getFullYear()
    const m = String(target.getMonth() + 1).padStart(2, '0')
    const d = String(target.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`

    setViewYear(target.getFullYear())
    setViewMonth(target.getMonth())
    onDateChange?.(dateStr)
    setIsCalendarOpen(false)
  }

  const handleSelectDay = (dayNum: number) => {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(dayNum).padStart(2, '0')
    const dateStr = `${viewYear}-${m}-${d}`
    onDateChange?.(dateStr)
    setIsCalendarOpen(false)
  }

  return (
    <header className="h-16 border-b border-[#262626] bg-[#161616] px-3 sm:px-6 flex items-center justify-between shrink-0 select-none z-40 relative">
      {/* Kiri: Tombol Kembali & Tanggal Aktif */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-white/5 hover:bg-white/10 text-xs text-[#a3a3a3] hover:text-white transition-colors cursor-pointer border border-white/10 shrink-0"
          aria-label="Kembali ke beranda"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Beranda</span>
        </button>

        {/* Date Selector: Teks Tanggal Bersih dengan Trigger Full Label + Icon */}
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className={`flex items-center gap-2 font-aeonik font-medium text-base sm:text-xl cursor-pointer transition-all duration-150 px-2.5 py-1.5 -mx-2.5 rounded-lg group ${
              isCalendarOpen
                ? 'text-[#f2d953] bg-white/[0.04]'
                : 'text-white hover:text-[#f2d953] hover:bg-white/[0.02]'
            }`}
            aria-label="Buka kalender tanggal reservasi"
            aria-expanded={isCalendarOpen}
          >
            <span className="truncate">{displayDate}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                isCalendarOpen ? 'rotate-180 text-[#f2d953]' : 'text-[#a3a3a3] group-hover:text-[#f2d953]'
              }`}
            />
          </button>

          {/* Dropdown Popover Kalender */}
          {isCalendarOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-[#181818] border border-[#2e2e2e] rounded-xl shadow-2xl p-3.5 z-50 animate-fadeIn">
              {/* Header Bulan & Navigasi */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#282828]">
                <div className="text-sm font-bold text-white">
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 rounded-md text-[#a3a3a3] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Bulan sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 rounded-md text-[#a3a3a3] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Bulan berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Date Chips */}
              <div className="flex items-center gap-1.5 mb-3">
                <button
                  type="button"
                  onClick={() => handleQuickSelect(0)}
                  className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-medium text-white border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect(1)}
                  className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-medium text-white border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                >
                  Besok
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSelect(2)}
                  className="flex-1 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-medium text-white border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                >
                  Lusa
                </button>
              </div>

              {/* Baris Nama Hari */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                {DAY_NAMES.map((name) => (
                  <span key={name} className="text-[11px] font-medium text-[#737373]">
                    {name}
                  </span>
                ))}
              </div>

              {/* Matriks Hari dalam Bulan */}
              <div className="grid grid-cols-7 gap-1">
                {/* Spacer hari kosong sebelum tanggal 1 */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {/* Tombol Tanggal */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1
                  const m = String(viewMonth + 1).padStart(2, '0')
                  const d = String(dayNum).padStart(2, '0')
                  const cellDateStr = `${viewYear}-${m}-${d}`

                  const cellDateObj = new Date(viewYear, viewMonth, dayNum)
                  cellDateObj.setHours(0, 0, 0, 0)
                  const isPast = cellDateObj < todayDateObj
                  const isSelected = selectedDate === cellDateStr
                  const isToday = cellDateStr === todayStr

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      disabled={isPast}
                      onClick={() => handleSelectDay(dayNum)}
                      className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#f2d953] text-black font-bold shadow-md'
                          : isToday
                          ? 'border border-[#f2d953]/60 text-white font-semibold hover:bg-white/10'
                          : isPast
                          ? 'text-[#525252] cursor-not-allowed opacity-40 hover:bg-transparent'
                          : 'text-[#e5e5e5] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {dayNum}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kanan: Info Pemesan */}
      <div className="flex items-center gap-3">
        {customerName && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2d953]" />
            <span className="text-white font-medium">{customerName}</span>
          </div>
        )}
      </div>
    </header>
  )
}
