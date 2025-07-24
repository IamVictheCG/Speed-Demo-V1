import React, { useEffect, useRef, useState } from 'react';
import { initializeMap, createMarker, displayRoute, getCurrentLocation, Location } from '../../utils/maps';
import { Driver } from '../../types';
import { Button } from '../UI/Button';
import { Navigation, MapPin, Loader2 } from 'lucide-react';

interface MapComponentProps {
  pickup?: Location;
  destination?: Location;
  driverLocation?: Location;
  passengerLocation?: Location;
  nearbyDrivers?: Driver[];
  showRoute?: boolean;
  height?: string;
  onLocationSelect?: (location: Location) => void;
  onDriverSelect?: (driver: Driver) => void;
  className?: string;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  pickup,
  destination,
  driverLocation,
  passengerLocation,
  nearbyDrivers = [],
  showRoute = false,
  height = '400px',
  onLocationSelect,
  onDriverSelect,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const routeRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  // Get user's current location
  const getUserLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      return location;
    } catch (error) {
      console.error('Error getting user location:', error);
      // Default to Lagos, Nigeria if geolocation fails
      return { lat: 6.5244, lng: 3.3792 }; // Victoria Island, Lagos
    }
  };

  // Clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  // Clear existing route
  const clearRoute = () => {
    if (routeRendererRef.current) {
      routeRendererRef.current.setMap(null);
      routeRendererRef.current = null;
    }
  };

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        setLoading(true);
        setError(null);

        // Get user location or use default
        const currentLocation = await getUserLocation();
        
        // Use pickup location, user location, or default center
        const center = pickup || currentLocation;
        
        // Initialize the map
        const map = await initializeMap(mapRef.current, center, 13);
        mapInstanceRef.current = map;

        // Add click listener for location selection
        if (onLocationSelect) {
          map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const location: Location = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              };
              onLocationSelect(location);
            }
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to load map. Please check your internet connection.');
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    clearMarkers();
    clearRoute();

    const map = mapInstanceRef.current;
    const bounds = new google.maps.LatLngBounds();
    let hasLocations = false;

    // Add pickup marker
    if (pickup) {
      const marker = createMarker(map, pickup, 'pickup', 'Pickup Location');
      markersRef.current.push(marker);
      bounds.extend({ lat: pickup.lat, lng: pickup.lng });
      hasLocations = true;
    }

    // Add destination marker
    if (destination) {
      const marker = createMarker(map, destination, 'destination', 'Destination');
      markersRef.current.push(marker);
      bounds.extend({ lat: destination.lat, lng: destination.lng });
      hasLocations = true;
    }

    // Add driver marker
    if (driverLocation) {
      const marker = createMarker(map, driverLocation, 'driver', 'Driver Location');
      markersRef.current.push(marker);
      bounds.extend({ lat: driverLocation.lat, lng: driverLocation.lng });
      hasLocations = true;
    }

    // Add passenger marker
    if (passengerLocation) {
      const marker = createMarker(map, passengerLocation, 'passenger', 'Passenger Location');
      markersRef.current.push(marker);
      bounds.extend({ lat: passengerLocation.lat, lng: passengerLocation.lng });
      hasLocations = true;
    }

    // Add nearby drivers markers
    nearbyDrivers.forEach((driver) => {
      if (driver.location && driver.isOnline) {
        const marker = createMarker(
          map, 
          driver.location, 
          'driver', 
          `${driver.name} - ${driver.vehicleInfo.make} ${driver.vehicleInfo.model}`
        );
        
        // Add click listener to driver marker
        if (onDriverSelect) {
          marker.addListener('click', () => {
            onDriverSelect(driver);
          });
        }
        
        markersRef.current.push(marker);
        bounds.extend({ lat: driver.location.lat, lng: driver.location.lng });
        hasLocations = true;
      }
    });
    // Show route if requested and we have pickup and destination
    if (showRoute && pickup && destination) {
      displayRoute(map, pickup, destination).then(renderer => {
        routeRendererRef.current = renderer;
      });
    }

    // Fit map to show all markers
    if (hasLocations) {
      if (markersRef.current.length === 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(15);
      } else {
        map.fitBounds(bounds);
        // Add some padding
        setTimeout(() => {
          const zoom = map.getZoom();
          if (zoom && zoom > 15) {
            map.setZoom(15);
          }
        }, 100);
      }
    }
  }, [pickup, destination, driverLocation, passengerLocation, nearbyDrivers, showRoute, onDriverSelect]);

  const centerOnUserLocation = async () => {
    if (!mapInstanceRef.current) return;
    
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      mapInstanceRef.current.setCenter({ lat: location.lat, lng: location.lng });
      mapInstanceRef.current.setZoom(15);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-2">{error}</p>
          <Button size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button
          size="sm"
          variant="outline"
          onClick={centerOnUserLocation}
          className="bg-white shadow-md"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};