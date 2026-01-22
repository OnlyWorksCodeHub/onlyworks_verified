// Cookie utility functions for attribution tracking

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }

  return null
}

export function setCookie(name: string, value: string, days: number = 30) {
  const maxAge = days * 24 * 60 * 60 // Convert to seconds
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/`
}
