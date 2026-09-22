// PERAN FILE: Komponen Section FAQ 1:1 'Frequently asked questions - We're here to help you' Blanca Padel
import { useState } from 'react'

interface FaqItem {
  number: string
  question: string
  answer: string
}

const FAQ_DATA: FaqItem[] = [
  {
    number: '01',
    question:
      'Can you tell us how we can customize balls and racquets with Blanca? We have seen this on your Instagram page.',
    answer:
      'If you are a club and looking to collaborate on racquets, balls or clothing send us a message. Minimums on racquets can vary, but we do not offer one off customizations. The minimum for custom balls is 100 cases of balls (each with 24 cans).',
  },
  {
    number: '02',
    question: 'How can we trial Blanca gear?',
    answer:
      'You can use our store/padel club locator map to locate places where we have demo racquets you can test out. If your closest club is not on there, be sure to tell them you would like to demo our racquets and have them message us at: hola@blancapadel.com',
  },
  {
    number: '03',
    question: 'Where are your products made?',
    answer:
      'Our sourcing and development team scours the earth to find you the best possible products and materials for the most accessible pricing. Our racquets are hand made in China. Our balls are made in China. Our clothing and accessories are made in Hong Kong, China, Vietnam, Mexico and the United States! If you are a vendor and think you have a product or materials that may be a good fit for Blanca, message us at: hola@blancapadel.com',
  },
  {
    number: '04',
    question: 'Where is Blanca based?',
    answer:
      'Blanca Padel is headquartered in the Tampa Bay Area, St. Petersburg, Florida in the United States to be specific. Our brand was founded in San Diego, California.',
  },
]

export default function BlancaFaq() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  return (
    <section
      id="faq"
      data-section-id="shopify-section-faq"
      className="mt-[64px] mdw:mt-[120px] relative text-[#fcfcfc] overflow-hidden"
    >
      <div className="container mdw:site-grid items-start">
        {/* Garis Pembatas Atas (Fancy Spacer) */}
        <div className="col-span-12 fancy-spacer mb-[64px] mdw:mb-[120px]" />

        {/* Kolom Kiri: Preheading & Judul Utama (Sticky di Desktop) */}
        <div className="col-start-1 col-span-4 mdw:sticky top-[80px]">
          <span className="block preheading mb-[24px] md:mb-[32px]">
            Frequently asked questions
          </span>
          <h2 className="h2-mobile mdw:h2">
            We’re here <br className="hidden mdw:block" />to help you
          </h2>
        </div>

        {/* Kolom Kanan: Daftar Akordeon FAQ */}
        <div className="col-start-5 col-span-8 flex flex-col items-stretch mt-[40px] mdw:mt-0">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openItems.includes(index)

            return (
              <div key={item.number} className="w-full">
                {/* Garis pemisah antar pertanyaan */}
                {index > 0 && (
                  <div className="fancy-spacer my-[32px] mdw:my-[40px]" />
                )}

                <div className="w-full">
                  <h4>
                    <button
                      type="button"
                      onClick={() => toggleItem(index)}
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
                        <span className="sr-only">
                          {isOpen ? 'Close' : 'Open'} faq
                        </span>
                      </span>
                    </button>
                  </h4>

                  {/* Panel Jawaban dengan Animasi Transisi Halus */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen
                        ? 'max-h-[500px] opacity-100'
                        : 'max-h-0 opacity-0 pointer-events-none'
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
          })}
        </div>

        {/* Garis Pembatas Bawah (Fancy Spacer) */}
        <div className="col-span-12 fancy-spacer mt-[64px] mdw:mt-[120px]" />
      </div>
    </section>
  )
}
