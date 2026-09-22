// PERAN FILE: Komponen utama pembungkus aplikasi & pengatur navigasi tab (Pemesan vs Kasir)
import { useState } from 'react'
import CustomerBookingPage from './components/CustomerBookingPage'
import CashierPage from './components/CashierPage'

export default function App() {
  const [activeTab, setActiveTab] = useState<'pemesan' | 'kasir'>('pemesan')

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 text-black bg-white min-h-screen">
      {/* Header Utama & Navigasi Tab */}
      <header className="border-b pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">Booking Lapangan Badminton</h1>
          <p className="text-sm text-gray-500">Aplikasi UKK RPL / PPLG - Sistem Reservasi & Kasir</p>
        </div>

        {/* Tab Navigasi Menu */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('pemesan')}
            className={`px-3 py-1.5 rounded font-bold text-sm border ${
              activeTab === 'pemesan'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Menu Pemesan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kasir')}
            className={`px-3 py-1.5 rounded font-bold text-sm border ${
              activeTab === 'kasir'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Menu Kasir
          </button>
        </div>
      </header>

      {/* Konten Halaman Aktif */}
      {activeTab === 'pemesan' ? <CustomerBookingPage /> : <CashierPage />}
    </div>
  )
}
