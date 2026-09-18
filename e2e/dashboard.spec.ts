import {
    test,
    expect,
    type Page,
} from '@playwright/test'

/*
 * Mock API responses so E2E tests
 * do not depend on real external APIs.
 */

async function mockDashboardApis(
    page: Page
) {
    /*
     * News API
     */
    await page.route(
        '**/api.currentsapi.services/v1/latest-news*',
        async (route) => {
            const url = new URL(
                route.request().url()
            )

            const pageNumber =
                url.searchParams.get(
                    'page_number'
                )

            const news =
                pageNumber === '2'
                    ? [
                          {
                              id: 'news-3',
                              title:
                                  'Frontend Performance',
                              description:
                                  'Practical techniques for improving frontend performance.',
                              image: null,
                              url:
                                  'https://example.com/news-3',
                              author:
                                  'Test News',
                              published:
                                  '2026-09-18',
                          },
                      ]
                    : [
                          {
                              id: 'news-1',
                              title:
                                  'React in 2026',
                              description:
                                  'Latest React development updates.',
                              image: null,
                              url:
                                  'https://example.com/news-1',
                              author:
                                  'Test News',
                              published:
                                  '2026-09-18',
                          },
                          {
                              id: 'news-2',
                              title:
                                  'AI Trends',
                              description:
                                  'Current trends in artificial intelligence.',
                              image: null,
                              url:
                                  'https://example.com/news-2',
                              author:
                                  'Test News',
                              published:
                                  '2026-09-18',
                          },
                      ]

            await route.fulfill({
                status: 200,
                contentType:
                    'application/json',
                body: JSON.stringify({
                    status: 'ok',
                    news,
                }),
            })
        }
    )

    /*
     * Social API
     */
    await page.route(
        '**/dummyjson.com/posts?*',
        async (route) => {
            await route.fulfill({
                status: 200,
                contentType:
                    'application/json',
                body: JSON.stringify({
                    posts: [
                        {
                            id: 1,
                            title:
                                'Social Post One',
                            body:
                                'This is the first social post.',
                            tags: [
                                'technology',
                            ],
                            reactions: {
                                likes: 10,
                                dislikes: 1,
                            },
                            views: 100,
                            userId: 1,
                        },
                        {
                            id: 2,
                            title:
                                'Social Post Two',
                            body:
                                'This is the second social post.',
                            tags: [
                                'technology',
                            ],
                            reactions: {
                                likes: 20,
                                dislikes: 2,
                            },
                            views: 200,
                            userId: 2,
                        },
                    ],
                    total: 2,
                    skip: 0,
                    limit: 6,
                }),
            })
        }
    )

    /*
     * iTunes Music API
     *
     * The application uses JSONP,
     * so we return JavaScript calling
     * the generated callback.
     */
    await page.route(
        '**/itunes.apple.com/search*',
        async (route) => {
            const url = new URL(
                route.request().url()
            )

            const callback =
                url.searchParams.get(
                    'callback'
                )

            const term =
                url.searchParams.get(
                    'term'
                ) || ''

            const isSearch =
                term.toLowerCase() ===
                'react'

            const results = isSearch
                ? [
                      {
                          trackId: 301,
                          trackName:
                              'React Coding Music',
                          artistName:
                              'Test Artist',
                          collectionName:
                              'Coding Collection',
                          artworkUrl100:
                              'https://example.com/music-react.jpg',
                          trackViewUrl:
                              'https://example.com/music-react',
                          primaryGenreName:
                              'Electronic',
                      },
                  ]
                : [
                      {
                          trackId: 201,
                          trackName:
                              'Tech Beats',
                          artistName:
                              'Test Artist',
                          collectionName:
                              'Technology Collection',
                          artworkUrl100:
                              'https://example.com/music-tech.jpg',
                          trackViewUrl:
                              'https://example.com/music-tech',
                          primaryGenreName:
                              'Electronic',
                      },
                      {
                          trackId: 202,
                          trackName:
                              'Coding Focus',
                          artistName:
                              'Test Artist',
                          collectionName:
                              'Focus Collection',
                          artworkUrl100:
                              'https://example.com/music-focus.jpg',
                          trackViewUrl:
                              'https://example.com/music-focus',
                          primaryGenreName:
                              'Electronic',
                      },
                  ]

            const responseBody = {
                resultCount:
                    results.length,
                results,
            }

            const jsonResponse =
                JSON.stringify(
                    responseBody
                )

            const body = callback
                ? `${callback}(${jsonResponse})`
                : jsonResponse

            await route.fulfill({
                status: 200,
                contentType:
                    callback
                        ? 'application/javascript'
                        : 'application/json',
                body,
            })
        }
    )
}

async function mockSearchApis(
    page: Page
) {
    /*
     * Search News API
     */
    await page.route(
        '**/api.currentsapi.services/v1/search*',
        async (route) => {
            await route.fulfill({
                status: 200,
                contentType:
                    'application/json',
                body: JSON.stringify({
                    status: 'ok',
                    news: [
                        {
                            id: 'search-news-1',
                            title:
                                'React Testing Guide',
                            description:
                                'A guide to testing React applications.',
                            image: null,
                            url:
                                'https://example.com/react-testing',
                            author:
                                'Search News',
                            published:
                                '2026-09-18',
                        },
                    ],
                }),
            })
        }
    )

    /*
     * Search Social API
     */
    await page.route(
        '**/dummyjson.com/posts/search*',
        async (route) => {
            await route.fulfill({
                status: 200,
                contentType:
                    'application/json',
                body: JSON.stringify({
                    posts: [
                        {
                            id: 10,
                            title:
                                'React Community Post',
                            body:
                                'A post about building React applications.',
                            tags: [
                                'react',
                            ],
                            reactions: {
                                likes: 20,
                                dislikes: 1,
                            },
                            views: 250,
                            userId: 5,
                        },
                    ],
                    total: 1,
                    skip: 0,
                    limit: 6,
                }),
            })
        }
    )

    /*
     * Search Music API
     */
    await page.route(
        '**/itunes.apple.com/search*',
        async (route) => {
            const url = new URL(
                route.request().url()
            )

            const callback =
                url.searchParams.get(
                    'callback'
                )

            const responseBody = {
                resultCount: 1,
                results: [
                    {
                        trackId: 401,
                        trackName:
                            'React Developer Playlist',
                        artistName:
                            'Test Artist',
                        collectionName:
                            'Developer Collection',
                        artworkUrl100:
                            'https://example.com/react-playlist.jpg',
                        trackViewUrl:
                            'https://example.com/react-playlist',
                        primaryGenreName:
                            'Electronic',
                    },
                ],
            }

            const jsonResponse =
                JSON.stringify(
                    responseBody
                )

            const body = callback
                ? `${callback}(${jsonResponse})`
                : jsonResponse

            await route.fulfill({
                status: 200,
                contentType:
                    callback
                        ? 'application/javascript'
                        : 'application/json',
                body,
            })
        }
    )
}

test.describe(
    'ContentHub Dashboard',
    () => {
        test.beforeEach(
            async ({ page }) => {
                await mockDashboardApis(
                    page
                )
            }
        )

        test(
            'opens the dashboard successfully',
            async ({ page }) => {
                await page.goto('/')

                await expect(
                    page.getByRole(
                        'heading',
                        {
                            name:
                                'Welcome Back 👋',
                            exact: true,
                        }
                    )
                ).toBeVisible()

                await expect(
                    page.getByRole(
                        'heading',
                        {
                            name:
                                'Personalized Feed',
                            exact: true,
                        }
                    )
                ).toBeVisible()

                await expect(
                    page.getByRole(
                        'heading',
                        {
                            name:
                                'Trending',
                            exact: true,
                        }
                    )
                ).toBeVisible()

                await expect(
                    page.getByRole(
                        'heading',
                        {
                            name:
                                'Favorites',
                            exact: true,
                        }
                    )
                ).toBeVisible()
            }
        )

        test(
            'opens settings from header',
            async ({ page }) => {
                await page.goto('/')

                await page.getByRole(
                    'button',
                    {
                        name:
                            /open settings/i,
                    }
                ).click()

                const settingsDialog =
                    page.getByRole(
                        'dialog',
                        {
                            name:
                                'Settings',
                        }
                    )

                await expect(
                    settingsDialog
                ).toBeVisible()

                await expect(
                    settingsDialog
                        .getByRole(
                            'heading',
                            {
                                name:
                                    'Settings',
                                exact: true,
                            }
                        )
                        .first()
                ).toBeVisible()
            }
        )

        test(
            'searches content successfully',
            async ({ page }) => {
                await mockSearchApis(
                    page
                )

                await page.goto('/')

                const searchInput =
                    page.getByRole(
                        'searchbox',
                        {
                            name:
                                'Search content',
                        }
                    )

                await searchInput.fill(
                    'react'
                )

                await expect(
                    page.getByRole(
                        'heading',
                        {
                            name:
                                'Search Results',
                            exact: true,
                        }
                    )
                ).toBeVisible()

                await expect(
                    page.getByText(
                        'Results for "react"'
                    )
                ).toBeVisible()

                await expect(
                    page.getByRole(
                        'heading',
                        {
                            name:
                                'React Testing Guide',
                            exact: true,
                        }
                    )
                ).toBeVisible()
            }
        )

        test(
            'reorders feed cards with drag and drop',
            async ({ page }) => {
                await page.goto('/')

                const firstCard =
                    page
                        .locator(
                            '#personalized-feed article'
                        )
                        .nth(0)

                const secondCard =
                    page
                        .locator(
                            '#personalized-feed article'
                        )
                        .nth(1)

                await expect(
                    firstCard
                        .getByRole(
                            'heading'
                        )
                        .first()
                ).toHaveText(
                    'React in 2026'
                )

                await expect(
                    secondCard
                        .getByRole(
                            'heading'
                        )
                        .first()
                ).toHaveText(
                    'AI Trends'
                )

                const dragSource =
                    firstCard.locator(
                        '..'
                    )

                const dropTarget =
                    secondCard.locator(
                        '..'
                    )

                await dragSource.dragTo(
                    dropTarget
                )

                await expect(
                    page
                        .locator(
                            '#personalized-feed article h3'
                        )
                        .first()
                ).toHaveText(
                    'AI Trends'
                )

                await page.reload()

                await expect(
                    page
                        .locator(
                            '#personalized-feed article h3'
                        )
                        .first()
                ).toHaveText(
                    'AI Trends'
                )
            }
        )
    }
)