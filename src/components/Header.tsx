function Header() {
    return (
        <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Page Title */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        ContentHub
                    </h2>

                    <p className="text-sm text-gray-500">
                        Personalized Dashboard
                    </p>
                </div>

                {/* Header Actions */}
                <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                    {/* Search */}
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
                        <input
                            type="search"
                            placeholder="Search content..."
                            aria-label="Search content"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-gray-500 sm:w-64"
                        />

                        <button
                            type="button"
                            className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                        >
                            Search
                        </button>
                    </div>

                    {/* Settings */}
                    <button
                        type="button"
                        aria-label="Open settings"
                        className="hidden rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:block"
                    >
                        ⚙ Settings
                    </button>

                    {/* Account Info */}
                    <div className="hidden items-center gap-2 border-l border-gray-200 pl-3 sm:flex">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                            U
                        </div>

                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Guest User
                            </p>

                            <p className="text-xs text-gray-500">
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