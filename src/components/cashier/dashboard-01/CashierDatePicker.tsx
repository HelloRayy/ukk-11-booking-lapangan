// PERAN FILE: Komponen Popover Kalender Tanggal Interaktif Toolbar Kasir (1:1 UI Reservasi)
import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { formatDisplayDate, getTodayISODate } from '../../../reservation/utils/formatters'

interface CashierDatePickerProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function CashierDatePicker({
  selectedDate,
  onDateChange,
}: CashierDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const initialDate = useMemo(() => {
    if (selectedDate) {
      const parts = selectedDate.split('-').map(Number)
      if (parts.length === 3) return new Date(parts[0], parts[1] - 1, parts[2])
    }
    return new Date()
  }, [selectedDate])

  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  useEffect(() => {
    setViewYear(initialDate.getFullYear())
    setViewMonth(initialDate.getMonth())
  }, [initialDate])

  // Click outside & Escape key listeners
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const displayDate = selectedDate ? formatDisplayDate(selectedDate) : 'Pilih Tanggal'

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

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()

  const todayStr = getTodayISODate()

  const handleSelectDay = (dayNum: number) => {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(dayNum).padStart(2, '0')
    const dateStr = `${viewYear}-${m}-${d}`
    onDateChange(dateStr)
    setIsOpen(false)
  }

  return (
    <div className="relative font-aeonik" ref={containerRef}>
      {/* Trigger Button: Teks Tanggal Bersih dengan Icon Kalender & Chevron */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-150 px-3 h-8 rounded-lg border bg-[#141414] group select-none ${
          isOpen
            ? 'text-[#f2d953] border-[#f2d953]/60 bg-[#1a1914]'
            : 'text-white border-[#262626] hover:text-[#f2d953] hover:border-[#383838]'
        }`}
        aria-label="Buka kalender tanggal reservasi"
        aria-expanded={isOpen}
      >
        <Calendar className="w-3.5 h-3.5 text-[#a3a3a3] group-hover:text-[#f2d953] transition-colors shrink-0" />
        <span className="truncate max-w-[190px] sm:max-w-none">{displayDate}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-[#f2d953]' : 'text-[#a3a3a3] group-hover:text-[#f2d953]'
          }`}
        />
      </button>

      {/* Popover Kalender Visual (1:1 dengan Reservasi) */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-[#181818] border border-[#2e2e2e] rounded-xl shadow-2xl p-3.5 z-50 animate-fadeIn select-none">
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

              const isSelected = selectedDate === cellDateStr
              const isToday = cellDateStr === todayStr

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#f2d953] text-[#161616] font-bold shadow-md'
                      : isToday
                      ? 'border border-[#f2d953]/60 text-white font-semibold hover:bg-white/10'
                      : 'text-[#e5e5e5] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {dayNum}
                </button>
              )
            })}
          </div>

          {/* Shortcut Hari Ini */}
          <div className="pt-2.5 mt-2.5 border-t border-[#262626] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onDateChange(todayStr)
                setIsOpen(false)
              }}
              className="text-[11px] font-medium text-[#f2d953] hover:underline cursor-pointer"
            >
              Lompat ke Hari Ini
            </button>
            <span className="text-[10px] text-[#737373]">
              {selectedDate}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
