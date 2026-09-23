// PERAN FILE: Halaman Utama Kasir Berbasis Shadcn Dashboard-01 (Fokus Overview Step 1)
import { useState } from 'react'
import Sidebar from './cashier/dashboard-01/Sidebar'
import Header from './cashier/dashboard-01/Header'
import DashboardOverview from './cashier/dashboard-01/DashboardOverview'

export default function CashierPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#121212] text-[#fafafa] flex">
      {/* 1. Sidebar Navigasi Kiri (Desktop) */}
      <Sidebar currentTab="overview" />

      {/* 2. Drawer Mobile Sederhana */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 bg-[#141414] border-r border-[#262626] p-4 flex flex-col justify-between">
            <Sidebar currentTab="overview" />
          </div>
        </div>
      )}

      {/* 3. Area Konten Utama Kanan (Header + Overview) */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <DashboardOverview />
          </div>
        </main>
      </div>
    </div>
  )
}
