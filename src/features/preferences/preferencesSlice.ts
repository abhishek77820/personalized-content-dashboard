import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PreferencesState {
  categories: string[]
  darkMode: boolean
}

const initialState: PreferencesState = {
  categories: ['technology'],
  darkMode: false,
}

const preferencesSlice = createSlice({
  name: 'preferences',

  initialState,

  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
  },
})

export const { setCategories, toggleDarkMode } =
  preferencesSlice.actions

export default preferencesSlice.reducer