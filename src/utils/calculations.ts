// fungsi hitung total sewa, dp 50 persen, sama sisa pelunasan
export function hitungBiayaBooking(durasiJam: number, tarifPerJam: number) {
  const totalBayar = durasiJam * tarifPerJam
  const nominalDP = totalBayar * 0.5 // dp 50% buat tanda jadi
  const sisaBayar = totalBayar - nominalDP

  return {
    totalBayar,
    nominalDP,
    sisaBayar,
  }
}
