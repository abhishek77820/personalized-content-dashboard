import { configureStore } from '@reduxjs/toolkit'

import preferencesReducer from '../features/preferences/preferencesSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'
import newsReducer from '../features/news/newsSlice'
import recommendationsReducer from '../features/recommendations/recommendationsSlice'
import socialReducer from '../features/social/socialSlice'
import searchReducer from '../features/search/searchSlice'
import feedOrderReducer from '../features/feed/feedOrderSlice'

export const store = configureStore({
    reducer: {
        preferences: preferencesReducer,
        favorites: favoritesReducer,
        news: newsReducer,
        recommendations: recommendationsReducer,
        social: socialReducer,
        search: searchReducer,
        feedOrder: feedOrderReducer,
    },
})

export type RootState =
    ReturnType<typeof store.getState>

export type AppDispatch =
    typeof store.dispatch