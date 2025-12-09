import '@testing-library/jest-dom';

// Setup environment variables for tests
// Use an absolute API URL that works in both local and CI environments
if (!import.meta.env.VITE_API_URL) {
    import.meta.env.VITE_API_URL = 'http://localhost:8000/api';
}
