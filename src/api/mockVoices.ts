/**
 * Mock Voice Data - Simulated voice library data
 *
 * React Concepts Demonstrated:
 * - TypeScript interfaces for data structure
 * - Mock data organization and export
 * - Centralized data management
 *
 * Vue.js Equivalent Mapping:
 * - This would be similar to a data service or store module
 * - Export pattern = similar to Vue composables or store modules
 * - TypeScript interfaces = same in Vue 3 with TypeScript
 */

import { Voice, Category } from '../types';

// Mock audio URLs for demonstration
const MOCK_AUDIO_URLS = {
  'sara-martin': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  'avatar-franco': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  'diego-martin': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  'tatiana-martin': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  'my-voice-clone': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
  'ai-generated': 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
};

export const mockVoices: Voice[] = [
  {
    id: 'sara-martin',
    name: 'Sara Martin',
    description: 'Middle aged Spanish-Castilian female with a warm, professional tone',
    category: 'premade',
    avatar: '👩',
    color: 'bg-blue-500',
    language: 'Spanish',
    gender: 'Female',
    age: 'Middle-aged',
    accent: 'Castilian',
    useCase: 'Narration, Professional',
    audioUrl: MOCK_AUDIO_URLS['sara-martin'],
    type: 'Female, Spanish-Castilian',
  },
  {
    id: 'avatar-franco',
    name: 'Avatar Franco',
    description: 'Middle-aged male with a high tone. Suitable for energetic content',
    category: 'premade',
    avatar: '👨',
    color: 'bg-green-500',
    language: 'English',
    gender: 'Male',
    age: 'Middle-aged',
    accent: 'American',
    useCase: 'Commercials, Energetic',
    audioUrl: MOCK_AUDIO_URLS['avatar-franco'],
    type: 'Male, High tone',
  },
  {
    id: 'diego-martin',
    name: 'Diego Martin',
    description: 'Young Spanish Masculine Male with clear pronunciation',
    category: 'premade',
    avatar: '👦',
    color: 'bg-purple-500',
    language: 'Spanish',
    gender: 'Male',
    age: 'Young',
    accent: 'Spanish',
    useCase: 'Youth Content, Education',
    audioUrl: MOCK_AUDIO_URLS['diego-martin'],
    type: 'Male, Young Spanish',
  },
  {
    id: 'tatiana-martin',
    name: 'Tatiana Martin',
    description: 'Middle aged female with neutral Spanish accent, perfect for corporate content',
    category: 'premade',
    avatar: '👩‍🦰',
    color: 'bg-pink-500',
    language: 'Spanish',
    gender: 'Female',
    age: 'Middle-aged',
    accent: 'Neutral Spanish',
    useCase: 'Corporate, Training',
    audioUrl: MOCK_AUDIO_URLS['tatiana-martin'],
    type: 'Middle aged female, Neutral Spanish',
  },
  {
    id: 'my-voice-clone',
    name: 'My Voice Clone',
    description: 'Personal voice clone created from audio samples',
    category: 'cloned',
    avatar: '🎭',
    color: 'bg-orange-500',
    language: 'English',
    gender: 'Male',
    age: 'Adult',
    accent: 'Custom',
    useCase: 'Personal Projects',
    audioUrl: MOCK_AUDIO_URLS['my-voice-clone'],
  },
  {
    id: 'ai-generated',
    name: 'AI Generated Voice',
    description: 'Custom voice generated from text description',
    category: 'generated',
    avatar: '🤖',
    color: 'bg-cyan-500',
    language: 'English',
    gender: 'Neutral',
    age: 'Ageless',
    accent: 'Synthetic',
    useCase: 'Experimental',
    audioUrl: MOCK_AUDIO_URLS['ai-generated'],
  },
];

export const mockVoiceCategories: Category[] = [
  { id: 'all', name: 'All Voices', count: mockVoices.length },
  {
    id: 'premade',
    name: 'Premade',
    count: mockVoices.filter(v => v.category === 'premade').length,
  },
  { id: 'cloned', name: 'Cloned', count: mockVoices.filter(v => v.category === 'cloned').length },
  {
    id: 'generated',
    name: 'Generated',
    count: mockVoices.filter(v => v.category === 'generated').length,
  },
];

// Helper function to get voices by category
export const getVoicesByCategory = (categoryId: string): Voice[] => {
  if (categoryId === 'all') {
    return mockVoices;
  }
  return mockVoices.filter(voice => voice.category === categoryId);
};

// Helper function to search voices
export const searchVoices = (query: string, categoryId: string = 'all'): Voice[] => {
  const voices = getVoicesByCategory(categoryId);
  if (!query.trim()) {
    return voices;
  }

  const searchTerm = query.toLowerCase();
  return voices.filter(
    voice =>
      voice.name.toLowerCase().includes(searchTerm) ||
      voice.description.toLowerCase().includes(searchTerm) ||
      voice.language.toLowerCase().includes(searchTerm) ||
      voice.useCase.toLowerCase().includes(searchTerm),
  );
};

// Helper function to get voice by ID
export const getVoiceById = (id: string): Voice | undefined => {
  return mockVoices.find(voice => voice.id === id);
};
