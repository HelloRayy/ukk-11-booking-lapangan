import { useState } from 'react'

interface Props {
  durasiJam: number
  totalBayar: number
  nominalDP: number
  isSubmitting: boolean
  onKirimData: (data: { nama: string; noHp: string; tipeBayar: 'Lunas' | 'DP' }) => void
}

// form input data pemesan & opsi pembayaran
export default function BookingForm({
  durasiJam,
  totalBayar,
  nominalDP,
  isSubmitting,
  onKirimData,
}: Props) {
  const [nama, setNama] = useState('')
  const [noHp, setNoHp] = useState('')
  const [tipeBayar, setTipeBayar] = useState<'DP' | 'Lunas'>('DP')

  // fungsi validasi input sebelum dikirim ke database
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 1. cek nama
    if (!nama.trim()) {
      alert('Nama pemesan wajib diisi!')
      return
    }

    // 2. cek nomor hp
    if (!noHp.trim()) {
      alert('Nomor HP pemesan wajib diisi!')
      return
    }

    // 3. cek apakah sudah pilih jam
    if (durasiJam === 0) {
      alert('Pilih minimal 1 slot jam main di atas!')
      return
    }

    // jika semua syarat lolos, kirim ke App.tsx
    onKirimData({ nama, noHp, tipeBayar })
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-50 space-y-4">
      <h3 className="font-bold">5. Data Pemesan & Pembayaran:</h3>

      {/* input nama */}
      <div>
        <label className="block text-xs font-semibold uppercase mb-1">Nama Pemesan:</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Contoh: Budi Santoso"
          className="w-full border p-2 rounded bg-white"
        />
      </div>

      {/* input no hp */}
      <div>
        <label className="block text-xs font-semibold uppercase mb-1">Nomor WhatsApp / HP:</label>
        <input
          type="tel"
          value={noHp}
          onChange={(e) => setNoHp(e.target.value)}
          placeholder="Contoh: 08123456789"
          className="w-full border p-2 rounded bg-white"
        />
      </div>

      {/* opsi pembayaran: dp vs lunas */}
      <div>
        <label className="block text-xs font-semibold uppercase mb-1">Opsi Pembayaran:</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipeBayar"
              value="DP"
              checked={tipeBayar === 'DP'}
              onChange={() => setTipeBayar('DP')}
            />
            <span className="text-sm">
              Bayar DP 50% (Rp {nominalDP.toLocaleString('id-ID')})
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="tipeBayar"
              value="Lunas"
              checked={tipeBayar === 'Lunas'}
              onChange={() => setTipeBayar('Lunas')}
            />
            <span className="text-sm">
              Bayar Lunas (Rp {totalBayar.toLocaleString('id-ID')})
            </span>
          </label>
        </div>
      </div>

      {/* tombol submit */}
      <button
        type="submit"
        disabled={isSubmitting || durasiJam === 0}
        className={`w-full p-3 rounded font-bold text-white transition-all ${
          durasiJam === 0 || isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
        }`}
      >
        {isSubmitting ? 'Menyimpan Booking...' : 'Konfirmasi & Booking Lapangan'}
      </button>
    </form>
  )
}
