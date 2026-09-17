import type { ContentItem } from '../types/content'

export const sampleContent: ContentItem[] = [
  {
    id: '1',
    type: 'news',
    title: 'The Future of Artificial Intelligence',
    description:
      'Artificial intelligence is changing the way people build and use modern software.',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    source: 'Tech News',
    publishedAt: 'Today',
  },
  {
    id: '2',
    type: 'movie',
    title: 'The Social Network',
    description:
      'A story about technology, innovation and the people behind a major social platform.',
    imageUrl:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    source: 'Movie Recommendation',
    rating: 8.0,
  },
  {
    id: '3',
    type: 'social',
    title: 'Building Better Products',
    description:
      'Developers and creators share ideas about building useful digital products.',
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
    source: 'Social Feed',
    publishedAt: '2 hours ago',
  },
]