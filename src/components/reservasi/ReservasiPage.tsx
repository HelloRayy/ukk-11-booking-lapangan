// PERAN FILE: Root Coordinator untuk Halaman /reservasi
import { useReservasiSetup } from './hooks/useReservasiSetup'
import ReservasiHeader from './components/ReservasiHeader'
import ReservasiContent from './components/ReservasiContent'

export default function ReservasiPage() {
  const { customer, isLoading, handleBackToHome } = useReservasiSetup()

  return (
    <div className="min-h-screen bg-[#161616] text-[#fafafa] font-aeonik flex flex-col">
      {/* 1. Header Navigasi */}
      <ReservasiHeader onBack={handleBackToHome} />

      {/* 2. Konten Utama Kerangka Reservasi */}
      <ReservasiContent customer={customer} isLoading={isLoading} />
    </div>
  )
}
