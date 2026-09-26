// PERAN FILE: Komponen Popover Kalender Tanggal Interaktif Toolbar Kasir (1:1 UI Reservasi)
import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { formatDisplayDate, getTodayISODate } from '../../reservation/utils/formatters'

interface CashierDatePickerProps {
  selectedDate: string
  onDateChange: (date: string) => void
  align?: 'left' | 'right'
  allowAllDates?: boolean
  labelPrefix?: string
  compact?: boolean
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export default function CashierDatePicker({
  selectedDate,
  onDateChange,
  align = 'right',
  allowAllDates = false,
  labelPrefix,
  compact = true,
}: CashierDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const initialDate = useMemo(() => {
    if (selectedDate && selectedDate !== 'all') {
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

  const todayStr = getTodayISODate()

  const displayDate = useMemo(() => {
    if (selectedDate === 'all') return 'Semua Tanggal'
    if (!selectedDate) return 'Pilih Tanggal'
    if (compact) {
      if (selectedDate === todayStr) return 'Hari Ini'
      try {
        const d = new Date(selectedDate.includes('T') ? selectedDate : `${selectedDate}T00:00:00`)
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      } catch {
        return selectedDate
      }
    }
    return formatDisplayDate(selectedDate)
  }, [selectedDate, compact, todayStr])

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

  const handleSelectDay = (dayNum: number) => {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(dayNum).padStart(2, '0')
    const dateStr = `${viewYear}-${m}-${d}`
    onDateChange(dateStr)
    setIsOpen(false)
  }

  return (
    <div className="relative font-sans" ref={containerRef}>
      {/* Trigger Button: Teks Tanggal Bersih dengan Icon Kalender & Chevron */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all duration-150 px-2.5 h-8 rounded-lg border group select-none ${
          isOpen
            ? 'text-zinc-100 border-amber-400/80 ring-1 ring-amber-400/30 bg-zinc-900 shadow-xs'
            : selectedDate !== 'all'
            ? 'border-zinc-700/80 bg-zinc-900/80 text-zinc-100 hover:border-zinc-600'
            : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
        }`}
        aria-label="Buka kalender tanggal reservasi"
        aria-expanded={isOpen}
      >
        <Calendar className={`w-3.5 h-3.5 transition-colors shrink-0 ${isOpen ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
        <span className="truncate max-w-[210px]">
          {labelPrefix ? (
            <span>
              {labelPrefix}{' '}
              <strong className="font-semibold text-zinc-100">{displayDate}</strong>
            </span>
          ) : (
            displayDate
          )}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200'
          }`}
        />
      </button>

      {/* Popover Kalender Visual (1:1 dengan Reservasi) */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 w-72 sm:w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-3.5 z-50 animate-fadeIn select-none font-sans ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {/* Header Bulan & Navigasi */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
            <div className="text-sm font-bold text-zinc-100">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Bulan sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Bulan berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Baris Nama Hari */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAY_NAMES.map((name) => (
              <span key={name} className="text-[11px] font-medium text-zinc-500">
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
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow-xs'
                      : isToday
                      ? 'border border-amber-400/60 text-zinc-100 font-semibold hover:bg-zinc-800'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                  }`}
                >
                  {dayNum}
                </button>
              )
            })}
          </div>

          {/* Shortcut Footer */}
          <div className="pt-2.5 mt-2.5 border-t border-zinc-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onDateChange(todayStr)
                  setIsOpen(false)
                }}
                className="text-[11px] font-medium text-amber-400 hover:underline cursor-pointer"
              >
                Hari Ini
              </button>
              {allowAllDates && (
                <>
                  <span className="text-zinc-700">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDateChange('all')
                      setIsOpen(false)
                    }}
                    className={`text-[11px] font-medium cursor-pointer transition-colors ${
                      selectedDate === 'all'
                        ? 'text-amber-400 font-semibold underline'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Semua Tanggal
                  </button>
                </>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
              {selectedDate === 'all' ? 'Semua Tanggal' : selectedDate}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
