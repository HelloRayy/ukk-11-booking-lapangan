export function calculateBookingCost(durationHours: number, ratePerHour: number) {
  const totalCost = durationHours * ratePerHour
  const downPayment = totalCost * 0.5
  const remainingCost = totalCost - downPayment

  return {
    totalBayar: totalCost,
    nominalDP: downPayment,
    sisaBayar: remainingCost,
    totalCost,
    downPayment,
    remainingCost,
  }
}

export const hitungBiayaBooking = calculateBookingCost
