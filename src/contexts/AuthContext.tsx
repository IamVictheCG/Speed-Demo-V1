import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Driver } from '../types';

interface AuthContextType {
  user: User | Driver | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  switchUserType: (type: 'passenger' | 'driver') => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | Driver | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('speed_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: 'John Doe',
      phone: '+1234567890',
      userType: 'passenger',
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`,
      rating: 4.8,
      totalRides: 24,
      joinedDate: '2023-01-15'
    };

    setUser(mockUser);
    localStorage.setItem('speed_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (userData: Partial<User>) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      userType: userData.userType || 'passenger',
      rating: 0,
      totalRides: 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setUser(newUser);
    localStorage.setItem('speed_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('speed_user');
  };

  const switchUserType = (type: 'passenger' | 'driver') => {
    if (user) {
      const updatedUser = { ...user, userType: type };
      setUser(updatedUser);
      localStorage.setItem('speed_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    switchUserType,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};