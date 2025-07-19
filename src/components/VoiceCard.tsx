/**
 * VoiceCard Component - Reusable card for voice library items
 *
 * React Concepts Demonstrated:
 * - Props interface with TypeScript for complex data structures
 * - Custom hook consumption (useAudio)
 * - Conditional rendering based on audio state
 * - Event handlers for audio playback
 * - Dynamic styling with template literals
 * - Component composition with metadata display
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue component with props
 * - Props interface = defineProps<VoiceCardProps>()
 * - useAudio = inject() or useStore() from Pinia
 * - Conditional rendering = v-if/v-show directives
 * - Event handlers = @click methods
 * - Dynamic styling = :class bindings
 */

import { useAudio } from '../context/AudioContext';
import { Voice } from '../types';
import { memo } from 'react';

interface VoiceCardProps {
  voice: Voice;
  onPlay?: (voice: Voice) => void;
  onUse?: (voice: Voice) => void;
  showMetadata?: boolean;
  compact?: boolean;
  className?: string;
}

const VoiceCard = ({
  voice,
  onPlay,
  onUse,
  showMetadata = true,
  compact = false,
  className = '',
}: VoiceCardProps): React.JSX.Element => {
  const { audioState } = useAudio();

  const isCurrentTrack = audioState.currentTrack === voice.id;
  const isPlaying = isCurrentTrack && audioState.isPlaying;

  const handlePlay = () => {
    if (onPlay) {
      onPlay(voice);
    }
  };

  const handleUse = () => {
    if (onUse) {
      onUse(voice);
    }
  };

  if (compact) {
    return (
      <div
        className={`flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors ${className}`}
      >
        <div className={`w-10 h-10 ${voice.color} rounded-full flex items-center justify-center`}>
          <span className="text-white">{voice.avatar}</span>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium">{voice.name}</h4>
          <p className="text-gray-400 text-sm">
            {voice.type || `${voice.gender}, ${voice.language}`}
          </p>
        </div>
        {onPlay && (
          <button
            onClick={handlePlay}
            className={`p-2 rounded-full transition-colors ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 ${className}`}
    >
      {/* Voice Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 ${voice.color} rounded-full flex items-center justify-center`}>
          <span className="text-white text-xl">{voice.avatar}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold">{voice.name}</h3>
          <p className="text-gray-400 text-sm">
            {voice.type || `${voice.gender}, ${voice.language}`}
          </p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(voice.category)}`}>
          {voice.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{voice.description}</p>

      {/* Metadata */}
      {showMetadata && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Language:</span>
            <span className="text-white">{voice.language}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Gender:</span>
            <span className="text-white">{voice.gender}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Age:</span>
            <span className="text-white">{voice.age}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Use Case:</span>
            <span className="text-white">{voice.useCase}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {onPlay && (
          <button
            onClick={handlePlay}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isPlaying ? <>⏸️ Stop</> : <>▶️ Preview</>}
          </button>
        )}
        {onUse && (
          <button
            onClick={handleUse}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Use
          </button>
        )}
      </div>
    </div>
  );
};

// Helper function to get category colors
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'premade':
      return 'bg-blue-600/20 text-blue-400';
    case 'cloned':
      return 'bg-orange-600/20 text-orange-400';
    case 'generated':
      return 'bg-cyan-600/20 text-cyan-400';
    default:
      return 'bg-gray-600/20 text-gray-400';
  }
};

// Vue equivalent: No direct equivalent, but similar to computed props optimization
export default memo(VoiceCard);
