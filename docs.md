# ✅ Project Title: VoiceCraft Dashboard (React App)

## 📋 Summary

Build a single-page React application simulating a voice AI platform dashboard (like ElevenLabs). The app features a modern dashboard interface with sidebar navigation and three main features: Text to Speech, Voice Library, and Projects. Each feature demonstrates React patterns including hooks, Context API, routing, and component composition with simulated voice playback functionality.

## 📦 Stack

- React (functional components + hooks)
- TypeScript
- Tailwind CSS
- React Router
- Context API for global audio state
- Mock data for voice content and audio clips

## 🧠 AI Agent Instructions

You will develop the app in **8 sequential phases**. After completing each phase:

- **Write a short but complete `README_phase_X.md`** file that explains what was implemented and how it works from a React perspective.
- This README will be passed as context into the next phase.

---

## 🛠️ Phase Breakdown

---

### Phase 1: Project Setup

**Goal**: Initialize a working React + Tailwind project with dashboard routing scaffolded.

**Tasks**:

- Create React app structure using Vite.
- Install and configure Tailwind CSS.
- Set up basic folder structure: `components/`, `pages/`, `context/`, `api/`, `assets/`, `types/`.
- Configure React Router with dashboard routes:
  - `/` → Dashboard (main dashboard page)
  - `/text-to-speech` → Text to Speech feature
  - `/voice-library` → Voice Library feature
  - `/projects` → Projects feature
- Add a sidebar navigation component.

**Deliverables**:

- Working routing with Tailwind-styled sidebar navigation.
- `README_phase_1.md`: Describe how routing, Tailwind setup, and project structure are done in React.

---

## Phase 1.1 Dashboard UI Design

**Goal**: Create a professional dashboard UI design with modern components and color palette.

**Tasks**:

- Design a modern dashboard layout with sidebar navigation.
- Create professional-looking components with consistent styling.
- Implement a dark theme with orange/purple accent colors.
- Design the main dashboard page with quick actions and recent items.
- Create placeholder pages for each feature (Text to Speech, Voice Library, Projects).
- Ensure responsive design for different screen sizes.

**Deliverables**:

- Professional dashboard UI design.
- Responsive sidebar navigation component.
- Modern dashboard homepage with quick actions grid.

Remember that the app must look professional for the recruitment process.

### Phase 1.2 - Typescript

**Goal**: Convert the app to Typescript.

**Tasks**:

- Convert the app to Typescript.
- Fix all errors.
- Add types to all files.
- Remember to use `tsx` extension for files and continue all next phases in Typescript.

**Deliverables**:

- Typescript app.
- `README_phase_1.2.md`: Describe how Typescript is done in React.

---

### Phase 2: Mock Data Setup

**Goal**: Create mock data structure for voice content and dashboard information.

**Tasks**:

- Create mock data files for:
  - Voice library entries (name, type, audio samples, metadata).
  - Text-to-speech voices and settings.
  - Project data and recent activity.
  - Dashboard statistics and recent items.
- Set up data utility functions in `api/` folder to simulate API calls.
- Integrate mock data into dashboard components.
- Display dynamic content on dashboard using fetched data.

**Deliverables**:

- Mock data structure for all features.
- Dashboard displaying dynamic content from mock data.
- `README_phase_2.md`: Describe data fetching with hooks and mock data integration.

---

### Phase 3: Feature Pages Implementation

**Goal**: Implement the three main feature pages with audio playback functionality.

**Tasks**:

- Build Text to Speech page:
  - Text input area with character count
  - Voice selection dropdown
  - Generate speech button and audio playback
- Build Voice Library page:
  - Grid/list view of available voices
  - Voice preview with play/pause buttons
  - Filter and search functionality
- Build Projects page:
  - List of user projects with metadata
  - Project creation and management interface
- Use HTML5 `<audio>` element for all audio playback.

**Deliverables**:

- Three fully functional feature pages.
- `README_phase_3.md`: Explain feature page implementation and audio rendering.

---

### Phase 4: Global Audio Context

**Goal**: Implement global audio state management using Context API.

**Tasks**:

- Create `AudioContext` to manage:
  - Current playing audio clip
  - Playback state (playing, paused, stopped)
  - Current playback time and duration
  - Volume control
  - Handlers for play, pause, stop, seek
- Ensure only one audio plays at a time across the entire app.
- Integrate context with all audio players in different features.

**Deliverables**:

- Global audio state management with Context API.
- Controlled playback across all dashboard features.
- `README_phase_4.md`: Explain React Context creation, usage, and how it maps to Vue provide/inject.

---

### Phase 5: Component Architecture Refinement

**Goal**: Extract and optimize reusable components across the dashboard.

**Tasks**:

- Create reusable components:
  - `<DashboardCard />` for dashboard quick actions
  - `<AudioPlayer />` for consistent audio playback UI
  - `<VoiceCard />` for voice library items
  - `<ProjectCard />` for project listings
  - `<PageHeader />` for consistent page headers
- Implement proper TypeScript interfaces for all component props.
- Ensure separation of concerns between logic and presentation.
- Optimize component composition and reusability.

**Deliverables**:

- Well-structured component architecture following React best practices.
- TypeScript interfaces for all components.
- `README_phase_6.md`: Explain component design, props, TypeScript usage, and how this compares to Vue SFCs.

---

### Phase 6: Error Handling and Loading States

**Goal**: Implement robust error handling and loading states throughout the dashboard.

**Tasks**:

- Add loading states for all data fetching operations:
  - Dashboard data loading with skeleton components
  - Voice library loading states
  - Audio loading and buffering indicators
- Implement error handling:
  - Network error handling for mock API calls
  - Audio playback error handling
  - Graceful fallbacks for missing data
- Add user feedback for all interactions:
  - Success/error notifications
  - Loading indicators for audio generation
  - Empty states for when no data is available

**Deliverables**:

- Comprehensive error handling and loading states.
- User-friendly feedback for all interactions.
- `README_phase_7.md`: Explain error handling patterns, loading states, and user feedback implementation.

---

### Phase 7: Final Polish and Production Readiness

**Goal**: Final improvements, optimizations, and deployment preparation.

**Tasks**:

- Add production-ready features:
  - Favicon and app metadata
  - SEO-friendly title tags and meta descriptions
  - Performance optimizations (lazy loading, code splitting)
- Enhance user experience:
  - Smooth animations and transitions
  - Audio waveform visualizations (CSS-based or canvas)
  - Keyboard shortcuts and accessibility improvements
- Prepare for deployment:
  - Build optimization
  - Environment configuration
  - Deployment to Netlify or Vercel
- Final code review and documentation.

**Deliverables**:

- Production-ready dashboard application.
- Deployment configuration and live demo.
- `README_phase_8.md`: Deployment guide, performance optimizations, and final architecture overview.
