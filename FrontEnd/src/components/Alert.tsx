import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
  className?: string;
  autoClose?: boolean;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  className = '',
  autoClose = false,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoClose) {
      timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          onClose && onClose();
        }, 300);
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, duration, onClose]);

  const iconClasses = "w-5 h-5";
  const icons = {
    success: <CheckCircle className={iconClasses} />,
    error: <AlertCircle className={iconClasses} />,
    info: <Info className={iconClasses} />,
    warning: <AlertTriangle className={iconClasses} />
  };

  if (!isVisible) return null;

  return (
    <div
      className={`flex items-center p-4 border rounded-md ${className} ${
        isExiting ? 'opacity-0 transition-opacity duration-300' : 'opacity-100'
      }
      ${type === 'success'
        ? 'bg-green-50 text-green-800 border-green-200'
        : type === 'error'
        ? 'bg-red-50 text-red-800 border-red-200'
        : type === 'info'
        ? 'bg-blue-50 text-blue-800 border-blue-200'
        : 'bg-yellow-50 text-yellow-800 border-yellow-200'}`}
    >
      <div className="mr-3">{icons[type]}</div>
      <div className="flex-1 text-sm">{message}</div>
      {onClose && (
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => {
              setIsVisible(false);
              onClose();
            }, 300);
          }}
          className="ml-4 focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;