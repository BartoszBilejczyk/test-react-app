# VoiceCraft Dashboard

A modern, production-ready React application showcasing AI voice generation capabilities. Built with React 19, TypeScript, and Vite, this dashboard demonstrates advanced React patterns, component architecture, and professional development practices.

## 🎯 Project Overview

VoiceCraft Dashboard is a comprehensive voice AI platform interface featuring:

- **Text-to-Speech Generation** with voice selection and character counting
- **Voice Library Management** with search, filtering, and audio preview
- **Project Management** with grid/list views and status tracking
- **Playground Features** including video dubbing with file upload
- **Real-time Audio Playback** with global state management

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** 9+ or **yarn** 1.22+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd test-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5174`

## 📋 Available Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build production bundle                  |
| `npm run preview`       | Preview production build locally         |
| `npm run lint`          | Run ESLint for code quality              |
| `npm run prettier`      | Format code with Prettier                |
| `npm run test`          | Run unit tests in watch mode             |
| `npm run test:run`      | Run tests once                           |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run test:ui`       | Open Vitest UI for interactive testing   |

## 🏗️ Architecture

### Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety and developer experience
- **Vite** - Fast build tool with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing with lazy loading
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities

### Project Structure

```
src/
├── api/                    # Mock API and data utilities
│   ├── mockVoices.ts      # Voice library data
│   ├── mockProjects.ts    # Project management data
│   ├── mockDashboard.ts   # Dashboard statistics
│   └── apiUtils.ts        # API simulation utilities
├── components/            # Reusable UI components
│   ├── DashboardCard.tsx  # Quick action cards
│   ├── VoiceCard.tsx      # Voice display component
│   ├── ProjectCard.tsx    # Project display component
│   ├── PageHeader.tsx     # Standardized page headers
│   ├── AudioPlayer.tsx    # Audio playback component
│   ├── ErrorBoundary.tsx  # Error handling boundary
│   ├── Toast.tsx          # Notification system
│   └── SkeletonLoader.tsx # Loading state components
├── context/               # React Context providers
│   └── AudioContext.tsx   # Global audio state
├── hooks/                 # Custom React hooks
│   ├── useApi.ts          # Data fetching hooks
│   └── useKeyboardShortcuts.ts # Accessibility features
├── pages/                 # Route components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── TextToSpeech.tsx   # TTS interface
│   ├── VoiceLibrary.tsx   # Voice management
│   ├── Projects.tsx       # Project management
│   └── Playground.tsx     # Experimental features
├── types/                 # TypeScript definitions
│   └── index.ts           # Shared interfaces
├── utils/                 # Utility functions
│   └── performance.ts     # Performance monitoring
└── test/                  # Testing utilities
    ├── setup.ts           # Test configuration
    └── test-utils.tsx     # Custom testing helpers
```

## 🎨 Features

### Core Functionality

- **Dashboard** - Real-time statistics, quick actions, recent activity
- **Text-to-Speech** - Voice selection, character counting, generation simulation
- **Voice Library** - Search, filtering, category management, audio preview
- **Projects** - CRUD operations, grid/list views, status tracking
- **Playground** - File upload, dubbing simulation, language selection

### Technical Features

- **Lazy Loading** - Code splitting for optimal performance
- **Error Boundaries** - Graceful error handling and recovery
- **Toast Notifications** - User feedback system
- **Keyboard Shortcuts** - Accessibility navigation (Alt+H/T/V/P/G)
- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Professional dark UI with orange accents

### Performance Optimizations

- **Bundle Splitting** - Vendor and UI component chunks
- **React.memo** - Component memoization for re-render optimization
- **Lazy Loading** - Route-based code splitting
- **Performance Monitoring** - Core Web Vitals tracking
- **Memory Management** - Proper cleanup and memory leak prevention

## 🧪 Testing

### Testing Strategy

The project uses **Vitest** and **React Testing Library** for comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Open interactive test UI
npm run test:ui
```

### Test Coverage

- **Unit Tests** - Utility functions and API helpers
- **Component Tests** - UI components with user interactions
- **Hook Tests** - Custom hooks with async operations
- **Integration Tests** - Component integration with context providers

### Example Test Structure

```typescript
// Component testing example
import { render, screen, fireEvent } from '../test/test-utils'
import DashboardCard from '../DashboardCard'

describe('DashboardCard', () => {
  it('should render with all required props', () => {
    render(<DashboardCard {...props} />)
    expect(screen.getByText('Feature Name')).toBeInTheDocument()
  })
})
```

## 🔧 Development

### Code Quality

- **ESLint** - Code linting with React-specific rules
- **Prettier** - Code formatting
- **TypeScript** - Strict type checking
- **Husky** - Git hooks for quality gates (if configured)

### Development Workflow

1. **Feature Development** - Create feature branch
2. **Testing** - Write tests for new functionality
3. **Code Review** - Ensure code quality and standards
4. **Integration** - Merge with proper testing

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_MOCK_API=true
```

## 📦 Build and Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Output

- **Optimized Bundle** - ~77KB gzipped
- **Code Splitting** - Vendor and UI chunks
- **Asset Optimization** - Images and fonts optimized
- **Source Maps** - Available for debugging (configurable)

### Deployment Options

- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **AWS S3 + CloudFront** - Scalable hosting
- **Docker** - Containerized deployment

## 🎯 React Patterns Demonstrated

### Modern React Patterns

- **Functional Components** with hooks
- **Custom Hooks** for reusable logic
- **Context API** for global state management
- **Error Boundaries** for error handling
- **Suspense** for lazy loading
- **React.memo** for performance optimization

### TypeScript Integration

- **Interface Definitions** for all data structures
- **Generic Components** for reusability
- **Strict Type Checking** throughout the application
- **Props Validation** with TypeScript interfaces

### Performance Best Practices

- **Code Splitting** with React.lazy()
- **Memoization** with useMemo and useCallback
- **Component Optimization** with React.memo
- **Bundle Analysis** and optimization

## 🔍 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For questions and support:

- **Documentation** - Check this README and inline code comments
- **Issues** - Create GitHub issues for bugs and feature requests
- **Discussions** - Use GitHub Discussions for questions

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
