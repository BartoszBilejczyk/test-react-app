/**
 * TextToSpeech Page Component - Text-to-speech generation interface
 *
 * React Concepts Demonstrated:
 * - Multiple useState hooks for form state management
 * - Custom hook consumption for global state
 * - Async/await for simulated API calls
 * - Form handling with controlled inputs
 * - Loading states and user feedback
 * - Array mapping for dynamic options
 * - Event handlers for form interactions
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue page component
 * - useState = ref() for reactive form data
 * - useAudio = inject() or useStore() from Pinia
 * - Async functions = same syntax in Vue 3
 * - Form handling = v-model for two-way binding
 * - Loading states = ref() boolean values
 * - Array mapping = v-for directive
 * - Event handlers = @click, @input methods
 */

import { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { useApi, useApiCall } from '../hooks/useApi';
import { fetchVoices, generateSpeech } from '../api/apiUtils';
import { SkeletonVoiceSelector, SkeletonTextArea } from '../components/SkeletonLoader';
import { LoadingError, GenerationError } from '../components/ErrorDisplay';
import { useToastHelpers } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const TextToSpeech = (): React.JSX.Element => {
  // Vue equivalent: const text = ref('')
  const [text, setText] = useState('');

  // Vue equivalent: const selectedVoice = ref('sara-martin')
  const [selectedVoice, setSelectedVoice] = useState('sara-martin');

  // Vue equivalent: const audioStore = useAudioStore()
  const { audioState, playTrack, pauseTrack } = useAudio();

  // Toast notifications
  const { success, error } = useToastHelpers();

  // Fetch available voices
  const {
    data: voices,
    loading: voicesLoading,
    error: voicesError,
    refetch: refetchVoices,
  } = useApi(fetchVoices);

  // Speech generation API call
  const {
    loading: isGenerating,
    error: generationError,
    execute: executeGeneration,
    reset: resetGeneration,
  } = useApiCall();

  // Vue equivalent: const handleGenerate = async () => { ... }
  const handleGenerate = async () => {
    if (!text.trim()) {
      error('Input required', 'Please enter some text to generate speech');
      return;
    }

    if (!selectedVoice) {
      error('Voice required', 'Please select a voice for speech generation');
      return;
    }

    try {
      resetGeneration();
      const result = await executeGeneration(() => generateSpeech(text, selectedVoice));

      if (result.audioUrl) {
        playTrack(result.audioUrl, 'generated-speech');
        success('Speech generated successfully', `Generated ${result.duration}s of audio`);
      }
    } catch (err) {
      error('Generation failed', 'Unable to generate speech. Please try again.');
    }
  };

  // Show loading state for voices
  if (voicesLoading) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6 space-y-8">
          <SkeletonTextArea />
          <SkeletonVoiceSelector />
        </div>
      </div>
    );
  }

  // Show error state for voices
  if (voicesError) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6">
          <LoadingError onRetry={refetchVoices} />
        </div>
      </div>
    );
  }

  // Get available voices for selection (filter to TTS-suitable voices)
  const availableVoices = (voices || []).slice(0, 3); // Limit to first 3 for TTS

  return (
    <div className="h-screen overflow-y-auto bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white">🎤</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Text to Speech</h1>
            <p className="text-gray-400 text-sm">Convert your text into natural-sounding speech</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Text Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Enter your text</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400 text-sm">{text.length}/1000 characters</span>
                <button
                  onClick={() => setText('')}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Error Display */}
            {generationError && <GenerationError onRetry={() => resetGeneration()} />}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!text.trim() || isGenerating}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>🎵</span>
                  <span>Generate Speech</span>
                </>
              )}
            </button>

            {/* Audio Player */}
            {audioState.currentTrack && (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={
                        audioState.isPlaying
                          ? pauseTrack
                          : () => playTrack(audioState.currentTrack!, 'generated-speech')
                      }
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      {audioState.isPlaying ? (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <div>
                      <p className="text-white font-medium">Generated Speech</p>
                      <p className="text-gray-400 text-sm">
                        Using {availableVoices.find(v => v.id === selectedVoice)?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {Math.floor(audioState.currentTime)}s / {Math.floor(audioState.duration)}s
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Voice Selection Section */}
          <div>
            <label className="block text-white font-medium mb-3">Select Voice</label>
            <div className="space-y-3">
              {availableVoices.map(voice => (
                <div
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedVoice === voice.id
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 ${voice.color} rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white">{voice.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{voice.name}</h4>
                      <p className="text-gray-400 text-sm">{voice.type}</p>
                    </div>
                    {selectedVoice === voice.id && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Voice Settings */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-gray-400 text-xs mt-1">
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>2x</span>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Stability</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.5"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-gray-400 text-xs mt-1">
                  <span>Variable</span>
                  <span>Stable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
