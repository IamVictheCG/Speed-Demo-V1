import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { LocationInput } from '../Maps/LocationInput';
import { MapComponent } from '../Maps/MapComponent';
import { calculateFare, Location } from '../../utils/maps';
import { 
  MapPin, 
  Navigation, 
  Heart, 
  Music, 
  Clock,
  DollarSign,
  Car,
  Route
} from 'lucide-react';

export const BookingForm: React.FC = () => {
  const { user } = useAuth();
  const { createTrip, addNotification } = useApp();
  const [formData, setFormData] = useState({
    pickup: '',
    destination: '',
    petFriendly: false,
    musicTheme: 'quiet' as 'quiet' | 'pop' | 'rock' | 'rnb'
  });
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);

  // Calculate fare when both locations are selected
  React.useEffect(() => {
    if (pickupLocation && destinationLocation) {
      // Simulate route calculation (in real app, use Google Directions API)
      const distance = 5.2; // km
      const duration = 18; // minutes
      const fare = calculateFare(distance, duration);
      
      setEstimatedFare(fare);
      setRouteInfo({ distance, duration });
    } else {
      setEstimatedFare(null);
      setRouteInfo(null);
    }
  }, [pickupLocation, destinationLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLocation || !destinationLocation) {
      addNotification({
        type: 'error',
        title: 'Missing Locations',
        message: 'Please select both pickup and destination locations'
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const tripData = {
      passengerId: user?.id || '1',
      pickup: pickupLocation,
      destination: destinationLocation,
      fare: estimatedFare || 0,
      distance: routeInfo?.distance || 0,
      duration: routeInfo?.duration || 0,
      petFriendly: formData.petFriendly,
      musicTheme: formData.musicTheme
    };

    createTrip(tripData);
    setLoading(false);
    
    addNotification({
      type: 'success',
      title: 'Trip Requested',
      message: 'We are finding the best driver for you!'
    });
  };

  const musicThemes = [
    { id: 'quiet', label: 'Quiet Ride', icon: '🤫' },
    { id: 'pop', label: 'Pop Music', icon: '🎵' },
    { id: 'rock', label: 'Rock Music', icon: '🎸' },
    { id: 'rnb', label: 'R&B Music', icon: '🎤' }
  ];

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book a Ride</h1>
        <p className="text-gray-600 mt-1">Where would you like to go?</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pickup Location */}
          <div className="relative">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <label className="text-sm font-medium text-gray-700">Pickup Location</label>
            </div>
            <LocationInput
              value={formData.pickup}
              onChange={(value) => setFormData(prev => ({ ...prev, pickup: value }))}
              onLocationSelect={(location) => {
                setPickupLocation(location);
                setFormData(prev => ({ ...prev, pickup: location.address || '' }));
              }}
              placeholder="Enter pickup location"
              icon={<MapPin className="h-5 w-5 text-green-500" />}
            />
          </div>

          {/* Destination */}
          <div className="relative">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
              <label className="text-sm font-medium text-gray-700">Destination</label>
            </div>
            <LocationInput
              value={formData.destination}
              onChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}
              onLocationSelect={(location) => {
                setDestinationLocation(location);
                setFormData(prev => ({ ...prev, destination: location.address || '' }));
              }}
              placeholder="Enter destination"
              icon={<Navigation className="h-5 w-5 text-red-500" />}
            />
          </div>

          {/* Map Preview */}
          {(pickupLocation || destinationLocation) && (
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Route className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Route Preview</h3>
                </div>
              </div>
              <MapComponent
                pickup={pickupLocation}
                destination={destinationLocation}
                showRoute={!!(pickupLocation && destinationLocation)}
                height="250px"
              />
            </Card>
          )}

          {/* Trip Summary */}
          {routeInfo && estimatedFare && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-3">Trip Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-blue-700">
                    <Clock className="w-4 h-4 mr-2" />
                    Estimated Time
                  </div>
                  <span className="text-sm font-medium text-blue-900">{routeInfo.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-blue-700">
                    <Navigation className="w-4 h-4 mr-2" />
                    Distance
                  </div>
                  <span className="text-sm font-medium text-blue-900">{routeInfo.distance} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-blue-700">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Estimated Fare
                  </div>
                  <span className="text-lg font-bold text-blue-900">${estimatedFare.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Pet Friendly */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Heart className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="font-medium text-gray-900">Pet-Friendly Ride</h3>
                <p className="text-sm text-gray-600">Traveling with your furry friend?</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, petFriendly: !prev.petFriendly }))}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.petFriendly ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                  formData.petFriendly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Music Theme */}
          <div>
            <div className="flex items-center mb-3">
              <Music className="w-5 h-5 text-purple-500 mr-2" />
              <label className="text-sm font-medium text-gray-700">Music Preference</label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {musicThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, musicTheme: theme.id as any }))}
                  className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                    formData.musicTheme === theme.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg mr-2">{theme.icon}</span>
                  <span className="font-medium">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={loading}
            disabled={!pickupLocation || !destinationLocation}
          >
            <Car className="w-5 h-5 mr-2" />
            {loading ? 'Booking Ride...' : 'Book Ride'}
          </Button>
        </form>
      </Card>
    </div>
  );
};