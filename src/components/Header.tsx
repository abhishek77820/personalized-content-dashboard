function Header() {
    return (
        <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Personalized Feed
                    </h2>

                    <p className="text-sm text-gray-500">
                        Content based on your preferences
                    </p>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                    <input
                        type="search"
                        placeholder="Search content..."
                        className="w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
                    />

                    <button
                        type="button"
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                    >
                        Search
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header