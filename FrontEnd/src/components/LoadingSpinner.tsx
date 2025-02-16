import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  variant?: 'spinner' | 'dots' | 'pulse';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  variant = 'spinner'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colors = {
    primary: 'text-indigo-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  if (variant === 'dots') {
    return (
      <div className="flex space-x-2 justify-center items-center">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`${sizes[size]} ${colors[color]} opacity-60 rounded-full animate-pulse-dot`}
            style={{ animationDelay: `${(dot - 1) * 0.2}s` }}
          />
        ))}
        <style jsx>{`
          @keyframes pulse-dot {
            0%, 80%, 100% { transform: scale(0.2); }
            40% { transform: scale(1); }
          }
          .animate-pulse-dot {
            animation: pulse-dot 1.4s infinite ease-in-out both;
          }
        `}</style>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`relative ${sizes[size]}`}>
        <div className={`absolute inset-0 ${colors[color]} rounded-full animate-ping-slow opacity-75`} />
        <div className={`relative ${colors[color]} rounded-full ${sizes[size]} animate-pulse`} />
        <style jsx>{`
          @keyframes ping-slow {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .animate-ping-slow {
            animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <svg
        className={`animate-spin ${sizes[size]} ${colors[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;