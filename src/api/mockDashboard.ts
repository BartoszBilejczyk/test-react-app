/**
 * Mock Dashboard Data - Dashboard statistics and quick actions
 *
 * React Concepts Demonstrated:
 * - Centralized dashboard data management
 * - Statistics calculation from other data sources
 * - Quick actions configuration
 * - Recent activity aggregation
 *
 * Vue.js Equivalent Mapping:
 * - Similar to Vue store getters or computed properties
 * - Dashboard composables in Vue 3
 * - Reactive data aggregation
 */

import { QuickAction, DashboardStats, Voice } from '../types';
import { mockProjects, getProjectStats } from './mockProjects';
import { mockVoices } from './mockVoices';

export const mockQuickActions: QuickAction[] = [
  {
    id: 'instant-speech',
    name: 'Instant speech',
    description: 'Convert text to speech instantly',
    icon: '🎤',
    color: 'from-blue-500 to-blue-600',
    href: '/text-to-speech',
  },
  {
    id: 'voice-library',
    name: 'Voice Library',
    description: 'Browse and manage voices',
    icon: '🎭',
    color: 'from-purple-500 to-purple-600',
    href: '/voice-library',
  },
  {
    id: 'projects',
    name: 'Projects',
    description: 'Manage your voice projects',
    icon: '📁',
    color: 'from-green-500 to-green-600',
    href: '/projects',
  },
  {
    id: 'playground',
    name: 'Playground',
    description: 'Experiment with dubbing and voice effects',
    icon: '🎬',
    color: 'from-orange-500 to-orange-600',
    href: '/playground',
  },
];

// Get recent voices (subset of voice library for dashboard)
export const getRecentVoices = (limit: number = 4): Voice[] => {
  return mockVoices.slice(0, limit);
};

// Calculate dashboard statistics
export const getDashboardStats = (): DashboardStats => {
  const projectStats = getProjectStats();

  return {
    totalProjects: projectStats.total,
    totalVoices: mockVoices.length,
    totalDuration: projectStats.totalDuration,
    monthlyUsage: 85, // Percentage of monthly quota used
  };
};

// Get recent activity (recent projects with additional metadata)
export const getRecentActivity = (limit: number = 5) => {
  return mockProjects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(project => ({
      ...project,
      timeAgo: getTimeAgo(project.createdAt),
      statusColor: getStatusColor(project.status),
    }));
};

// Helper function to calculate time ago
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-400';
    case 'processing':
      return 'text-yellow-400';
    case 'draft':
      return 'text-gray-400';
    case 'failed':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

// Usage statistics for charts/graphs (mock data)
export const getUsageStats = () => {
  return {
    daily: [
      { date: '2024-01-01', projects: 2, duration: 45 },
      { date: '2024-01-02', projects: 1, duration: 30 },
      { date: '2024-01-03', projects: 3, duration: 75 },
      { date: '2024-01-04', projects: 0, duration: 0 },
      { date: '2024-01-05', projects: 4, duration: 120 },
      { date: '2024-01-06', projects: 2, duration: 60 },
      { date: '2024-01-07', projects: 1, duration: 25 },
    ],
    weekly: [
      { week: 'Week 1', projects: 8, duration: 240 },
      { week: 'Week 2', projects: 12, duration: 360 },
      { week: 'Week 3', projects: 6, duration: 180 },
      { week: 'Week 4', projects: 15, duration: 450 },
    ],
    monthly: [
      { month: 'Nov', projects: 25, duration: 750 },
      { month: 'Dec', projects: 32, duration: 960 },
      { month: 'Jan', projects: 41, duration: 1230 },
    ],
  };
};

// Popular voices (most used in projects)
export const getPopularVoices = (limit: number = 3) => {
  const voiceUsage = mockProjects.reduce(
    (acc, project) => {
      acc[project.voice] = (acc[project.voice] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(voiceUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([voiceName, count]) => {
      const voice = mockVoices.find(v => v.name === voiceName);
      return {
        voice: voice || { name: voiceName, avatar: '🎤', color: 'bg-gray-500' },
        usageCount: count,
      };
    });
};

// Greeting message based on time of day
export const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};
