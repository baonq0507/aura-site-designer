import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  backdrop?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  text = 'Loading...',
  backdrop = true 
}) => {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      backdrop ? 'bg-black/50 backdrop-blur-sm' : ''
    }`}>
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  lines = 1 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index} 
          className="h-4 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="h-32 bg-gray-200 animate-pulse"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
};
