/**
 * useApi Hook Tests
 *
 * React Testing Concepts Demonstrated:
 * - Testing custom hooks with renderHook
 * - Testing async operations and state changes
 * - Testing error scenarios and loading states
 * - Testing hook cleanup and memory leaks
 * - Testing hook dependencies and re-execution
 *
 * Vue.js Equivalent Testing:
 * - Similar to testing Vue composables
 * - Testing reactive state changes
 * - Testing async composable functions
 * - Similar cleanup and lifecycle testing
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApi, useApiCall, useSearch } from '../useApi';
import { mockSuccessfulApiCall, mockFailedApiCall } from '../../test/test-utils';

describe('useApi Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful API Calls', () => {
    it('should handle successful API call', async () => {
      const mockApiFunction = vi
        .fn()
        .mockImplementation(() => mockSuccessfulApiCall({ message: 'Success' }));

      const { result } = renderHook(() => useApi(mockApiFunction));

      // Initial state
      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();

      // Wait for API call to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual({ message: 'Success' });
      expect(result.current.error).toBeNull();
      expect(mockApiFunction).toHaveBeenCalledTimes(1);
    });

    it('should refetch data when refetch is called', async () => {
      const mockApiFunction = vi.fn().mockImplementation(() => mockSuccessfulApiCall({ count: 1 }));

      const { result } = renderHook(() => useApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual({ count: 1 });
      expect(mockApiFunction).toHaveBeenCalledTimes(1);

      // Update mock to return different data
      mockApiFunction.mockImplementation(() => mockSuccessfulApiCall({ count: 2 }));

      // Call refetch
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual({ count: 2 });
      });

      expect(mockApiFunction).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const mockApiFunction = vi.fn().mockImplementation(() => mockFailedApiCall('API Error'));

      const { result } = renderHook(() => useApi(mockApiFunction));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('API Error');
    });

    it('should reset error on successful refetch', async () => {
      const mockApiFunction = vi
        .fn()
        .mockImplementationOnce(() => mockFailedApiCall('First Error'))
        .mockImplementationOnce(() => mockSuccessfulApiCall({ success: true }));

      const { result } = renderHook(() => useApi(mockApiFunction));

      // Wait for first call to fail
      await waitFor(() => {
        expect(result.current.error).toBe('First Error');
      });

      // Refetch should succeed
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual({ success: true });
      expect(result.current.error).toBeNull();
    });
  });

  describe('Loading States', () => {
    it('should show loading state during API call', async () => {
      const mockApiFunction = vi.fn().mockImplementation(
        () => mockSuccessfulApiCall({ data: 'test' }, 100), // 100ms delay
      );

      const { result } = renderHook(() => useApi(mockApiFunction));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});

describe('useApiCall Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Manual API Calls', () => {
    it('should execute API call manually', async () => {
      const { result } = renderHook(() => useApiCall());

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();

      const mockApiFunction = vi
        .fn()
        .mockImplementation(() => mockSuccessfulApiCall({ result: 'success' }));

      const promise = result.current.execute(mockApiFunction);

      expect(result.current.loading).toBe(true);

      const data = await promise;

      expect(data).toEqual({ result: 'success' });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors in manual calls', async () => {
      const { result } = renderHook(() => useApiCall());

      const mockApiFunction = vi
        .fn()
        .mockImplementation(() => mockFailedApiCall('Manual call error'));

      try {
        await result.current.execute(mockApiFunction);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Manual call error');
      }

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Manual call error');
    });

    it('should reset error state', async () => {
      const { result } = renderHook(() => useApiCall());

      // Simulate error by executing a failing function
      try {
        await result.current.execute(() => mockFailedApiCall('Test error'));
      } catch (error) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.error).toBe('Test error');
      });

      result.current.reset();

      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });
});

describe('useSearch Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Search Functionality', () => {
    it('should debounce search queries', async () => {
      const mockSearchFunction = vi
        .fn()
        .mockImplementation(query => mockSuccessfulApiCall([{ id: 1, name: query }]));

      const { result } = renderHook(() => useSearch(mockSearchFunction));

      // Set query multiple times quickly
      result.current.setQuery('a');
      result.current.setQuery('ab');
      result.current.setQuery('abc');

      expect(result.current.query).toBe('abc');
      expect(mockSearchFunction).not.toHaveBeenCalled();

      // Fast-forward time to trigger debounced search
      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(mockSearchFunction).toHaveBeenCalledTimes(1);
        expect(mockSearchFunction).toHaveBeenCalledWith('abc');
      });
    });

    it('should clear search results', async () => {
      const mockSearchFunction = vi
        .fn()
        .mockImplementation(() => mockSuccessfulApiCall([{ id: 1, name: 'result' }]));

      const { result } = renderHook(() => useSearch(mockSearchFunction));

      result.current.setQuery('test');
      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(result.current.results).toHaveLength(1);
      });

      result.current.clearSearch();

      expect(result.current.query).toBe('');
      expect(result.current.results).toEqual([]);
    });

    it('should handle search errors', async () => {
      const mockSearchFunction = vi
        .fn()
        .mockImplementation(() => mockFailedApiCall('Search failed'));

      const { result } = renderHook(() => useSearch(mockSearchFunction));

      result.current.setQuery('test');
      vi.advanceTimersByTime(500);

      await waitFor(() => {
        expect(result.current.error).toBe('Search failed');
      });

      expect(result.current.results).toEqual([]);
    });

    it('should not search for empty queries', () => {
      const mockSearchFunction = vi.fn();

      const { result } = renderHook(() => useSearch(mockSearchFunction));

      result.current.setQuery('');
      vi.advanceTimersByTime(500);

      expect(mockSearchFunction).not.toHaveBeenCalled();
    });
  });
});
