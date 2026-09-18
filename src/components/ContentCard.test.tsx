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

import ContentCard from './ContentCard'

import type {
    ContentItem,
} from '../types/content'

const newsItem: ContentItem = {
    id: 'news-1',
    type: 'news',
    title: 'React Testing Article',
    description:
        'This is a test description for the news card.',
    imageUrl: '',
    source: 'Test News',
    publishedAt: '2026-09-18',
    actionUrl:
        'https://example.com/news',
    actionLabel: 'Read More',
}

describe('ContentCard', () => {
    it('renders the content correctly', () => {
        render(
            <ContentCard
                item={newsItem}
            />
        )

        expect(
            screen.getByText(
                'React Testing Article'
            )
        ).toBeInTheDocument()

        expect(
            screen.getByText(
                'This is a test description for the news card.'
            )
        ).toBeInTheDocument()

        expect(
            screen.getByText('Test News')
        ).toBeInTheDocument()

        expect(
            screen.getByRole('link', {
                name: /read more/i,
            })
        ).toBeInTheDocument()
    })

    it('shows save button when item is not favorite', () => {
        render(
            <ContentCard
                item={newsItem}
            />
        )

        expect(
            screen.getByRole('button', {
                name: /add react testing article to favorites/i,
            })
        ).toHaveTextContent(
            '☆ Save'
        )
    })

    it('calls favorite handler when save button is clicked', () => {
        const handleFavorite =
            vi.fn()

        render(
            <ContentCard
                item={newsItem}
                onFavorite={
                    handleFavorite
                }
            />
        )

        const button =
            screen.getByRole(
                'button',
                {
                    name: /add react testing article to favorites/i,
                }
            )

        fireEvent.click(button)

        expect(
            handleFavorite
        ).toHaveBeenCalledWith(
            'news-1'
        )
    })
})