import HeroBlanca from './HeroBlanca'
import BlancaDifference from './BlancaDifference'
import BlancaTechnology from './BlancaTechnology'
import BlancaLocations from './BlancaLocations'
import BlancaFaq from './BlancaFaq'
import BlancaCta from './BlancaCta'
import BlancaFooter from './BlancaFooter'
import { useReservationDrawer } from './reservation/hooks/useReservationDrawer'
import { useLenis } from './hooks/useLenis'

export default function HeroBlancaPreview() {
  const drawer = useReservationDrawer()
  useLenis({ isLocked: drawer.isOpen })

  return (
    <div className="w-full min-h-screen text-[#fcfcfc] bg-dots">
      {/* 1. Hero Section (Attention / First Fold) */}
      <HeroBlanca onOpenReservation={drawer.openDrawer} drawer={drawer} />

      {/* 2. Social Proof & Core Benefits (Interest) */}
      <BlancaDifference />

      {/* 3. Court Showcase & Technology (Desire) */}
      <BlancaTechnology />

      {/* 4. Locations & Operational Info (Action Enabler) */}
      <BlancaLocations />

      {/* 5. FAQ (Objection Handling & Closing) */}
      <BlancaFaq />

      {/* 6. Final Call-to-Action Banner */}
      <BlancaCta onOpenReservation={drawer.openDrawer} />

      {/* 7. Footer */}
      <BlancaFooter />
    </div>
  )
}
