import Header from './Header'
import Sidebar from './Sidebar'

function Dashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header />

                <main className="flex-1 p-4 sm:p-6">
                    <section className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome Back 👋
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Here is your personalized content.
                        </p>
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="font-semibold text-gray-900">
                                Personalized Feed
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Your recommended content will appear here.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="font-semibold text-gray-900">
                                Trending
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Trending content will appear here.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="font-semibold text-gray-900">
                                Favorites
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Your favorite content will appear here.
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Dashboard