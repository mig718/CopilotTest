import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

// Mock axios
vi.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Login Form Tests ====================
  describe('Login Form', () => {
    it('should render login form on initial load', () => {
      render(<App />);
      expect(screen.getByText('Username:')).toBeInTheDocument();
      expect(screen.getByText('Password:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should update username input value', async () => {
      const user = userEvent.setup();
      render(<App />);
      const usernameInput = screen.getByDisplayValue('');
      
      await user.type(usernameInput, 'testuser');
      expect(usernameInput.value).toBe('testuser');
    });

    it('should update password input value', async () => {
      const user = userEvent.setup();
      render(<App />);
      const inputs = screen.getAllByDisplayValue('');
      const passwordInput = inputs[1];
      
      await user.type(passwordInput, 'password123');
      expect(passwordInput.value).toBe('password123');
    });

    it('should submit login form with credentials', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValueOnce({ data: { success: true } });
      
      render(<App />);
      const inputs = screen.getAllByDisplayValue('');
      
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/login',
          { username: 'testuser', password: 'password123' },
          { withCredentials: true }
        );
      });
    });

    it('should show success message on successful login', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValueOnce({ data: { success: true } });
      
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

    it('should show error on failed login', async () => {
      const user = userEvent.setup();
      axios.post.mockRejectedValueOnce(new Error('Login failed'));
      
      render(<App />);
      const inputs = screen.getAllByDisplayValue('');
      
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      await waitFor(() => {
        const container = screen.getByRole('button', { name: /login/i }).closest('div');
        expect(container).toHaveStyle({ background: '#e74c3c' });
      });
    });

    it('should show loading spinner during login submission', async () => {
      const user = userEvent.setup();
      axios.post.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      
      render(<App />);
      const inputs = screen.getAllByDisplayValue('');
      
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');
      
      const loginButton = screen.getByRole('button', { name: /login/i });
      await user.click(loginButton);

      expect(screen.queryByRole('button', { name: /login/i })).not.toBeVisible();
    });
  });

  // ==================== Sign-up Form Tests ====================
  describe('Sign-up Form', () => {
    it('should render sign-up form after clicking Sign Up button', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('First Name:')).toBeInTheDocument();
      expect(screen.getByText('Last Name:')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('should update email input value', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const emailInput = screen.getByDisplayValue('');
      await user.type(emailInput, 'test@example.com');
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update first name input value', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[1], 'John');
      expect(inputs[1].value).toBe('John');
    });

    it('should update last name input value', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[2], 'Doe');
      expect(inputs[2].value).toBe('Doe');
    });

    it('should update password input value', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[3], 'securepassword123');
      expect(inputs[3].value).toBe('securepassword123');
    });

    it('should submit sign-up form with all fields', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValueOnce({ data: { success: true } });
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'test@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/signup',
          {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123'
          },
          { withCredentials: true }
        );
      });
    });

    it('should show success message on successful sign-up', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValueOnce({ data: { success: true } });
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'test@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText(/Account Created!/i)).toBeInTheDocument();
      });
    });

    it('should show loading spinner during sign-up submission', async () => {
      const user = userEvent.setup();
      axios.post.mockImplementationOnce(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'test@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      expect(screen.queryByRole('button', { name: /register/i })).not.toBeVisible();
    });
  });

  // ==================== Duplicate Email Tests ====================
  describe('Duplicate Email Validation', () => {
    it('should show duplicate email error on 409 response', async () => {
      const user = userEvent.setup();
      axios.post.mockRejectedValueOnce({
        response: { status: 409, data: { message: 'Email already exists' } }
      });
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'existing@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
      });
    });

    it('should show duplicate email error on email-related error message', async () => {
      const user = userEvent.setup();
      axios.post.mockRejectedValueOnce({
        response: { status: 400, data: { message: 'This email is already registered' } }
      });
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'existing@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
      });
    });

    it('should highlight email input with red border on duplicate email', async () => {
      const user = userEvent.setup();
      axios.post.mockRejectedValueOnce({
        response: { status: 409 }
      });
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      const emailInput = inputs[0];
      await user.type(emailInput, 'existing@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(emailInput).toHaveStyle({ border: '2px solid red' });
      });
    });

    it('should clear duplicate email error when user edits email field', async () => {
      const user = userEvent.setup();
      axios.post.mockRejectedValueOnce({
        response: { status: 409 }
      });
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      const emailInput = inputs[0];
      await user.type(emailInput, 'existing@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
      });

      await user.clear(emailInput);
      await user.type(emailInput, 'newemail@example.com');

      expect(screen.queryByText('Email already registered')).not.toBeInTheDocument();
    });
  });

  // ==================== View Switching Tests ====================
  describe('View Switching', () => {
    it('should switch from login to sign-up view', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
    });

    it('should switch from sign-up back to login view', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const logInButton = screen.getByRole('button', { name: /log in/i });
      await user.click(logInButton);

      expect(screen.getByText('Username:')).toBeInTheDocument();
      expect(screen.getByText('Password:')).toBeInTheDocument();
      expect(screen.queryByText('Create Account')).not.toBeInTheDocument();
    });

    it('should clear login form fields when switching to sign-up', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'testuser');
      await user.type(inputs[1], 'password123');

      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      // Fields should be cleared
      const signupInputs = screen.getAllByDisplayValue('');
      signupInputs.forEach(input => {
        expect(input.value).toBe('');
      });
    });

    it('should clear sign-up form fields when switching to login', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'test@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const logInButton = screen.getByRole('button', { name: /log in/i });
      await user.click(logInButton);

      // Login form should be empty
      const loginInputs = screen.getAllByDisplayValue('');
      loginInputs.forEach(input => {
        expect(input.value).toBe('');
      });
    });
  });

  // ==================== Error Handling Tests ====================
  describe('Error Handling', () => {
    it('should show general error on non-409 sign-up error', async () => {
      const user = userEvent.setup();
      axios.post.mockRejectedValueOnce({
        response: { status: 500, data: { message: 'Server error' } }
      });
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'test@example.com');
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

    it('should reset form after successful sign-up', async () => {
      const user = userEvent.setup();
      axios.post.mockResolvedValueOnce({ data: { success: true } });
      
      vi.useFakeTimers();
      
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      await user.type(inputs[0], 'test@example.com');
      await user.type(inputs[1], 'John');
      await user.type(inputs[2], 'Doe');
      await user.type(inputs[3], 'password123');

      const registerButton = screen.getByRole('button', { name: /register/i });
      await user.click(registerButton);

      vi.runAllTimers();

      await waitFor(() => {
        expect(screen.getByText('Username:')).toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  // ==================== Form Validation Tests ====================
  describe('Form Validation', () => {
    it('should have required attributes on login form fields', async () => {
      render(<App />);
      
      const inputs = screen.getAllByDisplayValue('');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('required');
      });
    });

    it('should have required attributes on sign-up form fields', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const inputs = screen.getAllByDisplayValue('');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('required');
      });
    });

    it('should have email type on sign-up email field', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      const emailInput = screen.getAllByDisplayValue('')[0];
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should have password type on password fields', async () => {
      render(<App />);
      
      const passwordInputs = screen.getAllByDisplayValue('').filter(
        input => input.type === 'password'
      );
      expect(passwordInputs.length).toBeGreaterThan(0);
    });
  });

  // ==================== UI Elements Tests ====================
  describe('UI Elements', () => {
    it('should display sign-up link on login screen', () => {
      render(<App />);
      
      expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should display login link on sign-up screen', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('should render all labels on login form', () => {
      render(<App />);
      
      expect(screen.getByText('Username:')).toBeInTheDocument();
      expect(screen.getByText('Password:')).toBeInTheDocument();
    });

    it('should render all labels on sign-up form', async () => {
      const user = userEvent.setup();
      render(<App />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      await user.click(signUpButton);

      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('First Name:')).toBeInTheDocument();
      expect(screen.getByText('Last Name:')).toBeInTheDocument();
      expect(screen.getByText('Password:')).toBeInTheDocument();
    });
  });
});
