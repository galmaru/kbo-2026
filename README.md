# ⚾ KBO 일정 앱

모바일 최적화 KBO 프로야구 일정 앱. 네이버 스포츠 연동, 라이브 경기 링크, 즐겨찾기 영구 저장.

---

## 🚀 Vercel 배포 방법 (5분 완성)

### 1단계 — GitHub에 올리기

```bash
# 이 폴더를 GitHub 새 레포지터리로 업로드
cd kbo-schedule
git init
git add .
git commit -m "init: KBO schedule app"
git remote add origin https://github.com/YOUR_USERNAME/kbo-schedule.git
git push -u origin main
```

### 2단계 — Vercel 연결

1. [vercel.com](https://vercel.com) → **Add New Project**
2. GitHub 레포지터리 선택
3. Framework: **Vite** (자동 감지됨)
4. **Deploy** 클릭

> 끝! 약 1분이면 `https://kbo-schedule-xxx.vercel.app` 주소가 생깁니다.

---

## 📁 프로젝트 구조

```
kbo-schedule/
├── api/
│   └── schedule.ts        # Vercel Edge Function (네이버 스포츠 API 프록시)
├── src/
│   ├── components/
│   │   ├── GameCard.tsx   # 경기 카드 (라이브/종료 → 네이버 링크)
│   │   ├── DateSlider.tsx # 날짜 선택 슬라이더
│   │   ├── FavoritesTab.tsx
│   │   └── StandingsTab.tsx
│   ├── hooks/
│   │   ├── useSchedule.ts # KBO 일정 데이터 fetch
│   │   └── useFavorites.ts # localStorage 즐겨찾기
│   ├── types/index.ts
│   ├── constants.ts       # 팀 정보, 네이버 URL 생성
│   └── App.tsx
└── index.html
```

---

## ⚡ 주요 기능

| 기능 | 설명 |
|------|------|
| 📅 날짜 슬라이더 | 오늘 기준 ±30일 스크롤 |
| 🔴 라이브 연결 | LIVE 경기 카드 탭 → 네이버 스포츠 생중계 |
| 📊 결과 연결 | 종료 경기 탭 → 네이버 스포츠 결과 상세 |
| ⭐ 즐겨찾기 | localStorage 영구 저장, 즐겨찾기 팀 경기 상단 고정 |
| 🔄 자동 갱신 | 라이브 경기 있을 때 30초마다 자동 갱신 |

---

## 🔗 네이버 스포츠 URL 패턴

```
라이브:  https://m.sports.naver.com/game/{gameId}/relay
결과:    https://m.sports.naver.com/game/{gameId}/record
```

`api/schedule.ts` Edge Function이 네이버 API를 프록시해서  
CORS 없이 브라우저에서 데이터를 받아옵니다.

---

## 🛠 로컬 개발

```bash
npm install
npm run dev   # http://localhost:3000
```

API가 연결 안 될 경우 샘플 데이터로 자동 폴백됩니다.
