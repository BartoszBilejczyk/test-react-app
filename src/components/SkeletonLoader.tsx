/**
 * Skeleton Loader Components - Loading placeholders for different content types
 *
 * React Concepts Demonstrated:
 * - Multiple component exports from single file
 * - Reusable skeleton patterns
 * - CSS animations for loading effects
 * - Component composition for complex layouts
 *
 * Vue.js Equivalent Mapping:
 * - Similar to Vue skeleton components
 * - Multiple exports = multiple components in same file
 * - Animation classes = same Tailwind approach
 */

// Base skeleton element
const SkeletonElement = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
}: {
  className?: string;
  width?: string;
  height?: string;
}): React.JSX.Element => (
  <div className={`bg-gray-700 rounded animate-pulse ${width} ${height} ${className}`} />
);

// Card skeleton for voice cards, project cards, etc.
export const SkeletonCard = (): React.JSX.Element => (
  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonElement width="w-12" height="h-12" className="rounded-full" />
      <div className="flex-1">
        <SkeletonElement width="w-3/4" height="h-5" className="mb-2" />
        <SkeletonElement width="w-1/2" height="h-4" />
      </div>
    </div>
    <SkeletonElement width="w-full" height="h-4" className="mb-2" />
    <SkeletonElement width="w-2/3" height="h-4" className="mb-4" />
    <div className="flex justify-between items-center">
      <SkeletonElement width="w-20" height="h-8" className="rounded-full" />
      <SkeletonElement width="w-16" height="h-6" />
    </div>
  </div>
);

// List item skeleton
export const SkeletonListItem = (): React.JSX.Element => (
  <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
    <SkeletonElement width="w-10" height="h-10" className="rounded-full" />
    <div className="flex-1">
      <SkeletonElement width="w-1/3" height="h-5" className="mb-2" />
      <SkeletonElement width="w-2/3" height="h-4" />
    </div>
    <SkeletonElement width="w-20" height="h-6" />
  </div>
);

// Dashboard stats skeleton
export const SkeletonStats = (): React.JSX.Element => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <SkeletonElement width="w-8" height="h-8" className="rounded" />
          <SkeletonElement width="w-16" height="h-6" />
        </div>
        <SkeletonElement width="w-20" height="h-8" className="mb-2" />
        <SkeletonElement width="w-24" height="h-4" />
      </div>
    ))}
  </div>
);

// Quick actions skeleton
export const SkeletonQuickActions = (): React.JSX.Element => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-6 border border-gray-600"
      >
        <div className="flex items-center space-x-4 mb-4">
          <SkeletonElement width="w-12" height="h-12" className="rounded-lg" />
          <div className="flex-1">
            <SkeletonElement width="w-3/4" height="h-6" className="mb-2" />
            <SkeletonElement width="w-full" height="h-4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Voice library grid skeleton
export const SkeletonVoiceGrid = ({ count = 6 }: { count?: number }): React.JSX.Element => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

// Projects list skeleton
export const SkeletonProjectsList = ({ count = 5 }: { count?: number }): React.JSX.Element => (
  <div className="space-y-4">
    {[...Array(count)].map((_, index) => (
      <SkeletonListItem key={index} />
    ))}
  </div>
);

// Text area skeleton (for text-to-speech)
export const SkeletonTextArea = (): React.JSX.Element => (
  <div className="space-y-4">
    <SkeletonElement width="w-32" height="h-6" />
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <SkeletonElement width="w-full" height="h-32" />
    </div>
    <div className="flex justify-between items-center">
      <SkeletonElement width="w-24" height="h-4" />
      <SkeletonElement width="w-32" height="h-10" className="rounded-lg" />
    </div>
  </div>
);

// Voice selector skeleton
export const SkeletonVoiceSelector = (): React.JSX.Element => (
  <div className="space-y-4">
    <SkeletonElement width="w-24" height="h-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <SkeletonElement width="w-10" height="h-10" className="rounded-full" />
            <div className="flex-1">
              <SkeletonElement width="w-3/4" height="h-5" className="mb-1" />
              <SkeletonElement width="w-1/2" height="h-4" />
            </div>
          </div>
          <SkeletonElement width="w-20" height="h-8" className="rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

// Page header skeleton
export const SkeletonPageHeader = (): React.JSX.Element => (
  <div className="mb-8">
    <SkeletonElement width="w-64" height="h-8" className="mb-2" />
    <SkeletonElement width="w-96" height="h-5" />
  </div>
);

// Full page skeleton (combines multiple elements)
export const SkeletonPage = ({
  showHeader = true,
  showStats = false,
  showGrid = true,
  gridCount = 6,
}: {
  showHeader?: boolean;
  showStats?: boolean;
  showGrid?: boolean;
  gridCount?: number;
}): React.JSX.Element => (
  <div className="p-6 space-y-8">
    {showHeader && <SkeletonPageHeader />}
    {showStats && <SkeletonStats />}
    {showGrid && <SkeletonVoiceGrid count={gridCount} />}
  </div>
);
