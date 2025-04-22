import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import PostList from '../components/postView';
import { mocks } from "./test-utils"

// Mocking axios to avoid real network calls
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

// Audio mock
global.Audio = jest.fn().mockImplementation(() => ({
  pause: mocks.Audio.pause,
  play: mocks.Audio.play,
}))

describe('PostList Component', () => {
  const mockToken = 'mockToken';
  const mockSpotifyToken = 'mockSpotifyToken';
  const mockRefreshToken = 'mockRefreshToken';

  beforeEach(() => {
    sessionStorage.setItem('authToken', mockToken);
    localStorage.setItem('spotifyAccessToken', mockSpotifyToken);
    localStorage.setItem('spotifyRefreshToken', mockRefreshToken);
    axios.get.mockResolvedValue({
      data: { posts: [{ _id: '1', description: 'Test post', audioFile: '/audio/test.mp3', userId: { username: 'testUser' } }], likedList: [1] }
    });
  });

  it('fetches and displays posts', async () => {
    render(<PostList refreshPostView={false} />);

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    await waitFor (() => expect(screen.getByText('Test post')).toBeInTheDocument());
      expect(screen.getByText('testUser')).toBeInTheDocument();
  });

  it('shows loading indicator initially', () => {
    render(<PostList refreshPostView={false} />);
    expect(screen.getByText('Loading posts...')).toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch posts'));

    render(<PostList refreshPostView={false} />);

    await waitFor(() => expect(screen.getByText('Failed to fetch posts. Please try again.')).toBeInTheDocument());
  });

});



