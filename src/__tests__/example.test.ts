/**
 * Example Test - Demonstrates React Testing Setup
 *
 * React Testing Concepts Demonstrated:
 * - Basic unit testing with Vitest
 * - Testing utility functions
 * - Mocking and assertions
 * - TypeScript integration in tests
 *
 * Vue.js Equivalent Testing:
 * - Similar test structure with describe/it
 * - Same assertion patterns
 * - Similar mocking strategies
 */

import { describe, it, expect } from 'vitest';

// Simple utility functions to test
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

describe('Utility Functions', () => {
  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(120)).toBe('2:00');
      expect(formatDuration(0)).toBe('0:00');
      expect(formatDuration(3661)).toBe('61:01');
    });

    it('should handle edge cases', () => {
      expect(formatDuration(59)).toBe('0:59');
      expect(formatDuration(60)).toBe('1:00');
      expect(formatDuration(1)).toBe('0:01');
    });
  });

  describe('calculateReadingTime', () => {
    it('should calculate reading time correctly', () => {
      const shortText = 'Hello world';
      const longText = 'Lorem ipsum '.repeat(100); // ~200 words

      expect(calculateReadingTime(shortText)).toBe(1); // Minimum 1 minute
      expect(calculateReadingTime(longText)).toBe(1); // ~200 words = 1 minute
    });

    it('should handle empty text', () => {
      expect(calculateReadingTime('')).toBe(1);
      expect(calculateReadingTime('   ')).toBe(1);
    });

    it('should round up reading time', () => {
      const text = 'word '.repeat(250); // 250 words = 1.25 minutes
      expect(calculateReadingTime(text)).toBe(2); // Should round up to 2
    });
  });

  describe('validateEmail', () => {
    it('should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });
});

describe('React Testing Setup', () => {
  it('should have Vitest configured correctly', () => {
    expect(typeof describe).toBe('function');
    expect(typeof it).toBe('function');
    expect(typeof expect).toBe('function');
  });

  it('should support TypeScript', () => {
    const testObject: { name: string; count: number } = {
      name: 'test',
      count: 42,
    };

    expect(testObject.name).toBe('test');
    expect(testObject.count).toBe(42);
  });

  it('should support async testing', async () => {
    const asyncFunction = async (delay: number) => {
      await new Promise(resolve => setTimeout(resolve, delay));
      return 'completed';
    };

    const result = await asyncFunction(10);
    expect(result).toBe('completed');
  });
});

// Example of testing React patterns that would be used in components
describe('React Patterns Testing Examples', () => {
  describe('State Management Patterns', () => {
    it('should demonstrate immutable updates', () => {
      // Simulating React state update patterns
      const initialState = { count: 0, items: ['a', 'b'] };

      // Immutable count update (React pattern)
      const updatedCount = { ...initialState, count: initialState.count + 1 };
      expect(updatedCount.count).toBe(1);
      expect(updatedCount.items).toBe(initialState.items); // Reference preserved

      // Immutable array update (React pattern)
      const updatedItems = { ...initialState, items: [...initialState.items, 'c'] };
      expect(updatedItems.items).toEqual(['a', 'b', 'c']);
      expect(updatedItems.items).not.toBe(initialState.items); // New reference
    });
  });

  describe('Event Handler Patterns', () => {
    it('should demonstrate event handler testing patterns', () => {
      // Simulating React event handlers
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
      };

      // Simulate multiple clicks
      handleClick();
      handleClick();

      expect(clickCount).toBe(2);
    });

    it('should demonstrate parameterized event handlers', () => {
      const results: string[] = [];
      const handleClickWithParam = (param: string) => {
        return () => {
          results.push(param);
        };
      };

      const handler1 = handleClickWithParam('button1');
      const handler2 = handleClickWithParam('button2');

      handler1();
      handler2();
      handler1();

      expect(results).toEqual(['button1', 'button2', 'button1']);
    });
  });

  describe('Form Validation Patterns', () => {
    it('should demonstrate form validation testing', () => {
      interface FormData {
        email: string;
        password: string;
      }

      const validateForm = (data: FormData): string[] => {
        const errors: string[] = [];

        if (!validateEmail(data.email)) {
          errors.push('Invalid email format');
        }

        if (data.password.length < 8) {
          errors.push('Password must be at least 8 characters');
        }

        return errors;
      };

      // Valid form
      expect(validateForm({ email: 'test@example.com', password: 'password123' })).toEqual([]);

      // Invalid form
      expect(validateForm({ email: 'invalid', password: '123' })).toEqual([
        'Invalid email format',
        'Password must be at least 8 characters',
      ]);
    });
  });
});
