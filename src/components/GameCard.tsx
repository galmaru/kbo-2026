import type { Game } from '../types'
import { TEAMS, getNaverGameUrl, getTeamInitial } from '../constants'

interface Props {
  game: Game
  isFavoriteGame: boolean
}

export function GameCard({ game, isFavoriteGame }: Props) {
  const home = TEAMS[game.homeTeamId]
  const away = TEAMS[game.awayTeamId]
  if (!home || !away) return null

  const isLive = game.status === 'live'
  const isFinal = game.status === 'final'
  const isScheduled = game.status === 'scheduled'
  const isCancelled = game.status === 'cancelled' || game.status === 'postponed'

  const naverUrl = getNaverGameUrl(game)
  const isClickable = isLive || isFinal

  const handleClick = () => {
    if (isClickable) window.open(naverUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleClick}
      className={`
        game-card relative rounded-2xl border overflow-hidden mb-3
        ${isFavoriteGame ? 'border-l-4' : 'border-[0.5px] border-gray-800'}
        ${isClickable ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        ${isLive ? 'bg-[#16151f] border-[#ff3c3c] shadow-[0_0_12px_rgba(255,60,60,0.15)]' : 'bg-[#13121c] border-gray-800'}
      `}
      style={isFavoriteGame && !isLive ? { borderLeftColor: home.color } : undefined}
    >
      {/* 상단 행: 시간 + 경기장 + 상태 */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-[#e03] px-2 py-[2px] rounded-full">
              <span className="w-[6px] h-[6px] rounded-full bg-white animate-pulse inline-block" />
              LIVE
            </span>
          )}
          {isLive && game.inning && (
            <span className="text-[11px] text-gray-400">{game.inning}</span>
          )}
          <span className={`text-[12px] ${isScheduled ? 'font-medium text-gray-300' : 'text-gray-600'}`}>
            {game.time}
          </span>
          {isFinal && (
            <span className="text-[11px] text-gray-500 border border-gray-700 px-2 py-[1px] rounded-full">종료</span>
          )}
          {isCancelled && (
            <span className="text-[11px] text-gray-600 border border-gray-800 px-2 py-[1px] rounded-full">
              {game.status === 'postponed' ? '우천순연' : '취소'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-600">{game.stadium}</span>
          {isClickable && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-gray-600">
              <path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          )}
        </div>
      </div>

      {/* 경기 매치업 */}
      <div className="flex items-center justify-between px-4 pb-4">
        {/* 원정팀 */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamLogo teamId={away.id} color={away.color} initial={getTeamInitial(away.id)} />
          <span className="text-[12px] text-gray-300 font-medium">{away.shortName}</span>
        </div>

        {/* 스코어 / VS */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 px-4">
          {(isLive || isFinal) && game.awayScore != null && game.homeScore != null ? (
            <div className="flex items-baseline gap-3">
              <ScoreNum score={game.awayScore} won={game.awayScore > game.homeScore} />
              <span className="text-gray-600 text-sm">:</span>
              <ScoreNum score={game.homeScore} won={game.homeScore > game.awayScore} />
            </div>
          ) : (
            <span className="text-gray-600 text-sm font-light tracking-widest">vs</span>
          )}
        </div>

        {/* 홈팀 */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamLogo teamId={home.id} color={home.color} initial={getTeamInitial(home.id)} />
          <span className="text-[12px] text-gray-300 font-medium">{home.shortName}</span>
        </div>
      </div>

      {/* 라이브 - 클릭 힌트 */}
      {isLive && (
        <div className="border-t border-gray-800 px-4 py-2 flex items-center justify-center gap-1">
          <span className="text-[11px] text-[#e03] font-medium">네이버 스포츠 생중계 보기</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 8L8 2M8 2H4M8 2V6" stroke="#e03" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
      {isFinal && (
        <div className="border-t border-gray-800 px-4 py-2 flex items-center justify-center gap-1">
          <span className="text-[11px] text-gray-500">경기 결과 상세보기</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 8L8 2M8 2H4M8 2V6" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </div>
  )
}

function TeamLogo({ color, initial }: { teamId: string; color: string; initial: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  )
}

function ScoreNum({ score, won }: { score: number; won: boolean }) {
  return (
    <span className={`text-2xl font-bold ${won ? 'text-white' : 'text-gray-500'}`}>
      {score}
    </span>
  )
}
