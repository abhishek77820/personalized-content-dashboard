import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Header from './Header'
import Sidebar from './Sidebar'
import ContentCard from './ContentCard'
import ContentState from './ContentState'

import type { ContentItem } from '../types/content'
import type { RootState, AppDispatch } from '../app/store'

import {
    addFavorite,
    removeFavorite,
} from '../features/favorites/favoritesSlice'

import { getNews } from '../features/news/newsSlice'
import { getRecommendations } from '../features/recommendations/recommendationsSlice'

interface DashboardProps {
    onSettingsClick: () => void
}

function Dashboard({
    onSettingsClick,
}: DashboardProps) {
    const dispatch = useDispatch<AppDispatch>()

    const favorites = useSelector(
        (state: RootState) => state.favorites.items
    )

    const news = useSelector(
        (state: RootState) => state.news
    )

    const recommendations = useSelector(
        (state: RootState) =>
            state.recommendations
    )

    const categories = useSelector(
        (state: RootState) =>
            state.preferences.categories
    )

    const selectedCategory =
        categories[0] || 'technology'

    useEffect(() => {
        dispatch(getNews(selectedCategory))
        dispatch(
            getRecommendations(selectedCategory)
        )
    }, [dispatch, selectedCategory])

    const handleFavorite = (
        item: ContentItem
    ) => {
        const alreadyFavorite = favorites.some(
            (favorite) =>
                favorite.id === item.id
        )

        if (alreadyFavorite) {
            dispatch(removeFavorite(item.id))
        } else {
            dispatch(addFavorite(item))
        }
    }

    const newsItems: ContentItem[] =
        news.articles.map((article) => ({
            id: article.id,
            type: 'news',
            title: article.title,
            description:
                article.description ||
                'No description available.',
            imageUrl: article.image || '',
            source:
                article.author || 'News',
            publishedAt: article.published,
            actionUrl: article.url,
            actionLabel: 'Read More',
        }))

    const musicItems: ContentItem[] =
        recommendations.items.map((item) => ({
            id: `music-${item.id}`,
            type: 'music',
            title: item.title,
            description: `${item.artist} • ${item.album}`,
            imageUrl: item.image,
            source: item.genre || 'Music',
            actionUrl: item.url,
            actionLabel: 'Listen Now',
        }))

    const personalizedFeed = [
        ...newsItems,
        ...musicItems,
    ]

    const isInitialLoading =
        personalizedFeed.length === 0 &&
        (news.status === 'loading' ||
            recommendations.status ===
                'loading')

    const bothSourcesFailed =
        news.status === 'error' &&
        recommendations.status === 'error'

    const hasContent =
        personalizedFeed.length > 0

    const bothSourcesFinished =
        (news.status === 'success' ||
            news.status === 'error') &&
        (recommendations.status === 'success' ||
            recommendations.status === 'error')

    const hasNoContent =
        bothSourcesFinished &&
        !hasContent &&
        !bothSourcesFailed

    const retryAll = () => {
        dispatch(getNews(selectedCategory))
        dispatch(
            getRecommendations(
                selectedCategory
            )
        )
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    onSettingsClick={
                        onSettingsClick
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

                    {/* Personalized Feed */}
                    <section className="mb-10">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Personalized Feed
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Latest{' '}
                                {selectedCategory}{' '}
                                news and music
                                recommendations based
                                on your preferences.
                            </p>
                        </div>

                        {/* Loading */}
                        {isInitialLoading && (
                            <ContentState
                                type="loading"
                                message="Loading your personalized feed..."
                            />
                        )}

                        {/* Both APIs failed */}
                        {!isInitialLoading &&
                            bothSourcesFailed && (
                                <ContentState
                                    type="error"
                                    message="Unable to load news and music recommendations."
                                    onRetry={retryAll}
                                />
                            )}

                        {/* Empty */}
                        {!isInitialLoading &&
                            !bothSourcesFailed &&
                            hasNoContent && (
                                <ContentState
                                    type="empty"
                                    message="No personalized content available right now."
                                />
                            )}

                        {/* Unified Feed */}
                        {!isInitialLoading &&
                            !bothSourcesFailed &&
                            hasContent && (
                                <>
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
                                                        Music recommendations are still available.
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(
                                                            getNews(
                                                                selectedCategory
                                                            )
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
                                                        News content is still available.
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
                                </>
                            )}
                    </section>

                    {/* Favorites */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Favorites
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Content you have saved.
                            </p>
                        </div>

                        {favorites.length === 0 ? (
                            <ContentState
                                type="empty"
                                message="You have not saved any content yet."
                            />
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {favorites.map(
                                    (item) => (
                                        <ContentCard
                                            key={item.id}
                                            item={item}
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