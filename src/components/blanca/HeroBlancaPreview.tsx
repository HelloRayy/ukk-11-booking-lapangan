import HeroBlanca from './HeroBlanca'
import BlancaDifference from './BlancaDifference'
import BlancaTechnology from './BlancaTechnology'
import BlancaLocations from './BlancaLocations'

export default function HeroBlancaPreview() {
  return (
    <div className="w-full min-h-screen text-[#fcfcfc] bg-dots">
      <HeroBlanca />
      <BlancaDifference />
      <BlancaTechnology />
      <BlancaLocations />
    </div>
  )
}
