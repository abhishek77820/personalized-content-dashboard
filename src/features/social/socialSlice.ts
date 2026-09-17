import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit'

import {
    fetchSocialPosts,
    type SocialPost,
} from '../../api/socialApi'

interface SocialState {
    posts: SocialPost[]
    status:
        | 'idle'
        | 'loading'
        | 'success'
        | 'error'
    error: string | null
}

const initialState: SocialState = {
    posts: [],
    status: 'idle',
    error: null,
}

export const getSocialPosts =
    createAsyncThunk(
        'social/getSocialPosts',
        async () => {
            return await fetchSocialPosts()
        }
    )

const socialSlice = createSlice({
    name: 'social',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getSocialPosts.pending,
                (state) => {
                    state.status = 'loading'
                    state.error = null
                }
            )
            .addCase(
                getSocialPosts.fulfilled,
                (state, action) => {
                    state.status = 'success'
                    state.posts = action.payload
                }
            )
            .addCase(
                getSocialPosts.rejected,
                (state, action) => {
                    state.status = 'error'
                    state.error =
                        action.error.message ||
                        'Failed to load social posts'
                }
            )
    },
})

export default socialSlice.reducer