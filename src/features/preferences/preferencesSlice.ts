import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PreferencesState {
  categories: string[]
  darkMode: boolean
}

// localStorage se saved preferences read karo
const getInitialPreferences = (): PreferencesState => {
  const savedPreferences = localStorage.getItem('preferences')

  if (savedPreferences) {
    return JSON.parse(savedPreferences)
  }

  return {
    categories: ['technology'],
    darkMode: false,
  }
}

const initialState: PreferencesState = getInitialPreferences()

const preferencesSlice = createSlice({
  name: 'preferences',

  initialState,

  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload

      localStorage.setItem(
        'preferences',
        JSON.stringify(state)
      )
    },

    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode

      localStorage.setItem(
        'preferences',
        JSON.stringify(state)
      )
    },
  },
})

export const {
  setCategories,
  toggleDarkMode,
} = preferencesSlice.actions

export default preferencesSlice.reducer