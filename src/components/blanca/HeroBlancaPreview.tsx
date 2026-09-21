// PERAN FILE: Wrapper preview terisolasi untuk pengujian visual Hero Blanca Padel
import HeroBlanca from './HeroBlanca'

export default function HeroBlancaPreview() {
  return (
    <div className="w-full min-h-screen bg-[#161616] text-[#fcfcfc] select-none">
      <HeroBlanca />
    </div>
  )
}
