import { DAFTAR_JAM } from '../constants/gor'

interface Props {
  selectedDate: string
  bookedSlots: string[]
  selectedSlots: string[]
  onToggleSlot: (jam: string) => void
}

// grid jam simpel - tombol otomatis terkunci kalau sudah lewat jamnya atau sudah dibooking
export default function TimeSlotGrid({
  selectedDate,
  bookedSlots,
  selectedSlots,
  onToggleSlot,
}: Props) {
  // cek apakah tanggal yang dipilih adalah hari ini
  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const jamSekarang = new Date().getHours() // jam sekarang (format 0 - 23)

  return (
    <div>
      <h3 className="font-bold mb-2">3. Pilih Jam Main:</h3>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {DAFTAR_JAM.map((jam) => {
          const jamAngka = parseInt(jam.split(':')[0], 10) // '08:00' diambil angka 8
          const isPast = isToday && jamAngka <= jamSekarang // jam yang sudah lewat hari ini
          const isBooked = bookedSlots.includes(jam)
          const isDisabled = isBooked || isPast
          const isSelected = selectedSlots.includes(jam)

          return (
            <button
              key={jam}
              type="button"
              disabled={isDisabled}
              onClick={() => onToggleSlot(jam)}
              className={`p-2 border rounded font-medium ${
                isBooked
                  ? 'bg-gray-200 text-gray-400 line-through cursor-not-allowed'
                  : isPast
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : isSelected
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {jam}
            </button>
          )
        })}
      </div>
    </div>
  )
}
