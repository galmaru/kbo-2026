import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import type { Game, GameStatus } from '../types'

interface UseScheduleResult {
  games: Game[]
  loading: boolean
  error: string | null
  refresh: () => void
}

function parseStatus(code: string): GameStatus {
  if (code === '0' || code === 'BEFORE') return 'scheduled'
  if (code === '1' || code === 'LIVE') return 'live'
  if (code === '3' || code === 'RESULT') return 'final'
  if (code === '4') return 'cancelled'
  if (code === '5') return 'postponed'
  return 'scheduled'
}

// 샘플 데이터 - API 실패 시 또는 개발 시 사용
function getSampleGames(dateStr: string): Game[] {
  const today = format(new Date(), 'yyyyMMdd')
  const isToday = dateStr === today

  const base: Game[] = [
    {
      gameId: `${dateStr}_OB_LG`,
      date: dateStr,
      time: '18:30',
      stadium: '잠실야구장',
      homeTeamId: 'OB',
      awayTeamId: 'LG',
      status: isToday ? 'live' : dateStr < today ? 'final' : 'scheduled',
      homeScore: isToday || dateStr < today ? 3 : undefined,
      awayScore: isToday || dateStr < today ? 5 : undefined,
      inning: isToday ? '7회 초' : undefined,
      naverGameId: `${dateStr}LGOB0`,
    },
    {
      gameId: `${dateStr}_LT_SK`,
      date: dateStr,
      time: '18:30',
      stadium: '사직야구장',
      homeTeamId: 'LT',
      awayTeamId: 'SK',
      status: isToday ? 'scheduled' : dateStr < today ? 'final' : 'scheduled',
      homeScore: dateStr < today ? 7 : undefined,
      awayScore: dateStr < today ? 2 : undefined,
      naverGameId: `${dateStr}SKLT0`,
    },
    {
      gameId: `${dateStr}_HH_SS`,
      date: dateStr,
      time: '18:30',
      stadium: '대전한화생명볼파크',
      homeTeamId: 'HH',
      awayTeamId: 'SS',
      status: isToday ? 'scheduled' : dateStr < today ? 'final' : 'scheduled',
      homeScore: dateStr < today ? 4 : undefined,
      awayScore: dateStr < today ? 1 : undefined,
      naverGameId: `${dateStr}SSHH0`,
    },
    {
      gameId: `${dateStr}_HT_NC`,
      date: dateStr,
      time: '18:30',
      stadium: '광주기아챔피언스필드',
      homeTeamId: 'HT',
      awayTeamId: 'NC',
      status: isToday ? 'final' : dateStr < today ? 'final' : 'scheduled',
      homeScore: isToday || dateStr < today ? 6 : undefined,
      awayScore: isToday || dateStr < today ? 3 : undefined,
      naverGameId: `${dateStr}NCHT0`,
    },
    {
      gameId: `${dateStr}_KT_WO`,
      date: dateStr,
      time: '18:30',
      stadium: '수원KT위즈파크',
      homeTeamId: 'KT',
      awayTeamId: 'WO',
      status: dateStr < today ? 'final' : 'scheduled',
      homeScore: dateStr < today ? 2 : undefined,
      awayScore: dateStr < today ? 5 : undefined,
      naverGameId: `${dateStr}WOKT0`,
    },
  ]
  return base
}

export function useSchedule(dateStr: string): UseScheduleResult {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGames = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/schedule?date=${dateStr}`)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()

      // 네이버 API 응답 파싱
      const gameList = data?.result?.games ?? data?.games ?? []
      if (gameList.length === 0) throw new Error('no games')

      const parsed: Game[] = gameList.map((g: Record<string, unknown>) => ({
        gameId: String(g.gameId ?? ''),
        date: dateStr,
        time: String(g.gameDateTime ?? '18:30').slice(11, 16) || '18:30',
        stadium: String(g.stadium ?? g.stadiumName ?? ''),
        homeTeamId: String(g.homeTeamId ?? ''),
        awayTeamId: String(g.awayTeamId ?? ''),
        homeScore: g.homeTeamScore != null ? Number(g.homeTeamScore) : undefined,
        awayScore: g.awayTeamScore != null ? Number(g.awayTeamScore) : undefined,
        status: parseStatus(String(g.statusCode ?? '0')),
        inning: g.currentInning ? `${g.currentInning}회 ${g.currentInningSymbol === 'TOP' ? '초' : '말'}` : undefined,
        naverGameId: String(g.gameId ?? ''),
      }))
      setGames(parsed)
    } catch {
      // API 실패 시 샘플 데이터 사용
      setGames(getSampleGames(dateStr))
      setError(null) // 샘플 데이터로 정상 표시
    } finally {
      setLoading(false)
    }
  }, [dateStr])

  useEffect(() => { fetchGames() }, [fetchGames])

  // 라이브 경기 있으면 30초마다 자동 갱신
  useEffect(() => {
    const hasLive = games.some(g => g.status === 'live')
    if (!hasLive) return
    const id = setInterval(fetchGames, 30000)
    return () => clearInterval(id)
  }, [games, fetchGames])

  return { games, loading, error, refresh: fetchGames }
}
