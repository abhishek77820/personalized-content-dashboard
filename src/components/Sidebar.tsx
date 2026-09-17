interface SidebarProps {
    onSettingsClick: () => void
}

function Sidebar({
    onSettingsClick,
}: SidebarProps) {
    const scrollToSection = (
        sectionId: string
    ) => {
        const section =
            document.getElementById(
                sectionId
            )

        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }
    }

    return (
        <aside className="hidden min-h-screen w-64 border-r border-gray-200 bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 md:block">

            {/* Brand */}
            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    ContentHub
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Personalized Dashboard
                </p>
            </div>

            {/* Navigation */}
            <nav
                className="p-4"
                aria-label="Dashboard navigation"
            >
                <ul className="space-y-2">

                    {/* Dashboard */}
                    <li>
                        <button
                            type="button"
                            onClick={() =>
                                scrollToSection(
                                    'personalized-feed'
                                )
                            }
                            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-left text-sm font-medium text-gray-900 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                        >
                            Dashboard
                        </button>
                    </li>

                    {/* Trending */}
                    <li>
                        <button
                            type="button"
                            onClick={() =>
                                scrollToSection(
                                    'trending'
                                )
                            }
                            className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Trending
                        </button>
                    </li>

                    {/* Favorites */}
                    <li>
                        <button
                            type="button"
                            onClick={() =>
                                scrollToSection(
                                    'favorites'
                                )
                            }
                            className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Favorites
                        </button>
                    </li>

                    {/* Settings */}
                    <li>
                        <button
                            type="button"
                            onClick={
                                onSettingsClick
                            }
                            className="w-full rounded-lg px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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