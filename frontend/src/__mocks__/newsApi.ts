import { jest } from '@jest/globals';
import type { Article } from '../components/NewsFeed';

export const fetchNews = jest.fn<Promise<Article[]>, [string]>((ticker: string) =>
  Promise.resolve([
    {
      title: 'Mock Article',
      source: 'Mock News',
      timestamp: '2023-01-01',
      sentiment: 'neutral'
    }
  ])
);
