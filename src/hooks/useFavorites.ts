import { useState, useEffect } from 'react'

const KEY = 'kbo_favorites_v1'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const toggle = (teamId: string) => {
    setFavorites(prev =>
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    )
  }

  const isFavorite = (teamId: string) => favorites.includes(teamId)

  return { favorites, toggle, isFavorite }
}
