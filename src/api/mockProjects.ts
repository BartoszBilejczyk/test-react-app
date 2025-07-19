/**
 * Mock Project Data - Simulated project data for dashboard
 *
 * React Concepts Demonstrated:
 * - TypeScript interfaces for complex data structures
 * - Date handling and formatting
 * - Array filtering and sorting utilities
 * - Mock data with realistic project scenarios
 *
 * Vue.js Equivalent Mapping:
 * - Similar to Vue store modules or composables
 * - Data organization = same patterns in Vue
 * - Helper functions = Vue composables or utils
 */

import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'podcast-intro',
    name: 'Podcast Intro',
    description: 'Welcome message for tech podcast',
    voice: 'Sara Martin',
    duration: '0:45',
    createdAt: '2024-01-15',
    status: 'completed',
    type: 'text-to-speech',
    thumbnail: '🎙️',
    color: 'bg-blue-500',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 'product-demo',
    name: 'Product Demo Narration',
    description: 'Voice-over for product demonstration video',
    voice: 'Avatar Franco',
    duration: '2:30',
    createdAt: '2024-01-14',
    status: 'completed',
    type: 'text-to-speech',
    thumbnail: '📱',
    color: 'bg-green-500',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 'audiobook-chapter',
    name: 'Audiobook Chapter 1',
    description: 'First chapter of science fiction novel',
    voice: 'Diego Martin',
    duration: '15:20',
    createdAt: '2024-01-12',
    status: 'processing',
    type: 'text-to-speech',
    thumbnail: '📚',
    color: 'bg-purple-500',
  },
  {
    id: 'commercial-ad',
    name: 'Radio Commercial',
    description: 'Advertisement for local business',
    voice: 'Tatiana Martin',
    duration: '0:30',
    createdAt: '2024-01-10',
    status: 'completed',
    type: 'voice-clone',
    thumbnail: '📻',
    color: 'bg-pink-500',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 'training-module',
    name: 'Training Module',
    description: 'Corporate training narration',
    voice: 'My Voice Clone',
    duration: '8:15',
    createdAt: '2024-01-08',
    status: 'draft',
    type: 'voice-clone',
    thumbnail: '🎓',
    color: 'bg-orange-500',
  },
  {
    id: 'documentary-narration',
    name: 'Documentary Narration',
    description: 'Nature documentary voice-over',
    voice: 'Sara Martin',
    duration: '45:30',
    createdAt: '2024-01-05',
    status: 'completed',
    type: 'text-to-speech',
    thumbnail: '🌿',
    color: 'bg-emerald-500',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
  {
    id: 'game-character',
    name: 'Game Character Voice',
    description: 'RPG character dialogue and narration',
    voice: 'AI Generated Voice',
    duration: '12:45',
    createdAt: '2024-01-03',
    status: 'failed',
    type: 'text-to-speech',
    thumbnail: '🎮',
    color: 'bg-red-500',
  },
  {
    id: 'meditation-guide',
    name: 'Meditation Guide',
    description: 'Calming meditation session narration',
    voice: 'Tatiana Martin',
    duration: '20:00',
    createdAt: '2024-01-01',
    status: 'completed',
    type: 'text-to-speech',
    thumbnail: '🧘',
    color: 'bg-indigo-500',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  },
];

// Helper functions for project management
export const getProjectsByStatus = (status: Project['status']): Project[] => {
  return mockProjects.filter(project => project.status === status);
};

export const getProjectsByType = (type: Project['type']): Project[] => {
  return mockProjects.filter(project => project.type === type);
};

export const getRecentProjects = (limit: number = 5): Project[] => {
  return mockProjects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const searchProjects = (query: string): Project[] => {
  if (!query.trim()) {
    return mockProjects;
  }

  const searchTerm = query.toLowerCase();
  return mockProjects.filter(
    project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.voice.toLowerCase().includes(searchTerm) ||
      project.type.toLowerCase().includes(searchTerm),
  );
};

export const sortProjects = (projects: Project[], sortBy: string): Project[] => {
  switch (sortBy) {
    case 'recent':
      return projects.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'name':
      return projects.sort((a, b) => a.name.localeCompare(b.name));
    case 'duration':
      return projects.sort((a, b) => {
        const getDurationInSeconds = (duration: string) => {
          const parts = duration.split(':');
          return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        };
        return getDurationInSeconds(b.duration) - getDurationInSeconds(a.duration);
      });
    case 'status':
      return projects.sort((a, b) => a.status.localeCompare(b.status));
    default:
      return projects;
  }
};

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

// Project statistics
export const getProjectStats = () => {
  const total = mockProjects.length;
  const completed = getProjectsByStatus('completed').length;
  const processing = getProjectsByStatus('processing').length;
  const draft = getProjectsByStatus('draft').length;
  const failed = getProjectsByStatus('failed').length;

  const totalDuration = mockProjects.reduce((acc, project) => {
    const parts = project.duration.split(':');
    const minutes = parseInt(parts[0]);
    const seconds = parseInt(parts[1]);
    return acc + minutes * 60 + seconds;
  }, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return {
    total,
    completed,
    processing,
    draft,
    failed,
    totalDuration: `${hours}h ${minutes}m`,
    completionRate: Math.round((completed / total) * 100),
  };
};
