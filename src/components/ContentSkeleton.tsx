function ContentSkeleton() {
    return (
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Image skeleton */}
            <div className="aspect-video animate-shimmer" />

            <div className="p-5">
                {/* Type */}
                <div className="h-6 w-20 rounded-full animate-shimmer" />

                {/* Title */}
                <div className="mt-4 space-y-2">
                    <div className="h-5 w-full rounded animate-shimmer" />
                    <div className="h-5 w-4/5 rounded animate-shimmer" />
                </div>

                {/* Description */}
                <div className="mt-3 space-y-2">
                    <div className="h-4 w-full rounded animate-shimmer" />
                    <div className="h-4 w-11/12 rounded animate-shimmer" />
                    <div className="h-4 w-3/4 rounded animate-shimmer" />
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="h-4 w-24 rounded animate-shimmer" />

                    <div className="h-9 w-20 rounded-lg animate-shimmer" />
                </div>
            </div>
        </article>
    )
}

export default ContentSkeleton