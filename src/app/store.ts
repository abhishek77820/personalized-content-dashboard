import { configureStore } from '@reduxjs/toolkit'

import preferencesReducer from '../features/preferences/preferencesSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'
import newsReducer from '../features/news/newsSlice'
import recommendationsReducer from '../features/recommendations/recommendationsSlice'

export const store = configureStore({
    reducer: {
        preferences: preferencesReducer,
        favorites: favoritesReducer,
        news: newsReducer,
        recommendations: recommendationsReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch