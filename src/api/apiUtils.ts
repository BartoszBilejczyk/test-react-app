/**
 * API Utilities - Simulated API calls with loading states and error handling
 *
 * React Concepts Demonstrated:
 * - Promise-based API simulation
 * - Error handling patterns
 * - TypeScript generic types for API responses
 * - Async/await patterns
 * - Configurable delays for realistic UX
 *
 * Vue.js Equivalent Mapping:
 * - Similar to Vue composables or service modules
 * - API utilities = same patterns in Vue
 * - Error handling = similar try/catch patterns
 * - Loading states = ref() booleans in Vue
 */

import { ApiResponse } from '../types';

// Configuration for API simulation
const API_CONFIG = {
  baseDelay: 800, // Base delay in milliseconds
  maxDelay: 2000, // Maximum delay for longer operations
  errorRate: 0.05, // 5% chance of random errors (for testing)
};

// Simulate network delay
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simulate random errors for testing error handling
const shouldSimulateError = (): boolean => {
  return Math.random() < API_CONFIG.errorRate;
};

// Generic API call simulator
export const simulateApiCall = async <T>(
  data: T,
  options: {
    delay?: number;
    shouldError?: boolean;
    errorMessage?: string;
  } = {},
): Promise<ApiResponse<T>> => {
  const {
    delay: customDelay = API_CONFIG.baseDelay,
    shouldError = shouldSimulateError(),
    errorMessage = 'An unexpected error occurred',
  } = options;

  // Simulate network delay
  await delay(customDelay);

  // Simulate error
  if (shouldError) {
    throw new Error(errorMessage);
  }

  // Return successful response
  return {
    data,
    success: true,
    message: 'Operation completed successfully',
  };
};

// Specific API functions for different data types

// Voice API
export const fetchVoices = async () => {
  const { mockVoices } = await import('./mockVoices');
  return simulateApiCall(mockVoices, {
    delay: 1000,
    errorMessage: 'Failed to load voices',
  });
};

export const fetchVoiceCategories = async () => {
  const { mockVoiceCategories } = await import('./mockVoices');
  return simulateApiCall(mockVoiceCategories, {
    delay: 500,
    errorMessage: 'Failed to load voice categories',
  });
};

export const searchVoicesApi = async (query: string, categoryId: string = 'all') => {
  const { searchVoices } = await import('./mockVoices');
  const results = searchVoices(query, categoryId);
  return simulateApiCall(results, {
    delay: 600,
    errorMessage: 'Search failed',
  });
};

// Project API
export const fetchProjects = async () => {
  const { mockProjects } = await import('./mockProjects');
  return simulateApiCall(mockProjects, {
    delay: 1200,
    errorMessage: 'Failed to load projects',
  });
};

export const fetchProjectStats = async () => {
  const { getProjectStats } = await import('./mockProjects');
  const stats = getProjectStats();
  return simulateApiCall(stats, {
    delay: 800,
    errorMessage: 'Failed to load project statistics',
  });
};

export const createProject = async (projectData: any) => {
  // Simulate longer delay for creation
  await delay(2000);

  const newProject = {
    id: `project-${Date.now()}`,
    ...projectData,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'processing' as const,
  };

  return simulateApiCall(newProject, {
    delay: 0, // Already delayed above
    errorMessage: 'Failed to create project',
  });
};

// Dashboard API
export const fetchDashboardData = async () => {
  const { getDashboardStats, getRecentActivity, getRecentVoices } = await import('./mockDashboard');

  const dashboardData = {
    stats: getDashboardStats(),
    recentActivity: getRecentActivity(5),
    recentVoices: getRecentVoices(4),
  };

  return simulateApiCall(dashboardData, {
    delay: 1000,
    errorMessage: 'Failed to load dashboard data',
  });
};

export const fetchQuickActions = async () => {
  const { mockQuickActions } = await import('./mockDashboard');
  return simulateApiCall(mockQuickActions, {
    delay: 300,
    errorMessage: 'Failed to load quick actions',
  });
};

// Text-to-Speech API
export const generateSpeech = async (text: string, voiceId: string) => {
  // Simulate longer processing time for speech generation
  const processingTime = Math.min(text.length * 50, API_CONFIG.maxDelay);

  await delay(processingTime);

  // Mock generated audio URL
  const generatedAudio = {
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: Math.ceil(text.length / 10), // Rough estimate: 10 chars per second
    voiceId,
    text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), // Truncated text
    generatedAt: new Date().toISOString(),
  };

  return simulateApiCall(generatedAudio, {
    delay: 0, // Already delayed above
    shouldError: Math.random() < 0.1, // 10% chance of generation failure
    errorMessage: 'Speech generation failed. Please try again.',
  });
};

// Audio playback simulation
export const validateAudioUrl = async (url: string) => {
  return simulateApiCall(
    { isValid: true, url },
    {
      delay: 200,
      errorMessage: 'Audio file is not accessible',
    },
  );
};

// Dubbing API simulation
export const processDubbing = async (
  file: File,
  sourceLanguage: string,
  targetLanguage: string,
  voiceId: string,
) => {
  // Simulate longer processing time for dubbing (5-10 seconds)
  const processingTime = Math.min(file.size / 100000 + 3000, 10000);

  await delay(processingTime);

  const dubbedResult = {
    dubbedUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    duration: '2:30',
    sourceLanguage,
    targetLanguage,
    voiceId,
    originalFile: file.name,
    fileSize: file.size,
    processedAt: new Date().toISOString(),
    processingTime: Math.round(processingTime / 1000),
  };

  return simulateApiCall(dubbedResult, {
    delay: 0, // Already delayed above
    shouldError: Math.random() < 0.15, // 15% chance of dubbing failure
    errorMessage: 'Dubbing processing failed. The file may be corrupted or too large.',
  });
};

// Error types for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'UNKNOWN_ERROR',
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network connection failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Invalid input data') {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// Utility to handle API errors consistently
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
};
