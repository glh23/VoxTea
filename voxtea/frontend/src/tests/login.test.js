import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';

// Mock axios module
// jest.mock('axios');

// Mock navigate
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('Login Page', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
    sessionStorage.clear();
  });

  it('renders login form correctly', () => {
    render(<Login />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockResponse = {
      token: 'testtoken',
      user: { name: 'Test User' },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem('authToken')).toBe('testtoken');
    });
  });

  it('handles login failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Invalid credentials',
      }),
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'wrong@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('does not call fetch with empty inputs', async () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      // Should not throw errors, but fetch will still be called
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});