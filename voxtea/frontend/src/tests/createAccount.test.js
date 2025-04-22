import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateAccount from '../pages/CreateAccount'; 
import { BrowserRouter } from 'react-router-dom';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock the fetch API and alert
global.fetch = jest.fn();
global.alert = jest.fn(); 

describe('CreateAccount Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <CreateAccount />
      </BrowserRouter>
    );
  };

  it('renders the form correctly', () => {
    renderComponent();
    
    expect(screen.getByPlaceholderText(/Enter your username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm your password/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile Image \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    renderComponent();
    
    const backButton = screen.getByAltText('Previous Button');
    fireEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('validates passwords match before submission', async () => {
    renderComponent();
    
    // Fill form with non-matching passwords
    fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password456' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    expect(global.alert).toHaveBeenCalledWith('Passwords do not match!');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles successful account creation', async () => {
    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token' })
    });
    
    renderComponent();
    
    // Fill form with valid data using placeholder text selectors
    fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123' } });
    
    // Mock file input
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText(/profile image/i), { target: { files: [file] } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for async actions to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/users/register', {
        method: 'POST',
        body: expect.any(FormData)
      });
      
      expect(global.alert).toHaveBeenCalledWith('Account created successfully!');
      expect(sessionStorage.getItem('authToken')).toBe('test-token');
      expect(mockNavigate).toHaveBeenCalledWith('/Home');
    });
  });

  it('handles API error during account creation', async () => {
    // Mock API error response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'Email already in use' })
    });
    
    renderComponent();
    
   // Fill form with valid data
   fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: 'testuser' } });
   fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@example.com' } });
   fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
   fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123' } });
   
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for async actions to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.alert).toHaveBeenCalledWith('Email already in use');
    });
  });

  it('handles network error during account creation', async () => {
    // Mock network error
    const errorMessage = 'Network error';
    global.fetch.mockRejectedValueOnce(new Error(errorMessage));
    
    renderComponent();
    
    // Fill form with valid data
   fireEvent.change(screen.getByPlaceholderText(/Enter your username/i), { target: { value: 'testuser' } });
   fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'test@example.com' } });
   fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: 'password123' } });
   fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123' } });
   
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    
    // Wait for async actions to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.alert).toHaveBeenCalledWith(errorMessage);
    });
  });
});