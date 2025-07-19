import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AudioPlayer from '../components/AudioPlayer';

interface FeatureData {
  title: string;
  description: string;
  icon: string;
  details: string[];
  audioSamples: AudioSample[];
  reactConcept: string;
  conceptDescription: string;
}

interface AudioSample {
  id: string;
  name: string;
  description: string;
  url: string;
}

const FeatureDetail = (): React.JSX.Element => {
  const { featureName } = useParams<{ featureName: string }>();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state to demonstrate useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [featureName]);

  // Mock data for the 3 core features
  const featureData: Record<string, FeatureData> = {
    'text-to-speech': {
      title: 'Text-to-Speech',
      description:
        'Convert text to speech with natural-sounding AI voices. This feature demonstrates React hooks like useState and useEffect for managing component state and lifecycle.',
      icon: '🎤',
      details: [
        'Natural-sounding voice synthesis',
        'Multiple voice options',
        'Real-time text processing',
        'Customizable speech parameters',
      ],
      audioSamples: [
        {
          id: 'tts-1',
          name: 'Female Voice - Professional',
          description: 'Clear, professional female voice perfect for business content',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        },
        {
          id: 'tts-2',
          name: 'Male Voice - Casual',
          description: 'Friendly male voice ideal for casual conversations',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        },
      ],
      reactConcept: 'React Hooks & Component Lifecycle',
      conceptDescription:
        'This feature uses useState for managing loading states and useEffect for simulating data fetching and cleanup.',
    },
    'voice-cloning': {
      title: 'Voice Cloning',
      description:
        'Create realistic voice clones from audio samples. This feature showcases React Router with dynamic routing and the useParams hook.',
      icon: '👤',
      details: [
        'High-quality voice replication',
        'Minimal training data required',
        'Preserves emotional characteristics',
        'Multiple language support',
      ],
      audioSamples: [
        {
          id: 'clone-1',
          name: 'Original Voice Sample',
          description: 'The source voice used for cloning',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        },
        {
          id: 'clone-2',
          name: 'Cloned Voice Result',
          description: 'The AI-generated clone of the original voice',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        },
      ],
      reactConcept: 'React Router & Dynamic Routes',
      conceptDescription:
        'Demonstrates useParams hook to extract route parameters and render different content based on the URL.',
    },
    dubbing: {
      title: 'Dubbing',
      description:
        'Dub videos into multiple languages while preserving voice characteristics. This feature demonstrates the Context API for global audio state management.',
      icon: '🎬',
      details: [
        'Automatic language translation',
        'Voice characteristic preservation',
        'Lip-sync optimization',
        'Batch processing support',
      ],
      audioSamples: [
        {
          id: 'dub-1',
          name: 'English Original',
          description: 'Original English audio track',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        },
        {
          id: 'dub-2',
          name: 'Spanish Dub',
          description: 'AI-dubbed Spanish version maintaining original voice',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        },
        {
          id: 'dub-3',
          name: 'French Dub',
          description: 'AI-dubbed French version with voice preservation',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        },
      ],
      reactConcept: 'Context API & Global State',
      conceptDescription:
        'Uses React Context to manage global audio playback state, ensuring only one audio plays at a time across the entire app.',
    },
  };

  const feature = featureName ? featureData[featureName] : undefined;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Feature Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The requested feature could not be found. Let's get you back to exploring our features.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Features
        </Link>
      </div>

      {/* Feature Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-6">{feature.icon}</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{feature.title}</h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* React Concept Highlight */}
      <div className="bg-blue-50 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          React Concept: {feature.reactConcept}
        </h2>
        <p className="text-gray-700 leading-relaxed">{feature.conceptDescription}</p>
      </div>

      {/* Feature Details */}
      <div className="bg-white rounded-xl p-8 mb-12 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feature.details.map((detail, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mt-1">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Samples Section */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Audio Samples</h2>
        <p className="text-center text-gray-600 mb-8">
          Try the interactive audio player below. Notice how the Context API manages global playback
          state - only one audio can play at a time across the entire app!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feature.audioSamples.map(sample => (
            <AudioPlayer
              key={sample.id}
              trackId={sample.id}
              trackUrl={sample.url}
              trackName={sample.name}
              description={sample.description}
            />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <div className="inline-flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Explore More Features
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetail;
