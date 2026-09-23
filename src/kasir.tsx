import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CashierPage from './components/CashierPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-[#121212] text-white">
      <CashierPage />
    </div>
  </StrictMode>,
)
