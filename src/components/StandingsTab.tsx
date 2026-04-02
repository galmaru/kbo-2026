export function StandingsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="text-4xl mb-4">🏆</div>
      <p className="text-gray-400 text-[14px] font-medium mb-2">순위표</p>
      <p className="text-gray-600 text-[12px] leading-relaxed">
        네이버 스포츠에서 실시간 순위를 확인하세요
      </p>
      <a
        href="https://m.sports.naver.com/kbaseball/record/rank/teamrank"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-[12px] text-[#f97316] border border-[#f97316]/30 px-4 py-2 rounded-full"
      >
        네이버 스포츠 순위 보기 →
      </a>
    </div>
  )
}
