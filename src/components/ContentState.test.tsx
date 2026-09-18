import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react'

import {
    describe,
    expect,
    it,
    vi,
} from 'vitest'

import ContentState from './ContentState'

describe('ContentState', () => {
    it('shows loading state', () => {
        render(
            <ContentState
                type="loading"
                message="Loading news..."
            />
        )

        expect(
            screen.getByText(
                'Loading news...'
            )
        ).toBeInTheDocument()
    })

    it('shows empty state', () => {
        render(
            <ContentState
                type="empty"
                message="No news available."
            />
        )

        expect(
            screen.getByText(
                'No news available.'
            )
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                'No content available'
            )
        ).toBeInTheDocument()
    })

    it('shows error state', () => {
        render(
            <ContentState
                type="error"
                message="Failed to load news."
            />
        )

        expect(
            screen.getByText(
                'Failed to load news.'
            )
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                'Something went wrong'
            )
        ).toBeInTheDocument()
    })

    it('calls retry handler', () => {
        const handleRetry = vi.fn()

        render(
            <ContentState
                type="error"
                message="Failed to load news."
                onRetry={
                    handleRetry
                }
            />
        )

        fireEvent.click(
            screen.getByRole(
                'button',
                {
                    name: /retry/i,
                }
            )
        )

        expect(
            handleRetry
        ).toHaveBeenCalledTimes(1)
    })
})