import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { NotificationToast } from '../UI/NotificationToast';
import { Navigation } from './Navigation';

export const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { notifications } = useApp();

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-0">
      <Navigation />
      <main className="pb-0 sm:pb-16">
        <Outlet />
      </main>
      
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <NotificationToast key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};