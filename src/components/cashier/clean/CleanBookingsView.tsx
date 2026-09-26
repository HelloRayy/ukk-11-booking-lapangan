import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Download,
  Plus,
  Clock,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Receipt,
  CreditCard,
} from 'lucide-react'
import type { Lapangan, Booking } from '../../../types/database'
import { formatRupiah, formatDisplayDate, getTodayISODate } from '../../../utils/formatters'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { Card, CardContent } from '../../ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../ui/table'

interface CleanBookingsViewProps {
  courts: Lapangan[]
  bookings: Booking[]
  onOpenWalkin: () => void
  onSelectBooking: (booking: Booking) => void
  onQuickLunasi: (booking: Booking) => void
}

type StatusFilterType = 'SEMUA' | 'DP' | 'LUNAS' | 'BATAL'
type DateFilterType = 'SEMUA' | 'HARI_INI' | 'BESOK' | 'CUSTOM'

export function CleanBookingsView({
  courts,
  bookings,
  onOpenWalkin,
  onSelectBooking,
  onQuickLunasi,
}: CleanBookingsViewProps) {
  const today = getTodayISODate()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('SEMUA')
  const [dateFilter, setDateFilter] = useState<DateFilterType>('SEMUA')
  const [customDate, setCustomDate] = useState(today)

  const tomorrow = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }, [])

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1. Status Filter
      if (statusFilter === 'DP' && (b.status !== 'Booked' || b.sisa_bayar <= 0)) return false
      if (statusFilter === 'LUNAS' && b.status !== 'Lunas') return false
      if (statusFilter === 'BATAL' && b.status !== 'Batal') return false

      // 2. Date Filter
      if (dateFilter === 'HARI_INI' && b.tgl_main !== today) return false
      if (dateFilter === 'BESOK' && b.tgl_main !== tomorrow) return false
      if (dateFilter === 'CUSTOM' && b.tgl_main !== customDate) return false

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const inv = `inv-${b.id.toString().padStart(4, '0')}`.toLowerCase()
        const nama = (b.nama_penyewa || '').toLowerCase()
        const hp = (b.no_hp || '').toLowerCase()

        if (!inv.includes(q) && !nama.includes(q) && !hp.includes(q)) {
          return false
        }
      }

      return true
    })
  }, [bookings, statusFilter, dateFilter, customDate, searchQuery, today, tomorrow])

  // Summary Metrics
  const summary = useMemo(() => {
    let totalKas = 0
    let totalPiutang = 0
    let lunasCount = 0
    let dpCount = 0

    filteredBookings.forEach((b) => {
      if (b.status !== 'Batal') {
        totalKas += b.nominal_dibayar || 0
        totalPiutang += b.sisa_bayar || 0
        if (b.status === 'Lunas') lunasCount++
        else if (b.status === 'Booked' && b.sisa_bayar > 0) dpCount++
      }
    })

    return {
      totalKas,
      totalPiutang,
      lunasCount,
      dpCount,
      count: filteredBookings.length,
    }
  }, [filteredBookings])

  // Export CSV
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      alert('Tidak ada transaksi untuk diekspor.')
      return
    }

    const headers = [
      'No Invoice',
      'Nama Penyewa',
      'WhatsApp',
      'Lapangan',
      'Tanggal Main',
      'Slot Jam',
      'Total Bayar',
      'Nominal Dibayar',
      'Sisa Bayar',
      'Status',
    ]

    const rows = filteredBookings.map((b) => {
      const courtName = courts.find((c) => c.id === b.lapangan_id)?.nama_lapangan || `Lapangan ${b.lapangan_id}`
      return [
        `"INV-${b.id.toString().padStart(4, '0')}"`,
        `"${b.nama_penyewa.replace(/"/g, '""')}"`,
        `"${b.no_hp}"`,
        `"${courtName}"`,
        `"${b.tgl_main}"`,
        `"${(b.jam_slots || []).join('; ')}"`,
        `"${b.total_bayar}"`,
        `"${b.nominal_dibayar}"`,
        `"${b.sisa_bayar}"`,
        `"${b.status}"`,
      ]
    })

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `transaksi-kasir-${today}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full select-none">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Transaksi Terfilter</p>
              <p className="text-2xl font-bold text-zinc-100 mt-1">{summary.count}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Receipt className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Kas Diterima</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">{formatRupiah(summary.totalKas)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Piutang Sisa DP</p>
              <p className="text-lg font-bold text-amber-400 mt-1">{formatRupiah(summary.totalPiutang)}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 bg-zinc-900/60 border-zinc-800">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Rasio Lunas : DP</p>
              <p className="text-lg font-bold text-zinc-100 mt-1">
                <span className="text-emerald-400">{summary.lunasCount}</span>
                <span className="text-zinc-600 mx-1.5">:</span>
                <span className="text-amber-400">{summary.dpCount}</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300">
              <CreditCard className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Filter & Actions Toolbar */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4">
        {/* Search & Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              type="text"
              placeholder="Cari nama penyewa, nomor WhatsApp, atau nomor invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-zinc-950 border-zinc-800 text-sm placeholder:text-zinc-500 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-9 border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100 rounded-lg text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              <span>Ekspor CSV</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenWalkin}
              className="h-9 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-semibold rounded-lg text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Booking Baru</span>
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-zinc-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {(['SEMUA', 'DP', 'LUNAS', 'BATAL'] as StatusFilterType[]).map((st) => (
              <Button
                key={st}
                size="sm"
                variant={statusFilter === st ? 'secondary' : 'ghost'}
                onClick={() => setStatusFilter(st)}
                className={`h-7 px-3 text-xs rounded-md ${
                  statusFilter === st ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'
                }`}
              >
                {st === 'SEMUA' ? 'Semua' : st === 'DP' ? 'DP (Belum Lunas)' : st === 'LUNAS' ? 'Lunas' : 'Batal'}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-zinc-400 mr-1">Tanggal:</span>
            <Button
              size="sm"
              variant={dateFilter === 'SEMUA' ? 'secondary' : 'ghost'}
              onClick={() => setDateFilter('SEMUA')}
              className={`h-7 px-3 text-xs rounded-md ${
                dateFilter === 'SEMUA' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'
              }`}
            >
              Semua
            </Button>
            <Button
              size="sm"
              variant={dateFilter === 'HARI_INI' ? 'secondary' : 'ghost'}
              onClick={() => setDateFilter('HARI_INI')}
              className={`h-7 px-3 text-xs rounded-md ${
                dateFilter === 'HARI_INI' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'
              }`}
            >
              Hari Ini
            </Button>
            <Button
              size="sm"
              variant={dateFilter === 'BESOK' ? 'secondary' : 'ghost'}
              onClick={() => setDateFilter('BESOK')}
              className={`h-7 px-3 text-xs rounded-md ${
                dateFilter === 'BESOK' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400'
              }`}
            >
              Besok
            </Button>
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-md px-2 py-0.5">
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value)
                  setDateFilter('CUSTOM')
                }}
                className="bg-transparent text-xs text-zinc-300 outline-hidden cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-800 bg-zinc-950/80">
              <TableHead className="w-[120px]">Invoice</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Lapangan & Jadwal</TableHead>
              <TableHead>Total Tarif</TableHead>
              <TableHead>Terbayar</TableHead>
              <TableHead>Sisa Tagihan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-zinc-500 text-sm">
                  Tidak ada transaksi yang sesuai dengan filter atau kata kunci.
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((b) => {
                const inv = `INV-${b.id.toString().padStart(4, '0')}`
                const isLunas = b.status === 'Lunas'
                const isDP = b.status === 'Booked' && b.sisa_bayar > 0
                const isBatal = b.status === 'Batal'
                const courtName = courts.find((c) => c.id === b.lapangan_id)?.nama_lapangan || `Lapangan ${b.lapangan_id}`

                return (
                  <TableRow key={b.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30">
                    <TableCell className="font-mono text-sm font-semibold text-zinc-100">
                      <div className="flex flex-col">
                        <span>{inv}</span>
                        <span className="text-xs text-zinc-500 font-sans">
                          {b.created_at ? new Date(b.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-100 text-sm">{b.nama_penyewa}</span>
                        <a
                          href={`https://wa.me/${b.no_hp.replace(/^0/, '62')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{b.no_hp}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-200 text-sm">{courtName}</span>
                        <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {b.tgl_main} ({(b.jam_slots || []).join(', ')})
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="font-semibold text-zinc-200 text-sm">
                      {formatRupiah(b.total_bayar)}
                    </TableCell>

                    <TableCell className="font-semibold text-emerald-400 text-sm">
                      {formatRupiah(b.nominal_dibayar)}
                    </TableCell>

                    <TableCell className="text-sm">
                      {b.sisa_bayar > 0 ? (
                        <span className="font-bold text-amber-400">{formatRupiah(b.sisa_bayar)}</span>
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {isLunas && <Badge variant="success">Lunas</Badge>}
                      {isDP && <Badge variant="warning">DP 50%</Badge>}
                      {isBatal && <Badge variant="secondary">Batal</Badge>}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isDP && (
                          <Button
                            size="sm"
                            onClick={() => onQuickLunasi(b)}
                            className="h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-md shadow-xs"
                          >
                            <CreditCard className="w-3.5 h-3.5 mr-1" />
                            <span>Lunasi</span>
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectBooking(b)}
                          className="h-8 px-3 text-xs border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100 rounded-md"
                        >
                          Detail
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
