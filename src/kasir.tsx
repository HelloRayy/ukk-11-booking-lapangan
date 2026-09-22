import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CashierPage from './components/CashierPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <CashierPage />
      </div>
    </div>
  </StrictMode>,
)
