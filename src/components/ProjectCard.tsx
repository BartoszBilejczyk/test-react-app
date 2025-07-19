/**
 * ProjectCard Component - Reusable card for project listings
 *
 * React Concepts Demonstrated:
 * - Props interface with TypeScript for project data
 * - Conditional rendering based on project status
 * - Event handlers for project actions
 * - Dynamic styling with status-based colors
 * - Date formatting and time calculations
 * - Component composition with metadata
 *
 * Vue.js Equivalent Mapping:
 * - This would be a .vue component with props
 * - Props interface = defineProps<ProjectCardProps>()
 * - Conditional rendering = v-if/v-show directives
 * - Event handlers = @click methods
 * - Dynamic styling = :class bindings
 * - Date formatting = computed properties or filters
 */

import { Project } from '../types';
import { memo } from 'react';

interface ProjectCardProps {
  project: Project;
  viewMode?: 'grid' | 'list';
  onPlay?: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDownload?: (project: Project) => void;
  className?: string;
}

const ProjectCard = ({
  project,
  viewMode = 'grid',
  onPlay,
  onEdit,
  onDownload,
  className = '',
}: ProjectCardProps): React.JSX.Element => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-400';
      case 'processing':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'draft':
        return 'bg-gray-600/20 text-gray-400';
      case 'failed':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⏳';
      case 'draft':
        return '📝';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'text-to-speech':
        return 'bg-blue-600/20 text-blue-400';
      case 'voice-clone':
        return 'bg-purple-600/20 text-purple-400';
      case 'dubbing':
        return 'bg-orange-600/20 text-orange-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  if (viewMode === 'list') {
    return (
      <div
        className={`bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-200 ${className}`}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 ${project.color} rounded-lg flex items-center justify-center`}>
            <span className="text-lg text-white">{project.thumbnail}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-white font-semibold">{project.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)} {project.status}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(project.type)}`}>
                {project.type}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{project.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>Voice: {project.voice}</span>
              <span>Duration: {project.duration}</span>
              <span>Created: {formatDate(project.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {project.status === 'completed' && onPlay && (
              <button
                onClick={() => onPlay(project)}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                title="Play"
              >
                ▶️
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                title="Edit"
              >
                ✏️
              </button>
            )}
            {project.status === 'completed' && onDownload && (
              <button
                onClick={() => onDownload(project)}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                title="Download"
              >
                ⬇️
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group ${className}`}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${project.color} rounded-lg flex items-center justify-center`}>
          <span className="text-xl text-white">{project.thumbnail}</span>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
          {getStatusIcon(project.status)} {project.status}
        </span>
      </div>

      {/* Project Info */}
      <div className="mb-4">
        <h3 className="text-white font-semibold mb-2">{project.name}</h3>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Voice:</span>
            <span className="text-gray-300">{project.voice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Duration:</span>
            <span className="text-gray-300">{project.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Type:</span>
            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(project.type)}`}>
              {project.type}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Created:</span>
            <span className="text-gray-300">{formatDate(project.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {project.status === 'completed' && onPlay && (
          <button
            onClick={() => onPlay(project)}
            className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            ▶️ Play
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(project)}
            className="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            ✏️ Edit
          </button>
        )}
        {project.status === 'completed' && onDownload && (
          <button
            onClick={() => onDownload(project)}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            title="Download"
          >
            ⬇️
          </button>
        )}
      </div>

      {/* Processing indicator */}
      {project.status === 'processing' && (
        <div className="mt-4 flex items-center space-x-2 text-yellow-400">
          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Processing...</span>
        </div>
      )}
    </div>
  );
};

// Vue equivalent: No direct equivalent, but similar to computed props optimization
export default memo(ProjectCard);
