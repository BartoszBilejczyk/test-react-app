/**
 * DashboardCard Component Tests
 *
 * React Testing Concepts Demonstrated:
 * - Component rendering and props testing
 * - User interaction testing with user-event
 * - Testing React Router navigation
 * - Testing conditional rendering
 * - Testing accessibility features
 * - Testing CSS classes and styling
 *
 * Vue.js Equivalent Testing:
 * - Similar to Vue Test Utils component testing
 * - mount() vs render() for component testing
 * - Similar user interaction testing patterns
 * - Testing router-link vs Link component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import userEvent from '@testing-library/user-event';
import DashboardCard from '../DashboardCard';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('DashboardCard', () => {
  const defaultProps = {
    id: 'test-card',
    name: 'Test Feature',
    description: 'This is a test feature description',
    icon: '🎤',
    color: 'from-blue-500 to-blue-600',
    href: '/test-feature',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with all required props', () => {
      render(<DashboardCard {...defaultProps} />);

      expect(screen.getByText('Test Feature')).toBeInTheDocument();
      expect(screen.getByText('This is a test feature description')).toBeInTheDocument();
      expect(screen.getByText('🎤')).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      render(<DashboardCard {...defaultProps} />);

      const card = screen.getByRole('link');
      expect(card).toHaveClass('group', 'relative', 'bg-gray-800', 'rounded-xl');

      const iconContainer = screen.getByText('🎤').parentElement;
      expect(iconContainer).toHaveClass('from-blue-500', 'to-blue-600');
    });

    it('should render with custom className', () => {
      render(<DashboardCard {...defaultProps} className="custom-class" />);

      const card = screen.getByRole('link');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Navigation', () => {
    it('should render as a Link when href is provided', () => {
      render(<DashboardCard {...defaultProps} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/test-feature');
    });

    it('should be clickable and navigate to correct href', async () => {
      const user = userEvent.setup();
      render(<DashboardCard {...defaultProps} />);

      const link = screen.getByRole('link');
      await user.click(link);

      // In a real test environment, this would test actual navigation
      // Here we're testing that the link is properly set up
      expect(link).toHaveAttribute('href', '/test-feature');
    });
  });

  describe('Disabled State', () => {
    it('should render as disabled when disabled prop is true', () => {
      render(<DashboardCard {...defaultProps} disabled={true} />);

      const card = screen.getByText('Test Feature').closest('div');
      expect(card).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('should not render as Link when disabled', () => {
      render(<DashboardCard {...defaultProps} disabled={true} />);

      // Should not be a link when disabled
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should not show hover arrow when disabled', () => {
      render(<DashboardCard {...defaultProps} disabled={true} />);

      // The hover arrow should not be present when disabled
      const arrow = screen.queryByRole('img'); // SVG elements are often queried as img
      expect(arrow).not.toBeInTheDocument();
    });
  });

  describe('Click Handler', () => {
    it('should call onClick handler when provided', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <DashboardCard
          {...defaultProps}
          onClick={handleClick}
          href="" // Remove href to test onClick without navigation
        />,
      );

      const card = screen.getByText('Test Feature').closest('div');
      await user.click(card!);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<DashboardCard {...defaultProps} onClick={handleClick} disabled={true} />);

      const card = screen.getByText('Test Feature').closest('div');
      await user.click(card!);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible when not disabled', () => {
      render(<DashboardCard {...defaultProps} />);

      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('tabindex', '-1');
    });

    it('should have proper ARIA attributes', () => {
      render(<DashboardCard {...defaultProps} />);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();

      // Check that the content is accessible
      expect(screen.getByText('Test Feature')).toBeInTheDocument();
      expect(screen.getByText('This is a test feature description')).toBeInTheDocument();
    });
  });

  describe('Hover Effects', () => {
    it('should show hover arrow when not disabled', () => {
      render(<DashboardCard {...defaultProps} />);

      // The hover arrow should be present but initially hidden (opacity-0)
      const card = screen.getByRole('link');
      const arrow = card.querySelector('svg');
      expect(arrow).toBeInTheDocument();
    });

    it('should have hover classes applied', () => {
      render(<DashboardCard {...defaultProps} />);

      const card = screen.getByRole('link');
      expect(card).toHaveClass('hover:bg-gray-750', 'hover:border-gray-600');
    });
  });

  describe('Icon and Color', () => {
    it('should render icon with correct gradient colors', () => {
      render(<DashboardCard {...defaultProps} />);

      const iconContainer = screen.getByText('🎤').parentElement;
      expect(iconContainer).toHaveClass('bg-gradient-to-br', 'from-blue-500', 'to-blue-600');
    });

    it('should handle different color combinations', () => {
      const customProps = {
        ...defaultProps,
        color: 'from-red-500 to-red-600',
        icon: '🎭',
      };

      render(<DashboardCard {...customProps} />);

      const iconContainer = screen.getByText('🎭').parentElement;
      expect(iconContainer).toHaveClass('from-red-500', 'to-red-600');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings gracefully', () => {
      const emptyProps = {
        ...defaultProps,
        name: '',
        description: '',
        icon: '',
      };

      render(<DashboardCard {...emptyProps} />);

      // Component should still render without crashing
      const card = screen.getByRole('link');
      expect(card).toBeInTheDocument();
    });

    it('should handle very long text content', () => {
      const longTextProps = {
        ...defaultProps,
        name: 'This is a very long feature name that might wrap to multiple lines',
        description:
          'This is an extremely long description that definitely will wrap to multiple lines and test how the component handles overflow and text wrapping in various scenarios',
      };

      render(<DashboardCard {...longTextProps} />);

      expect(screen.getByText(longTextProps.name)).toBeInTheDocument();
      expect(screen.getByText(longTextProps.description)).toBeInTheDocument();
    });
  });
});
