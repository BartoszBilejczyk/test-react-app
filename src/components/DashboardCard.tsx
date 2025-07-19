/**
 * DashboardCard Component - Reusable card for dashboard quick actions
 *
 * React Concepts Demonstrated:
 * - Props interface with TypeScript for type safety
 * - Conditional rendering and dynamic styling
 * - Event handlers and navigation
 * - CSS gradient backgrounds
 * - Hover effects and transitions
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue component with props
 * - Props interface = defineProps<DashboardCardProps>()
 * - Dynamic styling = :class bindings
 * - Event handlers = @click methods
 * - Conditional rendering = v-if directives
 */

import { Link } from 'react-router-dom';
import { memo } from 'react';

interface DashboardCardProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const DashboardCard = ({
  name,
  description,
  icon,
  color,
  href,
  onClick,
  disabled = false,
  className = '',
}: DashboardCardProps): React.JSX.Element => {
  const cardContent = (
    <div
      className={`
        group relative bg-gray-800 rounded-xl p-6 transition-all duration-300 border border-gray-700 
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-750 hover:border-gray-600 cursor-pointer'
        }
        ${className}
      `}
      onClick={onClick}
    >
      <div
        className={`
          w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 
          ${disabled ? '' : 'group-hover:scale-110'} 
          transition-transform duration-300
        `}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-white font-semibold mb-2">{name}</h3>
      <p className="text-gray-400 text-sm">{description}</p>

      {/* Hover arrow indicator */}
      {!disabled && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );

  // If href is provided and not disabled, wrap in Link
  if (href && !disabled) {
    return (
      <Link to={href} className="block">
        {cardContent}
      </Link>
    );
  }

  // Otherwise return the card directly
  return cardContent;
};

// Vue equivalent: No direct equivalent, but similar to computed props optimization
export default memo(DashboardCard);
