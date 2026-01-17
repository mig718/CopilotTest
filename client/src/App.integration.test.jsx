import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

// Mock axios
vi.mock('axios');

describe('Authentication App - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ==================== Login Integration Scenarios ====================
  describe('Login Flow - Integration Scenarios', () => {
    it('should complete successful login flow with valid credentials', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          token: 'auth-token-123',
          user: { id: 1, username: 'johnsmith' }
        }
      });

      render(<App />);

      // User enters credentials
      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'johnsmith');
      await user.type(inputs[1], 'SecurePass123');

      // User clicks login button
      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      // Verify API call with correct endpoint and payload
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/login',
          {
            username: 'johnsmith',
            password: 'SecurePass123'
          },
          { withCredentials: true }
        );
      });

      // Verify success state is displayed
      expect(screen.getByText('Login Successful!')).toBeInTheDocument();
    });

    it('should handle login failure with invalid credentials', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Invalid credentials' }
        }
      });

      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'johnsmith');
      await user.type(inputs[1], 'WrongPassword');

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        const container = loginButton.closest('div');
        // Check if error state is applied (red background)
        expect(container).toHaveStyle({ background: '#e74c3c' });
      });
    });

    it('should handle server error during login attempt', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      });

      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'johnsmith');
      await user.type(inputs[1], 'password123');

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        const container = loginButton.closest('div');
        expect(container).toHaveStyle({ background: '#e74c3c' });
      });
    });

    it('should allow user to retry login after failure', async () => {
      const user = userEvent.setup({ delay: null });
      
      // First attempt fails
      axios.post.mockRejectedValueOnce({
        response: { status: 401, data: { message: 'Invalid credentials' } }
      });

      render(<App />);

      let inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'johnsmith');
      await user.type(inputs[1], 'WrongPassword');

      let loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        const container = loginButton.closest('div');
        expect(container).toHaveStyle({ background: '#e74c3c' });
      });

      // Second attempt succeeds
      axios.post.mockResolvedValueOnce({
        data: { success: true, token: 'auth-token-123' }
      });

      // User clears fields and tries again
      inputs = screen.getAllByDisplayValue('');
      const usernameInput = inputs[0];
      const passwordInput = inputs[1];
      
      await user.clear(usernameInput);
      await user.clear(passwordInput);
      
      await user.type(usernameInput, 'johnsmith');
      await user.type(passwordInput, 'CorrectPassword123');

      loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Login Successful!')).toBeInTheDocument();
      });
    });

    it('should validate credentials before sending to server', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<App />);

      const loginButton = screen.getByRole('button', { name: /login/i });
      
      // Try to submit without filling fields (browser validation should prevent submission)
      await user.click(loginButton);

      // API should not be called due to HTML5 validation
      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  // ==================== Sign-up Integration Scenarios ====================
  describe('Sign-up Flow - Integration Scenarios', () => {
    it('should complete successful sign-up flow with valid data', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          message: 'User created successfully',
          userId: 'user-123'
        }
      });

      render(<App />);

      // Navigate to sign-up
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      // Fill in all fields
      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'john.doe@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'SecurePass123!');

      // Submit form
      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      // Verify API call
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/signup',
          {
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'SecurePass123!'
          },
          { withCredentials: true }
        );
      });

      // Verify success message
      expect(screen.getByText(/Account Created!/i)).toBeInTheDocument();
    });

    it('should handle duplicate email error and allow retry with different email', async () => {
      const user = userEvent.setup({ delay: null });
      
      // First attempt with duplicate email
      axios.post.mockRejectedValueOnce({
        response: {
          status: 409,
          data: { message: 'Email already exists' }
        }
      });

      render(<App />);

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      let inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'existing@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      let registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      // Verify duplicate email error
      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
      });

      // Verify email field has error styling
      const emailInput = inputs[0];
      expect(emailInput).toHaveStyle({ border: '2px solid red' });

      // User changes email and retries
      axios.post.mockResolvedValueOnce({
        data: { success: true, message: 'User created successfully' }
      });

      await user.clear(emailInput);
      await user.type(emailInput, 'newemail@example.com');

      // Verify error message cleared
      expect(screen.queryByText('Email already registered')).not.toBeInTheDocument();

      registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText(/Account Created!/i)).toBeInTheDocument();
      });
    });

    it('should handle validation errors on sign-up', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'Password must be at least 8 characters' }
        }
      });

      render(<App />);

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'user@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'short');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        const container = registerButton.closest('div');
        expect(container).toHaveStyle({ background: '#e74c3c' });
      });
    });

    it('should redirect to login after successful sign-up', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({
        data: { success: true }
      });

      render(<App />);

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'newuser@example.com');
      await user.type(inputs[1], 'Jane');
      await user.type(inputs[2], 'Smith');
      await user.type(inputs[3], 'SecurePass123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText(/Account Created!/i)).toBeInTheDocument();
      });

      // Advance time to trigger redirect
      vi.runAllTimers();

      await waitFor(() => {
        expect(screen.getByText('Username:')).toBeInTheDocument();
        expect(screen.getByText('Password:')).toBeInTheDocument();
        expect(screen.queryByText('Create Account')).not.toBeInTheDocument();
      });
    });

    it('should handle network error during sign-up', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockRejectedValueOnce({
        response: undefined,
        message: 'Network Error'
      });

      render(<App />);

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'user@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        const container = registerButton.closest('div');
        expect(container).toHaveStyle({ background: '#e74c3c' });
      });
    });
  });

  // ==================== User Journey Scenarios ====================
  describe('Complete User Journey - Integration Scenarios', () => {
    it('should complete new user registration and subsequent login flow', async () => {
      const user = userEvent.setup({ delay: null });
      
      // Step 1: User signs up
      axios.post.mockResolvedValueOnce({
        data: { success: true, userId: 'user-123' }
      });

      render(<App />);

      let signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      let inputs = screen.getAllByDisplayValue('');
      const newEmail = 'newuser@example.com';
      const firstName = 'Jane';
      const lastName = 'Smith';
      const password = 'MySecurePass123!';

      await user.type(inputs[0], newEmail);
      await user.type(inputs[1], firstName);
      await user.type(inputs[2], lastName);
      await user.type(inputs[3], password);

      let registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      // Verify signup API call
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/signup',
          {
            email: newEmail,
            firstName: firstName,
            lastName: lastName,
            password: password
          },
          { withCredentials: true }
        );
      });

      // Step 2: User is redirected to login after signup
      vi.runAllTimers();

      await waitFor(() => {
        expect(screen.getByText('Username:')).toBeInTheDocument();
      });

      // Step 3: User logs in with new account
      axios.post.mockResolvedValueOnce({
        data: {
          success: true,
          token: 'auth-token-456',
          user: { id: 'user-123', email: newEmail }
        }
      });

      inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], newEmail);
      await user.type(inputs[1], password);

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      // Verify login API call
      await waitFor(() => {
        expect(axios.post).toHaveBeenLastCalledWith(
          'http://localhost:3000/api/auth/login',
          {
            username: newEmail,
            password: password
          },
          { withCredentials: true }
        );
      });

      // Verify successful login
      expect(screen.getByText('Login Successful!')).toBeInTheDocument();
    });

    it('should handle switching between login and sign-up multiple times', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<App />);

      // Start on login
      expect(screen.getByText('Username:')).toBeInTheDocument();

      // Switch to sign-up
      let signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);
      expect(screen.getByText('Create Account')).toBeInTheDocument();

      // Switch back to login
      let logInButton = screen.getByRole('button', { name: /log in/i });
      await user.click(logInButton);
      expect(screen.getByText('Username:')).toBeInTheDocument();

      // Switch to sign-up again
      signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);
      expect(screen.getByText('Create Account')).toBeInTheDocument();

      // Verify fields are cleared on each switch
      const inputs = screen.getAllByDisplayValue('');
      inputs.forEach(input => {
        expect(input.value).toBe('');
      });
    });

    it('should preserve form state during navigation and clear on view switch', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<App />);

      // Fill login form
      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');

      expect(inputs[0].value).toBe('testuser');
      expect(inputs[1].value).toBe('password123');

      // Switch to sign-up
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      // Verify login form is cleared
      const signupInputs = screen.getAllByDisplayValue('');
      signupInputs.forEach(input => {
        expect(input.value).toBe('');
      });
    });
  });

  // ==================== API Contract Scenarios ====================
  describe('API Contract - Integration Scenarios', () => {
    it('should send correct headers with credentials for login', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({ data: { success: true } });

      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          { withCredentials: true }
        );
      });
    });

    it('should send correct headers with credentials for signup', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({ data: { success: true } });

      render(<App />);

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'user@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(Object),
          { withCredentials: true }
        );
      });
    });

    it('should handle missing response data gracefully', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({});

      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Login Successful!')).toBeInTheDocument();
      });
    });

    it('should handle different error response formats', async () => {
      const user = userEvent.setup({ delay: null });
      
      // Error with response property
      axios.post.mockRejectedValueOnce({
        response: { status: 500 }
      });

      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        const container = loginButton.closest('div');
        expect(container).toHaveStyle({ background: '#e74c3c' });
      });
    });
  });

  // ==================== Loading State Scenarios ====================
  describe('Loading State - Integration Scenarios', () => {
    it('should show loading spinner and hide form during login submission', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockImplementationOnce(
        () => new Promise(resolve => {
          setTimeout(() => resolve({ data: { success: true } }), 100);
        })
      );

      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      // Form should be hidden
      expect(screen.queryByRole('button', { name: /login/i })).not.toBeVisible();
    });

    it('should show loading spinner and hide form during sign-up submission', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockImplementationOnce(
        () => new Promise(resolve => {
          setTimeout(() => resolve({ data: { success: true } }), 100);
        })
      );

      render(<App />);

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'user@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      // Form should be hidden
      expect(screen.queryByRole('button', { name: /register/i })).not.toBeVisible();
    });
  });

  // ==================== Edge Cases and Error Recovery ====================
  describe('Edge Cases and Error Recovery - Integration Scenarios', () => {
    it('should handle rapid form submissions', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({ data: { success: true } });

      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');

      const loginButton = screen.getByRole('button', { name: /login/i });
      
      // Simulate rapid clicks
      await user.click(loginButton);
      await user.click(loginButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle special characters in input fields', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({ data: { success: true } });

      render(<App />);

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      const specialEmail = 'user+test@example.co.uk';
      const specialPassword = 'P@$$w0rd!#%&*()';

      await user.type(inputs[0], specialEmail);
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], "O'Brien");
      await user.type(inputs[3], specialPassword);

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          {
            email: specialEmail,
            firstName: 'John',
            lastName: "O'Brien",
            password: specialPassword
          },
          { withCredentials: true }
        );
      });
    });

    it('should handle very long input strings', async () => {
      const user = userEvent.setup({ delay: null });
      
      axios.post.mockResolvedValueOnce({ data: { success: true } });

      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      const longUsername = 'a'.repeat(100);
      const longPassword = 'P'.repeat(100);

      await user.type(inputs[0], longUsername);
      await user.type(inputs[1], longPassword);

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.any(String),
          {
            username: longUsername,
            password: longPassword
          },
          { withCredentials: true }
        );
      });
    });

    it('should handle whitespace-only input after trimming', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<App />);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], '   ');
      await user.type(inputs[1], '   ');

      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      // Should not call API due to validation
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
