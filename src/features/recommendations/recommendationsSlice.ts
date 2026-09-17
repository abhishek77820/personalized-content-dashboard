import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit'

import {
    fetchRecommendations,
    type RecommendationItem,
} from '../../api/recommendationApi'

interface RecommendationsState {
    items: RecommendationItem[]
    status: 'idle' | 'loading' | 'success' | 'error'
    error: string | null
}

const initialState: RecommendationsState = {
    items: [],
    status: 'idle',
    error: null,
}

export const getRecommendations =
    createAsyncThunk(
        'recommendations/getRecommendations',
        async (category: string) => {
            return await fetchRecommendations(category)
        }
    )

const recommendationsSlice = createSlice({
    name: 'recommendations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getRecommendations.pending,
                (state) => {
                    state.status = 'loading'
                    state.error = null
                }
            )
            .addCase(
                getRecommendations.fulfilled,
                (state, action) => {
                    state.status = 'success'
                    state.items = action.payload
                }
            )
            .addCase(
                getRecommendations.rejected,
                (state, action) => {
                    state.status = 'error'
                    state.error =
                        action.error.message ||
                        'Failed to load music recommendations'
                }
            )
    },
})

export default recommendationsSlice.reducer