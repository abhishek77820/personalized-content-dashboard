import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import Sidebar from './Sidebar'
import ContentCard from './ContentCard'
import { sampleContent } from '../data/sampleContent'
import type { ContentItem } from '../types/content'
import type { RootState, AppDispatch } from '../app/store'
import {
  addFavorite,
  removeFavorite,
} from '../features/favorites/favoritesSlice'

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()

  const favorites = useSelector(
    (state: RootState) => state.favorites.items
  )

  const handleFavorite = (item: ContentItem) => {
    const alreadyFavorite = favorites.some(
      (favorite) => favorite.id === item.id
    )

    if (alreadyFavorite) {
      dispatch(removeFavorite(item.id))
    } else {
      dispatch(addFavorite(item))
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 sm:p-6">
          {/* Welcome */}
          <section className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back 👋
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Here is your personalized content.
            </p>
          </section>

          {/* Personalized Feed */}
          <section className="mb-10">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Personalized Feed
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Content based on your interests.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sampleContent.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  isFavorite={favorites.some(
                    (favorite) => favorite.id === item.id
                  )}
                  onFavorite={() => handleFavorite(item)}
                />
              ))}
            </div>
          </section>

          {/* Favorites */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Favorites
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Content you have saved.
              </p>
            </div>

            {favorites.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <p className="text-sm text-gray-500">
                  You have not saved any content yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    isFavorite={true}
                    onFavorite={() => handleFavorite(item)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard