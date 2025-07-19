/**
 * Error Display Components - User-friendly error messages and empty states
 *
 * React Concepts Demonstrated:
 * - Multiple component exports
 * - Props interfaces for different error types
 * - Conditional rendering based on error types
 * - Action buttons for error recovery
 *
 * Vue.js Equivalent Mapping:
 * - Similar to Vue error components
 * - Props = defineProps<ErrorProps>()
 * - Event handlers = emit() or callback props
 * - Conditional rendering = v-if/v-else
 */

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  icon?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

// Generic error display component
export const ErrorDisplay = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  icon = '⚠️',
  onRetry,
  onGoBack,
  className = '',
}: ErrorDisplayProps): React.JSX.Element => (
  <div className={`text-center py-12 px-4 ${className}`}>
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 mb-6 max-w-md mx-auto">{message}</p>

    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
      {onGoBack && (
        <button
          onClick={onGoBack}
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Go Back
        </button>
      )}
    </div>
  </div>
);

// Network error component
export const NetworkError = ({ onRetry }: { onRetry?: () => void }): React.JSX.Element => (
  <ErrorDisplay
    title="Connection Problem"
    message="Unable to connect to the server. Please check your internet connection and try again."
    icon="🌐"
    onRetry={onRetry}
  />
);

// Loading error component
export const LoadingError = ({ onRetry }: { onRetry?: () => void }): React.JSX.Element => (
  <ErrorDisplay
    title="Failed to Load"
    message="We couldn't load the requested data. This might be a temporary issue."
    icon="📡"
    onRetry={onRetry}
  />
);

// Audio error component
export const AudioError = ({ onRetry }: { onRetry?: () => void }): React.JSX.Element => (
  <ErrorDisplay
    title="Audio Playback Error"
    message="Unable to play the audio file. The file might be corrupted or unavailable."
    icon="🔇"
    onRetry={onRetry}
  />
);

// Generation error component
export const GenerationError = ({ onRetry }: { onRetry?: () => void }): React.JSX.Element => (
  <ErrorDisplay
    title="Generation Failed"
    message="Speech generation failed. Please check your input and try again."
    icon="🎤"
    onRetry={onRetry}
  />
);

// Empty state components
interface EmptyStateProps {
  title: string;
  message: string;
  icon: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  title,
  message,
  icon,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps): React.JSX.Element => (
  <div className={`text-center py-16 px-4 ${className}`}>
    <div className="text-8xl mb-6 opacity-50">{icon}</div>
    <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">{message}</p>

    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Specific empty states
export const EmptyVoiceLibrary = ({
  onAddVoice,
}: {
  onAddVoice?: () => void;
}): React.JSX.Element => (
  <EmptyState
    title="No voices found"
    message="Your voice library is empty. Add some voices to get started with speech generation."
    icon="🎭"
    actionLabel="Add Voice"
    onAction={onAddVoice}
  />
);

export const EmptyProjects = ({
  onCreateProject,
}: {
  onCreateProject?: () => void;
}): React.JSX.Element => (
  <EmptyState
    title="No projects yet"
    message="You haven't created any projects. Start by generating your first speech or creating a voice clone."
    icon="📁"
    actionLabel="Create Project"
    onAction={onCreateProject}
  />
);

export const EmptySearchResults = ({
  searchTerm,
  onClearSearch,
}: {
  searchTerm: string;
  onClearSearch?: () => void;
}): React.JSX.Element => (
  <EmptyState
    title="No results found"
    message={`No items match "${searchTerm}". Try adjusting your search terms or browse all items.`}
    icon="🔍"
    actionLabel="Clear Search"
    onAction={onClearSearch}
  />
);

export const EmptyRecentActivity = (): React.JSX.Element => (
  <EmptyState
    title="No recent activity"
    message="Your recent activity will appear here as you create projects and generate speech."
    icon="📊"
  />
);

// Inline error component (for smaller spaces)
export const InlineError = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}): React.JSX.Element => (
  <div className="flex items-center justify-between bg-red-900/20 border border-red-700 rounded-lg p-3">
    <div className="flex items-center space-x-2">
      <span className="text-red-400">⚠️</span>
      <span className="text-red-300 text-sm">{message}</span>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);

// Success message component
export const SuccessMessage = ({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}): React.JSX.Element => (
  <div className="flex items-center justify-between bg-green-900/20 border border-green-700 rounded-lg p-3">
    <div className="flex items-center space-x-2">
      <span className="text-green-400">✅</span>
      <span className="text-green-300 text-sm">{message}</span>
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
      >
        ×
      </button>
    )}
  </div>
);
