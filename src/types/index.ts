export type GameStatus = 'scheduled' | 'live' | 'final' | 'cancelled' | 'postponed'

export interface Game {
  gameId: string
  date: string        // YYYYMMDD
  time: string        // HH:MM
  stadium: string
  homeTeamId: string
  awayTeamId: string
  homeScore?: number
  awayScore?: number
  status: GameStatus
  inning?: string     // e.g. "7회초"
  naverGameId?: string
}

export interface Team {
  id: string
  name: string
  shortName: string
  color: string
  secondaryColor?: string
  naverTeamId: string
}
