/**
 * Toast Notification System - User feedback notifications
 *
 * React Concepts Demonstrated:
 * - Context API for global toast state
 * - Custom hooks for toast management
 * - useEffect for auto-dismiss timers
 * - Portal rendering for overlay components
 * - Animation classes for smooth transitions
 *
 * Vue.js Equivalent Mapping:
 * - Similar to Vue toast libraries or custom composables
 * - Context = provide/inject or Pinia store
 * - useEffect = watchEffect or watch
 * - Portal = Teleport component in Vue 3
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Custom hook to use toast context
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps): React.JSX.Element => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Individual Toast Component
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    // Wait for exit animation before removing
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-800 border-green-600 text-green-100';
      case 'error':
        return 'bg-red-800 border-red-600 text-red-100';
      case 'warning':
        return 'bg-yellow-800 border-yellow-600 text-yellow-100';
      case 'info':
        return 'bg-blue-800 border-blue-600 text-blue-100';
      default:
        return 'bg-gray-800 border-gray-600 text-gray-100';
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getToastStyles(toast.type)}
        border rounded-lg p-4 shadow-lg max-w-sm w-full
      `}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg flex-shrink-0 mt-0.5">{getIcon(toast.type)}</span>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{toast.title}</h4>
          {toast.message && <p className="text-sm opacity-90 mt-1">{toast.message}</p>}

          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="text-sm font-medium underline hover:no-underline mt-2 block"
            >
              {toast.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleRemove}
          className="flex-shrink-0 text-lg opacity-70 hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = (): React.JSX.Element => {
  const { toasts, removeToast } = useToast();

  // Render toasts in a portal to ensure they appear above everything
  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body,
  );
};

// Convenience functions for common toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string) => addToast({ type: 'success', title, message }),

    error: (title: string, message?: string) => addToast({ type: 'error', title, message }),

    warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),

    info: (title: string, message?: string) => addToast({ type: 'info', title, message }),
  };
};
