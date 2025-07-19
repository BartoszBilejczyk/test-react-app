/**
 * Sidebar Component - Navigation sidebar with collapsible functionality
 *
 * React Concepts Demonstrated:
 * - useState for local component state (collapse state)
 * - useLocation hook from React Router for active route detection
 * - Conditional rendering with logical operators
 * - Dynamic className generation with template literals
 * - Event handlers for user interactions
 * - Component composition and layout
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue single file component
 * - useState = ref() for reactive state
 * - useLocation = useRoute() from Vue Router
 * - Link = <router-link> component
 * - className = :class binding with computed properties
 * - Event handlers = @click methods
 * - Conditional rendering = v-if/v-show directives
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = (): React.ReactElement => {
  // Vue equivalent: const route = useRoute()
  const location = useLocation();

  // Vue equivalent: const isCollapsed = ref(false)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Vue equivalent: computed property or method
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  // Vue equivalent: const navigationItems = ref([...]) or reactive data
  const navigationItems = [
    {
      section: 'My Workspace',
      items: [
        { name: 'Home', path: '/', icon: '🏠' },
        { name: 'Voice Library', path: '/voice-library', icon: '🎭' },
        { name: 'Projects', path: '/projects', icon: '📁' },
      ],
    },
    {
      section: 'Create',
      items: [
        { name: 'Text to Speech', path: '/text-to-speech', icon: '🎤' },
        { name: 'Playground', path: '/playground', icon: '🎬' },
      ],
    },
  ];

  return (
    <div
      className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold text-white">VoiceCraft</div>
                <div className="text-xs text-gray-400">Creative Platform</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {navigationItems.map(section => (
          <div key={section.section} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-orange-600 text-white border-r-2 border-orange-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Account Section */}
      <div className="border-t border-gray-700 p-4">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">Bartek</div>
                <div className="text-xs text-gray-400">My Workspace</div>
              </div>
            </div>
            <button className="w-full px-3 py-2 text-xs font-medium text-orange-400 bg-orange-900/20 border border-orange-600/30 rounded-lg hover:bg-orange-900/30 transition-colors">
              ⚡ Upgrade
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">B</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
