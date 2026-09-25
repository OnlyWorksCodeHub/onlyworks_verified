import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import PublicProfileEmptyState from './PublicProfileEmptyState'

describe('PublicProfileEmptyState', () => {
  it('points empty public profiles to desktop downloads', () => {
    render(<PublicProfileEmptyState />)
    expect(screen.getByText(/no verified work published yet/i)).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /get onlyworks desktop/i })
    expect(link).toHaveAttribute('href', '/downloads')
  })
})
