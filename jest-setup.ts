import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';

// Mock window dimensions for consistent test results
Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });
