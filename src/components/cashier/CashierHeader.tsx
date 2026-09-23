// PERAN FILE: Header Navigasi Portal Kasir dengan Tab Switcher (Dashboard vs Bookings)
interface CashierHeaderProps {
  activeTab: 'dashboard' | 'bookings'
  onTabChange: (tab: 'dashboard' | 'bookings') => void
  onOpenManualModal: () => void
  onOpenCourtModal: () => void
  onRefresh: () => void
}

export default function CashierHeader({
  activeTab,
  onTabChange,
  onOpenManualModal,
  onOpenCourtModal,
  onRefresh,
}: CashierHeaderProps) {
  return (
    <div className="space-y-4">
      {/* 1. Bar Navigasi Atas Cepat (no-print) */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-[#262626] no-print">
        <a
          href="/"
          className="text-[#8e8e8e] hover:text-white font-medium flex items-center gap-1.5 transition-colors"
        >
          ← Blanca Arena
        </a>
        <a
          href="/reservasi"
          className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
        >
          Public Calendar →
        </a>
      </div>

      {/* 2. Bar Utama: Brand, Pill Tab Switcher, dan Tombol Aksi */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-[#262626]">
        {/* Sisi Kiri: Judul Portal */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              BLANCA ARENA
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0a5c36] text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              Cashier Hub
            </span>
          </div>
          <p className="text-xs text-[#8e8e8e] mt-0.5">
            Operational dashboard, manual booking, payment settlement & court master data
          </p>
        </div>

        {/* Sisi Tengah: Pill Tabs Switcher (Dashboard vs Bookings) */}
        <div className="flex items-center p-1 rounded-xl bg-black/50 border border-white/10 no-print">
          <button
            type="button"
            onClick={() => onTabChange('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-[#8e8e8e] hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onTabChange('bookings')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-[#8e8e8e] hover:text-white'
            }`}
          >
            Bookings
          </button>
          <button
            type="button"
            onClick={onOpenCourtModal}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#8e8e8e] hover:text-white transition-colors cursor-pointer"
          >
            Courts
          </button>
        </div>

        {/* Sisi Kanan: Tombol Aksi Kasir */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          {/* Tombol Aksi Tambah Booking Manual (Walk-in) */}
          <button
            type="button"
            onClick={onOpenManualModal}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>+ Walk-in Booking</span>
          </button>

          {/* Tombol Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
            title="Muat ulang data dari database"
          >
            Refresh
          </button>

          {/* Tombol Cetak Rekap */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 bg-[#f2d953] hover:bg-[#e4cb34] text-[#161616] text-xs font-bold rounded-xl cursor-pointer transition-all shadow-sm active:scale-95"
          >
            Cetak Rekap
          </button>
        </div>
      </div>
    </div>
  )
}
