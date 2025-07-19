# Phase 2: Mock Data Setup - README

## Overview

Phase 2 successfully establishes a comprehensive mock data infrastructure for the VoiceCraft Dashboard, replacing hardcoded data with centralized mock APIs and implementing proper data fetching patterns. This phase creates a realistic simulation of backend services with proper TypeScript typing and error handling.

## What Was Implemented

### 1. Mock Data Structure

Created comprehensive mock data files in `src/api/` folder:

#### Voice Data (`mockVoices.ts`)

- **Complete Voice Library**: 6 diverse voice profiles with realistic metadata
- **Voice Categories**: Premade, Cloned, Generated with dynamic counts
- **Rich Metadata**: Language, gender, age, accent, use case, audio URLs
- **Helper Functions**: Search, filtering, and retrieval utilities
- **TypeScript Integration**: Full type safety with Voice interface

#### Project Data (`mockProjects.ts`)

- **Realistic Projects**: 8 sample projects with various statuses and types
- **Project Statistics**: Completion rates, duration tracking, status distribution
- **Helper Functions**: Filtering by status/type, sorting, search functionality
- **Time Calculations**: Duration parsing and aggregation utilities

#### Dashboard Data (`mockDashboard.ts`)

- **Quick Actions**: 6 feature shortcuts with gradient colors and routing
- **Statistics Aggregation**: Real-time stats calculated from project/voice data
- **Recent Activity**: Time-based activity feed with relative timestamps
- **Usage Analytics**: Mock usage patterns and popular voice tracking

### 2. API Utilities (`apiUtils.ts`)

- **Generic API Simulator**: Configurable delays and error rates for realistic UX
- **Promise-based Architecture**: Async/await patterns matching real API calls
- **Error Simulation**: Random errors for testing error handling (5% rate)
- **Specific API Functions**: Dedicated functions for each data type
- **TypeScript Generics**: Type-safe API responses with ApiResponse<T> wrapper

### 3. Enhanced Type System

Extended `src/types/index.ts` with comprehensive interfaces:

```typescript
// Core data types
interface Voice {
  id: string;
  name: string;
  description: string;
  category: 'premade' | 'cloned' | 'generated';
  avatar: string;
  color: string;
  language: string;
  gender: 'Male' | 'Female' | 'Neutral';
  age: string;
  accent: string;
  useCase: string;
  audioUrl?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  voice: string;
  duration: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'draft' | 'failed';
  type: 'text-to-speech' | 'voice-clone' | 'dubbing';
  thumbnail: string;
  color: string;
  audioUrl?: string;
}

// API response wrapper
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

### 4. Component Integration

Updated all major components to use mock APIs:

#### Dashboard Component

- **Dynamic Stats**: Real-time statistics from aggregated project data
- **API Integration**: Fetches dashboard data and quick actions separately
- **Loading States**: Skeleton components during data loading
- **Error Handling**: Graceful error display with retry functionality

#### Voice Library Component

- **API-Driven**: Fetches voices and categories from mock API
- **Search Integration**: Real-time search with debounced API calls
- **Category Filtering**: Dynamic filtering with updated counts
- **Audio Playback**: Enhanced with error handling and user feedback

#### Text-to-Speech Component

- **Voice Selection**: Populated from API-fetched voice data
- **Speech Generation**: Simulated API call with realistic processing time
- **Error States**: Comprehensive error handling for generation failures

## React Concepts Demonstrated

### 1. Custom Hooks for Data Fetching

- **useApi Hook**: Automatic data fetching with loading/error states
- **useApiCall Hook**: Manual API calls for user-triggered actions
- **useSearch Hook**: Debounced search with real-time results
- **Generic Types**: Reusable hooks with TypeScript generics

### 2. State Management Patterns

- **Loading States**: Boolean flags for async operations
- **Error Handling**: String error messages with user-friendly display
- **Data Caching**: Automatic caching through useApi hook
- **Optimistic Updates**: Immediate UI feedback before API completion

### 3. Async/Await Patterns

- **Promise Handling**: Proper error catching and state management
- **Loading Indicators**: Visual feedback during async operations
- **Error Recovery**: Retry mechanisms for failed operations
- **Race Condition Prevention**: Proper cleanup and cancellation

### 4. Component Composition

- **Data Separation**: Clear separation between data fetching and presentation
- **Prop Drilling Elimination**: Context API for global state
- **Reusable Logic**: Custom hooks for common data patterns
- **Type Safety**: Full TypeScript coverage for all data flows

## Key Files Created/Modified

### New Files

1. **src/api/mockVoices.ts** - Voice library data and utilities
2. **src/api/mockProjects.ts** - Project data and statistics
3. **src/api/mockDashboard.ts** - Dashboard data aggregation
4. **src/api/apiUtils.ts** - API simulation utilities
5. **src/hooks/useApi.ts** - Data fetching custom hooks

### Modified Files

1. **src/types/index.ts** - Enhanced type definitions
2. **src/pages/Dashboard.tsx** - API integration and loading states
3. **src/pages/VoiceLibrary.tsx** - Search and filtering with API
4. **src/pages/TextToSpeech.tsx** - Voice selection and generation API

## API Simulation Features

### 1. Realistic Delays

- **Base Delay**: 800ms for standard operations
- **Variable Delays**: 500ms-2000ms based on operation complexity
- **Speech Generation**: Dynamic delay based on text length

### 2. Error Simulation

- **Random Errors**: 5% failure rate for testing error handling
- **Custom Error Messages**: Specific error messages for different operations
- **Error Types**: Network errors, validation errors, generation failures

### 3. Data Relationships

- **Cross-References**: Projects reference voices by name
- **Dynamic Counts**: Category counts calculated from actual data
- **Statistics**: Real-time calculations from underlying data

## Benefits Achieved

### 1. Realistic Development Experience

- **API-Like Behavior**: Simulates real backend interactions
- **Loading States**: Proper UX patterns for async operations
- **Error Scenarios**: Testing error handling without backend

### 2. Type Safety

- **End-to-End Typing**: From API responses to component props
- **Generic Utilities**: Reusable typed functions
- **Interface Consistency**: Standardized data structures

### 3. Maintainability

- **Centralized Data**: Single source of truth for all mock data
- **Easy Updates**: Simple data modifications without component changes
- **Scalable Architecture**: Easy to replace with real API calls

### 4. Development Efficiency

- **Immediate Feedback**: No backend dependency for frontend development
- **Consistent Data**: Predictable data structure across components
- **Testing Support**: Reliable data for component testing

## Next Steps (Phase 3)

- Implement remaining feature pages with full functionality
- Add more sophisticated audio playback controls
- Enhance project management capabilities
- Implement voice cloning simulation

## React vs Vue Comparison

### Data Fetching

- **React**: Custom hooks with useEffect for lifecycle management
- **Vue**: Composables with onMounted/watchEffect for reactivity

### State Management

- **React**: useState with manual state updates
- **Vue**: ref()/reactive() with automatic reactivity

### API Integration

- **React**: Promise-based with manual loading/error state management
- **Vue**: Similar patterns with automatic reactivity for state changes

### Type Safety

- **React**: TypeScript generics for hooks and components
- **Vue**: Similar TypeScript support with defineProps<T>() and composables

This mock data infrastructure provides a solid foundation for realistic development and testing, closely mimicking real-world API interactions while maintaining full type safety and proper error handling patterns.
