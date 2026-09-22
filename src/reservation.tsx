import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/blanca/blanca.css'
import ReservationPage from './components/reservation/ReservationPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReservationPage />
  </StrictMode>,
)
