import React, { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface NotificationToastProps {
  notification: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: string;
  };
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
  const { dismissNotification } = useApp();

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  };

  const colorMap = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
  };

  const Icon = iconMap[notification.type];

  return (
    <div className={`w-[360px] sm:w-[500px] mx-auto sm:ml-auto sm:mr-0 rounded-md shadow-md border px-6 py-3 z-50 ${colorMap[notification.type]} animate-slide-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">{notification.title}</p>
          <p className="mt-1 text-sm opacity-90">{notification.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => dismissNotification(notification.id)}
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};