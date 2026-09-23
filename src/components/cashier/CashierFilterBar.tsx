// PERAN FILE: Komponen Kontrol Pencarian (Search Bar) & Filter Status Transaksi
interface CashierFilterBarProps {
  searchKeyword: string
  selectedStatus: string
  onSearchChange: (keyword: string) => void
  onStatusChange: (status: string) => void
}

const STATUS_FILTERS = ['Semua', 'Belum Lunas', 'Lunas', 'Batal']

export default function CashierFilterBar({
  searchKeyword,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: CashierFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
      {/* 1. Search Bar Live (Poin 13 Kisi-kisi UKK) */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Cari nama penyewa, nomor HP, atau invoice..."
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-blue-500 shadow-xs"
        />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* 2. Tab Filter Status Pembayaran */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => onStatusChange(st)}
            className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              selectedStatus === st
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {st}
          </button>
        ))}
      </div>
    </div>
  )
}
