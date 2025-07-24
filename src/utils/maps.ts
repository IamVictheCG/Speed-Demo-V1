// Google Maps utility functions and configuration
import { Loader } from '@googlemaps/js-api-loader';

// Google Maps configuration
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

export const mapLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
});

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  polyline: string;
}

// Initialize Google Maps
export const initializeMap = async (
  container: HTMLElement,
  center: Location,
  zoom: number = 13
): Promise<google.maps.Map> => {
  const google = await mapLoader.load();
  
  const map = new google.maps.Map(container, {
    center: { lat: center.lat, lng: center.lng },
    zoom,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ],
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  return map;
};

// Create custom markers
export const createMarker = (
  map: google.maps.Map,
  position: Location,
  type: 'pickup' | 'destination' | 'driver' | 'passenger',
  title?: string
): google.maps.Marker => {
  const icons = {
    pickup: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#22c55e" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="16" r="4" fill="white"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    },
    destination: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 24 16 24s16-8 16-24C32 7.163 24.837 0 16 0z" fill="#ef4444"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 40),
      anchor: new google.maps.Point(16, 40)
    },
    driver: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="3"/>
          <path d="M12 14h8l-1 4H13l-1-4z" fill="white"/>
          <circle cx="14" cy="19" r="1.5" fill="white"/>
          <circle cx="18" cy="19" r="1.5" fill="white"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    },
    passenger: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#8b5cf6" stroke="white" stroke-width="3"/>
          <circle cx="16" cy="13" r="3" fill="white"/>
          <path d="M10 22c0-3.5 2.5-6 6-6s6 2.5 6 6" stroke="white" stroke-width="2" fill="none"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16)
    }
  };

  return new google.maps.Marker({
    position: { lat: position.lat, lng: position.lng },
    map,
    icon: icons[type],
    title: title || type
  });
};

// Geocoding - convert address to coordinates
export const geocodeAddress = async (address: string): Promise<Location | null> => {
  try {
    const google = await mapLoader.load();
    const geocoder = new google.maps.Geocoder();
    
    const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results) {
          resolve(results);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });

    if (result.length > 0) {
      const location = result[0].geometry.location;
      return {
        lat: location.lat(),
        lng: location.lng(),
        address: result[0].formatted_address
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Reverse geocoding - convert coordinates to address
export const reverseGeocode = async (location: Location): Promise<string | null> => {
  try {
    const google = await mapLoader.load();
    const geocoder = new google.maps.Geocoder();
    
    const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode({ location: { lat: location.lat, lng: location.lng } }, (results, status) => {
        if (status === 'OK' && results) {
          resolve(results);
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });

    return result.length > 0 ? result[0].formatted_address : null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Calculate route between two points
export const calculateRoute = async (
  origin: Location,
  destination: Location,
  travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
): Promise<RouteInfo | null> => {
  try {
    const google = await mapLoader.load();
    const directionsService = new google.maps.DirectionsService();
    
    const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
      directionsService.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (result, status) => {
        if (status === 'OK' && result) {
          resolve(result);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });

    const route = result.routes[0];
    const leg = route.legs[0];
    
    return {
      distance: leg.distance?.text || '',
      duration: leg.duration?.text || '',
      polyline: route.overview_polyline
    };
  } catch (error) {
    console.error('Route calculation error:', error);
    return null;
  }
};

// Display route on map
export const displayRoute = async (
  map: google.maps.Map,
  origin: Location,
  destination: Location
): Promise<google.maps.DirectionsRenderer | null> => {
  try {
    const google = await mapLoader.load();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: '#3b82f6',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });

    const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
      directionsService.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (status === 'OK' && result) {
          resolve(result);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });

    directionsRenderer.setDirections(result);
    directionsRenderer.setMap(map);
    
    return directionsRenderer;
  } catch (error) {
    console.error('Route display error:', error);
    return null;
  }
};

// Get current location
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        // Default to Lagos, Nigeria if geolocation fails
        console.warn('Geolocation failed, using Lagos as default:', error);
        resolve({
          lat: 6.5244,
          lng: 3.3792 // Victoria Island, Lagos
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  });
};

// Initialize Places Autocomplete
export const initializePlacesAutocomplete = async (
  input: HTMLInputElement,
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void,
  bounds?: google.maps.LatLngBounds
): Promise<google.maps.places.Autocomplete> => {
  const google = await mapLoader.load();
  
  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['establishment', 'geocode'],
    bounds,
    componentRestrictions: { country: 'us' } // Adjust as needed
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    onPlaceSelected(place);
  });

  return autocomplete;
};

// Calculate fare based on distance and time
export const calculateFare = (distance: number, duration: number): number => {
  const baseFare = 3.00;
  const perKmRate = 1.50;
  const perMinuteRate = 0.25;
  
  const distanceFare = distance * perKmRate;
  const timeFare = duration * perMinuteRate;
  
  return Math.round((baseFare + distanceFare + timeFare) * 100) / 100;
};