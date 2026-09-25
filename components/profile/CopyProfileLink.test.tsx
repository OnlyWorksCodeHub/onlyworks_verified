import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CopyProfileLink from './CopyProfileLink'

describe('CopyProfileLink', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it('copies the share URL and flips to Copied', async () => {
    render(<CopyProfileLink url="https://www.only-works.com/p/OW-A7B2K9" />)
    fireEvent.click(screen.getByRole('button', { name: /copy link/i }))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://www.only-works.com/p/OW-A7B2K9'
      )
      expect(screen.getByText('Copied')).toBeInTheDocument()
    })
  })
})
