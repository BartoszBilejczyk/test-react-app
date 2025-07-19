/**
 * VoiceCard Component Tests - Using Test Utilities
 *
 * React Testing Concepts Demonstrated:
 * - Component testing with mock data utilities
 * - Testing with context providers
 * - User interaction testing
 * - Testing audio functionality
 * - Using custom test utilities effectively
 *
 * Vue.js Equivalent Testing:
 * - Similar to Vue Test Utils with provide/inject
 * - Testing component props and events
 * - Mock data creation patterns
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import VoiceCard from '../VoiceCard';
import { createMockVoice } from '../../test/test-utils';

describe('VoiceCard', () => {
  const mockOnPlay = vi.fn();
  const mockOnUse = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering with Mock Data', () => {
    it('should render with mock voice data', () => {
      const mockVoice = createMockVoice({
        name: 'Test Voice',
        description: 'A voice for testing',
        category: 'premade',
      });

      render(<VoiceCard voice={mockVoice} onPlay={mockOnPlay} onUse={mockOnUse} />);

      expect(screen.getByText('Test Voice')).toBeInTheDocument();
      expect(screen.getByText('A voice for testing')).toBeInTheDocument();
      expect(screen.getByText('premade')).toBeInTheDocument();
    });

    it('should render different voice categories correctly', () => {
      const premadeVoice = createMockVoice({ category: 'premade' });
      const clonedVoice = createMockVoice({ category: 'cloned' });
      const generatedVoice = createMockVoice({ category: 'generated' });

      const { rerender } = render(<VoiceCard voice={premadeVoice} />);
      expect(screen.getByText('premade')).toBeInTheDocument();

      rerender(<VoiceCard voice={clonedVoice} />);
      expect(screen.getByText('cloned')).toBeInTheDocument();

      rerender(<VoiceCard voice={generatedVoice} />);
      expect(screen.getByText('generated')).toBeInTheDocument();
    });
  });

  describe('Compact Mode', () => {
    it('should render in compact mode', () => {
      const mockVoice = createMockVoice({
        name: 'Compact Voice',
        language: 'Spanish',
      });

      render(<VoiceCard voice={mockVoice} compact={true} onPlay={mockOnPlay} />);

      expect(screen.getByText('Compact Voice')).toBeInTheDocument();
      expect(screen.getByText('Female, Spanish')).toBeInTheDocument();
    });

    it('should show play button in compact mode', () => {
      const mockVoice = createMockVoice();

      render(<VoiceCard voice={mockVoice} compact={true} onPlay={mockOnPlay} />);

      const playButton = screen.getByRole('button');
      expect(playButton).toBeInTheDocument();
      expect(playButton).toHaveTextContent('▶️');
    });
  });

  describe('User Interactions', () => {
    it('should call onPlay when play button is clicked', async () => {
      const user = userEvent.setup();
      const mockVoice = createMockVoice();

      render(<VoiceCard voice={mockVoice} onPlay={mockOnPlay} onUse={mockOnUse} />);

      const playButton = screen.getByText('▶️ Preview');
      await user.click(playButton);

      expect(mockOnPlay).toHaveBeenCalledTimes(1);
      expect(mockOnPlay).toHaveBeenCalledWith(mockVoice);
    });

    it('should call onUse when use button is clicked', async () => {
      const user = userEvent.setup();
      const mockVoice = createMockVoice();

      render(<VoiceCard voice={mockVoice} onPlay={mockOnPlay} onUse={mockOnUse} />);

      const useButton = screen.getByText('Use');
      await user.click(useButton);

      expect(mockOnUse).toHaveBeenCalledTimes(1);
      expect(mockOnUse).toHaveBeenCalledWith(mockVoice);
    });
  });

  describe('Metadata Display', () => {
    it('should show metadata when showMetadata is true', () => {
      const mockVoice = createMockVoice({
        language: 'French',
        gender: 'Male',
        age: 'Young',
        useCase: 'Narration',
      });

      render(<VoiceCard voice={mockVoice} showMetadata={true} />);

      expect(screen.getByText('Language:')).toBeInTheDocument();
      expect(screen.getByText('French')).toBeInTheDocument();
      expect(screen.getByText('Gender:')).toBeInTheDocument();
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Age:')).toBeInTheDocument();
      expect(screen.getByText('Young')).toBeInTheDocument();
      expect(screen.getByText('Use Case:')).toBeInTheDocument();
      expect(screen.getByText('Narration')).toBeInTheDocument();
    });

    it('should hide metadata when showMetadata is false', () => {
      const mockVoice = createMockVoice();

      render(<VoiceCard voice={mockVoice} showMetadata={false} />);

      expect(screen.queryByText('Language:')).not.toBeInTheDocument();
      expect(screen.queryByText('Gender:')).not.toBeInTheDocument();
    });
  });

  describe('Voice Categories', () => {
    it('should apply correct styling for different categories', () => {
      const premadeVoice = createMockVoice({ category: 'premade' });

      render(<VoiceCard voice={premadeVoice} />);

      const categoryBadge = screen.getByText('premade');
      expect(categoryBadge).toHaveClass('bg-blue-600/20', 'text-blue-400');
    });
  });

  describe('Custom Voice Properties', () => {
    it('should handle custom voice properties', () => {
      const customVoice = createMockVoice({
        name: 'Custom AI Voice',
        description: 'An AI-generated voice with custom parameters',
        avatar: '🤖',
        color: 'bg-purple-500',
        accent: 'British',
        useCase: 'AI Assistant',
      });

      render(<VoiceCard voice={customVoice} />);

      expect(screen.getByText('Custom AI Voice')).toBeInTheDocument();
      expect(screen.getByText('An AI-generated voice with custom parameters')).toBeInTheDocument();
      expect(screen.getByText('🤖')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing optional handlers gracefully', () => {
      const mockVoice = createMockVoice();

      // Should not crash when handlers are not provided
      expect(() => {
        render(<VoiceCard voice={mockVoice} />);
      }).not.toThrow();
    });

    it('should handle empty description', () => {
      const mockVoice = createMockVoice({ description: '' });

      render(<VoiceCard voice={mockVoice} />);

      // Should still render the component
      expect(screen.getByText(mockVoice.name)).toBeInTheDocument();
    });
  });
});
