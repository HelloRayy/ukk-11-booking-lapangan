// PERAN FILE: Root Coordinator Section FAQ Blanca Padel (Modular Feature-Folder)
import { useFaqAccordion } from './faq/hooks/useFaqAccordion'
import FaqHeading from './faq/components/FaqHeading'
import FaqAccordionItem from './faq/components/FaqAccordionItem'

export default function BlancaFaq() {
  const { faqList, toggleItem, isOpen } = useFaqAccordion()

  return (
    <section
      id="faq"
      data-section-id="shopify-section-faq"
      className="mt-[64px] mdw:mt-[120px] relative text-[#fcfcfc] overflow-hidden font-aeonik"
    >
      <div className="container mdw:site-grid items-start">
        {/* Garis Pembatas Atas (Fancy Spacer) */}
        <div className="col-span-12 fancy-spacer mb-[64px] mdw:mb-[120px]" />

        {/* Kolom Kiri: Preheading & Judul Utama (Sticky di Desktop) */}
        <FaqHeading />

        {/* Kolom Kanan: Daftar Akordeon FAQ */}
        <div className="col-start-5 col-span-8 flex flex-col items-stretch mt-[40px] mdw:mt-0">
          {faqList.map((item, index) => (
            <FaqAccordionItem
              key={item.number}
              item={item}
              isOpen={isOpen(index)}
              onToggle={() => toggleItem(index)}
              isFirst={index === 0}
            />
          ))}
        </div>

        {/* Garis Pembatas Bawah (Fancy Spacer) */}
        <div className="col-span-12 fancy-spacer mt-[64px] mdw:mt-[120px]" />
      </div>
    </section>
  )
}
