function Sidebar() {
    return (
        <aside className="hidden min-h-screen w-64 border-r border-gray-200 bg-white md:block">
            <div className="border-b border-gray-200 p-6">
                <h1 className="text-xl font-bold text-gray-900">
                    ContentHub
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Personalized Dashboard
                </p>
            </div>

            <nav className="p-4">
                <ul className="space-y-2">
                    <li>
                        <button
                            type="button"
                            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-900"
                        >
                            Dashboard
                        </button>
                    </li>

                    <li>
                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Trending
                        </button>
                    </li>

                    <li>
                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Favorites
                        </button>
                    </li>

                    <li>
                        <button
                            type="button"
                            className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Settings
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar