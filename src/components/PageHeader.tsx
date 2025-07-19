/**
 * PageHeader Component - Consistent page headers across the application
 *
 * React Concepts Demonstrated:
 * - Props interface with TypeScript for flexible configuration
 * - Conditional rendering for optional elements
 * - Component composition with actions and breadcrumbs
 * - Responsive design with mobile-friendly layouts
 * - Icon integration and gradient backgrounds
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue component with props
 * - Props interface = defineProps<PageHeaderProps>()
 * - Conditional rendering = v-if/v-show directives
 * - Component composition = slots or named slots
 * - Responsive design = same CSS classes
 */

import { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  iconColor?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

const PageHeader = ({
  title,
  description,
  icon,
  iconColor = 'from-blue-500 to-blue-600',
  breadcrumbs,
  actions,
  children,
  className = '',
}: PageHeaderProps): React.JSX.Element => {
  return (
    <div className={`bg-gray-800 border-b border-gray-700 ${className}`}>
      <div className="px-6 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-4 h-4 text-gray-400 mx-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-white font-medium">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Main Header Content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            {icon && (
              <div
                className={`w-8 h-8 bg-gradient-to-br ${iconColor} rounded-lg flex items-center justify-center`}
              >
                <span className="text-white">{icon}</span>
              </div>
            )}

            {/* Title and Description */}
            <div>
              <h1 className="text-xl font-bold text-white">{title}</h1>
              {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
            </div>
          </div>

          {/* Actions */}
          {actions && <div className="flex items-center space-x-3">{actions}</div>}
        </div>

        {/* Additional Content */}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

// Predefined action button components for common use cases
export const HeaderButton = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-700 hover:bg-gray-600 text-white';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-gray-700 hover:bg-gray-600 text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${getVariantClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const HeaderIconButton = ({
  children,
  onClick,
  title,
  disabled = false,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default PageHeader;
