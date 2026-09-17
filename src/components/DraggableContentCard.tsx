import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
    useDrag,
    useDrop,
} from 'react-dnd'

import ContentCard from './ContentCard'

import type { ContentItem } from '../types/content'
import type { AppDispatch } from '../app/store'

import {
    moveFeedItem,
} from '../features/feed/feedOrderSlice'

interface DraggableContentCardProps {
    item: ContentItem
    isFavorite?: boolean
    onFavorite?: (id: string) => void
}

interface DragItem {
    id: string
}

function DraggableContentCard({
    item,
    isFavorite = false,
    onFavorite,
}: DraggableContentCardProps) {
    const dispatch =
        useDispatch<AppDispatch>()

    const cardRef =
        useRef<HTMLDivElement>(null)

    const [{ isDragging }, drag] =
        useDrag(() => ({
            type: 'CONTENT_CARD',

            item: {
                id: item.id,
            },

            collect: (monitor) => ({
                isDragging:
                    monitor.isDragging(),
            }),
        }), [item.id])

    const [{ isOver }, drop] =
        useDrop<
            DragItem,
            void,
            { isOver: boolean }
        >(() => ({
            accept: 'CONTENT_CARD',

            drop: (draggedItem) => {
                if (
                    draggedItem.id !==
                    item.id
                ) {
                    dispatch(
                        moveFeedItem({
                            dragId:
                                draggedItem.id,
                            targetId:
                                item.id,
                        })
                    )
                }
            },

            collect: (monitor) => ({
                isOver:
                    monitor.isOver(),
            }),
        }), [
            item.id,
            dispatch,
        ])

    drag(drop(cardRef))

    return (
        <div
            ref={cardRef}
            className={`transition ${
                isDragging
                    ? 'scale-95 opacity-40'
                    : 'opacity-100'
            } ${
                isOver
                    ? 'rounded-2xl ring-2 ring-gray-400'
                    : ''
            }`}
        >
            <ContentCard
                item={item}
                isFavorite={
                    isFavorite
                }
                onFavorite={
                    onFavorite
                }
            />
        </div>
    )
}

export default DraggableContentCard