const SOCIAL_API_URL = 'https://dummyjson.com/posts'

export interface SocialPost {
    id: number
    title: string
    body: string
    tags: string[]
    reactions: {
        likes: number
        dislikes: number
    }
    views: number
    userId: number
}

interface SocialApiResponse {
    posts: SocialPost[]
    total: number
    skip: number
    limit: number
}

export async function fetchSocialPosts() {
    const params = new URLSearchParams({
        limit: '6',
        skip: '0',
    })

    const response = await fetch(
        `${SOCIAL_API_URL}?${params.toString()}`
    )

    if (!response.ok) {
        throw new Error('Failed to fetch social posts')
    }

    const data: SocialApiResponse =
        await response.json()

    if (!Array.isArray(data.posts)) {
        throw new Error(
            'Invalid social posts response'
        )
    }

    return data.posts
}