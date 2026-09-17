export type ContentType =
    | 'news'
    | 'music'
    | 'social'

export interface ContentItem {
    id: string
    type: ContentType
    title: string
    description: string
    imageUrl: string
    source?: string
    publishedAt?: string
    rating?: number
    actionUrl?: string
    actionLabel?: string
}