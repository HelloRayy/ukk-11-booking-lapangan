// PERAN FILE: Root Coordinator Section Lokasi & Kontak Blanca Padel (Modular Feature-Folder)
import { useBlancaLocations } from './locations/hooks/useBlancaLocations'
import BlancaLocationHeader from './locations/components/BlancaLocationHeader'
import BlancaLocationMap from './locations/components/BlancaLocationMap'
import BlancaContactPanel from './locations/components/BlancaContactPanel'

export default function BlancaLocations() {
  const {
    mapContainerRef,
    searchQuery,
    setSearchQuery,
    filteredContacts,
    focusOnMap,
    venueData,
  } = useBlancaLocations()

  return (
    <section
      id="locations"
      className="locations relative w-full text-[#fcfcfc] overflow-hidden pt-[64px] mdw:pt-[110px] pb-[80px] mdw:pb-[140px] font-aeonik"
    >
      {/* Anchor Navigation */}
      <div id="find-a-club" className="absolute -top-[80px]" />

      <div className="container site-grid gap-y-[40px] mdw:gap-y-[80px] overflow-hidden">
        {/* Header Section (Judul & Narasi) */}
        <BlancaLocationHeader />

        {/* Layout Kontainer Utama: Peta di Kiri, Panel Kontak di Kanan */}
        <div className="col-span-12 flex flex-col lg:flex-row gap-[16px] h-auto lg:h-[680px] items-stretch">
          <BlancaLocationMap
            mapContainerRef={mapContainerRef}
            onFocusArena={focusOnMap}
          />

          <BlancaContactPanel
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            contacts={filteredContacts}
            venueData={venueData}
            onFocusMap={focusOnMap}
          />
        </div>
      </div>
    </section>
  )
}
