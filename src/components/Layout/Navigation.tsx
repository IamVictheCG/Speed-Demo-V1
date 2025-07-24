import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  MapPin, 
  Wallet, 
  User, 
  Car,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  History
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const isDriver = user?.userType === 'driver';

  const passengerNavItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: MapPin, label: 'Book', path: '/book' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const driverNavItems = [
    { icon: Home, label: 'Home', path: '/driver/dashboard' },
    { icon: Car, label: 'Rides', path: '/driver/rides' },
    { icon: History, label: 'History', path: '/history' },
    { icon: BarChart3, label: 'Earnings', path: '/driver/earnings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const navItems = isDriver ? driverNavItems : passengerNavItems;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  return (
    <>
      {/* Mobile Hamburger Sidebar */}
      <div className="hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-600">
            <Car className="w-8 h-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">Speed</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md w-full transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header with Hamburger - Only for mobile phones */}
      <div className="sm:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <div className="flex items-center ml-4">
              <Car className="w-6 h-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">Speed</span>
            </div>
          </div>
          <img
            src={user?.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1`}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-gray-200"
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay - Only for mobile phones */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeMobileMenu}></div>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="flex items-center h-16 px-4 bg-blue-600">
              <Car className="w-8 h-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">Speed</span>
              <button
                onClick={closeMobileMenu}
                className="ml-auto p-1 rounded-md text-blue-200 hover:text-white hover:bg-blue-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="px-2 py-4 space-y-1">
              {navItems.map(({ icon: Icon, label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMobileMenu}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md w-full transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - For tablets, laptops, and desktop */}
      <div className="hidden sm:block fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <nav className="flex">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={closeMobileMenu}
              className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                location.pathname === path
                  ? 'text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

    </>
  );
};