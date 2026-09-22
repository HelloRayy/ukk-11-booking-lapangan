// PERAN FILE: Komponen Section 1:1 'Our technology' Blanca Padel dengan Slider Interaktif
import { useState } from 'react'

interface SlideData {
  id: string
  imgSrc: string
  alt: string
  productName: string
  productSubtitle: string
  productLink: string
  racquetImg: string
  heading: string
  description: string
}

const slides: SlideData[] = [
  {
    id: 'coronado',
    imgSrc: '/assets/blanca/tech-lifestyle.jpg',
    alt: 'Blanca Lifestyle Coronado',
    productName: 'Coronado',
    productSubtitle: 'Control round shape racquet',
    productLink: '/products/coronado',
    racquetImg: '/assets/blanca/coronado-front.png',
    heading: 'We are carbon fiber obsessed',
    description:
      "We love carbon fiber for it's famous tensile strength, curious light weight nature and of course aesthetic. Our racquets are made with anywhere from 3K to 18K carbon fiber, the same used by professional padel players and utilized in aerospace and race car parts. ALL of our racquets are reinforced with carbon fiber tubing for added durability.",
  },
  {
    id: 'del-mar',
    imgSrc: '/assets/blanca/tech-carbon.png',
    alt: 'Del Mar Carbon Fiber',
    productName: 'Del Mar',
    productSubtitle: 'Diamond shaped aggressive racquet',
    productLink: '/products/del-mar',
    racquetImg: '/assets/blanca/del-mar-front.png',
    heading: 'Diamond shape aggressive power',
    description:
      'A high-performance racquet combining explosive power, maneuverability, and a buttery smooth feel. Its diamond shape positions the sweet spot higher for offensive overhead smashes, backed by durable 12K carbon fiber and shock-absorbing EVA core.',
  },
]

export default function BlancaTechnology() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  return (
    <section
      id="shopify-section-template--17894129991737__common_slider_x8NN4j"
      className="mt-[64px] mdw:mt-[128px] relative text-[#fcfcfc] overflow-hidden"
    >
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
          <div className="col-start-2 col-span-6 flex flex-col items-start gap-y-[24px] mdw:gap-y-[32px] mb-[40px] mdw:mb-[80px] max-mdw:px-[24px]">
            <span className="block preheading">Our technology</span>
            <h2 className="h2-mobile mdw:h2">
              Racquets made with the most modern tech
            </h2>
          </div>

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
                      {/* Left: Product & Court Lifestyle Image */}
                      <div className="col-start-1 col-span-7 flex">
                        <div className="flex flex-row items-stretch w-full mdw:min-h-[593px] max-mdw:p-[8px] pl-[8px] pb-[8px] relative">
                          <img
                            src={slide.imgSrc}
                            alt={slide.alt}
                            className="w-full h-auto mdw:h-full max-mdw:aspect-[327/262] max-mdw:max-h-[360px] object-cover object-center rounded-[4px] opacity-[0.95] overflow-hidden"
                            loading="lazy"
                          />

                          {/* Mini Product Card (pinned to bottom-left) */}
                          <div
                            className="max-mdw:hidden absolute bottom-[32px] left-[32px] min-h-[49px] mdw:min-h-[66px] leading-[1] flex flex-col items-start justify-center gap-y-[6px] p-[8px_58px_8px_14px] mdw:p-[16px_96px_16px_16px] bg-[#313131]/[0.8] mdw:hover:bg-[#444]/[0.8] backdrop-blur-[7px] rounded-[4px] text-white transition-colors duration-300 group/mini-product cursor-pointer"
                            data-product-card-tracked="true"
                          >
                            <a href={slide.productLink} className="flex flex-row items-center gap-x-[6px]">
                              <span className="text-sm mdw:text-base font-normal">{slide.productName}</span>
                              <span className="flex items-center justify-center w-[14px] h-[14px] rounded-[4px] bg-[#f2d953] text-black">
                                <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M1.25 7.5 4.75 4 1.25.5" stroke="currentColor" />
                                </svg>
                              </span>
                            </a>
                            <span className="font-light text-[12px] mdw:caption text-[#bfbfbf] !leading-[1]">
                              {slide.productSubtitle}
                            </span>

                            {/* Cutout Racquet Image */}
                            <div className="absolute -top-[10px] mdw:-top-[16px] bottom-0 right-0 w-[58px] mdw:w-[96px] px-[9px] mdw:px-[14px] overflow-hidden pointer-events-none">
                              <img
                                src={slide.racquetImg}
                                alt={slide.productName}
                                className="w-auto h-full scale-[150%] mdw:group-hover/mini-product:scale-[160%] translate-y-[10%] origin-center object-contain object-center transition-transform duration-300"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Navigation Controls & Tech Details */}
                      <div className="col-start-8 col-span-4 max-mdw:p-[40px_24px_40px] pl-[72px] pb-[40px] mdw:sticky top-[80px]">
                        {/* Prev / Next Buttons */}
                        <div className="flex flex-row items-center gap-x-[8px] mb-[32px] mdw:mb-[40px]">
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="flex flex-row items-center justify-center w-[40px] h-[40px] border border-[#444] rounded-[4px] hover:bg-white hover:text-black hover:border-white focus-visible:bg-white focus-visible:text-black focus-visible:border-white transition-colors duration-300 cursor-pointer"
                            aria-label="Previous slide"
                          >
                            <svg
                              aria-hidden="true"
                              className="-rotate-90"
                              width="21"
                              height="20"
                              viewBox="0 0 21 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M10.25 15.9V4.1m0 0L4.35 10m5.9-5.9 5.9 5.9" stroke="currentColor" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            className="flex flex-row items-center justify-center w-[40px] h-[40px] border border-[#444] rounded-[4px] hover:bg-white hover:text-black hover:border-white focus-visible:bg-white focus-visible:text-black focus-visible:border-white transition-colors duration-300 cursor-pointer"
                            aria-label="Next slide"
                          >
                            <svg
                              aria-hidden="true"
                              className="rotate-90"
                              width="21"
                              height="20"
                              viewBox="0 0 21 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M10.25 15.9V4.1m0 0L4.35 10m5.9-5.9 5.9 5.9" stroke="currentColor" />
                            </svg>
                          </button>
                        </div>

                        {/* Title & Description */}
                        <h3 className="h4-mobile mdw:h3">{slide.heading}</h3>
                        <div className="body text-[#bfbfbf] mt-[24px] mdw:mt-[32px]">
                          {slide.description}
                        </div>
                      </div>
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
