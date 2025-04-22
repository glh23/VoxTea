import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import PostForm from '../components/PostForm';


// Mock dependencies
jest.mock("axios", () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('../components/myAudioPlayer', () => {
  return function MockAudioPlayer({ audioSrc }) {
    return <div data-testid="audio-player">{audioSrc}</div>;
  };
});

// Mock the DragNdrop component 
jest.mock('../components/dragNdrop', () => {
  return function MockDragNdrop({ onFileSelect }) {
    return (
      <div data-testid="mock-dragndrop">
        <button 
          data-testid="mock-file-select" 
          onClick={() => {
            const mockFile = new global.File(['dummy audio content'], 'test.mp3', { type: 'audio/mp3' });
            onFileSelect(mockFile);
          }}
        >
          Select File
        </button>
      </div>
    );
  };
});


// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mockedURL');

let mockMediaRecorder;

beforeEach(() => {
  mockMediaRecorder = {
    start: jest.fn(),
    stop: jest.fn(),
    ondataavailable: null,
    onstop: null,
    state: 'inactive',
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  global.MediaRecorder = jest.fn(() => mockMediaRecorder);
});



// Mock navigator.mediaDevices
navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue('mockStream')
};

describe('PostForm Component', () => {
  const mockOnPostSuccess = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem('authToken', 'mockToken');
    window.alert = jest.fn(); 
  });

  it('renders PostForm component', () => {
    render(<PostForm onPostSuccess={mockOnPostSuccess} />);
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Record/i)).toBeInTheDocument();
    expect(screen.getByAltText(/Submit/i)).toBeInTheDocument();
  });

  it('handles description input', () => {
    render(<PostForm onPostSuccess={mockOnPostSuccess} />);
    const input = screen.getByPlaceholderText(/Description/i);
    fireEvent.change(input, { target: { value: 'Test description with #hashtag' } });
    expect(input.value).toBe('Test description with #hashtag');
  });

  it('shows alert if description is empty on submit', () => {
    render(<PostForm onPostSuccess={mockOnPostSuccess} />);
    fireEvent.click(screen.getByAltText(/Submit/i));
    expect(window.alert).toHaveBeenCalledWith('Please write a description!');
  });

  it('shows alert if audio file is missing on submit', () => {
    render(<PostForm onPostSuccess={mockOnPostSuccess} />);
    const input = screen.getByPlaceholderText(/Description/i);
    fireEvent.change(input, { target: { value: 'Test description' } });
    fireEvent.click(screen.getByAltText(/Submit/i));
    expect(window.alert).toHaveBeenCalledWith('Please upload or record an audio file!');
  });

  it('carousel navigation works correctly', () => {
    render(<PostForm onPostSuccess={mockOnPostSuccess} />);
    
    // Check that effects are rendered
    expect(screen.getByText('No Effect')).toBeInTheDocument();
    
    // Navigate to next effect using the next button
    fireEvent.click(screen.getByText('→'));
    
    expect(screen.getByText('←')).toBeInTheDocument(); 
  });

  it('handles form submission correctly with all required fields', async () => {
    render(<PostForm onPostSuccess={mockOnPostSuccess} />);
    
    // Fill in description
    const descriptionInput = screen.getByPlaceholderText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Test post #awesome' } });
    
    // Use our mock DragNdrop to simulate file selection
    const fileSelectButton = screen.getByTestId('mock-file-select');
    fireEvent.click(fileSelectButton);
    
    // Mock axios response
    axios.post.mockResolvedValueOnce({ data: { message: 'Post created successfully' } });
    
    // Submit the form
    fireEvent.click(screen.getByAltText(/Submit/i));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/posts/create',
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mockToken',
            'Content-Type': 'multipart/form-data'
          })
        })
      );
      expect(mockOnPostSuccess).toHaveBeenCalled();
    });
  });

  it('handles recording errors gracefully', async () => {
    // Mock getUserMedia to reject with an error
    navigator.mediaDevices.getUserMedia.mockRejectedValueOnce(new Error('Permission denied'));
    console.error = jest.fn();
    
    render(<PostForm onPostSuccess={mockOnPostSuccess} />);
    
    const recordButton = screen.getByAltText(/Record/i);
    fireEvent.click(recordButton);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error accessing microphone:', 
        expect.any(Error)
      );
    });
  });
});
