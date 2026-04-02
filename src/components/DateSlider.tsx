import { useRef, useEffect } from 'react'
import { format, addDays, subDays, parseISO, isToday } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Props {
  selectedDate: Date
  onSelect: (date: Date) => void
}

export function DateSlider({ selectedDate, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayRef = useRef<HTMLButtonElement>(null)

  // 오늘 기준 ±30일
  const today = new Date()
  const start = subDays(today, 30)
  const days = Array.from({ length: 61 }, (_, i) => addDays(start, i))

  useEffect(() => {
    todayRef.current?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [])

  const selectedStr = format(selectedDate, 'yyyyMMdd')

  return (
    <div className="bg-[#0f0f1a] border-b border-gray-800">
      {/* 월 레이블 */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-[13px] font-medium text-gray-300">
          {format(selectedDate, 'yyyy년 M월 d일', { locale: ko })}
        </span>
        <button
          onClick={() => onSelect(today)}
          className="text-[11px] text-[#f97316] border border-[#f97316]/30 px-2 py-[2px] rounded-full"
        >
          오늘
        </button>
      </div>

      {/* 날짜 스크롤 */}
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto px-3 pb-3 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map(day => {
          const str = format(day, 'yyyyMMdd')
          const isSelected = str === selectedStr
          const isTodayDay = isToday(day)
          const dow = format(day, 'E', { locale: ko })
          const d = format(day, 'd')
          const isSun = day.getDay() === 0
          const isSat = day.getDay() === 6

          return (
            <button
              key={str}
              ref={isTodayDay ? todayRef : undefined}
              onClick={() => onSelect(day)}
              className={`
                flex flex-col items-center min-w-[40px] py-2 px-1 rounded-xl transition-colors flex-shrink-0
                ${isSelected ? 'bg-[#f97316]' : 'bg-transparent'}
              `}
            >
              <span className={`text-[10px] mb-1 ${
                isSelected ? 'text-white/80' :
                isSun ? 'text-[#ef4444]' :
                isSat ? 'text-[#60a5fa]' :
                'text-gray-600'
              }`}>{dow}</span>
              <span className={`text-[14px] font-medium ${
                isSelected ? 'text-white' :
                isTodayDay ? 'text-[#f97316]' :
                isSun ? 'text-[#ef4444]' :
                isSat ? 'text-[#60a5fa]' :
                'text-gray-300'
              }`}>{d}</span>
              {isTodayDay && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-[#f97316] mt-1" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
