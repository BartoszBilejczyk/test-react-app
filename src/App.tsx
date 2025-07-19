/**
 * Main App Component - Root component that sets up routing and global state
 *
 * React Concepts Demonstrated:
 * - Functional Components with TypeScript
 * - React Router for client-side routing
 * - Context API for global state management
 * - Component composition and layout structure
 *
 * Vue.js Equivalent Mapping:
 * - This would be your main App.vue component
 * - BrowserRouter = Vue Router (router-view)
 * - AudioProvider = provide/inject or Pinia store
 * - Routes/Route = router configuration in router/index.js
 * - Component imports = similar to Vue component imports
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AudioProvider } from './context/AudioContext';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Lazy load pages for code splitting and better performance
// Vue equivalent: defineAsyncComponent() or dynamic imports in router
const Dashboard = lazy(() => import('./pages/Dashboard'));
const TextToSpeech = lazy(() => import('./pages/TextToSpeech'));
const VoiceLibrary = lazy(() => import('./pages/VoiceLibrary'));
const Projects = lazy(() => import('./pages/Projects'));
const Playground = lazy(() => import('./pages/Playground'));

// Component that uses keyboard shortcuts inside Router context
function AppContent(): React.JSX.Element {
  // Vue equivalent: useKeyboardShortcuts() composable in setup()
  // This must be called inside Router context for useNavigate to work
  useKeyboardShortcuts();

  return (
    <>
      {/* Vue equivalent: <div class="min-h-screen bg-gray-900 text-white flex"> */}
      <div className="min-h-screen bg-gray-900 text-white flex">
        {/* Vue equivalent: <Sidebar /> component */}
        <Sidebar />
        {/* Vue equivalent: <main class="flex-1 overflow-hidden"> */}
        <main className="flex-1 overflow-hidden">
          {/* Vue equivalent: Routes defined in router/index.js with lazy loading */}
          <Suspense
            fallback={
              <div className="h-screen flex items-center justify-center bg-gray-900">
                <LoadingSpinner size="lg" text="Loading page..." />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/text-to-speech" element={<TextToSpeech />} />
              <Route path="/voice-library" element={<VoiceLibrary />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/playground" element={<Playground />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </>
  );
}

function App(): React.JSX.Element {
  return (
    // Vue equivalent: <template> with provide() for global state and error handling
    <ErrorBoundary>
      <ToastProvider>
        <AudioProvider>
          {/* Vue equivalent: <router-view /> with Vue Router setup */}
          <Router>
            <AppContent />
          </Router>
        </AudioProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
