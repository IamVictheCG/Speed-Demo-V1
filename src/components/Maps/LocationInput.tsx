import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleAPI, geocodeAddress, Location } from '../../utils/maps';
import { MapPin, Search, X } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: Location) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  onLocationSelect,
  placeholder = "Enter location",
  label,
  icon,
  className = '',
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [service, setService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initService = async () => {
      const google = await loadGoogleAPI();
      setService(new google.maps.places.AutocompleteService());
    };

    initService();
  }, []);

  useEffect(() => {
    if (!service || value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    service.getPlacePredictions({ input: value }, (preds) => {
      const descs = preds?.map(p => p.description!) || [];
      setSuggestions(descs);
      setShowSuggestions(descs.length > 0);
    });
  }, [value, service]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSelect = async (address: string) => {
    onChange(address);
    setShowSuggestions(false);
    setIsLoading(true);
    try {
      const location = await geocodeAddress(address);
      if (location) {
        onLocationSelect(location);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSelect(value);
    }
  };

  const clearInput = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon || <MapPin className="h-5 w-5 text-gray-400" />}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length > 2 && suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${className}
          `}
        />

        <div className="absolute inset-y-0 right-0 flex items-center">
          {value && (
            <button
              type="button"
              onClick={clearInput}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {!value && (
            <button
              type="button"
              onClick={() => handleSelect(value)}
              disabled={isLoading || !value.trim()}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
      <div
        className="suggestion-container"
        onMouseDown={e => {
          // Prevent the input from losing focus before a click is registered
          e.preventDefault();
        }}
      >
        {suggestions.map((s, index) => (
          <div
            key={index}
            className="suggestion"
            onClick={() => {
              onChange(s);
              setSuggestions([]);
              setShowSuggestions(false);
              inputRef.current?.blur();
            }}
          >
            {s}
          </div>
        ))}
      </div>
    )}
    </div>
  );
};
