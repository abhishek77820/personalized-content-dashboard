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

import searchReducer, {
    searchContentThunk,
} from './searchSlice'

import {
    searchContent,
} from '../../api/searchApi'

import type {
    SearchResult,
} from '../../api/searchApi'

vi.mock('../../api/searchApi', () => ({
    searchContent: vi.fn(),
}))

const mockedSearchContent =
    vi.mocked(searchContent)

const createTestStore = () =>
    configureStore({
        reducer: {
            search: searchReducer,
        },
    })

const mockResults: SearchResult[] = [
    {
        id: 'news-1',
        type: 'news',
        title: 'React Tutorial',
        description:
            'A beginner friendly React tutorial.',
        imageUrl: '',
        source: 'Test News',
        publishedAt:
            '2026-09-18',
        actionUrl:
            'https://example.com/react',
        actionLabel:
            'Read More',
    },
    {
        id: 'music-1',
        type: 'music',
        title: 'React Coding Playlist',
        description:
            'Music for coding and development.',
        imageUrl: '',
        source: 'Test Music',
        actionUrl:
            'https://example.com/music',
        actionLabel:
            'Listen Now',
    },
]

describe(
    'searchSlice async flow',
    () => {
        beforeEach(() => {
            vi.clearAllMocks()
        })

        it(
            'loads search results successfully',
            async () => {
                mockedSearchContent.mockResolvedValue(
                    mockResults
                )

                const store =
                    createTestStore()

                await store.dispatch(
                    searchContentThunk(
                        'react'
                    )
                )

                const state =
                    store.getState().search

                expect(
                    state.status
                ).toBe('success')

                expect(
                    state.query
                ).toBe('react')

                expect(
                    state.results
                ).toEqual(
                    mockResults
                )

                expect(
                    state.error
                ).toBeNull()

                expect(
                    mockedSearchContent
                ).toHaveBeenCalledWith(
                    'react'
                )
            }
        )

        it(
            'handles empty search results',
            async () => {
                mockedSearchContent.mockResolvedValue(
                    []
                )

                const store =
                    createTestStore()

                await store.dispatch(
                    searchContentThunk(
                        'unknown-content'
                    )
                )

                const state =
                    store.getState().search

                expect(
                    state.status
                ).toBe('success')

                expect(
                    state.query
                ).toBe(
                    'unknown-content'
                )

                expect(
                    state.results
                ).toEqual([])

                expect(
                    state.error
                ).toBeNull()
            }
        )

        it(
            'handles search API errors',
            async () => {
                mockedSearchContent.mockRejectedValue(
                    new Error(
                        'Search API failed'
                    )
                )

                const store =
                    createTestStore()

                await store.dispatch(
                    searchContentThunk(
                        'react'
                    )
                )

                const state =
                    store.getState().search

                expect(
                    state.status
                ).toBe('error')

                expect(
                    state.query
                ).toBe('react')

                expect(
                    state.results
                ).toEqual([])

                expect(
                    state.error
                ).toBe(
                    'Search API failed'
                )
            }
        )

        it(
            'sets loading state while search is running',
            async () => {
                let resolveSearch: (
                    value: SearchResult[]
                ) => void

                const pendingSearch =
                    new Promise<
                        SearchResult[]
                    >(
                        (resolve) => {
                            resolveSearch =
                                resolve
                        }
                    )

                mockedSearchContent.mockReturnValue(
                    pendingSearch
                )

                const store =
                    createTestStore()

                const promise =
                    store.dispatch(
                        searchContentThunk(
                            'javascript'
                        )
                    )

                const loadingState =
                    store
                        .getState()
                        .search

                expect(
                    loadingState.status
                ).toBe('loading')

                expect(
                    loadingState.query
                ).toBe(
                    'javascript'
                )

                resolveSearch!([])

                await promise

                const finalState =
                    store
                        .getState()
                        .search

                expect(
                    finalState.status
                ).toBe(
                    'success'
                )
            }
        )
    }
)