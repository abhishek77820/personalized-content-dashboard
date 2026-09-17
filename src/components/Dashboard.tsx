import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Header from './Header'
import Sidebar from './Sidebar'
import ContentCard from './ContentCard'
import ContentState from './ContentState'

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

interface DashboardProps {
    onSettingsClick: () => void
}

function Dashboard({
    onSettingsClick,
}: DashboardProps) {
    const dispatch = useDispatch<AppDispatch>()

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

    const selectedCategory =
        categories[0] || 'technology'

    /*
     * Load personalized content
     *
     * Whenever the selected category changes:
     * 1. Reset old news
     * 2. Fetch news from page 1
     * 3. Fetch music recommendations
     * 4. Fetch social posts
     */
    useEffect(() => {
        dispatch(resetNews())

        dispatch(
            getNews({
                category: selectedCategory,
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
     *
     * useCallback keeps the function reference stable.
     * This prevents the Header debounce effect
     * from running continuously.
     */
    const handleSearch = useCallback(
        (query: string) => {
            if (!query.trim()) {
                dispatch(clearSearch())
                return
            }

            dispatch(
                searchContentThunk(
                    query
                )
            )
        },
        [dispatch]
    )

    /*
     * Add or remove a favorite item
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
     * Convert News API data
     * into our common ContentItem format.
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
     * Convert music recommendation data
     * into our common ContentItem format.
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
     * into our common ContentItem format.
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
     * Unified personalized feed
     */
    const personalizedFeed = [
        ...newsItems,
        ...musicItems,
        ...socialItems,
    ]

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
     * Trending social posts
     * based on views.
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
     * Convert search results
     * into ContentItem format.
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
     * Initial loading state
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
     * All three sources failed
     */
    const allSourcesFailed =
        news.status === 'error' &&
        recommendations.status ===
            'error' &&
        social.status === 'error'

    const hasContent =
        personalizedFeed.length > 0

    /*
     * Check whether all APIs
     * have finished their first request.
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

    /*
     * No content after all APIs finish
     */
    const hasNoContent =
        allSourcesFinished &&
        !hasContent

    /*
     * Retry all APIs
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
     * Load next news page
     */
    const loadMoreNews = () => {
        if (
            news.status === 'loading' ||
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
        <div className="flex min-h-screen bg-gray-50">

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
                    <section className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome Back 👋
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Here is your personalized
                            content.
                        </p>
                    </section>

                    {/* Search Results */}
                    {search.query.trim() && (
                        <section className="mb-12">

                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Search Results
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Results for "
                                    {search.query}"
                                </p>
                            </div>

                            {/* Search Loading */}
                            {search.status ===
                                'loading' && (
                                <ContentState
                                    type="loading"
                                    message="Searching content..."
                                />
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

                            {/* Search Results Grid */}
                            {search.status ===
                                'success' &&
                                searchItems.length >
                                    0 && (
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {searchItems.map(
                                            (item) => {
                                                const isFavorite =
                                                    favorites.some(
                                                        (
                                                            favorite
                                                        ) =>
                                                            favorite.id ===
                                                            item.id
                                                    )

                                                return (
                                                    <ContentCard
                                                        key={
                                                            item.id
                                                        }
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

                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Personalized Feed
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Latest{' '}
                                {selectedCategory}{' '}
                                news, music and social
                                content based on your
                                preferences.
                            </p>
                        </div>

                        {/* Initial Loading */}
                        {isInitialLoading && (
                            <ContentState
                                type="loading"
                                message="Loading your personalized feed..."
                            />
                        )}

                        {/* All Sources Failed */}
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

                        {/* Feed Content */}
                        {!isInitialLoading &&
                            !allSourcesFailed &&
                            hasContent && (
                                <>

                                    {/* Content Cards */}
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                                        {personalizedFeed.map(
                                            (item) => {
                                                const isFavorite =
                                                    favorites.some(
                                                        (
                                                            favorite
                                                        ) =>
                                                            favorite.id ===
                                                            item.id
                                                    )

                                                return (
                                                    <ContentCard
                                                        key={
                                                            item.id
                                                        }
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
                                                )
                                            }
                                        )}

                                    </div>

                                    {/* Load More News */}
                                    {news.hasMore && (
                                        <div className="mt-8 flex justify-center">
                                            <button
                                                type="button"
                                                onClick={
                                                    loadMoreNews
                                                }
                                                disabled={
                                                    news.status ===
                                                    'loading'
                                                }
                                                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">

                                            <div className="flex flex-wrap items-center justify-between gap-3">

                                                <div>
                                                    <p className="font-medium text-red-900">
                                                        News could not be loaded.
                                                    </p>

                                                    <p className="mt-1 text-sm text-red-700">
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
                                                    className="rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800"
                                                >
                                                    Retry News
                                                </button>

                                            </div>
                                        </div>
                                    )}

                                    {/* Music Error */}
                                    {recommendations.status ===
                                        'error' && (
                                        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

                                            <div className="flex flex-wrap items-center justify-between gap-3">

                                                <div>
                                                    <p className="font-medium text-yellow-900">
                                                        Music recommendations could not be loaded.
                                                    </p>

                                                    <p className="mt-1 text-sm text-yellow-700">
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
                                                    className="rounded-lg bg-yellow-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-700"
                                                >
                                                    Retry Music
                                                </button>

                                            </div>
                                        </div>
                                    )}

                                    {/* Social Error */}
                                    {social.status ===
                                        'error' && (
                                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">

                                            <div className="flex flex-wrap items-center justify-between gap-3">

                                                <div>
                                                    <p className="font-medium text-blue-900">
                                                        Social posts could not be loaded.
                                                    </p>

                                                    <p className="mt-1 text-sm text-blue-700">
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
                                                    className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
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

                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Trending
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
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
                                    (item) => {
                                        const isFavorite =
                                            favorites.some(
                                                (
                                                    favorite
                                                ) =>
                                                    favorite.id ===
                                                    item.id
                                            )

                                        return (
                                            <ContentCard
                                                key={
                                                    item.id
                                                }
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

                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Favorites
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
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
                                    (item) => (
                                        <ContentCard
                                            key={
                                                item.id
                                            }
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
                                    )
                                )}

                            </div>
                        )}

                    </section>

                </main>
            </div>
        </div>
    )
}

export default Dashboard