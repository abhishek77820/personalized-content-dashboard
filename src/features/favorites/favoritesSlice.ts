import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ContentItem } from '../../types/content'

interface FavoritesState {
  items: ContentItem[]
}

const initialState: FavoritesState = {
  items: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',

  initialState,

  reducers: {
    addFavorite: (state, action: PayloadAction<ContentItem>) => {
      const alreadyExists = state.items.some(
        (item) => item.id === action.payload.id
      )

      if (!alreadyExists) {
        state.items.push(action.payload)
      }
    },

    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      )
    },
  },
})

export const {
  addFavorite,
  removeFavorite,
} = favoritesSlice.actions

export default favoritesSlice.reducer