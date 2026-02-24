import { BACKEND_URL } from '@/lib/config'

export class BackendError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'BackendError'
    this.status = status
    this.data = data
  }
}

export async function fetchBackend(path: string, options?: RequestInit) {
  const url = `${BACKEND_URL}${path}`
  const res = await fetch(url, options)

  let data: any
  try {
    data = await res.json()
  } catch {
    if (!res.ok) {
      throw new BackendError(`Backend error: ${res.status} ${res.statusText}`, res.status)
    }
    return null
  }

  if (!res.ok) {
    const message = typeof data?.error === 'string' ? data.error
      : typeof data?.message === 'string' ? data.message
      : `Backend error: ${res.status}`
    throw new BackendError(message, res.status, data)
  }

  return data
}
