import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Trip, Wallet, Transaction, Driver } from '../types';

interface AppContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  wallet: Wallet | null;
  nearbyDrivers: Driver[];
  onlineDrivers: Driver[];
  createTrip: (tripData: Omit<Trip, 'id' | 'requestedAt' | 'status'>) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateDriverLocation: (driverId: string, location: { lat: number; lng: number }) => void;
  setDriverOnlineStatus: (driverId: string, isOnline: boolean) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [onlineDrivers, setOnlineDrivers] = useState<Driver[]>([]);
  const [wallet, setWallet] = useState<Wallet>({
    id: '1',
    userId: '1',
    balance: 125.50,
    transactions: [
      {
        id: '1',
        type: 'credit',
        amount: 50.00,
        description: 'Wallet top-up',
        date: '2024-01-15',
        status: 'completed'
      },
      {
        id: '2',
        type: 'debit',
        amount: 15.50,
        description: 'Trip to Downtown',
        date: '2024-01-14',
        status: 'completed'
      }
    ]
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock Nigerian drivers data
  React.useEffect(() => {
    const mockDrivers: Driver[] = [
      {
        id: 'driver1',
        email: 'adebayo@speed.ng',
        name: 'Adebayo Ogundimu',
        phone: '+234 803 123 4567',
        userType: 'driver',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        rating: 4.8,
        totalRides: 342,
        joinedDate: '2023-03-15',
        vehicleInfo: {
          make: 'Toyota',
          model: 'Corolla',
          year: 2020,
          color: 'Silver',
          licensePlate: 'LAG 456 AB'
        },
        isOnline: true,
        totalEarnings: 125000,
        completedTrips: 342,
        location: { lat: 6.5244, lng: 3.3792 }, // Victoria Island, Lagos
        verificationStatus: {
          isVerified: true,
          documentsSubmitted: true,
          documentsApproved: true,
          vehicleVerified: true,
          backgroundCheckPassed: true,
          completedAt: '2023-03-20',
          submittedAt: '2023-03-18'
        },
        documents: {
          driversLicense: {
            url: '/docs/license1.jpg',
            status: 'approved',
            uploadedAt: '2023-03-18'
          },
          vehicleRegistration: {
            url: '/docs/registration1.jpg',
            status: 'approved',
            uploadedAt: '2023-03-18'
          },
          insurance: {
            url: '/docs/insurance1.jpg',
            status: 'approved',
            uploadedAt: '2023-03-18'
          },
          profilePhoto: {
            url: '/docs/photo1.jpg',
            status: 'approved',
            uploadedAt: '2023-03-18'
          }
        }
      },
      {
        id: 'driver2',
        email: 'fatima@speed.ng',
        name: 'Fatima Abdullahi',
        phone: '+234 805 987 6543',
        userType: 'driver',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        rating: 4.9,
        totalRides: 278,
        joinedDate: '2023-01-20',
        vehicleInfo: {
          make: 'Honda',
          model: 'Accord',
          year: 2019,
          color: 'Black',
          licensePlate: 'LAG 789 CD'
        },
        isOnline: true,
        totalEarnings: 98500,
        completedTrips: 278,
        location: { lat: 6.4698, lng: 3.6002 }, // Surulere, Lagos
        verificationStatus: {
          isVerified: true,
          documentsSubmitted: true,
          documentsApproved: true,
          vehicleVerified: true,
          backgroundCheckPassed: true,
          completedAt: '2023-01-25',
          submittedAt: '2023-01-22'
        },
        documents: {
          driversLicense: {
            url: '/docs/license2.jpg',
            status: 'approved',
            uploadedAt: '2023-01-22'
          },
          vehicleRegistration: {
            url: '/docs/registration2.jpg',
            status: 'approved',
            uploadedAt: '2023-01-22'
          },
          insurance: {
            url: '/docs/insurance2.jpg',
            status: 'approved',
            uploadedAt: '2023-01-22'
          },
          profilePhoto: {
            url: '/docs/photo2.jpg',
            status: 'approved',
            uploadedAt: '2023-01-22'
          }
        }
      },
      {
        id: 'driver3',
        email: 'emeka@speed.ng',
        name: 'Emeka Okafor',
        phone: '+234 807 555 1234',
        userType: 'driver',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        rating: 4.7,
        totalRides: 189,
        joinedDate: '2023-06-10',
        vehicleInfo: {
          make: 'Hyundai',
          model: 'Elantra',
          year: 2021,
          color: 'White',
          licensePlate: 'LAG 321 EF'
        },
        isOnline: true,
        totalEarnings: 67800,
        completedTrips: 189,
        location: { lat: 6.5795, lng: 3.3211 }, // Ikeja, Lagos
        verificationStatus: {
          isVerified: true,
          documentsSubmitted: true,
          documentsApproved: true,
          vehicleVerified: true,
          backgroundCheckPassed: true,
          completedAt: '2023-06-15',
          submittedAt: '2023-06-12'
        },
        documents: {
          driversLicense: {
            url: '/docs/license3.jpg',
            status: 'approved',
            uploadedAt: '2023-06-12'
          },
          vehicleRegistration: {
            url: '/docs/registration3.jpg',
            status: 'approved',
            uploadedAt: '2023-06-12'
          },
          insurance: {
            url: '/docs/insurance3.jpg',
            status: 'approved',
            uploadedAt: '2023-06-12'
          },
          profilePhoto: {
            url: '/docs/photo3.jpg',
            status: 'approved',
            uploadedAt: '2023-06-12'
          }
        }
      },
      {
        id: 'driver4',
        email: 'kemi@speed.ng',
        name: 'Kemi Adebisi',
        phone: '+234 809 444 7890',
        userType: 'driver',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        rating: 4.6,
        totalRides: 156,
        joinedDate: '2023-08-05',
        vehicleInfo: {
          make: 'Kia',
          model: 'Cerato',
          year: 2020,
          color: 'Blue',
          licensePlate: 'LAG 654 GH'
        },
        isOnline: false,
        totalEarnings: 54200,
        completedTrips: 156,
        location: { lat: 6.4281, lng: 3.4219 }, // Yaba, Lagos
        verificationStatus: {
          isVerified: false,
          documentsSubmitted: false,
          documentsApproved: false,
          vehicleVerified: false,
          backgroundCheckPassed: false
        },
        documents: {}
      }
    ];

    setOnlineDrivers(mockDrivers);
    setNearbyDrivers(mockDrivers.filter(driver => driver.isOnline));
  }, []);
  const createTrip = (tripData: Omit<Trip, 'id' | 'requestedAt' | 'status'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: Date.now().toString(),
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };
    setTrips(prev => [...prev, newTrip]);
    setCurrentTrip(newTrip);
    
    addNotification({
      type: 'info',
      title: 'Trip Requested',
      message: 'Looking for nearby drivers...'
    });
  };

  const updateTrip = (tripId: string, updates: Partial<Trip>) => {
    setTrips(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    ));
    
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    setWallet(prev => prev ? {
      ...prev,
      balance: transaction.type === 'credit' 
        ? prev.balance + transaction.amount 
        : prev.balance - transaction.amount,
      transactions: [newTransaction, ...prev.transactions]
    } : null);
  };

  const updateDriverLocation = (driverId: string, location: { lat: number; lng: number }) => {
    setOnlineDrivers(prev => prev.map(driver => 
      driver.id === driverId ? { ...driver, location } : driver
    ));
    setNearbyDrivers(prev => prev.map(driver => 
      driver.id === driverId ? { ...driver, location } : driver
    ));
  };

  const setDriverOnlineStatus = (driverId: string, isOnline: boolean) => {
    setOnlineDrivers(prev => prev.map(driver => 
      driver.id === driverId ? { ...driver, isOnline } : driver
    ));
    
    // Check verification status from localStorage for current user
    const getVerificationStatus = () => {
      const saved = localStorage.getItem('driver_verification_status');
      return saved ? JSON.parse(saved) : { isVerified: false };
    };
    
    // Only allow verified drivers to go online
    if (isOnline && getVerificationStatus().isVerified) {
      const driver = onlineDrivers.find(d => d.id === driverId);
      if (driver && !nearbyDrivers.find(d => d.id === driverId)) {
        setNearbyDrivers(prev => [...prev, { ...driver, isOnline: true }]);
      }
    } else {
      setNearbyDrivers(prev => prev.filter(driver => driver.id !== driverId));
    }
  };
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissNotification(newNotification.id);
    }, 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    trips,
    currentTrip,
    wallet,
    nearbyDrivers,
    onlineDrivers,
    createTrip,
    updateTrip,
    addTransaction,
    updateDriverLocation,
    setDriverOnlineStatus,
    notifications,
    addNotification,
    dismissNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};