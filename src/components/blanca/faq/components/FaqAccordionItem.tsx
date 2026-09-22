// PERAN FILE: Pure UI Item Akordeon FAQ dengan Animasi Morphing Plus/Minus
import type { FaqItem } from '../types'

interface FaqAccordionItemProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
  isFirst: boolean
}

export default function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
  isFirst,
}: FaqAccordionItemProps) {
  return (
    <div className="w-full">
      {/* Garis pemisah antar pertanyaan */}
      {!isFirst && <div className="fancy-spacer my-[32px] mdw:my-[40px]" />}

      <div className="w-full">
        <h4>
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex flex-row items-center text-left text-[20px] smw:text-[24px] leading-[125%] smw:leading-[140%] group/faq cursor-pointer"
            aria-expanded={isOpen}
          >
            {/* Nomor Urut (01, 02, ...) */}
            <span
              className="flex-shrink-0 flex flex-row items-center justify-center w-[30px] font-light text-[#bfbfbf] mdw:group-hover/faq:text-white transition-colors duration-300"
              aria-hidden="true"
            >
              {item.number}
            </span>

            {/* Teks Pertanyaan */}
            <span className="flex-1 px-[16px] smw:px-[25px] text-white">
              {item.question}
            </span>

            {/* Tombol Plus / Minus Morphing Box */}
            <span className="flex-shrink-0 w-[40px] h-[40px] border border-[#444] rounded-[4px] mdw:group-hover/faq:border-white mdw:group-hover/faq:bg-white transition-colors duration-300 relative flex items-center justify-center">
              {/* Garis Horizontal */}
              <span
                className={`absolute w-[14px] h-[1px] bg-white mdw:group-hover/faq:bg-black transition-all duration-300 ${
                  isOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
                }`}
              />
              {/* Garis Vertikal (berotasi jadi horizontal saat dibuka) */}
              <span
                className={`absolute w-[14px] h-[1px] bg-white mdw:group-hover/faq:bg-black transition-all duration-300 ${
                  isOpen ? 'rotate-0' : 'rotate-90'
                }`}
              />
              <span className="sr-only">{isOpen ? 'Close' : 'Open'} faq</span>
            </span>
          </button>
        </h4>

        {/* Panel Jawaban dengan Animasi Transisi Halus */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="pt-[24px] smw:pt-[32px] pl-[46px] smw:pl-[55px] text-[#bfbfbf] leading-relaxed">
            <div className="w-full max-w-[632px] text-base font-light">
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
