import { useEffect, useState } from 'react'

interface HeaderProps {
    onSettingsClick: () => void
    onSearch: (query: string) => void
}

function Header({
    onSettingsClick,
    onSearch,
}: HeaderProps) {
    const [searchInput, setSearchInput] =
        useState('')

    /*
     * Debounced search
     */
    useEffect(() => {
        const trimmedQuery =
            searchInput.trim()

        if (!trimmedQuery) {
            return
        }

        const timeoutId =
            window.setTimeout(() => {
                onSearch(trimmedQuery)
            }, 500)

        return () =>
            window.clearTimeout(timeoutId)
    }, [searchInput, onSearch])

    /*
     * Search form submit
     */
    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        onSearch(
            searchInput.trim()
        )
    }

    return (
        <header className="border-b border-gray-200 bg-white px-4 py-4 transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">

                {/* Title */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        ContentHub
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Personalized Dashboard
                    </p>
                </div>

                <div className="flex w-full items-center justify-end gap-3 sm:w-auto">

                    {/* Search */}
                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none"
                    >
                        <input
                            type="search"
                            value={
                                searchInput
                            }
                            onChange={(
                                event
                            ) =>
                                setSearchInput(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search content..."
                            aria-label="Search content"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-gray-400 sm:w-64"
                        />

                        <button
                            type="submit"
                            className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            Search
                        </button>
                    </form>

                    {/* Settings */}
                    <button
                        type="button"
                        onClick={
                            onSettingsClick
                        }
                        aria-label="Open settings"
                        className="hidden rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 sm:block"
                    >
                        ⚙ Settings
                    </button>

                    {/* Account */}
                    <div className="hidden items-center gap-2 border-l border-gray-200 pl-3 dark:border-gray-700 sm:flex">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                            U
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                Guest User
                            </p>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Account
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header