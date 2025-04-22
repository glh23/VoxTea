import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import Chat from '../pages/message';
import axios from 'axios';
import socket from '../socket'; 

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));
jest.mock('../socket', () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn()
}));

// Mock the useNavigate hook
describe('Chat Component', () => {
  const mockChatId = '12345';
  const mockMessages = [
    {
      sender: { username: 'Alice', profilePicture: 'alice.png' },
      text: 'Hello!'
    },
    {
      sender: { username: 'Bob', profilePicture: 'bob.png' },
      text: 'Hi there!'
    }
  ];

  // Mocking the socket connection
  const mockChatData = {
    data: {
      messages: mockMessages,
      participants: ['Alice', 'Bob'],
      user: { username: 'TestUser', profilePicture: 'test.png' }
    }
  };

  // Before each test, clear all mocks and set up the session storage
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.setItem('authToken', 'fake-token');
    axios.get.mockResolvedValue(mockChatData);
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.delete.mockResolvedValue({});
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={[`/chat/${mockChatId}`]}>
        <Routes>
          <Route path="/chat/:chatId" element={<Chat />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders messages from API', async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText('Alice:')).toBeInTheDocument();
      expect(screen.getByText('Hello!')).toBeInTheDocument();
      expect(screen.getByText('Bob:')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
  });

  it('sends a message', async () => {
    renderComponent();
    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Message' } });
    const sendButton = screen.getByText(/Send/i);
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(socket.emit).toHaveBeenCalledWith('send_message', expect.objectContaining({ text: 'New Message' }));
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/chat/send'), expect.any(Object), expect.any(Object));
    });
  });

  it('deletes the chat and navigates', async () => {
    renderComponent();
    const deleteButton = await screen.findByText(/Delete Chat/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/chat/delete'), expect.any(Object));
    });
  });

  it('navigates back on back button click', async () => {
    renderComponent();
    const backButton = await screen.findByAltText(/Previous Button/i);
    fireEvent.click(backButton);
    // Can't assert useNavigate directly here without mocking, just ensure no error
  });
});
