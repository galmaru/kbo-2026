import { useState, useEffect, useCallback } from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import type { Game, GameStatus } from '../types'

function parseStatus(code: string): GameStatus {
  if (code === '0' || code === 'BEFORE') return 'scheduled'
  if (code === '1' || code === 'LIVE') return 'live'
  if (code === '3' || code === 'RESULT') return 'final'
  if (code === '4') return 'cancelled'
  if (code === '5') return 'postponed'
  return 'scheduled'
}

// 날짜(YYYYMMDD) → Game[] 맵
export type MonthlyGames = Record<string, Game[]>

export function useMonthlySchedule(month: Date) {
  const [gameMap, setGameMap] = useState<MonthlyGames>({})
  const [loading, setLoading] = useState(true)

  const fetchMonth = useCallback(async () => {
    setLoading(true)
    const fromDate = format(startOfMonth(month), 'yyyyMMdd')
    const toDate = format(endOfMonth(month), 'yyyyMMdd')

    try {
      const res = await fetch(`/api/schedule?fromDate=${fromDate}&toDate=${toDate}`)
      if (!res.ok) throw new Error('API error')
      const data = await res.json()

      const gameList = data?.result?.games ?? data?.games ?? []
      if (gameList.length === 0) throw new Error('no games')

      // 날짜별로 분류
      const map: MonthlyGames = {}
      for (const g of gameList) {
        const dateKey = String(g.gameDate ?? '').replace(/-/g, '') // YYYYMMDD
        if (!dateKey) continue

        const game: Game = {
          gameId: String(g.gameId ?? ''),
          date: dateKey,
          time: String(g.gameDateTime ?? '18:30').slice(11, 16) || '18:30',
          stadium: String(g.stadium ?? ''),
          homeTeamId: String(g.homeTeamCode ?? g.homeTeamId ?? ''),
          awayTeamId: String(g.awayTeamCode ?? g.awayTeamId ?? ''),
          homeScore: g.homeTeamScore != null ? Number(g.homeTeamScore) : undefined,
          awayScore: g.awayTeamScore != null ? Number(g.awayTeamScore) : undefined,
          status: parseStatus(String(g.statusCode ?? '0')),
          inning: g.statusCode === 'LIVE' && g.statusInfo ? String(g.statusInfo) : undefined,
          naverGameId: String(g.gameId ?? ''),
        }

        if (!map[dateKey]) map[dateKey] = []
        map[dateKey].push(game)
      }

      setGameMap(map)
    } catch {
      setGameMap({})
    } finally {
      setLoading(false)
    }
  }, [month.getFullYear(), month.getMonth()]) // eslint-disable-line

  useEffect(() => { fetchMonth() }, [fetchMonth])

  return { gameMap, loading }
}
