/**
 * VoiceLibrary Page Component - Browse and manage voice collection
 *
 * React Concepts Demonstrated:
 * - Multiple useState for search and filter state
 * - Array filtering with computed values
 * - Search functionality with controlled inputs
 * - Category filtering with state management
 * - Grid layout for voice cards
 * - Audio playback integration
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue page component
 * - useState = ref() for search and filter state
 * - Array filtering = computed() properties
 * - Search functionality = v-model with watchers
 * - Category filtering = reactive state with computed
 * - Grid layout = template with CSS Grid classes
 * - Audio integration = inject() or store usage
 */

import { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { useApi, useSearch } from '../hooks/useApi';
import { fetchVoices, fetchVoiceCategories, searchVoicesApi } from '../api/apiUtils';
import { SkeletonVoiceGrid, SkeletonPageHeader } from '../components/SkeletonLoader';
import { LoadingError, EmptyVoiceLibrary, EmptySearchResults } from '../components/ErrorDisplay';
import { useToastHelpers } from '../components/Toast';
import VoiceCard from '../components/VoiceCard';

const VoiceLibrary = (): React.JSX.Element => {
  // Vue equivalent: const selectedCategory = ref('all')
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Vue equivalent: const audioStore = useAudioStore()
  const { playTrack } = useAudio();

  // Toast notifications
  const { success, error } = useToastHelpers();

  // Fetch voices and categories
  const {
    data: voices,
    loading: voicesLoading,
    error: voicesError,
    refetch: refetchVoices,
  } = useApi(fetchVoices);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useApi(fetchVoiceCategories);

  // Search functionality
  const {
    query: searchTerm,
    setQuery: setSearchTerm,
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    clearSearch,
  } = useSearch(query => searchVoicesApi(query, selectedCategory));

  // Handle audio playback with error handling
  const handlePlaySample = async (voice: any) => {
    try {
      if (voice.audioUrl) {
        playTrack(voice.audioUrl, voice.id);
        success('Playing voice sample', `Now playing ${voice.name}`);
      } else {
        error('Audio not available', 'This voice sample is not available for preview');
      }
    } catch (err) {
      error('Playback failed', 'Unable to play the voice sample');
    }
  };

  // Determine which voices to display
  const displayVoices = searchTerm ? searchResults : voices || [];

  // Filter by category if not searching
  const filteredVoices = searchTerm
    ? displayVoices
    : displayVoices.filter(
        voice => selectedCategory === 'all' || voice.category === selectedCategory,
      );

  // Show loading state
  if (voicesLoading || categoriesLoading) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6 space-y-8">
          <SkeletonPageHeader />
          <SkeletonVoiceGrid count={6} />
        </div>
      </div>
    );
  }

  // Show error state
  if (voicesError || categoriesError) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6">
          <LoadingError onRetry={refetchVoices} />
        </div>
      </div>
    );
  }

  // Show empty state
  if (!voices || voices.length === 0) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6">
          <EmptyVoiceLibrary />
        </div>
      </div>
    );
  }

  // Show empty search results
  if (searchTerm && filteredVoices.length === 0) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6">
          <EmptySearchResults searchTerm={searchTerm} onClearSearch={clearSearch} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white">🎭</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Voice Library</h1>
            <p className="text-gray-400 text-sm">Browse and manage your voice collection</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search voices..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {(categories || []).map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Voice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVoices.map(voice => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              onPlay={handlePlaySample}
              onUse={voice => {
                success('Voice selected', `${voice.name} is ready to use`);
                // In a real app, this would navigate to text-to-speech with selected voice
                window.location.href = `/text-to-speech?voice=${voice.id}`;
              }}
              showMetadata={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceLibrary;
