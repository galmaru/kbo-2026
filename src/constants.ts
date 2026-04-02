import type { Team } from './types'

export const TEAMS: Record<string, Team> = {
  HH: { id: 'HH', name: '한화 이글스', shortName: '한화', color: '#FF6600', naverTeamId: 'HH' },
  OB: { id: 'OB', name: '두산 베어스', shortName: '두산', color: '#1D1D5E', naverTeamId: 'OB' },
  LG: { id: 'LG', name: 'LG 트윈스', shortName: 'LG', color: '#C0392B', naverTeamId: 'LG' },
  SS: { id: 'SS', name: '삼성 라이온즈', shortName: '삼성', color: '#1A2D5A', secondaryColor: '#C8A951', naverTeamId: 'SS' },
  LT: { id: 'LT', name: '롯데 자이언츠', shortName: '롯데', color: '#002856', secondaryColor: '#C0392B', naverTeamId: 'LT' },
  SK: { id: 'SK', name: 'SSG 랜더스', shortName: 'SSG', color: '#CE0E2D', naverTeamId: 'SK' },
  HT: { id: 'HT', name: 'KIA 타이거즈', shortName: 'KIA', color: '#EA0029', secondaryColor: '#000000', naverTeamId: 'HT' },
  NC: { id: 'NC', name: 'NC 다이노스', shortName: 'NC', color: '#1D5091', secondaryColor: '#BFA46A', naverTeamId: 'NC' },
  KT: { id: 'KT', name: 'KT 위즈', shortName: 'KT', color: '#000000', secondaryColor: '#D01C2A', naverTeamId: 'KT' },
  WO: { id: 'WO', name: '키움 히어로즈', shortName: '키움', color: '#820024', secondaryColor: '#FFCD00', naverTeamId: 'WO' },
}

export const TEAM_LIST = Object.values(TEAMS)

// 네이버 스포츠 URL 생성
export function getNaverGameUrl(game: { naverGameId?: string; status: string; date: string }): string {
  const base = 'https://m.sports.naver.com/game'
  if (!game.naverGameId) {
    return `https://m.sports.naver.com/kbaseball/schedule/index`
  }
  if (game.status === 'live') {
    return `${base}/${game.naverGameId}/relay`
  }
  if (game.status === 'final') {
    return `${base}/${game.naverGameId}/record`
  }
  if (game.status === 'scheduled') {
    return `${base}/${game.naverGameId}/preview`
  }
  return `https://m.sports.naver.com/kbaseball/schedule/index`
}

export function getTeamInitial(teamId: string): string {
  const map: Record<string, string> = {
    HH: '화', OB: '두', LG: 'LG', SS: '삼', LT: '롯',
    SK: 'SSG', HT: 'KIA', NC: 'NC', KT: 'kt', WO: '키',
  }
  return map[teamId] ?? teamId
}

export const STADIUMS: Record<string, string> = {
  HH: '대전한화생명볼파크',
  OB: '잠실야구장',
  LG: '잠실야구장',
  SS: '대구삼성라이온즈파크',
  LT: '사직야구장',
  SK: '인천SSG랜더스필드',
  HT: '광주기아챔피언스필드',
  NC: '창원NC파크',
  KT: '수원KT위즈파크',
  WO: '고척스카이돔',
}
