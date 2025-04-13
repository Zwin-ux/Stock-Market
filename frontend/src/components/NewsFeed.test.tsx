import React from 'react';
import { describe, it, expect, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsFeed from './NewsFeed';
import { fetchNews } from '../services/newsApi';

jest.mock('../services/newsApi');

const mockArticles = [
  {
    title: 'Test Article',
    source: 'Test News',
    timestamp: '2023-01-01',
    sentiment: 'neutral' as const
  }
];

describe('NewsFeed', () => {
  it('displays loading state', () => {
    (fetchNews as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<NewsFeed ticker="AAPL" />);
    expect(screen.getByText('Loading AAPL news...')).toBeInTheDocument();
  });

  it('displays articles', async () => {
    (fetchNews as jest.Mock).mockResolvedValue(mockArticles);
    render(<NewsFeed ticker="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText('Test Article')).toBeInTheDocument();
    });
  });

  it('shows error state', async () => {
    (fetchNews as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<NewsFeed ticker="AAPL" />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load news/)).toBeInTheDocument();
    });
  });
});
