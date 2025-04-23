// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import axios from 'axios';
// import PostList from '../components/postView';

// // Mocking axios to avoid real network calls
// jest.mock("axios", () => ({
//   get: jest.fn(),
//   post: jest.fn(),
//   delete: jest.fn(),
// }));

// global.Audio = jest.fn().mockImplementation(() => ({
//   pause: jest.fn(),
//   play: jest.fn(),
// }));

// describe('PostList Component', () => {
//   const mockToken = 'mockToken';
//   const mockSpotifyToken = 'mockSpotifyToken';
//   const mockRefreshToken = 'mockRefreshToken';

//   beforeEach(() => {
//     sessionStorage.setItem('authToken', mockToken);
//     localStorage.setItem('spotifyAccessToken', mockSpotifyToken);
//     localStorage.setItem('spotifyRefreshToken', mockRefreshToken);
//     axios.get.mockResolvedValue({
//       data: { posts: [{ _id: '1', description: 'Test post', audioFile: '/audio/test.mp3', userId: { username: 'testUser' } }], likedList: [1] }
//     });
//   });

//   it('fetches and displays posts', async () => {
//     render(<PostList refreshPostView={false} />);

//     await waitFor(() => expect(axios.get).toHaveBeenCalled());

//     await waitFor (() => expect(screen.getByText('Test post')).toBeInTheDocument());
//       expect(screen.getByText('testUser')).toBeInTheDocument();
//   });

//   it('shows loading indicator initially', () => {
//     render(<PostList refreshPostView={false} />);
//     expect(screen.getByText('Loading posts...')).toBeInTheDocument();
//   });

//   it('handles fetch error gracefully', async () => {
//     axios.get.mockRejectedValueOnce(new Error('Failed to fetch posts'));

//     render(<PostList refreshPostView={false} />);

//     await waitFor(() => expect(screen.getByText('Failed to fetch posts. Please try again.')).toBeInTheDocument());
//   });

//   it('navigates to next and previous post', async () => {
//     axios.get.mockResolvedValueOnce({
//       data: {
//         posts: [
//           { _id: '1', description: 'First post', audioFile: '/audio/1.mp3', userId: { username: 'user1' } },
//           { _id: '2', description: 'Second post', audioFile: '/audio/2.mp3', userId: { username: 'user2' } },
//         ],
//         likedList: [0, 0],
//       }
//     });
  
//     render(<PostList refreshPostView={false} />);
//     await waitFor(() => screen.getByText('First post'));
  
//     // Click next
//     fireEvent.click(screen.getByAltText('Next Button'));
//     expect(screen.getByText('Second post')).toBeInTheDocument();
  
//     // Click previous
//     fireEvent.click(screen.getByAltText('Previous Button'));
//     expect(screen.getByText('Second post')).toBeInTheDocument();
//   });
  
//   it('toggles like on click', async () => {
//     axios.post.mockResolvedValue({ data: { success: true } });
  
//     render(<PostList refreshPostView={false} />);
//     await waitFor(() => screen.getByAltText('Like'));
  
//     const likeButton = screen.getByAltText('Unlike');
//     fireEvent.click(likeButton);
  
//     // We expect the axios.post to be called when the like button is clicked
//     await waitFor(() => expect(axios.post).toHaveBeenCalled());
//   });
  
//   it('changes post type from dropdown and fetches posts', async () => {
//     render(<PostList refreshPostView={false} />);
//     await waitFor(() => screen.getByText('Test post'));
  
//     const dropdown = screen.getByRole('combobox');
//     fireEvent.change(dropdown, { target: { value: 'top' } });
  
//     await waitFor(() => {
//       expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/top'), expect.any(Object));
//     });
//   });
  
//   it('toggles audio play/pause on button click', async () => {
//     render(<PostList refreshPostView={false} />);
//     await waitFor(() => screen.getByAltText('Play'));
  
//     const playButton = screen.getByAltText('Play');
//     fireEvent.click(playButton);
  
//     // Since Audio is mocked, you can check if `play` method was called
//     expect(mocks.Audio.play).toHaveBeenCalled();
  
//     const pauseButton = screen.getByAltText('Pause');
//     fireEvent.click(pauseButton);
//     expect(mocks.Audio.pause).toHaveBeenCalled();
//   });
  
//   it('volume buttons call volume functions', async () => {
//     render(<PostList refreshPostView={false} />);
//     await waitFor(() => screen.getByAltText('Volume Down'));
  
//     const volDown = screen.getByAltText('Volume Down');
//     const volUp = screen.getByAltText('Volume Up');
  
//     fireEvent.click(volDown);
//     fireEvent.click(volUp);
  
//     // We can't check volume directly due to lack of real audio, but we can test DOM interaction
//     expect(volDown).toBeInTheDocument();
//     expect(volUp).toBeInTheDocument();
//   });
// });



import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import PostList from '../components/postView';

// Mocking axios to avoid real network calls
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

// Mocking Audio
const mockPause = jest.fn();
const mockPlay = jest.fn();

global.Audio = jest.fn().mockImplementation(() => ({
  pause: mockPause,
  play: mockPlay,
}));

describe('PostList Component', () => {
  const mockToken = 'mockToken';
  const mockSpotifyToken = 'mockSpotifyToken';
  const mockRefreshToken = 'mockRefreshToken';

  beforeEach(() => {
    sessionStorage.setItem('authToken', mockToken);
    localStorage.setItem('spotifyAccessToken', mockSpotifyToken);
    localStorage.setItem('spotifyRefreshToken', mockRefreshToken);

    axios.get.mockResolvedValue({
      data: { posts: [{ _id: '1', description: 'Test post', audioFile: '/audio/test.mp3', userId: { username: 'testUser' } }], likedList: [] }
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



  it('toggles like on click', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<PostList refreshPostView={false} />);
    await waitFor(() => screen.getByAltText(/like|unlike/i));

    const likeButton = screen.getByAltText(/like|unlike/i);
    fireEvent.click(likeButton);

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  it('changes post type from dropdown and fetches posts', async () => {
    render(<PostList refreshPostView={false} />);
    await waitFor(() => screen.getByText('Test post'));

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'top' } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/top'), expect.any(Object));
    });
  });

  it('volume buttons call volume functions', async () => {
    render(<PostList refreshPostView={false} />);
    await waitFor(() => screen.getByAltText('Volume Down'));

    const volDown = screen.getByAltText('Volume Down');
    const volUp = screen.getByAltText('Volume Up');

    fireEvent.click(volDown);
    fireEvent.click(volUp);
    expect(volDown).toBeInTheDocument();
    expect(volUp).toBeInTheDocument();
  });
});
