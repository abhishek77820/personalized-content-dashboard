import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchNews } from '../../api/newsApi'
import type { NewsArticle } from '../../api/newsApi'

interface NewsState {
  articles: NewsArticle[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
}

const initialState: NewsState = {
  articles: [],
  status: 'idle',
  error: null,
}

export const getNews = createAsyncThunk(
  'news/getNews',
  async (category: string) => {
    return await fetchNews(category)
  }
)

const newsSlice = createSlice({
  name: 'news',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getNews.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })

      .addCase(getNews.fulfilled, (state, action) => {
        state.status = 'success'
        state.articles = action.payload
      })

      .addCase(getNews.rejected, (state, action) => {
        state.status = 'error'
        state.error =
          action.error.message || 'Failed to load news'
      })
  },
})

export default newsSlice.reducer