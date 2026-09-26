import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/blanca/blanca.css'
import CashierPage from './components/CashierPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <CashierPage />
    </div>
  </StrictMode>,
)
