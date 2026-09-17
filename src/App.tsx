import { useState } from 'react'

import Dashboard from './components/Dashboard'
import SettingsPanel from './components/SettingsPanel'

function App() {
    const [isSettingsOpen, setIsSettingsOpen] =
        useState(false)

    return (
        <>
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
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">
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
                                className="rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
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
        </>
    )
}

export default App