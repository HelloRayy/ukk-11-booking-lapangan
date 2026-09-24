// PERAN FILE: Root Coordinator Section Our Technology Blanca Padel (Modular Feature-Folder)
import { useTechnologySlider } from './technology/hooks/useTechnologySlider'
import TechnologyHeading from './technology/components/TechnologyHeading'
import TechnologySlideMedia from './technology/components/TechnologySlideMedia'
import TechnologySlideDetails from './technology/components/TechnologySlideDetails'

export default function BlancaTechnology() {
  const { currentSlide, slides, handlePrev, handleNext } = useTechnologySlider()

  return (
    <section
      id="technology"
      className="mt-[64px] mdw:mt-[128px] relative text-[#fcfcfc] overflow-hidden font-aeonik"
    >
      {/* Anchor cadangan untuk ID Shopify lama */}
      <div
        id="shopify-section-template--17894129991737__common_slider_x8NN4j"
        className="absolute -top-[80px]"
      />

      {/* Background Glow Circle */}
      <div className="absolute inset-0 size-full overflow-hidden pointer-events-none">
        <div className="background-circle top-[-46px] mdw:top-[41px] left-[-269px] mdw:left-[-664px] w-[491px] mdw:w-[1129px] h-[657px] mdw:h-[1129px]" />
      </div>

      <div className="container">
        {/* Fancy Spacer Pembatas Atas */}
        <div className="fancy-spacer mb-[64px] mdw:mb-[128px]" />

        {/* Card Container Utama */}
        <div className="w-full mdw:site-grid bg-[#D9D9D9]/[0.12] backdrop-blur-[7px] pt-[40px] mdw:pt-[128px] rounded-[8px] overflow-x-clip">
          {/* Section Heading & Preheading */}
          <TechnologyHeading />

          {/* Slider Container */}
          <div className="col-span-12 relative">
            <div className="relative overflow-hidden w-full">
              {slides.map((slide, index) => {
                const isActive = index === currentSlide
                return (
                  <div
                    key={slide.id}
                    className={`w-full transition-opacity duration-500 ease-in-out ${
                      isActive ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 pointer-events-none'
                    }`}
                  >
                    <div className="w-full mdw:site-grid items-start">
                      {/* Left: Lifestyle Media & Cutout Card */}
                      <TechnologySlideMedia slide={slide} />

                      {/* Right: Controls & Description */}
                      <TechnologySlideDetails
                        slide={slide}
                        onPrev={handlePrev}
                        onNext={handleNext}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
