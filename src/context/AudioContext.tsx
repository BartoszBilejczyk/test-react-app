/**
 * Audio Context - Global state management for audio playback
 *
 * React Concepts Demonstrated:
 * - Context API for global state management
 * - Custom hooks for context consumption
 * - useRef for DOM element references
 * - useState for reactive state management
 * - TypeScript interfaces for type safety
 *
 * Vue.js Equivalent Mapping:
 * - This would be a Pinia store or provide/inject pattern
 * - createContext = defineStore() in Pinia
 * - useContext = useStore() or inject()
 * - useState = ref() or reactive()
 * - useRef = ref() for template refs
 * - Provider = app.provide() in main.js
 */

import { createContext, useContext, useState, useRef, ReactNode } from 'react';

// Vue equivalent: interface for store state
interface AudioState {
  currentTrack: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

// Vue equivalent: interface for store actions/getters
interface AudioContextType {
  audioState: AudioState;
  playTrack: (trackUrl: string, trackId: string) => void;
  pauseTrack: () => void;
  stopTrack: () => void;
  setCurrentTime: (time: number) => void;
}

// Vue equivalent: defineStore() or createApp().provide()
const AudioContext = createContext<AudioContextType | undefined>(undefined);

/**
 * Custom hook to consume audio context
 * Vue equivalent: composable function or useStore() in Pinia
 */
export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

/**
 * Audio Provider Component - Provides global audio state to the app
 * Vue equivalent: Plugin setup in main.js or root component with provide()
 */
interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps): React.JSX.Element => {
  // Vue equivalent: ref() or reactive() for state management
  const [audioState, setAudioState] = useState<AudioState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  // Vue equivalent: ref() for template refs or DOM element references
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (trackUrl: string, trackId: string): void => {
    // If same track is playing, just pause/resume
    if (audioState.currentTrack === trackId && audioRef.current) {
      if (audioState.isPlaying) {
        audioRef.current.pause();
        setAudioState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioRef.current.play();
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      }
      return;
    }

    // Stop current track if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Create new audio element
    const audio = new Audio(trackUrl);
    audioRef.current = audio;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration,
      }));
    });

    audio.addEventListener('timeupdate', () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    });

    audio.addEventListener('ended', () => {
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }));
    });

    // Play the track
    audio.play();
    setAudioState({
      currentTrack: trackId,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    });
  };

  const pauseTrack = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const stopTrack = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioState({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    });
  };

  const setCurrentTime = (time: number): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setAudioState(prev => ({ ...prev, currentTime: time }));
    }
  };

  const contextValue: AudioContextType = {
    audioState,
    playTrack,
    pauseTrack,
    stopTrack,
    setCurrentTime,
  };

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};
