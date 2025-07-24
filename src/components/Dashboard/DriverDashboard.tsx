import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { LineChart } from '@carbon/charts-react';
import '@carbon/charts/styles.css';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { MapComponent } from '../Maps/MapComponent';
import { 
  DollarSign, 
  Car, 
  Star, 
  Activity,
  User,
  MapPin,
  Clock,
  Power,
  TrendingUp,
  Navigation,
  AlertCircle,
  Shield
} from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const { user, switchUserType } = useAuth();
  const { addNotification, trips, currentTrip, setDriverOnlineStatus, updateDriverLocation } = useApp();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [driverLocation, setDriverLocation] = useState({
    lat: 6.5244,
    lng: 3.3792,
    address: 'Victoria Island, Lagos'
  });

  // Mock verification status - in real app, this would come from user data
  const getVerificationStatus = () => {
    const saved = localStorage.getItem('driver_verification_status');
    return saved ? JSON.parse(saved) : { isVerified: false, completedSteps: [] };
  };

  const isVerified = getVerificationStatus().isVerified;

  const toggleOnlineStatus = () => {
    // Check if driver is verified before allowing to go online
    if (!isVerified && !isOnline) {
      addNotification({
        type: 'warning',
        title: 'Verification Required',
        message: 'Complete your verification to go online'
      });
      navigate('/driver/verification');
      return;
    }

    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    // Update driver status in global state
    if (user?.id) {
      setDriverOnlineStatus(user.id, newStatus);
    }
    
    addNotification({
      type: 'success',
      title: newStatus ? 'Now Online' : 'Gone Offline',
      message: newStatus ? 'You can now receive trip requests' : 'You will not receive trip requests'
    });
  };

  const handleVerificationClick = () => {
    navigate('/driver/verification');
  };

  // Simulate driver location updates when online
  React.useEffect(() => {
    if (isOnline && user?.id) {
      const interval = setInterval(() => {
        // Simulate small location changes (driver moving around Lagos)
        const newLocation = {
          lat: driverLocation.lat + (Math.random() - 0.5) * 0.01,
          lng: driverLocation.lng + (Math.random() - 0.5) * 0.01
        };
        setDriverLocation(prev => ({ ...prev, ...newLocation }));
        updateDriverLocation(user.id, newLocation);
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [isOnline, user?.id, updateDriverLocation, driverLocation.lat, driverLocation.lng]);
  const driverStats = {
    totalEarnings: 2847.50,
    tripsCompleted: 156,
    rating: 4.9,
    todayEarnings: 89.25,
    weeklyEarnings: [
      { day: 'Monday', earnings: 125.50, trips: 8 },
      { day: 'Tuesday', earnings: 98.75, trips: 6 },
      { day: 'Wednesday', earnings: 156.25, trips: 10 },
      { day: 'Thursday', earnings: 89.50, trips: 5 },
      { day: 'Friday', earnings: 234.75, trips: 15 },
      { day: 'Saturday', earnings: 298.50, trips: 18 },
      { day: 'Sunday', earnings: 187.25, trips: 12 }
    ]
  };

  // Get recent completed trips for this driver
  const recentTrips = trips
    .filter(trip => trip.status === 'completed' && trip.driverId === user?.id)
    .slice(0, 3)
    .map(trip => ({
      id: trip.id,
      passenger: 'Passenger', // In real app, would fetch passenger name
      pickup: trip.pickup.address,
      destination: trip.destination.address,
      earnings: trip.fare,
      rating: trip.rating || 0,
      time: trip.completedAt ? new Date(trip.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    }));

  // Prepare chart data for Carbon Charts
  const chartData = driverStats.weeklyEarnings.map(item => ({
    group: 'Earnings',
    day: item.day,
    value: item.earnings
  }));

  const chartOptions = {
    title: 'Weekly Earnings Overview',
    axes: {
      bottom: {
        title: 'Day of Week',
        mapsTo: 'day',
        scaleType: 'labels'
      },
      left: {
        title: 'Earnings (₦)',
        mapsTo: 'value',
        scaleType: 'linear'
      }
    },
    curve: 'curveMonotoneX',
    height: '300px',
    color: {
      scale: {
        'Earnings': '#3b82f6'
      }
    },
    points: {
      enabled: true,
      radius: 4
    },
    grid: {
      x: {
        enabled: false
      },
      y: {
        enabled: true
      }
    },
    toolbar: {
      enabled: false
    },
    legend: {
      enabled: false
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">Ready to earn some money?</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchUserType('passenger')}
          >
            <User className="w-4 h-4 mr-2" />
            Switch to Passenger
          </Button>
          <img
            src={user?.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        </div>
      </div>

      {/* Online Status */}
      <Card className={`${isOnline ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {isOnline ? 'You are Online' : 'You are Offline'}
              </h3>
              <p className="text-gray-600 mt-1">
                {isOnline ? 'Ready to receive trip requests' : 'Go online to start earning'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {!isVerified && (
              <Button
                onClick={handleVerificationClick}
                variant="primary"
                className="flex items-center"
              >
                <Shield className="w-4 h-4 mr-2" />
                Complete Verification
              </Button>
            )}
            {isVerified && (
              <Button
                onClick={toggleOnlineStatus}
                variant={isOnline ? 'secondary' : 'primary'}
                className="flex items-center"
              >
                <Power className="w-4 h-4 mr-2" />
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            )}
          </div>
        </div>
        {!isVerified && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-700">
                Complete your driver verification to start earning. Click "Complete Verification" to continue.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Driver Map */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Navigation className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Driver Map</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        <MapComponent
          driverLocation={driverLocation}
          pickup={currentTrip?.pickup}
          destination={currentTrip?.destination}
          showRoute={!!currentTrip}
          height="300px"
          className="rounded-lg"
        />
        {currentTrip && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Active Trip</p>
                <p className="text-xs text-green-700">
                  {currentTrip.pickup.address} → {currentTrip.destination.address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-900">${currentTrip.fare}</p>
                <p className="text-xs text-green-700">{currentTrip.distance} km • {currentTrip.duration} min</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${driverStats.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Trips Completed</p>
              <p className="text-2xl font-bold text-gray-900">{driverStats.tripsCompleted}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{driverStats.rating}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Today's Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${driverStats.todayEarnings.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Earnings</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Daily Earnings</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">
                Total: ₦{driverStats.weeklyEarnings.reduce((sum, day) => sum + day.earnings, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <LineChart
            data={chartData}
            options={chartOptions}
          />
        </div>
        
        {/* Weekly Summary */}
        <div className="grid grid-cols-7 gap-2 mt-4">
          {driverStats.weeklyEarnings.map((day) => (
            <div key={day.day} className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600">{day.day.slice(0, 3)}</p>
              <p className="text-sm font-bold text-gray-900">₦{day.earnings}</p>
              <p className="text-xs text-gray-500">{day.trips} trips</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Trips */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Trips</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        {recentTrips.length > 0 ? (
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{trip.passenger}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {trip.pickup} → {trip.destination}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${trip.earnings}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{trip.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No trips completed yet</p>
            <p className="text-sm text-gray-500 mt-1">Go online to start receiving trip requests!</p>
          </div>
        )}
      </Card>
    </div>
  );
};