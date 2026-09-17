interface ContentStateProps {
    type: 'loading' | 'error' | 'empty'
    message?: string
    onRetry?: () => void
}

function ContentState({
    type,
    message,
    onRetry,
}: ContentStateProps) {
    /*
     * Loading state
     */
    if (type === 'loading') {
        return (
            <div className="flex min-h-40 items-center justify-center rounded-xl border border-gray-200 bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800">
                <div className="text-center">

                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800 dark:border-gray-600 dark:border-t-gray-200" />

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {message ||
                            'Loading content...'}
                    </p>

                </div>
            </div>
        )
    }

    /*
     * Error state
     */
    if (type === 'error') {
        return (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center transition-colors duration-200 dark:border-red-900 dark:bg-gray-800">

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Something went wrong
                </h3>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {message ||
                        'Unable to load content.'}
                </p>

                {onRetry && (
                    <button
                        type="button"
                        onClick={
                            onRetry
                        }
                        className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        Retry
                    </button>
                )}

            </div>
        )
    }

    /*
     * Empty state
     */
    return (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center transition-colors duration-200 dark:border-gray-600 dark:bg-gray-800">

            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                No content available
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {message ||
                    'There is no content to display right now.'}
            </p>

        </div>
    )
}

export default ContentState