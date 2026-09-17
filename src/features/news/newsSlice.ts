import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'

import { fetchNews } from '../../api/newsApi'
import type { NewsArticle } from '../../api/newsApi'

interface NewsState {
  articles: NewsArticle[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  page: number
  hasMore: boolean
}

const initialState: NewsState = {
  articles: [],
  status: 'idle',
  error: null,
  page: 0,
  hasMore: true,
}

export const getNews = createAsyncThunk(
  'news/getNews',
  async ({
    category,
    page,
  }: {
    category: string
    page: number
  }) => {
    const articles = await fetchNews(
      category,
      page
    )

    return {
      articles,
      page,
    }
  }
)

const newsSlice = createSlice({
  name: 'news',

  initialState,

  reducers: {
    resetNews: (state) => {
      state.articles = []
      state.status = 'idle'
      state.error = null
      state.page = 0
      state.hasMore = true
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getNews.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })

      .addCase(
        getNews.fulfilled,
        (state, action) => {
          const {
            articles,
            page,
          } = action.payload

          if (page === 1) {
            state.articles = articles
          } else {
            state.articles = [
              ...state.articles,
              ...articles,
            ]
          }

          state.page = page
          state.status = 'success'

          state.hasMore =
            articles.length > 0
        }
      )

      .addCase(
        getNews.rejected,
        (state, action) => {
          state.status = 'error'
          state.error =
            action.error.message ||
            'Failed to load news'
        }
      )
  },
})

export const {
  resetNews,
} = newsSlice.actions

export default newsSlice.reducer