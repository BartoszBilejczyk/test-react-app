// Comprehensive types for the VoiceCraft Dashboard React app

// Audio types for Context API
export interface AudioState {
  currentTrack: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export interface AudioContextType {
  audioState: AudioState;
  playTrack: (trackUrl: string, trackId: string) => void;
  pauseTrack: () => void;
  stopTrack: () => void;
  setCurrentTime: (time: number) => void;
}

// Voice types
export interface Voice {
  id: string;
  name: string;
  description: string;
  category: 'premade' | 'cloned' | 'generated';
  avatar: string;
  color: string;
  language: string;
  gender: 'Male' | 'Female' | 'Neutral';
  age: string;
  accent: string;
  useCase: string;
  audioUrl?: string;
  type?: string; // For backward compatibility
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  voice: string;
  duration: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'draft' | 'failed';
  type: 'text-to-speech' | 'voice-clone' | 'dubbing';
  thumbnail: string;
  color: string;
  audioUrl?: string;
}

// Dashboard types
export interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  href: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalVoices: number;
  totalDuration: string;
  monthlyUsage: number;
}

// Category types
export interface Category {
  id: string;
  name: string;
  count: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Loading and Error types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Feature types (legacy)
export interface Feature {
  name: string;
  slug: string;
  description: string;
  icon: string;
}
