import { TEAM_LIST } from '../constants'

interface Props {
  favorites: string[]
  onToggle: (teamId: string) => void
}

export function FavoritesTab({ favorites, onToggle }: Props) {
  return (
    <div className="px-4 py-4">
      <p className="text-[12px] text-gray-500 mb-4">
        즐겨찾기 팀을 선택하면 해당 팀 경기를 상단에 강조 표시합니다.
        선택 내용은 이 기기 브라우저에 영구 저장됩니다.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {TEAM_LIST.map(team => {
          const isFav = favorites.includes(team.id)
          return (
            <button
              key={team.id}
              onClick={() => onToggle(team.id)}
              className={`
                flex items-center gap-3 p-3 rounded-2xl border transition-all active:scale-[0.97]
                ${isFav
                  ? 'border-[0.5px] bg-[#13121c]'
                  : 'border-gray-800 bg-[#13121c]'
                }
              `}
              style={isFav ? { borderColor: team.color } : undefined}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                style={{ backgroundColor: team.color }}
              >
                {team.shortName.slice(0, 2)}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-[13px] text-gray-200 font-medium truncate">{team.shortName}</p>
                <p className="text-[10px] text-gray-600 truncate">{team.name}</p>
              </div>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border ${
                isFav ? 'border-0' : 'border-gray-700'
              }`}
                style={isFav ? { backgroundColor: team.color } : undefined}
              >
                {isFav && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {favorites.length > 0 && (
        <button
          onClick={() => favorites.forEach(onToggle)}
          className="mt-4 w-full text-[12px] text-gray-600 border border-gray-800 rounded-xl py-2"
        >
          즐겨찾기 전체 해제
        </button>
      )}
    </div>
  )
}
