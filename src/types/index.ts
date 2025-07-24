export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  userType: 'passenger' | 'driver';
  avatar?: string;
  rating?: number;
  totalRides?: number;
  joinedDate: string;
}

export interface Driver extends User {
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  isOnline: boolean;
  verificationStatus: {
    isVerified: boolean;
    documentsSubmitted: boolean;
    documentsApproved: boolean;
    vehicleVerified: boolean;
    backgroundCheckPassed: boolean;
    completedAt?: string;
    submittedAt?: string;
  };
  documents: {
    driversLicense?: {
      url: string;
      status: 'pending' | 'approved' | 'rejected';
      uploadedAt: string;
    };
    vehicleRegistration?: {
      url: string;
      status: 'pending' | 'approved' | 'rejected';
      uploadedAt: string;
    };
    insurance?: {
      url: string;
      status: 'pending' | 'approved' | 'rejected';
      uploadedAt: string;
    };
    profilePhoto?: {
      url: string;
      status: 'pending' | 'approved' | 'rejected';
      uploadedAt: string;
    };
  };
  totalEarnings: number;
  completedTrips: number;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface Trip {
  id: string;
  passengerId: string;
  driverId?: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  fare: number;
  distance: number;
  duration: number;
  requestedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  rating?: number;
  review?: string;
  petFriendly?: boolean;
  musicTheme?: 'quiet' | 'pop' | 'rock' | 'rnb';
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
}