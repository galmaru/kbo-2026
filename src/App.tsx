import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { DateSlider } from './components/DateSlider'
import { GameCard } from './components/GameCard'
import { FavoritesTab } from './components/FavoritesTab'
import { StandingsTab } from './components/StandingsTab'
import { useSchedule } from './hooks/useSchedule'
import { useFavorites } from './hooks/useFavorites'

type Tab = 'schedule' | 'standings' | 'favorites'

export default function App() {
  const [tab, setTab] = useState<Tab>('schedule')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const { favorites, toggle, isFavorite } = useFavorites()

  const dateStr = format(selectedDate, 'yyyyMMdd')
  const { games, loading } = useSchedule(dateStr)

  const sortedGames = useMemo(() => {
    return [...games].sort((a, b) => {
      // 즐겨찾기 팀 경기 상단
      const aFav = isFavorite(a.homeTeamId) || isFavorite(a.awayTeamId) ? 0 : 1
      const bFav = isFavorite(b.homeTeamId) || isFavorite(b.awayTeamId) ? 0 : 1
      if (aFav !== bFav) return aFav - bFav
      // 라이브 > 예정 > 종료
      const order: Record<string, number> = { live: 0, scheduled: 1, final: 2, cancelled: 3, postponed: 3 }
      return (order[a.status] ?? 9) - (order[b.status] ?? 9)
    })
  }, [games, isFavorite])

  const liveCount = games.filter(g => g.status === 'live').length

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white flex justify-center">
      <div className="w-full max-w-md flex flex-col min-h-screen">

        {/* 헤더 */}
        <div className="bg-[#0f0f1a] border-b border-gray-800 px-4 pt-12 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-bold tracking-tight">
              ⚾ <span className="text-white">KBO</span>
              <span className="text-gray-500 font-normal text-[16px] ml-1">일정</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {liveCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] bg-[#e03]/20 text-[#ff6b6b] border border-[#e03]/30 px-2 py-1 rounded-full">
                <span className="w-[5px] h-[5px] rounded-full bg-[#e03] animate-pulse inline-block" />
                {liveCount}경기 진행중
              </span>
            )}
          </div>
        </div>

        {/* 날짜 슬라이더 (일정 탭에서만) */}
        {tab === 'schedule' && (
          <DateSlider selectedDate={selectedDate} onSelect={setSelectedDate} />
        )}

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'schedule' && (
            <div className="px-3 pt-3 pb-20">
              {loading ? (
                <LoadingSkeleton />
              ) : sortedGames.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <p className="text-[11px] text-gray-600 px-1 mb-2">
                    {sortedGames.length}경기 · {format(selectedDate, 'M월 d일')}
                    {liveCount > 0 && <span className="text-[#e03] ml-1">· {liveCount}경기 LIVE</span>}
                  </p>
                  {sortedGames.map(game => (
                    <GameCard
                      key={game.gameId}
                      game={game}
                      isFavoriteGame={isFavorite(game.homeTeamId) || isFavorite(game.awayTeamId)}
                    />
                  ))}
                </>
              )}
            </div>
          )}
          {tab === 'standings' && <StandingsTab />}
          {tab === 'favorites' && (
            <div className="pb-20">
              <FavoritesTab favorites={favorites} onToggle={toggle} />
            </div>
          )}
        </div>

        {/* 하단 탭바 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0f0f1a] border-t border-gray-800 flex z-10">
          {([
            { id: 'schedule', label: '일정', icon: CalendarIcon },
            { id: 'standings', label: '순위', icon: TrophyIcon },
            { id: 'favorites', label: `즐겨찾기${favorites.length > 0 ? ` ${favorites.length}` : ''}`, icon: StarIcon },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                tab === id ? 'text-[#f97316]' : 'text-gray-600'
              }`}
            >
              <Icon active={tab === id} />
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-[#13121c] rounded-2xl border border-gray-800 animate-pulse" />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-4xl mb-3">⚾</span>
      <p className="text-gray-500 text-[14px]">이 날은 경기가 없어요</p>
    </div>
  )
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="14" rx="2" stroke={active ? '#f97316' : '#6b7280'} strokeWidth="1.5"/>
      <path d="M6 2v4M14 2v4M2 8h16" stroke={active ? '#f97316' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function TrophyIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 2h8v8a4 4 0 01-8 0V2zM4 4H2a2 2 0 002 4M16 4h2a2 2 0 01-2 4M10 14v3M7 18h6" stroke={active ? '#f97316' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function StarIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill={active ? '#f97316' : 'none'}>
      <path d="M10 2l2.4 5 5.6.8-4 4 .9 5.6L10 15l-4.9 2.4.9-5.6-4-4 5.6-.8L10 2z" stroke={active ? '#f97316' : '#6b7280'} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}
