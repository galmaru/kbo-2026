// api/schedule.ts - Vercel Edge Function
// 네이버 스포츠 KBO 일정 API 프록시

export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const date = url.searchParams.get('date') // YYYYMMDD

  if (!date || !/^\d{8}$/.test(date)) {
    return new Response(JSON.stringify({ error: 'Invalid date' }), { status: 400 })
  }

  // YYYYMMDD → YYYY-MM-DD 변환 (네이버 API 요구 형식)
  const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`

  // 네이버 스포츠 KBO 일정 API
  const naverUrl = `https://api-gw.sports.naver.com/schedule/games?fields=basic,schedule,baseball&categoryId=kbo&fromDate=${formattedDate}&toDate=${formattedDate}&size=500`

  try {
    const res = await fetch(naverUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        'Referer': 'https://m.sports.naver.com/kbaseball/schedule/index',
        'Accept': 'application/json',
      },
    })

    if (!res.ok) throw new Error(`Naver API ${res.status}`)
    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to fetch', detail: String(e) }), { status: 500 })
  }
}
