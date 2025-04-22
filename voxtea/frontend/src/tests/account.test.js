import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Account from '../pages/Account';
import '@testing-library/jest-dom/extend-expect';

// Mock the AudioPlayer component
jest.mock('../components/myAudioPlayer', () => {
  return function MockAudioPlayer(props) {
    return (
      <div data-testid="audio-player">
        <button onClick={props.onPlayNext}>Next</button>
        <button onClick={props.onPlayPrevious}>Previous</button>
        <button onClick={props.onLikeToggle}>Like</button>
      </div>
    );
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Account Component', () => {

  // Mock the session storage for the token
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => 'fake-token'), 
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });
  

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
// Mock the fetch API to return a resolved promise
  it('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  // Mock the fetch API to return a promise
  it('renders user data and posts after loading', async () => {
    const mockData = {
      username: 'testuser',
      posts: [
        { _id: '1', description: 'Post 1', audioFile: '/audio1.mp3' },
        { _id: '2', description: 'Post 2', audioFile: '/audio2.mp3' },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Welcome, testuser')).toBeInTheDocument());
    expect(screen.getByText('Post 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Post 1')).toBeInTheDocument();
  });

  it('handles next and previous post navigation', async () => {
    const mockData = {
      username: 'testuser',
      posts: [
        { _id: '1', description: 'Post 1', audioFile: '/audio1.mp3' },
        { _id: '2', description: 'Post 2', audioFile: '/audio2.mp3' },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Welcome, testuser')).toBeInTheDocument());

    // Navigate to next post
    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => expect(screen.getByText('Post 2 of 2')).toBeInTheDocument());

    // Navigate to previous post
    fireEvent.click(screen.getByText('Previous'));
    await waitFor(() => expect(screen.getByText('Post 1 of 2')).toBeInTheDocument());
  });

  it('handles post refresh', async () => {
    const mockData = {
      username: 'testuser',
      posts: [
        { _id: '1', description: 'Post 1', audioFile: '/audio1.mp3' },
        { _id: '2', description: 'Post 2', audioFile: '/audio2.mp3' },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Welcome, testuser')).toBeInTheDocument());

    // Mock the refresh request
    const refreshedData = {
      username: 'testuser',
      posts: [
        { _id: '3', description: 'Post 3', audioFile: '/audio3.mp3' },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => refreshedData,
    });

    fireEvent.click(screen.getByAltText('Refresh Button'));

    await waitFor(() => expect(screen.getByText('Post 1 of 1')).toBeInTheDocument());
    expect(screen.getByText('Post 3')).toBeInTheDocument();
  });

  it('handles fetch failure gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
  
    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching account data:'),
        expect.any(Error)
      );
    });
  
    consoleSpy.mockRestore();
  });
});
