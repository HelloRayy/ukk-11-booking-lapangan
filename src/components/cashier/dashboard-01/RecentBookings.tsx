// PERAN FILE: Komponen Daftar Transaksi Terkini ala Shadcn Recent Sales
import type { RecentBookingItem } from './mockData'

interface RecentBookingsProps {
  bookings: RecentBookingItem[]
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  const formatRupiah = (val: number) => `+Rp ${val.toLocaleString('id-ID')}`

  return (
    <div className="rounded-xl border border-[#262626] bg-[#1a1a1a] p-6 shadow-xs flex flex-col justify-between">
      {/* 1. Header Kartu */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white tracking-tight">
          Booking Terkini
        </h3>
        <p className="text-xs text-[#8e8e8e] mt-0.5">
          {bookings.length} transaksi hari ini
        </p>
      </div>

      {/* 2. Daftar Transaksi Terkini */}
      <div className="space-y-4">
        {bookings.map((item) => {
          const initials = item.customerName
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()

          const isLunas = item.status === 'Lunas'

          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
            >
              {/* Avatar Inisial */}
              <div
                className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${item.avatarColor}`}
              >
                {initials}
              </div>

              {/* Info Pelanggan & Lapangan */}
              <div className="flex-1 min-w-0 pr-2">
                <div className="text-sm font-medium text-white truncate leading-none">
                  {item.customerName}
                </div>
                <p className="text-xs text-[#8e8e8e] truncate mt-1">
                  {item.courtName} • {item.schedule}
                </p>
              </div>

              {/* Nominal Pembayaran & Status Text Bersih */}
              <div className="text-right shrink-0">
                <span className="text-sm font-semibold text-white block">
                  {formatRupiah(item.amount)}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isLunas ? 'text-emerald-400' : 'text-[#f2d953]'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
