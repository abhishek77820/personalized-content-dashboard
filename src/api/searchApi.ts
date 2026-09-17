const CURRENTS_SEARCH_URL =
    'https://api.currentsapi.services/v1/search'

const ITUNES_SEARCH_URL =
    'https://itunes.apple.com/search'

const SOCIAL_SEARCH_URL =
    'https://dummyjson.com/posts/search'

export interface SearchResult {
    id: string
    type: 'news' | 'music' | 'social'
    title: string
    description: string
    imageUrl: string
    source?: string
    publishedAt?: string
    actionUrl?: string
    actionLabel?: string
    rating?: number
}

interface CurrentsSearchResponse {
    status: string
    news: Array<{
        id: string
        title: string
        description?: string
        image?: string | null
        url: string
        author?: string
        published?: string
    }>
}

interface ITunesSearchResponse {
    resultCount: number
    results: Array<{
        trackId: number
        trackName: string
        artistName: string
        collectionName?: string
        artworkUrl100?: string
        trackViewUrl?: string
        primaryGenreName?: string
    }>
}

interface SocialSearchResponse {
    posts: Array<{
        id: number
        title: string
        body: string
        tags: string[]
        views: number
        userId: number
    }>
}

function fetchITunesJSONP(
    term: string
): Promise<ITunesSearchResponse> {
    return new Promise((resolve, reject) => {
        const callbackName =
            `searchCallback_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2)}`

        const script =
            document.createElement('script')

        const globalWindow =
            window as unknown as Record<
                string,
                (
                    data: ITunesSearchResponse
                ) => void
            >

        const cleanup = () => {
            delete globalWindow[callbackName]
            script.remove()
            window.clearTimeout(timeoutId)
        }

        const timeoutId = window.setTimeout(() => {
            cleanup()

            reject(
                new Error(
                    'Music search request timed out'
                )
            )
        }, 10000)

        globalWindow[callbackName] = (
            data
        ) => {
            cleanup()
            resolve(data)
        }

        script.onerror = () => {
            cleanup()

            reject(
                new Error(
                    'Failed to search music'
                )
            )
        }

        const params = new URLSearchParams({
            term,
            country: 'IN',
            media: 'music',
            entity: 'song',
            limit: '6',
            lang: 'en_us',
            callback: callbackName,
        })

        script.src =
            `${ITUNES_SEARCH_URL}?${params.toString()}`

        document.body.appendChild(script)
    })
}

async function searchNews(
    query: string
): Promise<SearchResult[]> {
    const apiKey =
        import.meta.env.VITE_CURRENTS_API_KEY

    if (!apiKey) {
        throw new Error(
            'Currents API key is missing'
        )
    }

    const params = new URLSearchParams({
        apiKey,
        keywords: query,
        language: 'en',
        page_number: '1',
        page_size: '6',
    })

    const response = await fetch(
        `${CURRENTS_SEARCH_URL}?${params.toString()}`
    )

    if (!response.ok) {
        throw new Error(
            'Failed to search news'
        )
    }

    const data: CurrentsSearchResponse =
        await response.json()

    if (
        data.status !== 'ok' ||
        !Array.isArray(data.news)
    ) {
        throw new Error(
            'Invalid news search response'
        )
    }

    return data.news.map((article) => ({
        id: `news-${article.id}`,
        type: 'news' as const,
        title: article.title,
        description:
            article.description ||
            'No description available.',
        imageUrl: article.image || '',
        source:
            article.author || 'News',
        publishedAt:
            article.published,
        actionUrl: article.url,
        actionLabel: 'Read More',
    }))
}

async function searchMusic(
    query: string
): Promise<SearchResult[]> {
    const data =
        await fetchITunesJSONP(query)

    return data.results.map((track) => ({
        id: `music-${track.trackId}`,
        type: 'music' as const,
        title: track.trackName,
        description: `${track.artistName} • ${
            track.collectionName ||
            'Unknown Album'
        }`,
        imageUrl:
            track.artworkUrl100?.replace(
                '100x100',
                '600x600'
            ) || '',
        source:
            track.primaryGenreName ||
            'Music',
        actionUrl:
            track.trackViewUrl || '',
        actionLabel: 'Listen Now',
    }))
}

async function searchSocial(
    query: string
): Promise<SearchResult[]> {
    const params = new URLSearchParams({
        q: query,
        limit: '6',
    })

    const response = await fetch(
        `${SOCIAL_SEARCH_URL}?${params.toString()}`
    )

    if (!response.ok) {
        throw new Error(
            'Failed to search social posts'
        )
    }

    const data: SocialSearchResponse =
        await response.json()

    if (!Array.isArray(data.posts)) {
        throw new Error(
            'Invalid social search response'
        )
    }

    return data.posts.map((post) => ({
        id: `social-${post.id}`,
        type: 'social' as const,
        title: post.title,
        description: post.body,
        imageUrl: '',
        source: `User #${post.userId}`,
        publishedAt: `${post.views} views`,
        actionUrl: `https://dummyjson.com/posts/${post.id}`,
        actionLabel: 'View Post',
    }))
}

export async function searchContent(
    query: string
) {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
        return []
    }

    const results = await Promise.allSettled([
        searchNews(trimmedQuery),
        searchMusic(trimmedQuery),
        searchSocial(trimmedQuery),
    ])

    return results.flatMap((result) =>
        result.status === 'fulfilled'
            ? result.value
            : []
    )
}