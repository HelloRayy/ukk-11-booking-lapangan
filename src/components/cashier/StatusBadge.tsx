// PERAN FILE: Komponen kecil reusable untuk menampilkan label status (Lunas/Booked/Batal)
import type { StatusBooking } from '../../types/database'

interface Props {
  status: StatusBooking
}

export default function StatusBadge({ status }: Props) {
  const warna = {
    Lunas: 'bg-green-100 text-green-800',
    Booked: 'bg-yellow-100 text-yellow-800',
    Batal: 'bg-red-100 text-red-800',
  }[status]

  return (
    <span className={`px-2 py-0.5 text-xs rounded font-bold ${warna}`}>
      {status}
    </span>
  )
}
