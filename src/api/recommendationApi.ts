const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search'

export interface RecommendationItem {
    id: string
    title: string
    artist: string
    album: string
    image: string
    url: string
    genre?: string
}

interface ITunesResponse {
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

const categorySearchTerms: Record<string, string> = {
    technology: 'electronic',
    sports: 'workout',
    finance: 'focus',
    entertainment: 'pop',
    health: 'relaxing',
    science: 'ambient',
}

function fetchITunesJSONP(
    term: string
): Promise<ITunesResponse> {
    return new Promise((resolve, reject) => {
        const callbackName =
            `itunesCallback_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2)}`

        const script = document.createElement('script')

        const globalWindow = window as unknown as Record<
            string,
            ((data: ITunesResponse) => void) | undefined
        >

        const cleanup = () => {
            delete globalWindow[callbackName]
            script.remove()

            if (timeoutId) {
                window.clearTimeout(timeoutId)
            }
        }

        const timeoutId = window.setTimeout(() => {
            cleanup()
            reject(
                new Error(
                    'Music recommendations request timed out'
                )
            )
        }, 10000)

        globalWindow[callbackName] = (
            data: ITunesResponse
        ) => {
            cleanup()
            resolve(data)
        }

        script.onerror = () => {
            cleanup()
            reject(
                new Error(
                    'Failed to load music recommendations'
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

        script.src = `${ITUNES_SEARCH_URL}?${params.toString()}`

        document.body.appendChild(script)
    })
}

export async function fetchRecommendations(
    category: string
) {
    const searchTerm =
        categorySearchTerms[category] || 'popular'

    const data = await fetchITunesJSONP(searchTerm)

    return data.results.map((track) => ({
        id: String(track.trackId),
        title: track.trackName,
        artist: track.artistName,
        album:
            track.collectionName ||
            'Unknown Album',
        image:
            track.artworkUrl100?.replace(
                '100x100',
                '600x600'
            ) || '',
        url: track.trackViewUrl || '',
        genre: track.primaryGenreName,
    }))
}