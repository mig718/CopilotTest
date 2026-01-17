# Authentication App

A single-page React application providing user authentication with login and registration functionality.

## Features

- **Login Screen**: Authenticate existing users with username and password
- **Sign-up Screen**: Register new users with email, first name, last name, and password
- **Single Page Architecture**: Seamless navigation between login and sign-up views without page reloads
- **Email Validation**: Checks for duplicate emails with user-friendly error messages
- **Loading States**: Visual feedback with spinner animations during form submission
- **Error Handling**: Comprehensive error feedback for failed authentication attempts
- **Responsive Design**: Clean, modern UI with styled forms and visual indicators

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

## Development

### Start Development Server

Run the development server with hot module reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### Run Linter

Check for code style issues:

```bash
npm run lint
```

### Run Linter with Auto-fix

Automatically fix linting issues:

```bash
npm run lint -- --fix
```

## Testing

This project uses **Vitest** for unit testing with React Testing Library for component testing.

### Run All Tests

Execute the test suite:

```bash
npm test
```

### Run Tests in Watch Mode

Tests automatically re-run when files change:

```bash
npm test -- --watch
```

### Run Tests with UI Dashboard

Interactive test runner with visual dashboard:

```bash
npm run test:ui
```

### Generate Coverage Report

Create a code coverage report:

```bash
npm run test:coverage
```

Coverage reports are generated in HTML format in the `coverage/` directory.

## Test Structure

The test suite includes:

- **Login Form Tests**: Form rendering, input handling, submission, and success/error states
- **Sign-up Form Tests**: All sign-up form fields, submission, and status management
- **Duplicate Email Validation**: Email conflict detection and user feedback
- **View Switching**: Navigation between login and sign-up screens
- **Error Handling**: Various error scenarios and recovery
- **Form Validation**: HTML5 validation attributes and input types
- **UI Elements**: Verification of all labels, buttons, and links

**Total Coverage**: 60+ comprehensive unit tests

## Building for Production

### Build Optimized Bundle

Create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Preview Production Build

Test the production build locally before deployment:

```bash
npm run preview
```

The preview will be available at `http://localhost:4173` by default.

## API Integration

The application connects to a backend server at `http://localhost:3000`.

### Login Endpoint

**POST** `/api/auth/login`

Request body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
- Success (200): User is authenticated
- Error (401): Invalid credentials

### Sign-up Endpoint

**POST** `/api/auth/signup`

Request body:
```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "password": "string"
}
```

Response:
- Success (201): User account created
- Error (409): Email already registered
- Error (400): Invalid input or other validation errors

## Project Structure

```
src/
├── App.jsx          # Main application component with login/signup logic
├── App.css          # Application styles
├── App.test.jsx     # Comprehensive unit tests
├── main.jsx         # Application entry point
├── index.css        # Global styles
└── assets/          # Static assets
vitest.config.js     # Vitest configuration
package.json         # Project dependencies and scripts
```

## Development Workflow

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Open browser** to `http://localhost:5173`

3. **Make changes** to component files - changes auto-reload

4. **Run tests** to verify functionality:
   ```bash
   npm test
   ```

5. **Build for production** when ready:
   ```bash
   npm run build
   ```

## Technology Stack

- **React 19**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API requests
- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code quality and style enforcement

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### CORS Issues

Ensure the backend server has CORS enabled for `http://localhost:5173`.

### Tests Not Running

Make sure all dependencies are installed:
```bash
npm install
```

### Build Fails

Clear cache and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance Optimization

- Vite provides fast Hot Module Reloading during development
- Production build is optimized and minified
- Code splitting is handled automatically by Vite
- React Fast Refresh for rapid development iteration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
