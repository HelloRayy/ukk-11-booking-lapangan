// PERAN FILE: Komponen Section 'Find a Club' / Locations Blanca Padel 1:1 Reproduction
import { useState, useMemo } from 'react'

interface Location {
  id: string
  slug: string
  title: string
  address: string
  region: 'west' | 'east' | 'mexico' | 'latam' | 'europe' | 'asia'
  lat: number
  lng: number
  image: string
  url?: string
}

const LOCATIONS: Location[] = [
  {
    id: 'location-2',
    slug: 'addison-reserve-country-club',
    title: 'Addison Reserve Country Club',
    address: '7201 Addison Reserve Blvd, Delray Beach, FL 33446',
    region: 'east',
    lat: 26.4365,
    lng: -80.157,
    image: 'https://blancapadel.com/cdn/shop/files/2020-10-23.jpg?v=1755628483',
    url: 'https://www.google.com/maps/search/?api=1&query=7201+Addison+Reserve+Blvd+Delray+Beach+FL+33446',
  },
  {
    id: 'location-3',
    slug: 'aronimonk-golf-club',
    title: 'Aronimonk Golf Club',
    address: '3600 St Davids Rd, Newtown Square, PA 19073',
    region: 'east',
    lat: 40.0117,
    lng: -75.409,
    image: 'https://blancapadel.com/cdn/shop/files/Aronimonk.jpg?v=1744122144',
    url: 'https://www.google.com/maps/search/?api=1&query=3600+St+Davids+Rd+Newtown+Square+PA+19073',
  },
  {
    id: 'location-4',
    slug: 'ballers-philly',
    title: 'Ballers - Philly',
    address: '1325 N Beach St, Philadelphia, PA 19125',
    region: 'east',
    lat: 39.9675,
    lng: -75.1261,
    image: 'https://blancapadel.com/cdn/shop/files/1748617415783.jpg?v=1754586857',
    url: 'https://www.google.com/maps/search/?api=1&query=1325+N+Beach+St+Philadelphia+PA+19125',
  },
  {
    id: 'location-1',
    slug: '40forty-padel-club',
    title: '40Forty Padel Club',
    address: '15 Jenkins Ct Suite B, Mauldin, SC 29662',
    region: 'east',
    lat: 34.782,
    lng: -82.3091,
    image: 'https://blancapadel.com/cdn/shop/files/40Forty.jpg?v=1788900607',
    url: 'https://www.google.com/maps/search/?api=1&query=15+Jenkins+Ct+Suite+B+Mauldin+SC+29662',
  },
  {
    id: 'location-11',
    slug: 'taktika-padel',
    title: 'Taktika Padel',
    address: '4490 W Point Loma Blvd, San Diego, CA 92107',
    region: 'west',
    lat: 32.7533,
    lng: -117.2346,
    image: 'https://blancapadel.com/cdn/shop/files/2024-07-22.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=4490+W+Point+Loma+Blvd+San+Diego+CA+92107',
  },
  {
    id: 'location-12',
    slug: 'the-king-of-padel',
    title: 'The King of Padel',
    address: '4370 Jutland Dr, San Diego, CA 92117',
    region: 'west',
    lat: 32.8229,
    lng: -117.2023,
    image: 'https://blancapadel.com/cdn/shop/files/2024-08-01.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=4370+Jutland+Dr+San+Diego+CA+92117',
  },
  {
    id: 'location-15',
    slug: 'the-padel-courts',
    title: 'The Padel Courts',
    address: '5115 W Sunset Blvd, Los Angeles, CA 90027',
    region: 'west',
    lat: 34.098,
    lng: -118.3005,
    image: 'https://blancapadel.com/cdn/shop/files/2024-02-14.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=5115+W+Sunset+Blvd+Los+Angeles+CA+90027',
  },
  {
    id: 'location-9',
    slug: 'spin-padel',
    title: 'Spin Padel',
    address: 'Vía Rápida Ote. 11942-2, Buena Vista, Sepanal, 22415 Tijuana, B.C., Mexico',
    region: 'mexico',
    lat: 32.518,
    lng: -117.0157,
    image: 'https://blancapadel.com/cdn/shop/files/2024-08-29.jpg?v=1733940003',
    url: 'https://www.google.com/maps/search/?api=1&query=Spin+Padel+Tijuana',
  },
  {
    id: 'location-14',
    slug: 'the-padel-club-georgetown',
    title: 'The Padel Club Georgetown',
    address: 'Lot 36 First Avenue Subryanville, Georgetown, Guyana',
    region: 'latam',
    lat: 6.8164,
    lng: -58.1408,
    image: 'https://blancapadel.com/cdn/shop/files/2024-09-05.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=The+Padel+Club+Georgetown+Guyana',
  },
  {
    id: 'location-8',
    slug: 'sensa-padel-boston',
    title: 'Sensa Padel - Boston',
    address: '1 Westinghouse Plaza Building G, Boston, MA 02136',
    region: 'east',
    lat: 42.2472,
    lng: -71.1303,
    image: 'https://blancapadel.com/cdn/shop/files/2024-05-15.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=1+Westinghouse+Plaza+Boston+MA+02136',
  },
  {
    id: 'location-5',
    slug: 'costa-padel',
    title: 'Costa Padel',
    address: 'Jl. Arteri Klp. Gading, RT.1/RW.1, Pegangsaan Dua, Jakarta Utara, DKI Jakarta',
    region: 'asia',
    lat: -6.177,
    lng: 106.9133,
    image: 'https://blancapadel.com/cdn/shop/files/Costa_Padel.jpg?v=1788898937',
    url: 'https://www.google.com/maps/search/?api=1&query=Costa+Padel+Kelapa+Gading+Jakarta',
  },
  {
    id: 'location-7',
    slug: 'reset-social-club',
    title: 'Reset Social Club',
    address: 'SCBD Park, Jl. Jend. Sudirman kav 52-53 Lot 8, Senayan, Jakarta Selatan',
    region: 'asia',
    lat: -6.2255,
    lng: 106.8088,
    image: 'https://blancapadel.com/cdn/shop/files/2024-01-23.jpg?v=1744136063',
    url: 'https://www.google.com/maps/search/?api=1&query=Reset+Social+Club+SCBD+Park+Jakarta',
  },
]

export default function BlancaLocations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLocationId, setActiveLocationId] = useState<string>('location-2')
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'map' | 'list'>('list')

  // Filter lokasi berdasarkan keyword pencarian atau filter region klik marker
  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter((loc) => {
      const matchSearch =
        loc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRegion = selectedRegion ? loc.region === selectedRegion : true
      return matchSearch && matchRegion
    })
  }, [searchQuery, selectedRegion])

  const handleSelectLocation = (id: string, region: Location['region']) => {
    setActiveLocationId(id)
    setSelectedRegion(region)
  }

  return (
    <section
      id="find-a-club"
      className="locations relative w-full bg-[#161616] text-[#fcfcfc] overflow-hidden pt-[64px] mdw:pt-[110px] pb-[80px] mdw:pb-[140px] font-aeonik"
    >
      <div className="container site-grid gap-y-[40px] mdw:gap-y-[80px] overflow-hidden">
        {/* Header Bagian Kiri: Judul Besar */}
        <div className="col-span-12 mdw:col-span-8">
          <h2 className="w-full max-w-[818px] text-[44px] sm:text-[56px] mdw:text-[76px] lg:text-[88px] font-normal leading-[1.02] tracking-[-1px] text-[#fcfcfc]">
            Blanca is much closer than you think
          </h2>
        </div>

        {/* Header Bagian Kanan: Paragraf Deskripsi Font 32px */}
        <div className="col-span-12 mdw:col-span-3 mdw:col-start-10 flex flex-col justify-end">
          <p className="text-[22px] mdw:text-[32px] text-[#bfbfbf] font-light leading-snug">
            Made from the highest quality materials and latest technology used by the big brand padel companies for a fraction of the price.
          </p>
        </div>

        {/* Layout Kontainer Utama 2 Kolom (Map & Daftar Klub) */}
        <search className="col-span-12 flex flex-col md:flex-row gap-[12px] mdw:gap-[16px] h-auto md:h-[647px] items-stretch">
          {/* Sisi Kiri: Dark Stylized Mapbox Interactive Map */}
          <div
            id="map"
            className={`bg-[#1c1c1c]/90 border border-white/[0.08] backdrop-blur-[7px] grow w-full md:max-w-[calc(100%-380px)] mdw:max-w-[calc(100%-510px)] h-[440px] md:h-full rounded-[8px] overflow-hidden relative select-none ${
              mobileView === 'list' ? 'max-md:hidden' : 'max-md:block'
            }`}
          >
            {/* Dark Styled World Map SVG Canvas */}
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full object-cover pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Lautan Background Gelap */}
              <rect width="1000" height="650" fill="#141517" />

              {/* Grid Garis Lintang Bujur Halus */}
              <g stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.5">
                <line x1="0" y1="162" x2="1000" y2="162" />
                <line x1="0" y1="325" x2="1000" y2="325" />
                <line x1="0" y1="487" x2="1000" y2="487" />
                <line x1="250" y1="0" x2="250" y2="650" />
                <line x1="500" y1="0" x2="500" y2="650" />
                <line x1="750" y1="0" x2="750" y2="650" />
              </g>

              {/* Vektor Benua Dunia Minimalis Warna Gelap */}
              <g fill="#222428" stroke="#2d3036" strokeWidth="0.8">
                {/* Amerika Utara & Greenland */}
                <path d="M70,70 L210,50 L270,70 L310,130 L290,160 L330,190 L320,230 L270,250 L230,290 L200,340 L160,340 L130,300 L110,240 L80,210 L50,150 Z" />
                <path d="M220,50 L270,30 L300,50 L280,80 L230,70 Z" />

                {/* Amerika Selatan */}
                <path d="M190,370 L260,370 L310,430 L280,510 L250,560 L230,590 L210,530 L190,440 Z" />

                {/* Eropa & Rusia Barat */}
                <path d="M370,120 L440,110 L480,90 L520,130 L490,180 L440,220 L390,220 L370,180 L350,150 Z" />
                <path d="M360,110 L380,100 L370,130 L350,130 Z" />

                {/* Afrika */}
                <path d="M370,240 L450,230 L490,280 L520,360 L490,460 L440,510 L400,470 L360,340 L350,270 Z" />

                {/* Asia & Rusia */}
                <path d="M490,90 L750,70 L860,110 L890,170 L830,240 L730,250 L680,310 L620,320 L580,260 L520,210 L500,140 Z" />
                <path d="M600,280 L670,270 L650,370 L610,360 Z" />

                {/* Asia Tenggara & Kepulauan Indonesia */}
                <path d="M690,330 L730,320 L760,370 L720,410 L690,360 Z" />
                <path d="M710,430 L770,440 L760,460 L700,450 Z" />
                <path d="M780,420 L830,430 L810,460 L770,450 Z" />

                {/* Australia */}
                <path d="M750,470 L870,460 L890,530 L840,590 L770,580 L730,520 Z" />
              </g>

              {/* Label Tipografi Geografis Halus Warna Abu-abu */}
              <g fill="#686c75" fontSize="10" fontFamily="sans-serif" letterSpacing="0.8">
                <text x="130" y="210">NORTH AMERICA</text>
                <text x="140" y="235" fontSize="8" fill="#4d5057">United States</text>
                <text x="140" y="165" fontSize="8" fill="#4d5057">Canada</text>
                <text x="215" y="470">SOUTH AMERICA</text>
                <text x="210" y="495" fontSize="8" fill="#4d5057">Brazil</text>
                <text x="420" y="170">EUROPE</text>
                <text x="405" y="370">AFRICA</text>
                <text x="640" y="190">ASIA</text>
                <text x="790" y="520">AUSTRALIA</text>
                <text x="260" y="270" fontSize="9" fill="#45484f">North Atlantic Ocean</text>
                <text x="310" y="530" fontSize="9" fill="#45484f">South Atlantic Ocean</text>
                <text x="560" y="490" fontSize="9" fill="#45484f">Indian Ocean</text>
              </g>
            </svg>

            {/* Marker Interaktif 1: West Coast US (California) - Cluster 15 */}
            <button
              type="button"
              onClick={() => setSelectedRegion(selectedRegion === 'west' ? null : 'west')}
              className={`absolute top-[28%] left-[13%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all duration-300 shadow-xl ${
                selectedRegion === 'west'
                  ? 'bg-[#f2d953] text-black scale-125 ring-4 ring-[#f2d953]/40 ring-offset-2 ring-offset-black'
                  : 'bg-white text-black hover:scale-110 hover:bg-[#f2d953]'
              }`}
              title="West Coast US (15 locations)"
            >
              15
            </button>

            {/* Marker Interaktif 2: Mexico / Baja - Blanca Icon Marker */}
            <button
              type="button"
              onClick={() => setSelectedRegion(selectedRegion === 'mexico' ? null : 'mexico')}
              className={`absolute top-[39%] left-[17%] -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl ${
                selectedRegion === 'mexico'
                  ? 'bg-[#f2d953] text-black scale-125 ring-4 ring-[#f2d953]/40'
                  : 'bg-white text-black hover:scale-110'
              }`}
              title="Mexico (Spin Padel)"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <line x1="3" y1="13" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Marker Interaktif 3: East Coast US (Florida / NY / PA) - Cluster 22 */}
            <button
              type="button"
              onClick={() => setSelectedRegion(selectedRegion === 'east' ? null : 'east')}
              className={`absolute top-[31%] left-[24%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all duration-300 shadow-xl ${
                selectedRegion === 'east'
                  ? 'bg-[#f2d953] text-black scale-125 ring-4 ring-[#f2d953]/40 ring-offset-2 ring-offset-black'
                  : 'bg-white text-black hover:scale-110 hover:bg-[#f2d953]'
              }`}
              title="East Coast US (22 locations)"
            >
              22
            </button>

            {/* Marker Interaktif 4: South America (Guyana) - Blanca Icon */}
            <button
              type="button"
              onClick={() => setSelectedRegion(selectedRegion === 'latam' ? null : 'latam')}
              className={`absolute top-[48%] left-[28%] -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl ${
                selectedRegion === 'latam'
                  ? 'bg-[#f2d953] text-black scale-125 ring-4 ring-[#f2d953]/40'
                  : 'bg-white text-black hover:scale-110'
              }`}
              title="South America"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <line x1="3" y1="13" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Marker Interaktif 5: Europe (Madrid / Paris) - Blanca Icon */}
            <button
              type="button"
              onClick={() => setSelectedRegion(selectedRegion === 'europe' ? null : 'europe')}
              className={`absolute top-[26%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl ${
                selectedRegion === 'europe'
                  ? 'bg-[#f2d953] text-black scale-125 ring-4 ring-[#f2d953]/40'
                  : 'bg-white text-black hover:scale-110'
              }`}
              title="Europe"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <line x1="3" y1="13" x2="13" y2="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Marker Interaktif 6: Asia (Jakarta / Southeast Asia) - Cluster 8 */}
            <button
              type="button"
              onClick={() => setSelectedRegion(selectedRegion === 'asia' ? null : 'asia')}
              className={`absolute top-[58%] left-[75%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition-all duration-300 shadow-xl ${
                selectedRegion === 'asia'
                  ? 'bg-[#f2d953] text-black scale-125 ring-4 ring-[#f2d953]/40 ring-offset-2 ring-offset-black'
                  : 'bg-white text-black hover:scale-110 hover:bg-[#f2d953]'
              }`}
              title="Southeast Asia (8 locations)"
            >
              8
            </button>

            {/* Mapbox Watermark Logo di Kiri Bawah Sesuai Screenshot */}
            <div className="absolute left-4 bottom-4 flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs font-semibold tracking-wider text-white">mapbox</span>
            </div>

            {/* Filter Reset Button jika region terpilih */}
            {selectedRegion && (
              <div className="absolute top-4 left-4 z-10">
                <button
                  type="button"
                  onClick={() => setSelectedRegion(null)}
                  className="px-3 py-1 bg-black/70 hover:bg-black text-xs text-neutral-300 rounded-full border border-white/20 flex items-center gap-1.5 backdrop-blur-md cursor-pointer transition-colors"
                >
                  <span>Filtered: {selectedRegion.toUpperCase()}</span>
                  <span className="font-bold text-[#f2d953]">×</span>
                </button>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Panel Pencarian & Scrollable List Lokasi Klub */}
          <div
            className={`w-full md:max-w-[380px] mdw:max-w-[504px] shrink-0 h-[560px] md:h-full flex flex-col bg-[#1c1c1c]/90 border border-white/[0.08] backdrop-blur-[7px] rounded-[8px] overflow-hidden ${
              mobileView === 'map' ? 'max-md:hidden' : 'max-md:flex'
            }`}
          >
            {/* Header Form Pencarian */}
            <div className="p-4 sm:p-6 mdw:p-8 border-b border-white/[0.08]">
              <h3 className="text-xl mdw:text-2xl font-normal text-white">
                Find a club or store near me
              </h3>

              {/* Input Pencarian dengan Icon Magnifier */}
              <div className="relative mt-4 w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8e8e]">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Enter city, ZIP, or location"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#262626] border border-white/[0.1] focus:border-white/40 focus:outline-none rounded-md py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#8e8e8e] transition-colors"
                />
              </div>

              {/* Status Jumlah Lokasi & Tombol GPS Location */}
              <div className="flex flex-row items-center justify-between mt-3 text-xs text-[#8e8e8e]">
                <span>{filteredLocations.length} locations found</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('San Diego')}
                  className="flex items-center gap-1 text-[#bfbfbf] hover:text-white transition-colors cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <circle cx="10" cy="10" r="7" strokeWidth="1.5" />
                    <circle cx="10" cy="10" r="2.5" fill="currentColor" />
                    <line x1="10" y1="1" x2="10" y2="4" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="10" y1="16" x2="10" y2="19" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="1" y1="10" x2="4" y2="10" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="16" y1="10" x2="19" y2="10" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span>Use my current location</span>
                </button>
              </div>
            </div>

            {/* Mobile View Toggle Buttons */}
            <div className="md:hidden flex border-b border-white/[0.08] text-sm">
              <button
                type="button"
                onClick={() => setMobileView('map')}
                className={`flex-1 py-3 text-center transition-colors ${
                  mobileView === 'map'
                    ? 'text-white border-b-2 border-[#f2d953] font-medium'
                    : 'text-[#8e8e8e]'
                }`}
              >
                Map view
              </button>
              <button
                type="button"
                onClick={() => setMobileView('list')}
                className={`flex-1 py-3 text-center transition-colors ${
                  mobileView === 'list'
                    ? 'text-white border-b-2 border-[#f2d953] font-medium'
                    : 'text-[#8e8e8e]'
                }`}
              >
                List view
              </button>
            </div>

            {/* Scrollable List Lokasi Klub */}
            <ul className="flex-1 overflow-y-auto divide-y divide-white/[0.06] p-0 m-0 list-none">
              {filteredLocations.map((loc) => {
                const isActive = loc.id === activeLocationId
                return (
                  <li
                    key={loc.id}
                    onClick={() => handleSelectLocation(loc.id, loc.region)}
                    className={`flex flex-row items-center gap-x-4 p-4 mdw:p-6 transition-colors duration-150 cursor-pointer ${
                      isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Thumbnail Foto Klub */}
                    <div className="shrink-0 w-[72px] h-[72px] mdw:w-[88px] mdw:h-[88px] rounded-[6px] overflow-hidden bg-neutral-800 border border-white/10">
                      <img
                        src={loc.image}
                        alt={loc.title}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback gambar jika link eksternal gagal dimuat
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                    </div>

                    {/* Informasi Teks Klub */}
                    <div className="flex-1 min-w-0 flex flex-col items-start">
                      <h4 className="text-sm mdw:text-base font-normal text-white truncate w-full">
                        {loc.title}
                      </h4>
                      <p className="text-xs text-[#bfbfbf] font-light leading-snug mt-1 line-clamp-2">
                        {loc.address}
                      </p>
                      <a
                        href={loc.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-[#8e8e8e] hover:text-white transition-colors mt-2 inline-flex items-center gap-1"
                      >
                        <span>Go to website</span>
                        <span>&rarr;</span>
                      </a>
                    </div>

                    {/* Tombol Kuning 'Go >' Khas Blanca */}
                    <div className="shrink-0 pl-1">
                      <a
                        href={loc.url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#f2d953] hover:bg-[#ffe769] text-black font-medium text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow-sm"
                      >
                        <span>Go</span>
                        <span className="text-[10px] font-bold">&gt;</span>
                      </a>
                    </div>
                  </li>
                )
              })}

              {filteredLocations.length === 0 && (
                <li className="p-8 text-center text-sm text-neutral-400">
                  No locations found matching &quot;{searchQuery}&quot;
                </li>
              )}
            </ul>
          </div>
        </search>
      </div>
    </section>
  )
}
