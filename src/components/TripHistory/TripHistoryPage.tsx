import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { 
  MapPin, 
  Clock, 
  Star, 
  Calendar,
  Filter,
  Search,
  Navigation,
  DollarSign,
  User,
  Car,
  ChevronRight,
  History as HistoryIcon
} from 'lucide-react';

interface Trip {
  id: string;
  date: string;
  time: string;
  pickup: string;
  destination: string;
  fare: number;
  distance: number;
  duration: number;
  status: 'completed' | 'cancelled';
  rating?: number;
  driverName?: string;
  passengerName?: string;
  vehicleInfo?: string;
  paymentMethod: string;
}

export const TripHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'cancelled'>('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Mock trip data - in real app, this would come from API
  const mockTrips: Trip[] = [
    {
      id: '1',
      date: '2024-01-15',
      time: '2:30 PM',
      pickup: 'Downtown Mall',
      destination: 'Airport Terminal',
      fare: 28.75,
      distance: 12.5,
      duration: 25,
      status: 'completed',
      rating: 5,
      driverName: 'Michael Johnson',
      passengerName: 'Sarah Wilson',
      vehicleInfo: 'Toyota Camry - ABC 123',
      paymentMethod: 'Wallet'
    },
    {
      id: '2',
      date: '2024-01-14',
      time: '10:15 AM',
      pickup: 'University Campus',
      destination: 'Tech Park',
      fare: 15.50,
      distance: 8.2,
      duration: 18,
      status: 'completed',
      rating: 4,
      driverName: 'David Chen',
      passengerName: 'Mike Rodriguez',
      vehicleInfo: 'Honda Civic - XYZ 789',
      paymentMethod: 'Credit Card'
    },
    {
      id: '3',
      date: '2024-01-13',
      time: '6:45 PM',
      pickup: 'Shopping Center',
      destination: 'Residential Area',
      fare: 12.25,
      distance: 5.8,
      duration: 15,
      status: 'completed',
      rating: 5,
      driverName: 'Emma Davis',
      passengerName: 'John Smith',
      vehicleInfo: 'Nissan Altima - DEF 456',
      paymentMethod: 'Wallet'
    },
    {
      id: '4',
      date: '2024-01-12',
      time: '11:20 AM',
      pickup: 'City Center',
      destination: 'Business District',
      fare: 0,
      distance: 0,
      duration: 0,
      status: 'cancelled',
      paymentMethod: 'N/A'
    }
  ];

  const trips = mockTrips; // In real app: user?.totalRides > 0 ? mockTrips : [];

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const completedTrips = trips.filter(trip => trip.status === 'completed');
  const totalSpent = completedTrips.reduce((sum, trip) => sum + trip.fare, 0);
  const totalDistance = completedTrips.reduce((sum, trip) => sum + trip.distance, 0);

  if (trips.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <HistoryIcon className="w-6 h-6 text-gray-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
        </div>

        <Card className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">
              Your trip history will appear here once you start using Speed. 
              Book your first ride to get started!
            </p>
            <Button className="inline-flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Book Your First Ride
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <HistoryIcon className="w-6 h-6 text-gray-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
        </div>
        <div className="text-sm text-gray-600">
          {trips.length} total trips
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Trips</p>
              <p className="text-xl font-bold text-gray-900">{completedTrips.length}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
              <Navigation className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600">Distance Traveled</p>
              <p className="text-xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Trips</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Trip List */}
      <div className="space-y-4">
        {filteredTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedTrip(trip)}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trip.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trip.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {trip.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {trip.time}
                    </div>
                  </div>
                  {trip.status === 'completed' && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${trip.fare.toFixed(2)}</div>
                      {trip.rating && (
                        <div className="flex items-center justify-end mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < trip.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center flex-1">
                    <div className="flex flex-col items-center mr-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <MapPin className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{trip.pickup}</span>
                      </div>
                      <div className="flex items-center">
                        <Navigation className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{trip.destination}</span>
                      </div>
                    </div>
                  </div>
                  
                  {trip.status === 'completed' && (
                    <div className="text-right text-sm text-gray-500">
                      <div>{trip.distance} km</div>
                      <div>{trip.duration} min</div>
                    </div>
                  )}
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTrips.length === 0 && trips.length > 0 && (
        <Card className="text-center py-8">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </Card>
      )}

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Trip Details</h3>
              <button
                onClick={() => setSelectedTrip(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTrip.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedTrip.status === 'completed' ? 'Completed' : 'Cancelled'}
                </span>
                {selectedTrip.status === 'completed' && (
                  <div className="text-2xl font-bold text-gray-900">
                    ${selectedTrip.fare.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Pickup</p>
                      <p className="font-medium text-gray-900">{selectedTrip.pickup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Destination</p>
                      <p className="font-medium text-gray-900">{selectedTrip.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <span className="font-medium">{selectedTrip.date} at {selectedTrip.time}</span>
                </div>
                
                {selectedTrip.status === 'completed' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance</span>
                      <span className="font-medium">{selectedTrip.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{selectedTrip.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">{selectedTrip.paymentMethod}</span>
                    </div>
                    
                    {user?.userType === 'passenger' && selectedTrip.driverName && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Driver</span>
                          <span className="font-medium">{selectedTrip.driverName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle</span>
                          <span className="font-medium">{selectedTrip.vehicleInfo}</span>
                        </div>
                      </>
                    )}
                    
                    {user?.userType === 'driver' && selectedTrip.passengerName && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Passenger</span>
                        <span className="font-medium">{selectedTrip.passengerName}</span>
                      </div>
                    )}
                    
                    {selectedTrip.rating && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < selectedTrip.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};