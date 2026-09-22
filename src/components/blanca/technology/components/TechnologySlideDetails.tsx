// PERAN FILE: Pure UI Kontrol Slider & Detail Teks Teknologi Blanca
import type { SlideData } from '../types'

interface TechnologySlideDetailsProps {
  slide: SlideData
  onPrev: () => void
  onNext: () => void
}

export default function TechnologySlideDetails({
  slide,
  onPrev,
  onNext,
}: TechnologySlideDetailsProps) {
  return (
    <div className="col-start-8 col-span-4 max-mdw:p-[40px_24px_40px] pl-[72px] pb-[40px] mdw:sticky top-[80px]">
      {/* Prev / Next Buttons */}
      <div className="flex flex-row items-center gap-x-[8px] mb-[32px] mdw:mb-[40px]">
        <button
          type="button"
          onClick={onPrev}
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
          onClick={onNext}
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
  )
}
