import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/blanca/blanca.css'
import ReservasiPage from './components/reservasi/ReservasiPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReservasiPage />
  </StrictMode>,
)
