/**
 * Performance Utilities Tests
 *
 * React Testing Concepts Demonstrated:
 * - Unit testing utility functions
 * - Mocking browser APIs (performance, memory)
 * - Testing singleton patterns
 * - Async testing with promises
 * - Testing error scenarios
 *
 * Vue.js Equivalent Testing:
 * - Similar unit tests would work in Vue with vitest
 * - Same mocking patterns for browser APIs
 * - Similar test structure and assertions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  PerformanceMonitor,
  getMemoryUsage,
  getBundleInfo,
  measureWebVitals,
} from '../performance';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    // Reset singleton instance for each test
    // @ts-ignore - accessing private property for testing
    PerformanceMonitor.instance = undefined;
    monitor = PerformanceMonitor.getInstance();

    // Clear any existing performance marks/measures
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = PerformanceMonitor.getInstance();
      const instance2 = PerformanceMonitor.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('Performance Measurement', () => {
    it('should start and end measurements correctly', () => {
      const measurementName = 'test-component-render';

      monitor.startMeasurement(measurementName);

      expect(performance.mark).toHaveBeenCalledWith(`${measurementName}-start`);

      const duration = monitor.endMeasurement(measurementName);

      expect(performance.mark).toHaveBeenCalledWith(`${measurementName}-end`);
      expect(performance.measure).toHaveBeenCalledWith(
        measurementName,
        `${measurementName}-start`,
        `${measurementName}-end`,
      );
      expect(typeof duration).toBe('number');
    });

    it('should store measurement results', () => {
      const measurementName = 'test-measurement';

      monitor.startMeasurement(measurementName);
      monitor.endMeasurement(measurementName);

      const average = monitor.getAverageTime(measurementName);
      expect(typeof average).toBe('number');
      expect(average).toBeGreaterThanOrEqual(0);
    });

    it('should calculate average correctly with multiple measurements', () => {
      const measurementName = 'multi-measurement';

      // Mock different durations
      vi.mocked(performance.getEntriesByName).mockReturnValueOnce([{ duration: 100 } as any]);
      monitor.startMeasurement(measurementName);
      monitor.endMeasurement(measurementName);

      vi.mocked(performance.getEntriesByName).mockReturnValueOnce([{ duration: 200 } as any]);
      monitor.startMeasurement(measurementName);
      monitor.endMeasurement(measurementName);

      const average = monitor.getAverageTime(measurementName);
      expect(average).toBe(150); // (100 + 200) / 2
    });

    it('should return 0 for non-existent measurements', () => {
      const average = monitor.getAverageTime('non-existent');
      expect(average).toBe(0);
    });
  });

  describe('Metrics Management', () => {
    it('should return all metrics with correct structure', () => {
      const measurementName = 'test-metric';

      monitor.startMeasurement(measurementName);
      monitor.endMeasurement(measurementName);

      const metrics = monitor.getAllMetrics();

      expect(metrics).toHaveProperty(measurementName);
      expect(metrics[measurementName]).toHaveProperty('average');
      expect(metrics[measurementName]).toHaveProperty('count');
      expect(metrics[measurementName]).toHaveProperty('latest');
      expect(metrics[measurementName].count).toBe(1);
    });

    it('should clear all metrics', () => {
      monitor.startMeasurement('test1');
      monitor.endMeasurement('test1');
      monitor.startMeasurement('test2');
      monitor.endMeasurement('test2');

      let metrics = monitor.getAllMetrics();
      expect(Object.keys(metrics)).toHaveLength(2);

      monitor.clearMetrics();
      metrics = monitor.getAllMetrics();
      expect(Object.keys(metrics)).toHaveLength(0);
    });
  });

  describe('Browser Compatibility', () => {
    it('should handle missing performance API gracefully', () => {
      // Temporarily remove performance API
      const originalPerformance = global.performance;
      // @ts-ignore
      global.performance = undefined;

      const duration = monitor.endMeasurement('test');
      expect(duration).toBe(0);

      // Restore performance API
      global.performance = originalPerformance;
    });
  });
});

describe('getMemoryUsage', () => {
  it('should return memory usage when available', () => {
    const memoryUsage = getMemoryUsage();

    expect(memoryUsage).toEqual({
      used: 1, // 1000000 / 1024 / 1024 rounded
      total: 2, // 2000000 / 1024 / 1024 rounded
      percentage: 50, // (1000000 / 2000000) * 100
    });
  });

  it('should return null when memory API is not available', () => {
    const originalMemory = (performance as any).memory;
    delete (performance as any).memory;

    const memoryUsage = getMemoryUsage();
    expect(memoryUsage).toBeNull();

    // Restore memory API
    (performance as any).memory = originalMemory;
  });
});

describe('getBundleInfo', () => {
  beforeEach(() => {
    // Mock performance.getEntriesByType
    vi.mocked(performance.getEntriesByType).mockReturnValue([
      {
        name: 'https://example.com/assets/main.js',
        transferSize: 50000,
        loadEnd: 1000,
        loadStart: 900,
      },
      {
        name: 'https://example.com/assets/vendor.js',
        transferSize: 30000,
        loadEnd: 1200,
        loadStart: 1000,
      },
      {
        name: 'https://example.com/assets/styles.css',
        transferSize: 10000,
        loadEnd: 800,
        loadStart: 700,
      },
    ] as PerformanceResourceTiming[]);
  });

  it('should calculate bundle information correctly', () => {
    const bundleInfo = getBundleInfo();

    expect(bundleInfo.estimatedSize).toBe('78 KB'); // (50000 + 30000) / 1024
    expect(bundleInfo.loadTime).toBe(200); // max(100, 200) from loadEnd - loadStart
    expect(bundleInfo.resourceCount).toBe(3); // 2 JS + 1 CSS
  });
});

describe('measureWebVitals', () => {
  it('should measure web vitals and resolve with metrics', async () => {
    // Mock PerformanceObserver
    const mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };

    global.PerformanceObserver = vi.fn().mockImplementation(callback => {
      // Simulate immediate callback with mock data
      setTimeout(() => {
        callback({
          getEntries: () => [
            { name: 'first-contentful-paint', startTime: 100 },
            { startTime: 200 }, // LCP entry
            { processingStart: 150, startTime: 100 }, // FID entry
            { value: 0.1, hadRecentInput: false }, // CLS entry
          ],
        });
      }, 0);

      return mockObserver;
    });

    const vitals = await measureWebVitals();

    expect(vitals).toEqual({
      fcp: 100,
      lcp: 200,
      fid: 50, // 150 - 100
      cls: 0.1,
    });

    expect(mockObserver.disconnect).toHaveBeenCalledTimes(4); // One for each observer
  });
});
