/**
 * Test Utilities - Custom render functions and test helpers
 *
 * React Testing Concepts Demonstrated:
 * - Custom render function with providers
 * - Mock context providers for testing
 * - Test utilities for common testing patterns
 * - TypeScript integration with testing
 *
 * Vue.js Equivalent Mapping:
 * - Similar to Vue Test Utils mount() with global plugins
 * - Custom render = mount() with provide/inject mocks
 * - Test helpers = similar utility functions
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AudioProvider } from '../context/AudioContext';
import { ToastProvider } from '../components/Toast';

// Mock audio context for testing
const MockAudioProvider = ({ children }: { children: React.ReactNode }) => {
  // For testing, we'll just use the real AudioProvider
  // In a real test scenario, you might want to mock the actual audio functionality
  return <AudioProvider>{children}</AudioProvider>;
};

// All the providers wrapper
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <MockAudioProvider>
        <ToastProvider>{children}</ToastProvider>
      </MockAudioProvider>
    </BrowserRouter>
  );
};

// Custom render function that includes providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Custom matchers and utilities
export const createMockVoice = (overrides = {}) => ({
  id: 'test-voice-1',
  name: 'Test Voice',
  description: 'A test voice for unit testing',
  category: 'premade' as const,
  avatar: '🎤',
  color: 'bg-blue-500',
  language: 'English',
  gender: 'Female' as const,
  age: 'Adult',
  accent: 'American',
  useCase: 'Testing',
  audioUrl: 'https://example.com/test-audio.mp3',
  ...overrides,
});

// Helper to mock successful API responses
export const mockSuccessfulApiCall = <T,>(data: T, delay = 0) => {
  return new Promise<{ data: T; success: boolean }>(resolve => {
    setTimeout(() => {
      resolve({ data, success: true });
    }, delay);
  });
};

// Helper to mock failed API responses
export const mockFailedApiCall = (error = 'API Error', delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(error));
    }, delay);
  });
};

// Helper to create mock files
export const createMockFile = (name = 'test.mp4', size = 1024, type = 'video/mp4') => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};
