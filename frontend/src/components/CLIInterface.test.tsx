import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CLIInterface from './CLIInterface';

describe('CLIInterface', () => {
  it('renders input field', () => {
    render(<CLIInterface />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('processes commands', async () => {
    render(<CLIInterface />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'news AAPL' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(await screen.findByText(/Fetching latest AAPL news/i)).toBeInTheDocument();
  });

  it('shows error for invalid commands', async () => {
    render(<CLIInterface />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(await screen.findByText(/command not found/i)).toBeInTheDocument();
  });
});
