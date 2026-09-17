import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit'

import {
    searchContent,
    type SearchResult,
} from '../../api/searchApi'

interface SearchState {
    query: string
    results: SearchResult[]
    status:
        | 'idle'
        | 'loading'
        | 'success'
        | 'error'
    error: string | null
}

const initialState: SearchState = {
    query: '',
    results: [],
    status: 'idle',
    error: null,
}

export const searchContentThunk =
    createAsyncThunk(
        'search/searchContent',
        async (query: string) => {
            const results =
                await searchContent(query)

            return {
                query,
                results,
            }
        }
    )

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.query = ''
            state.results = []
            state.status = 'idle'
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(
                searchContentThunk.pending,
                (state, action) => {
                    state.query =
                        action.meta.arg
                    state.status = 'loading'
                    state.error = null
                }
            )
            .addCase(
                searchContentThunk.fulfilled,
                (state, action) => {
                    state.query =
                        action.payload.query
                    state.results =
                        action.payload.results
                    state.status = 'success'
                }
            )
            .addCase(
                searchContentThunk.rejected,
                (state, action) => {
                    state.status = 'error'
                    state.error =
                        action.error.message ||
                        'Search failed'
                }
            )
    },
})

export const { clearSearch } =
    searchSlice.actions

export default searchSlice.reducer