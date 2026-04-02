// api/schedule.ts - Vercel Edge Function
// 네이버 스포츠 KBO 일정 API 프록시

export const config = { runtime: 'edge' }

function toFormattedDate(yyyymmdd: string) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const date = url.searchParams.get('date')       // YYYYMMDD (단일 날짜)
  const fromDate = url.searchParams.get('fromDate') // YYYYMMDD (범위 시작)
  const toDate = url.searchParams.get('toDate')     // YYYYMMDD (범위 끝)

  let from: string
  let to: string

  if (date) {
    if (!/^\d{8}$/.test(date)) {
      return new Response(JSON.stringify({ error: 'Invalid date' }), { status: 400 })
    }
    from = to = toFormattedDate(date)
  } else if (fromDate && toDate) {
    if (!/^\d{8}$/.test(fromDate) || !/^\d{8}$/.test(toDate)) {
      return new Response(JSON.stringify({ error: 'Invalid date range' }), { status: 400 })
    }
    from = toFormattedDate(fromDate)
    to = toFormattedDate(toDate)
  } else {
    return new Response(JSON.stringify({ error: 'date or fromDate/toDate required' }), { status: 400 })
  }

  const naverUrl = `https://api-gw.sports.naver.com/schedule/games?fields=basic,schedule,baseball&categoryId=kbo&fromDate=${from}&toDate=${to}&size=500`

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
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to fetch', detail: String(e) }), { status: 500 })
  }
}
