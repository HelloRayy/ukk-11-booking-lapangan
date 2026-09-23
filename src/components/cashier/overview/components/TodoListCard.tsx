// PERAN FILE: Kartu 4 - Daftar Tugas Kasir (To do List & Action Items)
import type { TodoItem } from '../types'

interface Props {
  items: TodoItem[]
  onItemClick?: (item: TodoItem) => void
}

export default function TodoListCard({ items, onItemClick }: Props) {
  const getBadgeStyle = (variant: TodoItem['badgeVariant']) => {
    switch (variant) {
      case 'unpaid':
        return 'bg-red-500/15 text-red-400 border-red-500/20'
      case 'request':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
      case 'block':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/20'
      case 'conflict':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/20'
      default:
        return 'bg-white/10 text-white border-white/10'
    }
  }

  return (
    <div className="rounded-2xl p-5 border border-[#262626] bg-[#1a1a1a] flex flex-col justify-between min-h-[220px] shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-white tracking-tight">To do List</h3>
        <span className="text-[11px] text-[#8e8e8e]">{items.length} Pending Actions</span>
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all cursor-pointer group"
          >
            <div className="flex-1 pr-2 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white truncate block">
                  {item.title}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${getBadgeStyle(item.badgeVariant)}`}>
                  {item.badgeText}
                </span>
              </div>
              <span className="text-[11px] text-[#8e8e8e] truncate block mt-0.5">
                {item.subtitle}
              </span>
            </div>

            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#555] group-hover:text-white transition-colors shrink-0"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  )
}
