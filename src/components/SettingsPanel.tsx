import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../app/store'
import {
  setCategories,
  toggleDarkMode,
} from '../features/preferences/preferencesSlice'

const availableCategories = [
  'Technology',
  'Sports',
  'Finance',
  'Entertainment',
  'Health',
  'Science',
]

function SettingsPanel() {
  const dispatch = useDispatch<AppDispatch>()

  const categories = useSelector(
    (state: RootState) => state.preferences.categories
  )

  const darkMode = useSelector(
    (state: RootState) => state.preferences.darkMode
  )

  const handleCategoryChange = (category: string) => {
    const categoryKey = category.toLowerCase()

    const updatedCategories = categories.includes(categoryKey)
      ? categories.filter((item) => item !== categoryKey)
      : [...categories, categoryKey]

    dispatch(setCategories(updatedCategories))
  }

  return (
    <section className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Settings
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose your preferred content categories.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          Preferred Categories
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {availableCategories.map((category) => {
            const categoryKey = category.toLowerCase()
            const isSelected = categories.includes(categoryKey)

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
        <div>
          <h3 className="font-semibold text-gray-800">
            Dark Mode
          </h3>

          <p className="text-sm text-gray-500">
            Use dark theme across the dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch(toggleDarkMode())}
          className={`relative h-7 w-14 rounded-full transition ${
            darkMode ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          aria-label="Toggle dark mode"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              darkMode ? 'left-8' : 'left-1'
            }`}
          />
        </button>
      </div>
    </section>
  )
}

export default SettingsPanel