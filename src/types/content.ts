export type ContentType = 'news' | 'movie' | 'social'

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  description: string
  imageUrl: string
  source?: string
  publishedAt?: string
  rating?: number
}