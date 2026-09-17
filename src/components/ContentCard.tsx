import { useState } from 'react'

import type { ContentItem } from '../types/content'

interface ContentCardProps {
    item: ContentItem
    isFavorite?: boolean
    onFavorite?: (id: string) => void
}

function ContentCard({
    item,
    isFavorite = false,
    onFavorite,
}: ContentCardProps) {
    const [imageError, setImageError] =
        useState(false)

    const showImage =
        Boolean(item.imageUrl) &&
        !imageError

    const fallbackIcon =
        item.type === 'music'
            ? '🎵'
            : item.type === 'social'
              ? '💬'
              : '📰'

    return (
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
            
            {/* Image */}
            <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                {showImage ? (
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        onError={() =>
                            setImageError(true)
                        }
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <div className="text-center">
                            <div className="text-4xl">
                                {fallbackIcon}
                            </div>

                            <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">
                                No image available
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">

                {/* Type + Rating */}
                <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {item.type}
                    </span>

                    {item.rating !== undefined && (
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            ⭐ {item.rating}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {item.description}
                </p>

                {/* Source + Favorite */}
                <div className="mt-5 flex items-center justify-between gap-3">

                    <div className="min-w-0">

                        {item.source && (
                            <p className="truncate text-xs font-medium text-gray-600 dark:text-gray-300">
                                {item.source}
                            </p>
                        )}

                        {item.publishedAt && (
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                {item.publishedAt}
                            </p>
                        )}

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onFavorite?.(
                                item.id
                            )
                        }
                        aria-label={
                            isFavorite
                                ? `Remove ${item.title} from favorites`
                                : `Add ${item.title} to favorites`
                        }
                        className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isFavorite
                                ? 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {isFavorite
                            ? '★ Saved'
                            : '☆ Save'}
                    </button>
                </div>

                {/* CTA */}
                {item.actionUrl &&
                    item.actionLabel && (
                        <a
                            href={
                                item.actionUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block text-sm font-medium text-gray-900 underline transition hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300"
                        >
                            {item.actionLabel}{' '}
                            →
                        </a>
                    )}
            </div>
        </article>
    )
}

export default ContentCard