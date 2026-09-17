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
    const [imageError, setImageError] = useState(false)

    const showImage =
        Boolean(item.imageUrl) && !imageError

    const fallbackIcon =
        item.type === 'music'
            ? '🎵'
            : item.type === 'social'
              ? '💬'
              : '📰'

    return (
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="aspect-video overflow-hidden bg-gray-100">
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
                    <div className="flex h-full items-center justify-center bg-gray-100">
                        <div className="text-center">
                            <div className="text-4xl">
                                {fallbackIcon}
                            </div>

                            <p className="mt-2 text-sm font-medium text-gray-500">
                                No image available
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                        {item.type}
                    </span>

                    {item.rating !== undefined && (
                        <span className="text-sm font-medium text-gray-600">
                            ⭐ {item.rating}
                        </span>
                    )}
                </div>

                <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
                    {item.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                    {item.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        {item.source && (
                            <p className="truncate text-xs font-medium text-gray-600">
                                {item.source}
                            </p>
                        )}

                        {item.publishedAt && (
                            <p className="mt-1 text-xs text-gray-400">
                                {item.publishedAt}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onFavorite?.(item.id)
                        }
                        aria-label={
                            isFavorite
                                ? `Remove ${item.title} from favorites`
                                : `Add ${item.title} to favorites`
                        }
                        className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isFavorite
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {isFavorite
                            ? '★ Saved'
                            : '☆ Save'}
                    </button>
                </div>

                {item.actionUrl &&
                    item.actionLabel && (
                        <a
                            href={item.actionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block text-sm font-medium text-gray-900 underline hover:text-gray-600"
                        >
                            {item.actionLabel} →
                        </a>
                    )}
            </div>
        </article>
    )
}

export default ContentCard