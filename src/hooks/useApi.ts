/**
 * Custom API Hooks - Data fetching with loading and error states
 *
 * React Concepts Demonstrated:
 * - Custom hooks for reusable logic
 * - useState for loading and error states
 * - useEffect for data fetching
 * - useCallback for memoized functions
 * - Generic TypeScript types for flexibility
 * - Error handling patterns
 *
 * Vue.js Equivalent Mapping:
 * - Similar to Vue composables
 * - useState = ref() for reactive state
 * - useEffect = watchEffect or onMounted
 * - useCallback = computed() or function refs
 * - Generic types = same TypeScript patterns
 */

import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../types';
import { handleApiError } from '../api/apiUtils';

// Generic hook for API calls
export const useApi = <T>(apiCall: () => Promise<ApiResponse<T>>, dependencies: any[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

// Hook for manual API calls (not automatic on mount)
export const useApiCall = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// Hook for loading states with multiple operations
export const useLoadingState = (initialState: boolean = false) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }));
  }, []);

  const setError = useCallback((key: string, error: string | null) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  }, []);

  const clearError = useCallback((key: string) => {
    setErrors(prev => ({ ...prev, [key]: null }));
  }, []);

  const isLoading = useCallback(
    (key?: string) => {
      if (key) {
        return loadingStates[key] || false;
      }
      return Object.values(loadingStates).some(loading => loading);
    },
    [loadingStates],
  );

  const getError = useCallback(
    (key: string) => {
      return errors[key] || null;
    },
    [errors],
  );

  const hasError = useCallback(
    (key?: string) => {
      if (key) {
        return !!errors[key];
      }
      return Object.values(errors).some(error => !!error);
    },
    [errors],
  );

  return {
    setLoading,
    setError,
    clearError,
    isLoading,
    getError,
    hasError,
    loadingStates,
    errors,
  };
};

// Hook for paginated data
export const usePaginatedApi = <T>(
  apiCall: (page: number, limit: number) => Promise<ApiResponse<{ items: T[]; total: number }>>,
  initialLimit: number = 10,
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall(pageNum, limit);

        if (reset) {
          setData(response.data.items);
        } else {
          setData(prev => [...prev, ...response.data.items]);
        }

        setTotal(response.data.total);
        setHasMore(response.data.items.length === limit);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    },
    [apiCall, limit],
  );

  useEffect(() => {
    fetchData(1, true);
    setPage(1);
  }, [fetchData]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, false);
    }
  }, [loading, hasMore, page, fetchData]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchData(1, true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    page,
    total,
    hasMore,
    loadMore,
    refresh,
  };
};

// Hook for search functionality
export const useSearch = <T>(
  searchApi: (query: string) => Promise<ApiResponse<T[]>>,
  debounceMs: number = 300,
) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await searchApi(searchQuery);
        setResults(response.data);
      } catch (err) {
        setError(handleApiError(err));
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [searchApi],
  );

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, search, debounceMs]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch,
  };
};
