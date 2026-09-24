// PERAN FILE: Tampilan transisi loading animasi saat sistem menyiapkan QRIS dinamis (~800ms)
export default function PaymentLoadingView() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in duration-200 select-none font-aeonik">
      <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#f2d953] animate-spin mb-4" />
      <h3 className="text-base font-bold text-white mb-1.5">
        Menyiapkan Kanal Pembayaran
      </h3>
      <p className="text-xs text-[#8e8e8e] max-w-[220px]">
        Menghubungkan ke sistem QRIS Dinamis Blanca Badminton Arena...
      </p>
    </div>
  )
}
