import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { fetchProjects } from '../api/apiUtils';
import { SkeletonProjectsList, SkeletonPageHeader } from '../components/SkeletonLoader';
import { LoadingError, EmptyProjects } from '../components/ErrorDisplay';
import { useToastHelpers } from '../components/Toast';
import ProjectCard from '../components/ProjectCard';
import { useAudio } from '../context/AudioContext';

const Projects = (): React.JSX.Element => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');

  // Toast notifications
  const { success, error } = useToastHelpers();

  // Audio context for playback
  const { playTrack } = useAudio();

  // Fetch projects from API
  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useApi(fetchProjects);

  // Show loading state
  if (projectsLoading) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6 space-y-8">
          <SkeletonPageHeader />
          <SkeletonProjectsList count={5} />
        </div>
      </div>
    );
  }

  // Show error state
  if (projectsError) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6">
          <LoadingError onRetry={refetchProjects} />
        </div>
      </div>
    );
  }

  // Show empty state
  if (!projects || projects.length === 0) {
    return (
      <div className="h-screen overflow-y-auto bg-gray-900">
        <div className="p-6">
          <EmptyProjects onCreateProject={() => (window.location.href = '/text-to-speech')} />
        </div>
      </div>
    );
  }

  // Project action handlers
  const handlePlayProject = (project: any) => {
    if (project.audioUrl) {
      playTrack(project.audioUrl, project.id);
      success('Playing project', `Now playing ${project.name}`);
    } else {
      error('Audio not available', 'This project audio is not available');
    }
  };

  const handleEditProject = (project: any) => {
    success('Edit project', `Opening ${project.name} for editing`);
    // In a real app, this would navigate to edit page
  };

  const handleDownloadProject = (project: any) => {
    success('Download started', `Downloading ${project.name}`);
    // In a real app, this would trigger download
  };

  const sortedProjects = [...(projects || [])].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'duration':
        return b.duration.localeCompare(a.duration);
      default:
        return 0;
    }
  });

  return (
    <div className="h-screen overflow-y-auto bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white">📁</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Projects</h1>
              <p className="text-gray-400 text-sm">Manage your voice projects and history</p>
            </div>
          </div>
          <Link
            to="/text-to-speech"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            + New Project
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Content */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode="grid"
                onPlay={handlePlayProject}
                onEdit={handleEditProject}
                onDownload={handleDownloadProject}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode="list"
                onPlay={handlePlayProject}
                onEdit={handleEditProject}
                onDownload={handleDownloadProject}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-white font-semibold mb-2">No projects yet</h3>
            <p className="text-gray-400 mb-4">Create your first voice project to get started</p>
            <Link
              to="/text-to-speech"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              + Create Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
