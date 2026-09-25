// PERAN FILE: Tampilan transisi loading animasi saat menyiapkan QRIS atau memverifikasi pembayaran
interface PaymentLoadingViewProps {
  title?: string
  subtitle?: string
}

export default function PaymentLoadingView({
  title = 'Menyiapkan Pembayaran',
  subtitle = 'Menghubungkan ke sistem QRIS Dinamis...',
}: PaymentLoadingViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in fade-in duration-200 select-none font-aeonik">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#f2d953] animate-spin" />
        <div className="absolute inset-0 rounded-full bg-[#f2d953]/10 blur-sm animate-pulse" />
      </div>
      <h3 className="text-base font-bold text-white mb-1 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-[#8e8e8e] max-w-[240px] leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}
