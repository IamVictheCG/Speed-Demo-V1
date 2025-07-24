import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { MapComponent } from '../Maps/MapComponent';
import { 
  MapPin, 
  Clock, 
  Star, 
  Wallet, 
  Activity,
  Car,
  Settings,
  Navigation
} from 'lucide-react';

export const PassengerDashboard: React.FC = () => {
  const { user, switchUserType } = useAuth();
  const { wallet, currentTrip, trips, nearbyDrivers } = useApp();
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const quickActions = [
    { icon: MapPin, label: 'Book a Ride', to: '/book', color: 'bg-blue-500' },
    { icon: Wallet, label: 'Top Up Wallet', to: '/wallet', color: 'bg-green-500' },
    { icon: Activity, label: 'Trip History', to: '/history', color: 'bg-purple-500' },
    { icon: Settings, label: 'Settings', to: '/settings', color: 'bg-gray-500' },
  ];

  // Get recent completed trips
  const recentTrips = trips
    .filter(trip => trip.status === 'completed')
    .slice(0, 3)
    .map(trip => ({
      id: trip.id,
      destination: trip.destination.address,
      date: trip.completedAt?.split('T')[0] || trip.requestedAt.split('T')[0],
      fare: trip.fare,
      rating: trip.rating || 0
    }));

  const handleDriverSelect = (driver: any) => {
    setSelectedDriver(driver);
  };
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">Ready for your next adventure?</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchUserType('driver')}
          >
            <Car className="w-4 h-4 mr-2" />
            Switch to Driver
          </Button>
          <img
            src={user?.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1`}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        </div>
      </div>

      {/* Live Map */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Navigation className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Live Map</h3>
          </div>
          {currentTrip && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {currentTrip.status === 'pending' && 'Finding Driver'}
              {currentTrip.status === 'accepted' && 'Driver En Route'}
              {currentTrip.status === 'in_progress' && 'In Progress'}
            </span>
          )}
        </div>
        <MapComponent
          pickup={currentTrip?.pickup}
          destination={currentTrip?.destination}
          nearbyDrivers={nearbyDrivers}
          showRoute={!!currentTrip}
          onDriverSelect={handleDriverSelect}
          height="300px"
          className="rounded-lg"
        />
        {currentTrip && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Current Trip</p>
                <p className="text-xs text-blue-700">
                  {currentTrip.pickup.address} → {currentTrip.destination.address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-900">${currentTrip.fare}</p>
                <p className="text-xs text-blue-700">{currentTrip.distance} km • {currentTrip.duration} min</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Nearby Drivers Info */}
        {!currentTrip && nearbyDrivers.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">
                  {nearbyDrivers.length} Driver{nearbyDrivers.length > 1 ? 's' : ''} Nearby
                </p>
                <p className="text-xs text-green-700">
                  Tap on a driver marker to see details
                </p>
              </div>
              <div className="flex -space-x-2">
                {nearbyDrivers.slice(0, 3).map((driver) => (
                  <img
                    key={driver.id}
                    src={driver.avatar}
                    alt={driver.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
                {nearbyDrivers.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-green-700">
                      +{nearbyDrivers.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Driver Selection Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Driver Details</h3>
              <button
                onClick={() => setSelectedDriver(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-200"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{selectedDriver.name}</h4>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">
                      {selectedDriver.rating} ({selectedDriver.totalRides} trips)
                    </span>
                  </div>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                    Online
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-gray-900 mb-2">Vehicle Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">
                      {selectedDriver.vehicleInfo.make} {selectedDriver.vehicleInfo.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{selectedDriver.vehicleInfo.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{selectedDriver.vehicleInfo.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plate Number:</span>
                    <span className="font-medium">{selectedDriver.vehicleInfo.licensePlate}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedDriver(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setSelectedDriver(null);
                    // Navigate to booking with this driver
                    window.location.href = '/book';
                  }}
                  className="flex-1"
                >
                  Book This Driver
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* Current Trip */}
      {currentTrip && (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Current Trip</h3>
              <p className="text-blue-100 mt-1">
                {currentTrip.status === 'pending' && 'Looking for driver...'}
                {currentTrip.status === 'accepted' && 'Driver on the way'}
                {currentTrip.status === 'in_progress' && 'En route to destination'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${currentTrip.fare}</div>
              <div className="text-blue-100 text-sm">
                {currentTrip.distance} km • {currentTrip.duration} min
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold text-gray-900">{user?.totalRides || 0}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Wallet Balance</p>
              <p className="text-2xl font-bold text-gray-900">${wallet?.balance.toFixed(2) || '0.00'}</p>
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
              <p className="text-2xl font-bold text-gray-900">{user?.rating || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2 group-hover:scale-105 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Trips */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Trips</h3>
          <Link to="/history" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </Link>
        </div>
        {recentTrips.length > 0 ? (
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{trip.destination}</p>
                    <p className="text-sm text-gray-500">{trip.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${trip.fare}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < trip.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No trips yet</p>
            <p className="text-sm text-gray-500 mt-1">Book your first ride to get started!</p>
          </div>
        )}
      </Card>
    </div>
  );
};