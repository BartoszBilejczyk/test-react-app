/**
 * Performance Monitoring Utilities - Production-ready performance tracking
 *
 * React Concepts Demonstrated:
 * - Performance measurement APIs
 * - Memory usage tracking
 * - Component render timing
 * - Bundle size optimization
 * - User experience metrics
 *
 * Vue.js Equivalent Mapping:
 * - Similar performance utilities would work in Vue
 * - Vue DevTools provides similar insights
 * - Performance API = same browser APIs
 * - Component timing = Vue's performance hooks
 */

import * as React from 'react';

// Performance measurement utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Vue equivalent: Similar utility function
  startMeasurement(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  // Vue equivalent: Similar utility function
  endMeasurement(name: string): number {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name, 'measure')[0];
      const duration = measure?.duration || 0;

      // Store metric
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name)!.push(duration);

      // Clean up marks
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);

      return duration;
    }
    return 0;
  }

  // Get average performance for a metric
  getAverageTime(name: string): number {
    const times = this.metrics.get(name) || [];
    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  // Get all performance metrics
  getAllMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};

    this.metrics.forEach((times, name) => {
      result[name] = {
        average: this.getAverageTime(name),
        count: times.length,
        latest: times[times.length - 1] || 0,
      };
    });

    return result;
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// React component performance wrapper
// Vue equivalent: Similar HOC or composable pattern
export const measureComponentPerformance = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
) => {
  const MeasuredComponent = (props: P) => {
    const monitor = PerformanceMonitor.getInstance();

    React.useEffect(() => {
      monitor.startMeasurement(`${componentName}-render`);

      return () => {
        monitor.endMeasurement(`${componentName}-render`);
      };
    });

    return React.createElement(WrappedComponent, props);
  };

  MeasuredComponent.displayName = `Measured(${componentName})`;
  return MeasuredComponent;
};

// Memory usage tracking
export const getMemoryUsage = (): {
  used: number;
  total: number;
  percentage: number;
} | null => {
  // @ts-ignore - performance.memory is not in all browsers
  if (typeof performance !== 'undefined' && performance.memory) {
    // @ts-ignore
    const memory = performance.memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
      percentage: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
    };
  }
  return null;
};

// Bundle size analysis
export const getBundleInfo = (): {
  estimatedSize: string;
  loadTime: number;
  resourceCount: number;
} => {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const scripts = resources.filter(r => r.name.includes('.js'));
  const styles = resources.filter(r => r.name.includes('.css'));

  const totalSize = scripts.reduce((sum, script) => {
    return sum + (script.transferSize || 0);
  }, 0);

  const loadTime = Math.max(...scripts.map(s => s.loadEnd - s.loadStart));

  return {
    estimatedSize: `${Math.round(totalSize / 1024)} KB`,
    loadTime: Math.round(loadTime),
    resourceCount: scripts.length + styles.length,
  };
};

// Core Web Vitals measurement
export const measureWebVitals = (): Promise<{
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
}> => {
  return new Promise(resolve => {
    const vitals = {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
    };

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        vitals.fcp = fcp.startTime;
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitals.lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        vitals.fid = entry.processingStart - entry.startTime;
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      vitals.cls = clsValue;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Resolve after a delay to collect metrics
    setTimeout(() => {
      resolve(vitals);
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    }, 5000);
  });
};

// Development performance logger
export const logPerformanceMetrics = (): void => {
  if (process.env.NODE_ENV === 'development') {
    const monitor = PerformanceMonitor.getInstance();
    const metrics = monitor.getAllMetrics();
    const memory = getMemoryUsage();
    const bundle = getBundleInfo();

    console.group('🚀 Performance Metrics');
    console.table(metrics);

    if (memory) {
      console.log(
        '💾 Memory Usage:',
        `${memory.used}MB / ${memory.total}MB (${memory.percentage}%)`,
      );
    }

    console.log('📦 Bundle Info:', bundle);
    console.groupEnd();
  }
};
