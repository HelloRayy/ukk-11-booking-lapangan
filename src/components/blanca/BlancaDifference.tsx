// PERAN FILE: Root Coordinator Section The Blanca Difference (Modular Feature-Folder)
import DifferenceHeading from './difference/components/DifferenceHeading'
import DifferenceCommunityStory from './difference/components/DifferenceCommunityStory'
import DifferenceVideoCard from './difference/components/DifferenceVideoCard'
import DifferenceFeatures from './difference/components/DifferenceFeatures'

export default function BlancaDifference() {
  return (
    <section
      id="courts"
      data-section-id="shopify-section-template--17894129991737__common_large_card_6W9JdB"
      className="relative w-full text-[#fcfcfc] overflow-hidden font-aeonik"
    >
      {/* Anchor cadangan untuk ID Shopify lama */}
      <div
        id="shopify-section-template--17894129991737__common_large_card_6W9JdB"
        className="absolute -top-[80px]"
      />

      {/* Background Glow Circle */}
      <div className="absolute inset-0 size-full overflow-hidden pointer-events-none">
        <div className="background-circle top-[92px] mdw:top-[-23px] right-[-300px] mdw:right-[-340px] w-[491px] mdw:w-[841px] h-[497px] mdw:h-[1278px] mdw:rotate-[-20.43deg]" />
      </div>

      <div className="container mdw:site-grid items-start">
        {/* Spacer Pembatas Atas */}
        <div className="col-span-12 fancy-spacer mb-[64px] mdw:mb-[128px]" />

        {/* Section Heading & Preheading */}
        <DifferenceHeading />

        {/* Left Column (Sticky di Desktop): Cerita Komunitas */}
        <DifferenceCommunityStory />

        {/* Right Column: Big Video + Product Overlay + Feature Cards */}
        <div className="col-start-5 col-span-8 flex flex-col items-stretch">
          <DifferenceVideoCard />

          {/* Subheading teks di bawah video */}
          <h3 className="body mdw:h3 text-[#bfbfbf] mdw:text-white w-full max-w-[676px] max-mdw:mb-[40px]">
            Minimal design, top performance for all levels, and options to test drive before buying.
          </h3>

          {/* Fancy Spacer Garis Pemisah */}
          <div className="max-mdw:hidden fancy-spacer my-[40px]" />

          {/* 3 Fitur Unggulan Lapangan */}
          <DifferenceFeatures />
        </div>
      </div>
    </section>
  )
}
