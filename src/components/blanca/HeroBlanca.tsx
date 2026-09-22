import { useHeroAnimation } from './hero/useHeroAnimation'
import HeaderNav from './hero/HeaderNav'
import CenterFlyingLogo from './hero/CenterFlyingLogo'
import HeroTitle from './hero/HeroTitle'
import HeroMedia from './hero/HeroMedia'
import ReservationModal from './hero/ReservationModal'

export default function HeroBlanca() {
  const {
    headerRef,
    headerLogoRef,
    centerLogoRef,
    ballRef,
    videoRef,
    titleRef,
    wordsRef,
    outroRef,
    isScrolled,
    handleMouseMove,
    handleMouseLeave,
  } = useHeroAnimation()

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-40 h-screen min-h-screen max-h-screen bg-[#161616] text-[#fcfcfc] overflow-hidden font-aeonik"
    >
      {/* Background Static Radial Glow Circle */}
      <div className="absolute inset-x-0 top-[-446px] lg:top-[-523px] w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="background-circle background-circle--static left-1/2 top-0 w-screen min-w-[1286px] max-w-[1440px] h-[751px] lg:h-[841px] -translate-x-1/2" />
      </div>

      {/* Header Fixed Navigation */}
      <HeaderNav
        headerRef={headerRef}
        headerLogoRef={headerLogoRef}
        isScrolled={isScrolled}
      />

      {/* Center Flying Logo Animation (Initial GSAP Position) */}
      <CenterFlyingLogo
        centerLogoRef={centerLogoRef}
        ballRef={ballRef}
      />

      {/* Hero Content Section */}
      <section className="relative isolate h-[100vh] flex flex-row items-center justify-center sm:pt-[76px] pt-[112px]">
        <HeroTitle
          titleRef={titleRef}
          wordsRef={wordsRef}
          outroRef={outroRef}
        />

        {/* Hero Media Layer with WebM Video & Native Spotlight */}
        <HeroMedia videoRef={videoRef} />
      </section>

      {/* Reservation FAB & Modal */}
      <ReservationModal />
    </div>
  )
}
