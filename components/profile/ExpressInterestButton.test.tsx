import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const authState = vi.hoisted(() => ({
  user: null as { id: string } | null,
  backendToken: null as string | null,
  loading: false,
}))

vi.mock('@/components/AuthProvider', () => ({
  useAuth: () => authState,
}))

vi.mock('@/lib/config', () => ({
  HIRING_TOOLKIT_ENABLED: true,
  NEXT_PUBLIC_BACKEND_URL: 'http://localhost:9999',
}))

import ExpressInterestButton from './ExpressInterestButton'

describe('ExpressInterestButton', () => {
  beforeEach(() => {
    authState.user = null
    authState.backendToken = null
    authState.loading = false
  })

  it('hides itself when OW id is a placeholder', () => {
    const { container } = render(
      <ExpressInterestButton owId="OW-?????" displayName="Mystery" />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('sends guests to login with next=/p/{owId}', () => {
    render(<ExpressInterestButton owId="OW-A7B2K9" displayName="Brodey" />)
    const link = screen.getByRole('link', { name: /express interest/i })
    expect(link).toHaveAttribute('href', '/login?next=/p/OW-A7B2K9')
  })

  it('opens outreach control for signed-in hiring managers', () => {
    authState.user = { id: 'hm-1' }
    authState.backendToken = 'token'
    render(<ExpressInterestButton owId="OW-A7B2K9" displayName="Brodey" />)
    expect(screen.getByRole('button', { name: /express interest/i })).toBeInTheDocument()
  })
})
