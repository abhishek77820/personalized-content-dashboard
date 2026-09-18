import {
    configureStore,
} from '@reduxjs/toolkit'

import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'

import newsReducer, {
    getNews,
} from './newsSlice'

import {
    fetchNews,
} from '../../api/newsApi'

import type {
    NewsArticle,
} from '../../api/newsApi'

vi.mock('../../api/newsApi', () => ({
    fetchNews: vi.fn(),
}))

const mockedFetchNews =
    vi.mocked(fetchNews)

const createTestStore = () =>
    configureStore({
        reducer: {
            news: newsReducer,
        },
    })

const mockArticles: NewsArticle[] = [
    {
        id: 'news-1',
        title: 'React News',
        description:
            'Latest React development news.',
        image: null,
        url:
            'https://example.com/react',
        author: 'Test Author',
        published:
            '2026-09-18',
    },
    {
        id: 'news-2',
        title: 'JavaScript News',
        description:
            'Latest JavaScript development news.',
        image: null,
        url:
            'https://example.com/javascript',
        author: 'Test Author',
        published:
            '2026-09-18',
    },
]

describe('newsSlice async flow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('loads news successfully', async () => {
        mockedFetchNews.mockResolvedValue(
            mockArticles
        )

        const store =
            createTestStore()

        await store.dispatch(
            getNews({
                category:
                    'technology',
                page: 1,
            })
        )

        const state =
            store.getState().news

        expect(
            state.status
        ).toBe('success')

        expect(
            state.articles
        ).toEqual(mockArticles)

        expect(
            state.page
        ).toBe(1)

        expect(
            state.hasMore
        ).toBe(true)

        expect(
            mockedFetchNews
        ).toHaveBeenCalledWith(
            'technology',
            1
        )
    })

    it('appends news when loading the next page', async () => {
        const firstPage = [
            mockArticles[0],
        ]

        const secondPage = [
            mockArticles[1],
        ]

        mockedFetchNews
            .mockResolvedValueOnce(
                firstPage
            )
            .mockResolvedValueOnce(
                secondPage
            )

        const store =
            createTestStore()

        await store.dispatch(
            getNews({
                category:
                    'technology',
                page: 1,
            })
        )

        await store.dispatch(
            getNews({
                category:
                    'technology',
                page: 2,
            })
        )

        const state =
            store.getState().news

        expect(
            state.status
        ).toBe('success')

        expect(
            state.articles
        ).toEqual([
            ...firstPage,
            ...secondPage,
        ])

        expect(
            state.page
        ).toBe(2)
    })

    it('handles API errors', async () => {
        mockedFetchNews.mockRejectedValue(
            new Error(
                'Failed to fetch news'
            )
        )

        const store =
            createTestStore()

        await store.dispatch(
            getNews({
                category:
                    'technology',
                page: 1,
            })
        )

        const state =
            store.getState().news

        expect(
            state.status
        ).toBe('error')

        expect(
            state.error
        ).toBe(
            'Failed to fetch news'
        )
    })

    it('sets hasMore to false when no articles are returned', async () => {
        mockedFetchNews.mockResolvedValue(
            []
        )

        const store =
            createTestStore()

        await store.dispatch(
            getNews({
                category:
                    'technology',
                page: 1,
            })
        )

        const state =
            store.getState().news

        expect(
            state.status
        ).toBe('success')

        expect(
            state.articles
        ).toEqual([])

        expect(
            state.hasMore
        ).toBe(false)
    })
})