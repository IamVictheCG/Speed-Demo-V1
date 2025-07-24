import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PassengerDashboard } from '../components/Dashboard/PassengerDashboard';
import { DriverDashboard } from '../components/Dashboard/DriverDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (user?.userType === 'driver') {
    return <DriverDashboard />;
  }

  return <PassengerDashboard />;
};