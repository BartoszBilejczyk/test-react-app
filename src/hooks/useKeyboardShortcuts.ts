/**
 * Keyboard Shortcuts Hook - Accessibility and power user features
 *
 * React Concepts Demonstrated:
 * - Custom hooks for reusable logic
 * - useEffect for event listeners
 * - useCallback for stable references
 * - Cleanup functions for memory management
 * - Keyboard event handling
 *
 * Vue.js Equivalent Mapping:
 * - This would be a Vue composable
 * - useEffect = onMounted/onUnmounted for lifecycle
 * - useCallback = computed() or function refs
 * - Event listeners = same addEventListener patterns
 * - Cleanup = onUnmounted cleanup
 */

import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastHelpers } from '../components/Toast';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { info } = useToastHelpers();

  // Vue equivalent: const shortcuts = ref([...]) or reactive data
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      altKey: true,
      action: () => navigate('/'),
      description: 'Go to Home/Dashboard',
    },
    {
      key: 't',
      altKey: true,
      action: () => navigate('/text-to-speech'),
      description: 'Go to Text-to-Speech',
    },
    {
      key: 'v',
      altKey: true,
      action: () => navigate('/voice-library'),
      description: 'Go to Voice Library',
    },
    {
      key: 'p',
      altKey: true,
      action: () => navigate('/projects'),
      description: 'Go to Projects',
    },
    {
      key: 'g',
      altKey: true,
      action: () => navigate('/playground'),
      description: 'Go to Playground',
    },
    {
      key: '?',
      shiftKey: true,
      action: () => showShortcuts(),
      description: 'Show keyboard shortcuts',
    },
  ];

  const showShortcuts = useCallback(() => {
    const shortcutList = shortcuts
      .map(
        s =>
          `${s.altKey ? 'Alt + ' : ''}${s.shiftKey ? 'Shift + ' : ''}${s.ctrlKey ? 'Ctrl + ' : ''}${s.key.toUpperCase()}: ${s.description}`,
      )
      .join('\n');

    info('Keyboard Shortcuts', shortcutList);
  }, [info, shortcuts]);

  // Vue equivalent: const handleKeyDown = (event) => { ... }
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const shortcut = shortcuts.find(
        s =>
          s.key.toLowerCase() === event.key.toLowerCase() &&
          !!s.ctrlKey === event.ctrlKey &&
          !!s.altKey === event.altKey &&
          !!s.shiftKey === event.shiftKey,
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    },
    [shortcuts],
  );

  // Vue equivalent: onMounted(() => { ... }) and onUnmounted(() => { ... })
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function - Vue equivalent: onUnmounted
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    shortcuts,
    showShortcuts,
  };
};

// Focus management hook for accessibility - currently not used given the example nature of the app
export const useFocusManagement = () => {
  // Vue equivalent: const focusElement = (selector) => { ... }
  const focusElement = useCallback((selector: string) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, []);

  // Vue equivalent: const trapFocus = (container) => { ... }
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return {
    focusElement,
    trapFocus,
  };
};
