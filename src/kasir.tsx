import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CashierPage from './components/CashierPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-[#121212] text-white p-3 sm:p-6 md:p-8">
      <div className="max-w-[1440px] mx-auto bg-[#161616] p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#262626] shadow-2xl">
        <CashierPage />
      </div>
    </div>
  </StrictMode>,
)
