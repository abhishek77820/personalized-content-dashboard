import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface FeedOrderState {
    ids: string[]
}

const getInitialFeedOrder = (): string[] => {
    const savedOrder =
        localStorage.getItem('feedOrder')

    if (!savedOrder) {
        return []
    }

    try {
        const parsedOrder =
            JSON.parse(savedOrder)

        return Array.isArray(parsedOrder)
            ? parsedOrder
            : []
    } catch {
        return []
    }
}

const initialState: FeedOrderState = {
    ids: getInitialFeedOrder(),
}

const feedOrderSlice = createSlice({
    name: 'feedOrder',

    initialState,

    reducers: {
        setFeedOrder: (
            state,
            action: PayloadAction<string[]>
        ) => {
            state.ids = action.payload

            localStorage.setItem(
                'feedOrder',
                JSON.stringify(state.ids)
            )
        },

        moveFeedItem: (
            state,
            action: PayloadAction<{
                dragId: string
                targetId: string
            }>
        ) => {
            const {
                dragId,
                targetId,
            } = action.payload

            const dragIndex =
                state.ids.indexOf(dragId)

            const targetIndex =
                state.ids.indexOf(targetId)

            if (
                dragIndex === -1 ||
                targetIndex === -1 ||
                dragIndex === targetIndex
            ) {
                return
            }

            const updatedIds = [
                ...state.ids,
            ]

            const [draggedId] =
                updatedIds.splice(
                    dragIndex,
                    1
                )

            const newTargetIndex =
                dragIndex < targetIndex
                    ? targetIndex - 1
                    : targetIndex

            updatedIds.splice(
                newTargetIndex,
                0,
                draggedId
            )

            state.ids = updatedIds

            localStorage.setItem(
                'feedOrder',
                JSON.stringify(state.ids)
            )
        },
    },
})

export const {
    setFeedOrder,
    moveFeedItem,
} = feedOrderSlice.actions

export default feedOrderSlice.reducer