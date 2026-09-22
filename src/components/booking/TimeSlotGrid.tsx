import { DAFTAR_JAM } from '../../constants/operationalHours'

interface Props {
  selectedDate: string
  jamTerisi: string[]
  jamDipilih: string[]
  onToggleSlot: (jam: string) => void
}

// grid jam simpel - tombol otomatis terkunci kalau sudah lewat jamnya atau sudah dibooking
export default function GridJam({
  selectedDate,
  jamTerisi,
  jamDipilih,
  onToggleSlot,
}: Props) {
  // MODE DEV: ubah ke true jika ingin simulasi jam manual (misal testing malam hari / demo UKK)
  const isDevMode = true // true = pakai jam simulasi, false = pakai jam realtime
  const jamSimulasi = 18 // atur jam simulasi di sini (contoh: 10 = jam 10:00 pagi)

  // cek apakah tanggal yang dipilih adalah hari ini
  const isToday = selectedDate === new Date().toISOString().split('T')[0]
  const jamSekarang = isDevMode ? jamSimulasi : new Date().getHours()

  return (
    <div>
      <h3 className="font-bold mb-2">
        3. Pilih Jam Main:
        {isDevMode && (
          <span className="text-xs text-orange-600 font-normal ml-2">
            [Mode Dev Aktif: Simulasi Jam {jamSimulasi}:00]
          </span>
        )}
      </h3>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {DAFTAR_JAM.map((jam) => {
          const jamAngka = parseInt(jam.split(':')[0], 10) // '08:00' diambil angka 8
          const isPast = isToday && jamAngka <= jamSekarang // jam yang sudah lewat hari ini
          const sudahTerisi = jamTerisi.includes(jam)
          const isDisabled = sudahTerisi || isPast
          const sedangDipilih = jamDipilih.includes(jam)

          return (
            <button
              key={jam}
              type="button"
              disabled={isDisabled}
              onClick={() => onToggleSlot(jam)}
              className={`p-2 border rounded font-medium ${
                sudahTerisi
                  ? 'bg-gray-200 text-gray-400 line-through cursor-not-allowed'
                  : isPast
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : sedangDipilih
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
