// PERAN FILE: Pure UI Grid 3 Fitur Unggulan Arena Blanca
import { COURT_FEATURES } from '../data/differenceData'

export default function DifferenceFeatures() {
  return (
    <div className="flex flex-col md:flex-row items-stretch">
      {COURT_FEATURES.map((feature, idx) => (
        <div
          key={feature.id}
          className={`flex-1 flex flex-col items-start gap-y-[24px] md:gap-y-[32px] ${
            idx < COURT_FEATURES.length - 1 ? 'max-mdw:mb-[32px]' : ''
          }`}
        >
          <div className="w-[24px] md:w-[32px] h-[24px] md:h-[32px] md:mt-[8px] shrink-0">
            <img
              src={feature.iconSrc}
              alt={feature.title}
              className="w-full h-full object-contain object-center"
            />
          </div>

          <div className="flex flex-col gap-[12px]">
            <p className="big-body font-medium text-[#fcfcfc]">{feature.title}</p>
            <div className="flex-1 flex flex-row items-stretch gap-x-[24px]">
              <div className="body text-[#bfbfbf] mdw:pr-[64px]">
                {feature.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
