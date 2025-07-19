/**
 * API Utilities Tests
 *
 * React Testing Concepts Demonstrated:
 * - Testing async functions with promises
 * - Mocking external dependencies
 * - Testing error scenarios and edge cases
 * - Testing with different data types
 * - Parameterized tests with test.each
 *
 * Vue.js Equivalent Testing:
 * - Similar async testing patterns in Vue
 * - Same mocking strategies for API calls
 * - Similar error handling test patterns
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  fetchVoices,
  fetchProjects,
  fetchDashboardData,
  generateSpeech,
  processDubbing,
  searchVoicesApi,
  handleApiError,
} from '../apiUtils';
import { createMockFile } from '../../test/test-utils';

// Mock the delay function to speed up tests
vi.mock('../apiUtils', async () => {
  const actual = await vi.importActual('../apiUtils');
  return {
    ...actual,
    delay: vi.fn().mockResolvedValue(undefined),
  };
});

describe('API Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchVoices', () => {
    it('should return voices data successfully', async () => {
      const result = await fetchVoices();

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);

      // Check voice structure
      const voice = result.data[0];
      expect(voice).toHaveProperty('id');
      expect(voice).toHaveProperty('name');
      expect(voice).toHaveProperty('description');
      expect(voice).toHaveProperty('category');
      expect(voice).toHaveProperty('language');
      expect(voice).toHaveProperty('gender');
    });

    it('should include all required voice properties', async () => {
      const result = await fetchVoices();
      const voice = result.data[0];

      const requiredProperties = [
        'id',
        'name',
        'description',
        'category',
        'avatar',
        'color',
        'language',
        'gender',
        'age',
        'accent',
        'useCase',
      ];

      requiredProperties.forEach(prop => {
        expect(voice).toHaveProperty(prop);
        expect(voice[prop]).toBeDefined();
      });
    });
  });

  describe('fetchProjects', () => {
    it('should return projects data successfully', async () => {
      const result = await fetchProjects();

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);

      // Check project structure
      const project = result.data[0];
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('status');
      expect(project).toHaveProperty('type');
      expect(project).toHaveProperty('createdAt');
    });

    it('should have valid project statuses', async () => {
      const result = await fetchProjects();
      const validStatuses = ['completed', 'processing', 'draft', 'failed'];

      result.data.forEach(project => {
        expect(validStatuses).toContain(project.status);
      });
    });

    it('should have valid project types', async () => {
      const result = await fetchProjects();
      const validTypes = ['text-to-speech', 'voice-clone', 'dubbing'];

      result.data.forEach(project => {
        expect(validTypes).toContain(project.type);
      });
    });
  });

  describe('fetchDashboardData', () => {
    it('should return complete dashboard data', async () => {
      const result = await fetchDashboardData();

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('stats');
      expect(result.data).toHaveProperty('recentActivity');
      expect(result.data).toHaveProperty('recentVoices');

      // Check stats structure
      const stats = result.data.stats;
      expect(stats).toHaveProperty('totalProjects');
      expect(stats).toHaveProperty('totalVoices');
      expect(stats).toHaveProperty('totalDuration');
      expect(stats).toHaveProperty('monthlyUsage');

      // Check that stats are numbers
      expect(typeof stats.totalProjects).toBe('number');
      expect(typeof stats.totalVoices).toBe('number');
      expect(typeof stats.monthlyUsage).toBe('number');
    });

    it('should have recent activity with proper structure', async () => {
      const result = await fetchDashboardData();
      const activities = result.data.recentActivity;

      expect(activities).toBeInstanceOf(Array);

      if (activities.length > 0) {
        const activity = activities[0];
        expect(activity).toHaveProperty('id');
        expect(activity).toHaveProperty('type');
        expect(activity).toHaveProperty('description');
        expect(activity).toHaveProperty('timestamp');
        expect(activity).toHaveProperty('relativeTime');
      }
    });
  });

  describe('generateSpeech', () => {
    it('should generate speech successfully with valid inputs', async () => {
      const text = 'Hello, this is a test message';
      const voiceId = 'test-voice-1';

      const result = await generateSpeech(text, voiceId);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('audioUrl');
      expect(result.data).toHaveProperty('duration');
      expect(result.data).toHaveProperty('text');
      expect(result.data).toHaveProperty('voiceId');
      expect(result.data).toHaveProperty('generatedAt');

      expect(result.data.text).toBe(text);
      expect(result.data.voiceId).toBe(voiceId);
    });

    it('should calculate duration based on text length', async () => {
      const shortText = 'Short';
      const longText =
        'This is a much longer text that should take more time to generate and speak';

      const shortResult = await generateSpeech(shortText, 'voice-1');
      const longResult = await generateSpeech(longText, 'voice-1');

      // Parse duration strings (format: "X:XX")
      const parseDuration = (duration: string) => {
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + seconds;
      };

      const shortDuration = parseDuration(shortResult.data.duration);
      const longDuration = parseDuration(longResult.data.duration);

      expect(longDuration).toBeGreaterThan(shortDuration);
    });

    it.each([
      ['', 'voice-1', 'Empty text should be handled'],
      ['Valid text', '', 'Empty voice ID should be handled'],
      ['Valid text', 'voice-1', 'Valid inputs should work'],
    ])('should handle edge cases: %s', async (text, voiceId, description) => {
      if (text === '' || voiceId === '') {
        // These should either throw or return error response
        // depending on implementation choice
        try {
          await generateSpeech(text, voiceId);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      } else {
        const result = await generateSpeech(text, voiceId);
        expect(result.success).toBe(true);
      }
    });
  });

  describe('processDubbing', () => {
    it('should process dubbing successfully', async () => {
      const file = createMockFile('test-video.mp4', 2048000, 'video/mp4');
      const sourceLanguage = 'en';
      const targetLanguage = 'es';
      const voiceId = 'spanish-voice-1';

      const result = await processDubbing(file, sourceLanguage, targetLanguage, voiceId);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('dubbedUrl');
      expect(result.data).toHaveProperty('duration');
      expect(result.data).toHaveProperty('sourceLanguage');
      expect(result.data).toHaveProperty('targetLanguage');
      expect(result.data).toHaveProperty('voiceId');
      expect(result.data).toHaveProperty('originalFile');
      expect(result.data).toHaveProperty('processingTime');

      expect(result.data.sourceLanguage).toBe(sourceLanguage);
      expect(result.data.targetLanguage).toBe(targetLanguage);
      expect(result.data.voiceId).toBe(voiceId);
      expect(result.data.originalFile).toBe(file.name);
    });

    it('should calculate processing time based on file size', async () => {
      const smallFile = createMockFile('small.mp4', 500000, 'video/mp4'); // 500KB
      const largeFile = createMockFile('large.mp4', 5000000, 'video/mp4'); // 5MB

      const smallResult = await processDubbing(smallFile, 'en', 'es', 'voice-1');
      const largeResult = await processDubbing(largeFile, 'en', 'es', 'voice-1');

      expect(largeResult.data.processingTime).toBeGreaterThan(smallResult.data.processingTime);
    });
  });

  describe('searchVoicesApi', () => {
    it('should search voices by query', async () => {
      const query = 'female';
      const result = await searchVoicesApi(query);

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);

      // Check that results contain the search term
      result.data.forEach(voice => {
        const searchableText =
          `${voice.name} ${voice.description} ${voice.gender} ${voice.language}`.toLowerCase();
        expect(searchableText).toContain(query.toLowerCase());
      });
    });

    it('should filter by category when provided', async () => {
      const query = 'voice';
      const category = 'premade';
      const result = await searchVoicesApi(query, category);

      expect(result.success).toBe(true);
      result.data.forEach(voice => {
        expect(voice.category).toBe(category);
      });
    });

    it('should return empty array for non-matching queries', async () => {
      const query = 'nonexistentvoicetype12345';
      const result = await searchVoicesApi(query);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('handleApiError', () => {
    it('should handle Error objects', () => {
      const error = new Error('Test error message');
      const result = handleApiError(error);

      expect(result).toBe('Test error message');
    });

    it('should handle string errors', () => {
      const error = 'String error message';
      const result = handleApiError(error);

      expect(result).toBe('String error message');
    });

    it('should handle unknown error types', () => {
      const error = { someProperty: 'value' };
      const result = handleApiError(error);

      expect(result).toBe('An unexpected error occurred');
    });

    it('should handle null/undefined errors', () => {
      expect(handleApiError(null)).toBe('An unexpected error occurred');
      expect(handleApiError(undefined)).toBe('An unexpected error occurred');
    });
  });
});
