import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import VerificationBadge from './VerificationBadge'

describe('VerificationBadge', () => {
  it('renders nothing for none status', () => {
    const { container } = render(<VerificationBadge status="none" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders verified label', () => {
    render(<VerificationBadge status="verified" />)
    expect(screen.getByText('Verified')).toBeInTheDocument()
  })

  it('renders trial label', () => {
    render(<VerificationBadge status="trial" />)
    expect(screen.getByText('Trial')).toBeInTheDocument()
  })
})
