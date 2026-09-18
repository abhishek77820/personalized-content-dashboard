import {
    useEffect,
    useCallback,
    useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    DndProvider,
} from 'react-dnd'
import {
    HTML5Backend,
} from 'react-dnd-html5-backend'

import Header from './Header'
import Sidebar from './Sidebar'
import ContentCard from './ContentCard'
import ContentState from './ContentState'
import ContentSkeleton from './ContentSkeleton'
import DraggableContentCard from './DraggableContentCard'

import type { ContentItem } from '../types/content'

import type {
    RootState,
    AppDispatch,
} from '../app/store'

import {
    addFavorite,
    removeFavorite,
} from '../features/favorites/favoritesSlice'

import {
    getNews,
    resetNews,
} from '../features/news/newsSlice'

import {
    getRecommendations,
} from '../features/recommendations/recommendationsSlice'

import {
    getSocialPosts,
} from '../features/social/socialSlice'

import {
    searchContentThunk,
    clearSearch,
} from '../features/search/searchSlice'

import {
    setFeedOrder,
} from '../features/feed/feedOrderSlice'

interface DashboardProps {
    onSettingsClick: () => void
}

function Dashboard({
    onSettingsClick,
}: DashboardProps) {
    const dispatch =
        useDispatch<AppDispatch>()

    const favorites = useSelector(
        (state: RootState) =>
            state.favorites.items
    )

    const news = useSelector(
        (state: RootState) =>
            state.news
    )

    const recommendations = useSelector(
        (state: RootState) =>
            state.recommendations
    )

    const social = useSelector(
        (state: RootState) =>
            state.social
    )

    const search = useSelector(
        (state: RootState) =>
            state.search
    )

    const categories = useSelector(
        (state: RootState) =>
            state.preferences.categories
    )

    const feedOrderIds = useSelector(
        (state: RootState) =>
            state.feedOrder.ids
    )

    const selectedCategory =
        categories[0] || 'technology'

    /*
     * Load personalized content
     */
    useEffect(() => {
        dispatch(resetNews())

        dispatch(
            getNews({
                category:
                    selectedCategory,
                page: 1,
            })
        )

        dispatch(
            getRecommendations(
                selectedCategory
            )
        )

        dispatch(
            getSocialPosts()
        )
    }, [
        dispatch,
        selectedCategory,
    ])

    /*
     * Search handler
     */
    const handleSearch = useCallback(
        (query: string) => {
            if (!query.trim()) {
                dispatch(clearSearch())
                return
            }

            dispatch(
                searchContentThunk(query)
            )
        },
        [dispatch]
    )

    /*
     * Favorite handler
     */
    const handleFavorite = (
        item: ContentItem
    ) => {
        const alreadyFavorite =
            favorites.some(
                (favorite) =>
                    favorite.id ===
                    item.id
            )

        if (alreadyFavorite) {
            dispatch(
                removeFavorite(
                    item.id
                )
            )
        } else {
            dispatch(
                addFavorite(item)
            )
        }
    }

    /*
     * Convert news API data
     */
    const newsItems: ContentItem[] =
        news.articles.map(
            (article) => ({
                id: article.id,
                type: 'news',
                title: article.title,
                description:
                    article.description ||
                    'No description available.',
                imageUrl:
                    article.image ||
                    '',
                source:
                    article.author ||
                    'News',
                publishedAt:
                    article.published,
                actionUrl:
                    article.url,
                actionLabel:
                    'Read More',
            })
        )

    /*
     * Convert music API data
     */
    const musicItems: ContentItem[] =
        recommendations.items.map(
            (item) => ({
                id: `music-${item.id}`,
                type: 'music',
                title: item.title,
                description:
                    `${item.artist} • ${item.album}`,
                imageUrl:
                    item.image,
                source:
                    item.genre ||
                    'Music',
                actionUrl:
                    item.url,
                actionLabel:
                    'Listen Now',
            })
        )

    /*
     * Convert social API data
     */
    const socialItems: ContentItem[] =
        social.posts.map(
            (post) => ({
                id: `social-${post.id}`,
                type: 'social',
                title: post.title,
                description:
                    post.body,
                imageUrl: '',
                source:
                    `User #${post.userId}`,
                publishedAt:
                    `${post.views} views`,
                actionUrl:
                    `https://dummyjson.com/posts/${post.id}`,
                actionLabel:
                    'View Post',
            })
        )

    /*
     * Create unified feed
     * according to saved order.
     */
    const personalizedFeed =
        useMemo(() => {
            const allItems = [
                ...newsItems,
                ...musicItems,
                ...socialItems,
            ]

            if (
                feedOrderIds.length === 0
            ) {
                return allItems
            }

            const itemMap = new Map(
                allItems.map((item) => [
                    item.id,
                    item,
                ])
            )

            const orderedItems =
                feedOrderIds
                    .map((id) =>
                        itemMap.get(id)
                    )
                    .filter(
                        (
                            item
                        ): item is ContentItem =>
                            item !== undefined
                    )

            const orderedIds =
                new Set(
                    orderedItems.map(
                        (item) =>
                            item.id
                    )
                )

            const newItems =
                allItems.filter(
                    (item) =>
                        !orderedIds.has(
                            item.id
                        )
                )

            return [
                ...orderedItems,
                ...newItems,
            ]
        }, [
            newsItems,
            musicItems,
            socialItems,
            feedOrderIds,
        ])

    /*
     * Keep newly loaded cards inside
     * the saved feed order.
     */
    useEffect(() => {
        const currentIds =
            personalizedFeed.map(
                (item) => item.id
            )

        const existingIds =
            feedOrderIds.filter(
                (id) =>
                    currentIds.includes(id)
            )

        const newIds =
            currentIds.filter(
                (id) =>
                    !feedOrderIds.includes(
                        id
                    )
            )

        const updatedOrder = [
            ...existingIds,
            ...newIds,
        ]

        const isSameOrder =
            updatedOrder.length ===
                feedOrderIds.length &&
            updatedOrder.every(
                (id, index) =>
                    id ===
                    feedOrderIds[index]
            )

        if (!isSameOrder) {
            dispatch(
                setFeedOrder(
                    updatedOrder
                )
            )
        }
    }, [
        personalizedFeed,
        feedOrderIds,
        dispatch,
    ])

    /*
     * Trending news
     */
    const trendingNews =
        newsItems.slice(0, 2)

    /*
     * Trending music
     */
    const trendingMusic =
        musicItems.slice(0, 2)

    /*
     * Trending social
     */
    const trendingSocial = [
        ...social.posts,
    ]
        .sort(
            (first, second) =>
                second.views -
                first.views
        )
        .slice(0, 2)
        .map(
            (post): ContentItem => ({
                id: `social-trending-${post.id}`,
                type: 'social',
                title: post.title,
                description:
                    post.body,
                imageUrl: '',
                source:
                    `User #${post.userId}`,
                publishedAt:
                    `${post.views} views`,
                actionUrl:
                    `https://dummyjson.com/posts/${post.id}`,
                actionLabel:
                    'View Post',
            })
        )

    const trendingItems = [
        ...trendingNews,
        ...trendingMusic,
        ...trendingSocial,
    ]

    /*
     * Search results
     */
    const searchItems: ContentItem[] =
        search.results.map(
            (item) => ({
                id: item.id,
                type: item.type,
                title: item.title,
                description:
                    item.description ||
                    'No description available.',
                imageUrl:
                    item.imageUrl ||
                    '',
                source:
                    item.source,
                publishedAt:
                    item.publishedAt,
                rating:
                    item.rating,
                actionUrl:
                    item.actionUrl,
                actionLabel:
                    item.actionLabel,
            })
        )

    /*
     * Initial loading
     */
    const isInitialLoading =
        personalizedFeed.length === 0 &&
        (
            news.status ===
                'loading' ||
            recommendations.status ===
                'loading' ||
            social.status ===
                'loading'
        )

    /*
     * All sources failed
     */
    const allSourcesFailed =
        news.status === 'error' &&
        recommendations.status ===
            'error' &&
        social.status === 'error'

    const hasContent =
        personalizedFeed.length > 0

    /*
     * All initial requests finished
     */
    const allSourcesFinished =
        (
            news.status === 'success' ||
            news.status === 'error'
        ) &&
        (
            recommendations.status ===
                'success' ||
            recommendations.status ===
                'error'
        ) &&
        (
            social.status ===
                'success' ||
            social.status ===
                'error'
        )

    const hasNoContent =
        allSourcesFinished &&
        !hasContent

    /*
     * Retry all content
     */
    const retryAll = () => {
        dispatch(resetNews())

        dispatch(
            getNews({
                category:
                    selectedCategory,
                page: 1,
            })
        )

        dispatch(
            getRecommendations(
                selectedCategory
            )
        )

        dispatch(
            getSocialPosts()
        )
    }

    /*
     * Load more news
     */
    const loadMoreNews = () => {
        if (
            news.status ===
                'loading' ||
            !news.hasMore
        ) {
            return
        }

        dispatch(
            getNews({
                category:
                    selectedCategory,
                page:
                    news.page + 1,
            })
        )
    }

    return (
        <DndProvider
            backend={HTML5Backend}
        >
            <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-200">

                {/* Sidebar */}
                <Sidebar
                    onSettingsClick={
                        onSettingsClick
                    }
                />

                <div className="flex min-w-0 flex-1 flex-col">

                    {/* Header */}
                    <Header
                        onSettingsClick={
                            onSettingsClick
                        }
                        onSearch={
                            handleSearch
                        }
                    />

                    <main className="flex-1 p-4 sm:p-6">

                        {/* Welcome */}
                        <section className="mb-8 animate-fade-up">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Welcome Back 👋
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Here is your personalized
                                content.
                            </p>
                        </section>

                        {/* Search Results */}
                        {search.query.trim() && (
                            <section className="mb-12 animate-fade-up">

                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Search Results
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Results for "
                                        {search.query}"
                                    </p>
                                </div>

                                {/* Search Loading */}
                                {search.status ===
                                    'loading' && (
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {Array.from(
                                            {
                                                length: 3,
                                            }
                                        ).map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <ContentSkeleton
                                                    key={
                                                        index
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}

                                {/* Search Error */}
                                {search.status ===
                                    'error' && (
                                    <ContentState
                                        type="error"
                                        message={
                                            search.error ||
                                            'Unable to complete search.'
                                        }
                                        onRetry={() =>
                                            handleSearch(
                                                search.query
                                            )
                                        }
                                    />
                                )}

                                {/* Search Empty */}
                                {search.status ===
                                    'success' &&
                                    searchItems.length ===
                                        0 && (
                                        <ContentState
                                            type="empty"
                                            message={`No content found for "${search.query}".`}
                                        />
                                    )}

                                {/* Search Results */}
                                {search.status ===
                                    'success' &&
                                    searchItems.length >
                                        0 && (
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                            {searchItems.map(
                                                (
                                                    item,
                                                    index
                                                ) => {
                                                    const isFavorite =
                                                        favorites.some(
                                                            (
                                                                favorite
                                                            ) =>
                                                                favorite.id ===
                                                                item.id
                                                        )

                                                    return (
                                                        <div
                                                            key={
                                                                item.id
                                                            }
                                                            className="animate-fade-up"
                                                            style={{
                                                                animationDelay: `${index * 70}ms`,
                                                            }}
                                                        >
                                                            <ContentCard
                                                                item={
                                                                    item
                                                                }
                                                                isFavorite={
                                                                    isFavorite
                                                                }
                                                                onFavorite={() =>
                                                                    handleFavorite(
                                                                        item
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                }
                                            )}

                                        </div>
                                    )}

                            </section>
                        )}

                        {/* Personalized Feed */}
                        <section
                            id="personalized-feed"
                            className="mb-12 scroll-mt-6"
                        >

                            <div className="mb-4 animate-fade-up">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Personalized Feed
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Latest{' '}
                                    {selectedCategory}{' '}
                                    news, music and social
                                    content based on your
                                    preferences.
                                </p>
                            </div>

                            {/* Loading Skeleton */}
                            {isInitialLoading && (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {Array.from(
                                        {
                                            length: 6,
                                        }
                                    ).map(
                                        (
                                            _,
                                            index
                                        ) => (
                                            <ContentSkeleton
                                                key={
                                                    index
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}

                            {/* All APIs failed */}
                            {!isInitialLoading &&
                                allSourcesFailed && (
                                    <ContentState
                                        type="error"
                                        message="Unable to load personalized content."
                                        onRetry={
                                            retryAll
                                        }
                                    />
                                )}

                            {/* No Content */}
                            {!isInitialLoading &&
                                !allSourcesFailed &&
                                hasNoContent && (
                                    <ContentState
                                        type="empty"
                                        message="No personalized content available right now."
                                    />
                                )}

                            {/* Content */}
                            {!isInitialLoading &&
                                !allSourcesFailed &&
                                hasContent && (
                                    <>

                                        {/* Draggable Feed */}
                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                            {personalizedFeed.map(
                                                (
                                                    item,
                                                    index
                                                ) => {
                                                    const isFavorite =
                                                        favorites.some(
                                                            (
                                                                favorite
                                                            ) =>
                                                                favorite.id ===
                                                                item.id
                                                        )

                                                    return (
                                                        <div
                                                            key={
                                                                item.id
                                                            }
                                                            className="animate-fade-up"
                                                            style={{
                                                                animationDelay: `${index * 70}ms`,
                                                            }}
                                                        >
                                                            <DraggableContentCard
                                                                item={
                                                                    item
                                                                }
                                                                isFavorite={
                                                                    isFavorite
                                                                }
                                                                onFavorite={() =>
                                                                    handleFavorite(
                                                                        item
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    )
                                                }
                                            )}

                                        </div>

                                        {/* Load More */}
                                        {news.hasMore && (
                                            <div className="mt-8 flex justify-center animate-fade-up">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        loadMoreNews
                                                    }
                                                    disabled={
                                                        news.status ===
                                                        'loading'
                                                    }
                                                    className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                                                >
                                                    {news.status ===
                                                    'loading'
                                                        ? 'Loading...'
                                                        : 'Load More News'}
                                                </button>
                                            </div>
                                        )}

                                        {/* News Error */}
                                        {news.status ===
                                            'error' && (
                                            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">

                                                <div className="flex flex-wrap items-center justify-between gap-3">

                                                    <div>
                                                        <p className="font-medium text-red-900 dark:text-red-200">
                                                            News could not be loaded.
                                                        </p>

                                                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                                            Other personalized content is still available.
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dispatch(
                                                                getNews({
                                                                    category:
                                                                        selectedCategory,
                                                                    page: 1,
                                                                })
                                                            )
                                                        }
                                                        className="rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700"
                                                    >
                                                        Retry News
                                                    </button>

                                                </div>
                                            </div>
                                        )}

                                        {/* Music Error */}
                                        {recommendations.status ===
                                            'error' && (
                                            <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/40">

                                                <div className="flex flex-wrap items-center justify-between gap-3">

                                                    <div>
                                                        <p className="font-medium text-yellow-900 dark:text-yellow-200">
                                                            Music recommendations could not be loaded.
                                                        </p>

                                                        <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                                                            Other personalized content is still available.
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dispatch(
                                                                getRecommendations(
                                                                    selectedCategory
                                                                )
                                                            )
                                                        }
                                                        className="rounded-lg bg-yellow-800 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                                                    >
                                                        Retry Music
                                                    </button>

                                                </div>
                                            </div>
                                        )}

                                        {/* Social Error */}
                                        {social.status ===
                                            'error' && (
                                            <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">

                                                <div className="flex flex-wrap items-center justify-between gap-3">

                                                    <div>
                                                        <p className="font-medium text-blue-900 dark:text-blue-200">
                                                            Social posts could not be loaded.
                                                        </p>

                                                        <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                                            Other personalized content is still available.
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dispatch(
                                                                getSocialPosts()
                                                            )
                                                        }
                                                        className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700"
                                                    >
                                                        Retry Social
                                                    </button>

                                                </div>
                                            </div>
                                        )}

                                    </>
                                )}

                        </section>

                        {/* Trending */}
                        <section
                            id="trending"
                            className="mb-12 scroll-mt-6"
                        >

                            <div className="mb-4 animate-fade-up">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Trending
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Popular content from your personalized sources.
                                </p>
                            </div>

                            {trendingItems.length ===
                            0 ? (
                                <ContentState
                                    type="empty"
                                    message="No trending content available right now."
                                />
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                    {trendingItems.map(
                                        (
                                            item,
                                            index
                                        ) => {
                                            const isFavorite =
                                                favorites.some(
                                                    (
                                                        favorite
                                                    ) =>
                                                        favorite.id ===
                                                        item.id
                                                )

                                            return (
                                                <div
                                                    key={
                                                        item.id
                                                    }
                                                    className="animate-fade-up"
                                                    style={{
                                                        animationDelay: `${index * 70}ms`,
                                                    }}
                                                >
                                                    <ContentCard
                                                        item={
                                                            item
                                                        }
                                                        isFavorite={
                                                            isFavorite
                                                        }
                                                        onFavorite={() =>
                                                            handleFavorite(
                                                                item
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )
                                        }
                                    )}

                                </div>
                            )}

                        </section>

                        {/* Favorites */}
                        <section
                            id="favorites"
                            className="pb-8 scroll-mt-6"
                        >

                            <div className="mb-4 animate-fade-up">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Favorites
                                </h2>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Content you have saved.
                                </p>
                            </div>

                            {favorites.length ===
                            0 ? (
                                <ContentState
                                    type="empty"
                                    message="You have not saved any content yet."
                                />
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                    {favorites.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="animate-fade-up"
                                                style={{
                                                    animationDelay: `${index * 70}ms`,
                                                }}
                                            >
                                                <ContentCard
                                                    item={
                                                        item
                                                    }
                                                    isFavorite={
                                                        true
                                                    }
                                                    onFavorite={() =>
                                                        handleFavorite(
                                                            item
                                                        )
                                                    }
                                                />
                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </section>

                    </main>
                </div>
            </div>
        </DndProvider>
    )
}

export default Dashboard