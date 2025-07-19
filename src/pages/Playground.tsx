/**
 * Playground Page Component - Experimental features including dubbing
 *
 * React Concepts Demonstrated:
 * - Multiple feature tabs with state management
 * - File upload handling with drag and drop
 * - Form validation and submission
 * - Progress tracking for long operations
 * - Audio/video preview functionality
 * - Custom hooks for complex state management
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue component with multiple sections
 * - Tab state = ref() with reactive switching
 * - File upload = similar patterns with input handling
 * - Form validation = reactive validation with computed
 * - Progress tracking = ref() with watchers
 */

import { useState } from 'react';
import { useApi, useApiCall } from '../hooks/useApi';
import { fetchVoices, processDubbing } from '../api/apiUtils';
import { SkeletonVoiceSelector, SkeletonTextArea } from '../components/SkeletonLoader';
import { LoadingError, GenerationError } from '../components/ErrorDisplay';
import { useToastHelpers } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';

const Playground = (): React.JSX.Element => {
  // Vue equivalent: const activeTab = ref('dubbing')
  const [activeTab, setActiveTab] = useState<'dubbing' | 'effects' | 'experiments'>('dubbing');

  // Dubbing state
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Toast notifications
  const { success, error } = useToastHelpers();

  // Fetch available voices
  const {
    data: voices,
    loading: voicesLoading,
    error: voicesError,
    refetch: refetchVoices,
  } = useApi(fetchVoices);

  // Dubbing generation API call
  const {
    loading: isDubbing,
    error: dubbingError,
    execute: executeDubbing,
    reset: resetDubbing,
  } = useApiCall();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  ];

  const tabs = [
    {
      id: 'dubbing',
      name: 'Video Dubbing',
      icon: '🎬',
      description: 'Dub videos in different languages',
    },
    {
      id: 'effects',
      name: 'Voice Effects',
      icon: '🎛️',
      description: 'Apply effects to voice recordings',
    },
    {
      id: 'experiments',
      name: 'Experiments',
      icon: '🧪',
      description: 'Try experimental features',
    },
  ];

  // File upload handlers
  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
      setUploadedFile(file);
      success('File uploaded', `${file.name} is ready for dubbing`);
    } else {
      error('Invalid file type', 'Please upload a video or audio file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Dubbing generation handler
  const handleStartDubbing = async () => {
    if (!uploadedFile) {
      error('File required', 'Please upload a video or audio file first');
      return;
    }

    if (!selectedVoice) {
      error('Voice required', 'Please select a voice for dubbing');
      return;
    }

    if (sourceLanguage === targetLanguage) {
      error('Different languages required', 'Source and target languages must be different');
      return;
    }

    try {
      resetDubbing();
      const result = await executeDubbing(() =>
        processDubbing(uploadedFile, sourceLanguage, targetLanguage, selectedVoice),
      );

      success(
        'Dubbing completed',
        `Successfully dubbed ${uploadedFile.name} in ${result.processingTime}s`,
      );
    } catch (err) {
      error('Dubbing failed', 'Unable to process the dubbing. Please try again.');
    }
  };

  // Show loading state for voices
  if (voicesLoading) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <PageHeader
          title="Playground"
          description="Experiment with dubbing and voice effects"
          icon="🎬"
          iconColor="from-orange-500 to-orange-600"
        />
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
        <PageHeader
          title="Playground"
          description="Experiment with dubbing and voice effects"
          icon="🎬"
          iconColor="from-orange-500 to-orange-600"
        />
        <div className="p-6">
          <LoadingError onRetry={refetchVoices} />
        </div>
      </div>
    );
  }

  const availableVoices = voices || [];

  return (
    <div className="h-screen overflow-y-auto bg-gray-900">
      <PageHeader
        title="Playground"
        description="Experiment with dubbing and voice effects"
        icon="🎬"
        iconColor="from-orange-500 to-orange-600"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Playground' }]}
      />

      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dubbing' && (
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Upload Video/Audio File</h3>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-orange-500 bg-orange-500/10'
                    : uploadedFile
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                {uploadedFile ? (
                  <div>
                    <div className="text-4xl mb-4">✅</div>
                    <h4 className="text-white font-medium mb-2">{uploadedFile.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-orange-400 hover:text-orange-300 text-sm"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-4">📁</div>
                    <h4 className="text-white font-medium mb-2">Drop your file here</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      Supports MP4, MOV, AVI, MP3, WAV files
                    </p>
                    <label className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                      Choose File
                      <input
                        type="file"
                        accept="video/*,audio/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Language Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-4">Source Language</h3>
                <select
                  value={sourceLanguage}
                  onChange={e => setSourceLanguage(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-white font-semibold mb-4">Target Language</h3>
                <select
                  value={targetLanguage}
                  onChange={e => setTargetLanguage(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Voice Selection */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Select Voice for Dubbing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableVoices.slice(0, 3).map(voice => (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedVoice === voice.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div
                        className={`w-10 h-10 ${voice.color} rounded-full flex items-center justify-center`}
                      >
                        <span className="text-white">{voice.avatar}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{voice.name}</h4>
                        <p className="text-gray-400 text-sm">{voice.language}</p>
                      </div>
                    </div>
                    {selectedVoice === voice.id && (
                      <div className="text-orange-400 text-sm">✓ Selected</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {dubbingError && <GenerationError onRetry={() => resetDubbing()} />}

            {/* Start Dubbing Button */}
            <button
              onClick={handleStartDubbing}
              disabled={!uploadedFile || !selectedVoice || isDubbing}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isDubbing ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Processing Dubbing...</span>
                </>
              ) : (
                <>
                  <span>🎬</span>
                  <span>Start Dubbing</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Voice Effects Tab */}
        {activeTab === 'effects' && (
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <div className="text-6xl mb-4">🎛️</div>
            <h3 className="text-white font-semibold mb-2">Voice Effects</h3>
            <p className="text-gray-400 mb-6">
              Apply real-time effects to voice recordings. Coming soon!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Echo', 'Reverb', 'Pitch Shift', 'Robot Voice'].map(effect => (
                <div key={effect} className="bg-gray-700 rounded-lg p-4 opacity-50">
                  <div className="text-2xl mb-2">🎚️</div>
                  <div className="text-white text-sm">{effect}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiments Tab */}
        {activeTab === 'experiments' && (
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <div className="text-6xl mb-4">🧪</div>
            <h3 className="text-white font-semibold mb-2">Experimental Features</h3>
            <p className="text-gray-400 mb-6">
              Try cutting-edge voice AI features. These are experimental and may not work perfectly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Voice Morphing', icon: '🔄', desc: 'Blend multiple voices' },
                { name: 'Emotion Control', icon: '😊', desc: 'Add emotions to speech' },
                { name: 'Age Modification', icon: '👶', desc: 'Change apparent age' },
                { name: 'Accent Transfer', icon: '🌍', desc: 'Apply different accents' },
              ].map(feature => (
                <div key={feature.name} className="bg-gray-700 rounded-lg p-4 opacity-50">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <div className="text-white font-medium mb-1">{feature.name}</div>
                  <div className="text-gray-400 text-sm">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;
