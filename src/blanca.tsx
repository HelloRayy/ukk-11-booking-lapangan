import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './components/blanca/blanca.css'
import HeroBlancaPreview from './components/blanca/HeroBlancaPreview'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroBlancaPreview />
  </StrictMode>,
)
