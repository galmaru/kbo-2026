import { useState, useMemo } from 'react'
import { format, startOfMonth, getDaysInMonth, getDay, addMonths, subMonths, isSameMonth } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useMonthlySchedule } from '../hooks/useMonthlySchedule'
import { TEAMS } from '../constants'
import type { Game } from '../types'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

interface Props {
  isFavorite: (teamId: string) => boolean
  onDateSelect: (date: Date) => void // 날짜 탭으로 이동
}

export function CalendarTab({ isFavorite, onDateSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null)

  const { gameMap, loading } = useMonthlySchedule(currentMonth)

  // 달력 그리드 생성
  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(currentMonth)
    const totalDays = getDaysInMonth(currentMonth)
    const startWeekday = getDay(firstDay) // 0=일, 6=토

    const days: (number | null)[] = Array(startWeekday).fill(null)
    for (let d = 1; d <= totalDays; d++) days.push(d)
    // 6줄 맞추기
    while (days.length % 7 !== 0) days.push(null)
    return days
  }, [currentMonth])

  const toDateStr = (day: number) =>
    format(currentMonth, 'yyyy') + format(currentMonth, 'MM') + String(day).padStart(2, '0')

  const selectedGames = selectedDateStr ? (gameMap[selectedDateStr] ?? []) : []

  const today = format(new Date(), 'yyyyMMdd')

  return (
    <div className="flex flex-col pb-20">
      {/* 월 네비게이션 */}
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={() => { setCurrentMonth(subMonths(currentMonth, 1)); setSelectedDateStr(null) }}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 active:bg-gray-800"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="text-[16px] font-semibold">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <button
          onClick={() => { setCurrentMonth(addMonths(currentMonth, 1)); setSelectedDateStr(null) }}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 active:bg-gray-800"
          disabled={isSameMonth(currentMonth, addMonths(new Date(), 2))}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 px-2 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[11px] font-medium py-1 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      {loading ? (
        <div className="grid grid-cols-7 px-2 gap-y-1">
          {Array(35).fill(0).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-[#13121c] animate-pulse mx-0.5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 px-2 gap-y-1">
          {calendarDays.map((day, i) => {
            if (!day) return <div key={i} />

            const dateStr = toDateStr(day)
            const games = gameMap[dateStr] ?? []
            const hasFavGame = games.some(g => isFavorite(g.homeTeamId) || isFavorite(g.awayTeamId))
            const hasGame = games.length > 0
            const isToday = dateStr === today
            const isSelected = dateStr === selectedDateStr
            const weekday = (i % 7)

            return (
              <button
                key={i}
                onClick={() => setSelectedDateStr(isSelected ? null : dateStr)}
                className={`
                  relative flex flex-col items-center pt-1.5 pb-1 mx-0.5 rounded-xl transition-colors
                  ${isSelected ? 'bg-[#f97316]/20 border border-[#f97316]/40' : 'active:bg-gray-800'}
                `}
              >
                <span className={`
                  text-[13px] font-medium w-7 h-7 flex items-center justify-center rounded-full
                  ${isToday ? 'bg-[#f97316] text-white font-bold' : ''}
                  ${!isToday && weekday === 0 ? 'text-red-400' : ''}
                  ${!isToday && weekday === 6 ? 'text-blue-400' : ''}
                  ${!isToday && weekday > 0 && weekday < 6 ? 'text-gray-200' : ''}
                `}>
                  {day}
                </span>

                {/* 경기 도트 */}
                <div className="flex gap-[3px] mt-1 h-[5px]">
                  {hasFavGame && (
                    <span className="w-[5px] h-[5px] rounded-full bg-[#f97316]" />
                  )}
                  {hasGame && !hasFavGame && (
                    <span className="w-[5px] h-[5px] rounded-full bg-gray-600" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* 범례 */}
      <div className="flex items-center gap-4 px-4 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-[6px] h-[6px] rounded-full bg-[#f97316]" />
          <span className="text-[10px] text-gray-500">즐겨찾기 팀 경기</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-[6px] h-[6px] rounded-full bg-gray-600" />
          <span className="text-[10px] text-gray-500">경기 있음</span>
        </div>
      </div>

      {/* 선택한 날짜의 경기 목록 */}
      {selectedDateStr && (
        <div className="mx-3 mt-4 rounded-2xl bg-[#13121c] border border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <span className="text-[13px] font-semibold">
              {format(
                new Date(
                  Number(selectedDateStr.slice(0, 4)),
                  Number(selectedDateStr.slice(4, 6)) - 1,
                  Number(selectedDateStr.slice(6, 8))
                ),
                'M월 d일 (EEE)',
                { locale: ko }
              )}
            </span>
            <button
              onClick={() => onDateSelect(
                new Date(
                  Number(selectedDateStr.slice(0, 4)),
                  Number(selectedDateStr.slice(4, 6)) - 1,
                  Number(selectedDateStr.slice(6, 8))
                )
              )}
              className="text-[11px] text-[#f97316]"
            >
              상세보기 →
            </button>
          </div>

          {selectedGames.length === 0 ? (
            <div className="py-6 text-center text-gray-600 text-[13px]">경기 없음</div>
          ) : (
            <div className="divide-y divide-gray-800/60">
              {selectedGames.map(game => (
                <MiniGameRow key={game.gameId} game={game} isFavorite={isFavorite} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MiniGameRow({ game, isFavorite }: { game: Game; isFavorite: (id: string) => boolean }) {
  const home = TEAMS[game.homeTeamId]
  const away = TEAMS[game.awayTeamId]
  if (!home || !away) return null

  const isFav = isFavorite(game.homeTeamId) || isFavorite(game.awayTeamId)
  const isLive = game.status === 'live'
  const isFinal = game.status === 'final'

  return (
    <div className={`flex items-center justify-between px-4 py-2.5 ${isFav ? 'bg-[#f97316]/5' : ''}`}>
      {/* 팀 이름 */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isFav && <span className="w-[3px] h-[3px] rounded-full bg-[#f97316] flex-shrink-0" />}
        <span className="text-[12px] text-gray-300 truncate">
          {away.shortName} <span className="text-gray-600">vs</span> {home.shortName}
        </span>
      </div>

      {/* 스코어 or 시간 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isLive && (
          <span className="text-[10px] text-[#ff6b6b] font-bold flex items-center gap-1">
            <span className="w-[4px] h-[4px] rounded-full bg-[#e03] animate-pulse inline-block" />
            LIVE
          </span>
        )}
        {(isLive || isFinal) && game.awayScore != null && game.homeScore != null ? (
          <span className="text-[12px] font-bold text-white tabular-nums">
            {game.awayScore} : {game.homeScore}
          </span>
        ) : game.status === 'scheduled' ? (
          <span className="text-[12px] text-gray-500">{game.time}</span>
        ) : (
          <span className="text-[11px] text-gray-600 border border-gray-700 px-1.5 py-[1px] rounded-full">
            {game.status === 'postponed' ? '순연' : game.status === 'cancelled' ? '취소' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
