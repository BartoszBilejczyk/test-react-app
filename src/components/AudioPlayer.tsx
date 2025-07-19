/**
 * AudioPlayer Component - Reusable audio player with progress tracking
 *
 * React Concepts Demonstrated:
 * - Props interface with TypeScript for type safety
 * - Custom hook consumption (useAudio)
 * - Computed values derived from props and context
 * - Event handlers for user interactions
 * - Conditional rendering based on state
 * - Dynamic styling with template literals
 * - Component composition and reusability
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue component with props
 * - Props interface = defineProps<AudioPlayerProps>()
 * - useAudio = inject() or useStore() from Pinia
 * - Computed values = computed() properties
 * - Event handlers = methods or function refs
 * - Conditional rendering = v-if/v-show directives
 * - Dynamic styling = :class or :style bindings
 */

import { useAudio } from '../context/AudioContext';

// Vue equivalent: defineProps<AudioPlayerProps>()
interface AudioPlayerProps {
  trackId: string;
  trackUrl: string;
  trackName: string;
  description?: string;
}

const AudioPlayer = ({
  trackId,
  trackUrl,
  trackName,
  description,
}: AudioPlayerProps): React.JSX.Element => {
  // Vue equivalent: const audioStore = useAudioStore() or inject('audio')
  const { audioState, playTrack, pauseTrack, stopTrack } = useAudio();

  // Vue equivalent: computed(() => audioState.currentTrack === trackId)
  const isCurrentTrack = audioState.currentTrack === trackId;
  const isPlaying = isCurrentTrack && audioState.isPlaying;

  // Vue equivalent: const handlePlayPause = () => { ... }
  const handlePlayPause = (): void => {
    if (isCurrentTrack && isPlaying) {
      pauseTrack();
    } else {
      playTrack(trackUrl, trackId);
    }
  };

  // Vue equivalent: method in methods object or function ref
  const handleStop = (): void => {
    stopTrack();
  };

  // Vue equivalent: utility function or computed property
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Vue equivalent: computed(() => audioState.duration > 0 ? ...)
  const progressPercentage =
    audioState.duration > 0 ? (audioState.currentTime / audioState.duration) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-all duration-200">
      {/* Track Info */}
      <div className="mb-3">
        <h4 className="font-semibold text-white">{trackName}</h4>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>

      {/* Progress Bar */}
      {isCurrentTrack && (
        <div className="mb-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(audioState.currentTime)}</span>
            <span>{formatTime(audioState.duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handlePlayPause}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            isPlaying
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {isCurrentTrack && (
          <button
            onClick={handleStop}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        )}

        <div className="flex-1">
          {isCurrentTrack && isPlaying && (
            <div className="flex items-center text-sm text-orange-400">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mr-2"></div>
              Now Playing
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
