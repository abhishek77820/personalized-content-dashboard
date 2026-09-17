import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import Dashboard from './components/Dashboard'
import SettingsPanel from './components/SettingsPanel'

import type { RootState } from './app/store'

function App() {
    const [isSettingsOpen, setIsSettingsOpen] =
        useState(false)

    const darkMode = useSelector(
        (state: RootState) =>
            state.preferences.darkMode
    )

    useEffect(() => {
        const root =
            document.documentElement

        root.classList.toggle(
            'dark',
            darkMode
        )
    }, [darkMode])

    return (
        <div
            className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-200"
        >
            <Dashboard
                onSettingsClick={() =>
                    setIsSettingsOpen(true)
                }
            />

            {isSettingsOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Settings"
                    onClick={() =>
                        setIsSettingsOpen(false)
                    }
                >
                    <div
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-gray-800"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Settings
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsSettingsOpen(
                                        false
                                    )
                                }
                                aria-label="Close settings"
                                className="rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5">
                            <SettingsPanel />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App