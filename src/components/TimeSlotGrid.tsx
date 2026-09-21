import { DAFTAR_JAM } from '../constants/gor'

interface Props {
  bookedSlots: string[]
  selectedSlots: string[]
  onToggleSlot: (jam: string) => void
}

// grid jam simpel - tombol biasa dengan background penanda status
export default function TimeSlotGrid({
  bookedSlots,
  selectedSlots,
  onToggleSlot,
}: Props) {
  return (
    <div>
      <h3 className="font-bold mb-2">3. Pilih Jam Main:</h3>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {DAFTAR_JAM.map((jam) => {
          const isBooked = bookedSlots.includes(jam)
          const isSelected = selectedSlots.includes(jam)

          return (
            <button
              key={jam}
              type="button"
              disabled={isBooked}
              onClick={() => onToggleSlot(jam)}
              className={`p-2 border rounded font-medium ${
                isBooked
                  ? 'bg-gray-200 text-gray-400 line-through cursor-not-allowed'
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
