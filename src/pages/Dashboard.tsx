/**
 * Dashboard Page Component - Main dashboard with quick actions and recent items
 *
 * React Concepts Demonstrated:
 * - Functional component with computed values
 * - Array mapping for dynamic rendering
 * - Conditional logic for dynamic content (greeting)
 * - Link component for navigation
 * - Complex layout with CSS Grid and Flexbox
 * - Static data management within component
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue page component in pages/ or views/
 * - Computed values = computed() properties
 * - Array mapping = v-for directive
 * - Link = <router-link> component
 * - Static data = data() return object or ref()
 * - Layout = template with CSS classes
 * - Conditional rendering = v-if/v-else directives
 */

import { useApi } from '../hooks/useApi';
import { fetchDashboardData, fetchQuickActions } from '../api/apiUtils';
import {
  SkeletonStats,
  SkeletonQuickActions,
  SkeletonVoiceGrid,
} from '../components/SkeletonLoader';
import { LoadingError } from '../components/ErrorDisplay';
import DashboardCard from '../components/DashboardCard';

const Dashboard = (): React.JSX.Element => {
  // Vue equivalent: const { data, loading, error } = useApi(fetchDashboardData)
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useApi(fetchDashboardData);

  const {
    data: quickActions,
    loading: actionsLoading,
    error: actionsError,
    refetch: refetchActions,
  } = useApi(fetchQuickActions);

  // Vue equivalent: computed(() => new Date().toLocaleTimeString(...))
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Vue equivalent: computed(() => { ... }) for dynamic greeting
  const greeting =
    new Date().getHours() < 12
      ? 'Good morning'
      : new Date().getHours() < 18
        ? 'Good afternoon'
        : 'Good evening';

  // Show loading state
  if (dashboardLoading || actionsLoading) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-white">{greeting}, Welcome back!</h1>
                <p className="text-gray-400">Loading your dashboard...</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">{currentTime}</div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <SkeletonStats />
          <SkeletonQuickActions />
          <SkeletonVoiceGrid count={4} />
        </div>
      </div>
    );
  }

  // Show error state
  if (dashboardError || actionsError) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Error loading dashboard</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">{currentTime}</div>
          </div>
        </div>

        <div className="p-6">
          <LoadingError
            onRetry={() => {
              refetchDashboard();
              refetchActions();
            }}
          />
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const stats = dashboardData?.stats;
  const recentActivity = dashboardData?.recentActivity || [];
  const recentVoices = dashboardData?.recentVoices || [];
  const actions = quickActions || [];

  return (
    <div className="h-screen overflow-y-auto bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">New</span>
            <span className="text-gray-300">Get the VoiceCraft mobile app</span>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Greeting Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">My Workspace</p>
              <h1 className="text-3xl font-bold text-white">{greeting}, Bartek</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Have a question?</span>
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">AI</span>
                </div>
                <span className="text-white text-sm">Talk to Bot</span>
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {actions.map(action => (
              <DashboardCard
                key={action.id}
                id={action.id}
                name={action.name}
                description={action.description}
                icon={action.icon}
                color={action.color}
                href={action.href}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📁</span>
                </div>
                <span className="text-gray-400 text-sm">Total</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalProjects}</div>
              <div className="text-gray-400 text-sm">Projects</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎭</span>
                </div>
                <span className="text-gray-400 text-sm">Available</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalVoices}</div>
              <div className="text-gray-400 text-sm">Voices</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">⏱️</span>
                </div>
                <span className="text-gray-400 text-sm">Generated</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.totalDuration}</div>
              <div className="text-gray-400 text-sm">Audio</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                <span className="text-gray-400 text-sm">This month</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stats.monthlyUsage}%</div>
              <div className="text-gray-400 text-sm">Usage</div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest from the library */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Latest from the library</h2>
            <div className="space-y-3">
              {recentVoices.map((voice, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 ${voice.color} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white">{voice.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{voice.name}</h4>
                    <p className="text-gray-400 text-sm">{voice.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create or clone a voice */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Create or clone a voice</h2>
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">✨</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Voice Design</h4>
                    <p className="text-gray-400 text-sm">
                      Design an entirely new voice from a text prompt
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🔄</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Clone your Voice</h4>
                    <p className="text-gray-400 text-sm">
                      Create a realistic digital clone of your voice
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📚</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Voice Collections</h4>
                    <p className="text-gray-400 text-sm">Browse curated voice collections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
