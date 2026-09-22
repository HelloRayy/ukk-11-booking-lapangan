// PERAN FILE: Pure UI Media Slide (Gambar Lifestyle Arena & Mini Card Raket Cutout)
import type { SlideData } from '../types'

interface TechnologySlideMediaProps {
  slide: SlideData
}

export default function TechnologySlideMedia({ slide }: TechnologySlideMediaProps) {
  return (
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
  )
}
