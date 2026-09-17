const CURRENTS_API_URL =
  'https://api.currentsapi.services/v1/latest-news'

export interface NewsArticle {
  id: string
  title: string
  description: string
  image: string | null
  url: string
  author: string
  published: string
}

interface CurrentsApiResponse {
  status: string
  news: NewsArticle[]
}

export async function fetchNews(
  category: string,
  page: number = 1
) {
  const apiKey =
    import.meta.env.VITE_CURRENTS_API_KEY

  if (!apiKey) {
    throw new Error(
      'Currents API key is missing'
    )
  }

  const params = new URLSearchParams({
    apiKey,
    category,
    language: 'en',
    page_number: String(page),
    page_size: '6',
  })

  const response = await fetch(
    `${CURRENTS_API_URL}?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(
      'Failed to fetch news'
    )
  }

  const data: CurrentsApiResponse =
    await response.json()

  if (data.status !== 'ok') {
    throw new Error(
      'Unable to fetch news'
    )
  }

  return data.news
}