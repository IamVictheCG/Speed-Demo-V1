import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Star,
  Edit,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  FileCheck
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  // Check verification status for drivers
  const getVerificationStatus = () => {
    if (user?.userType !== 'driver') return null;
    const saved = localStorage.getItem('driver_verification_status');
    return saved ? JSON.parse(saved) : { isVerified: false, completedSteps: [] };
  };

  const verificationStatus = getVerificationStatus();

  const profileSections = [
    {
      title: 'Personal Information',
      icon: User,
      items: [
        { label: 'Full Name', value: user?.name || 'Not provided', icon: User },
        { label: 'Email', value: user?.email || 'Not provided', icon: Mail },
        { label: 'Phone', value: user?.phone || 'Not provided', icon: Phone },
        { label: 'Member Since', value: user?.joinedDate || 'Not provided', icon: Calendar },
      ]
    },
    {
      title: 'Account Settings',
      icon: Shield,
      items: [
        ...(user?.userType === 'driver' ? [{
          label: 'Driver Verification',
          value: verificationStatus?.isVerified ? 'Verified ✓' : 'Complete verification to go online',
          icon: FileCheck,
          action: '/driver/verification',
          status: verificationStatus?.isVerified ? 'verified' : 'pending'
        }] : []),
        { label: 'Privacy & Security', value: 'Manage your account security', icon: Shield },
        { label: 'Notifications', value: 'Customize your notifications', icon: Bell },
        { label: 'Help & Support', value: 'Get help when you need it', icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`}
            alt="Profile"
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600 capitalize">{user?.userType}</p>
            <div className="flex items-center mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">
                {user?.rating || 0} ({user?.totalRides || 0} rides)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Verified
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Sections */}
      {profileSections.map((section) => (
        <Card key={section.title}>
          <div className="flex items-center mb-4">
            <section.icon className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
          </div>
          <div className="space-y-3">
            {section.items.map((item) => (
              <div 
                key={item.label} 
                className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                  item.action ? 'hover:bg-gray-100' : ''
                } ${
                  item.status === 'verified' ? 'bg-green-50' : 
                  item.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                }`}
                onClick={() => item.action && (window.location.href = item.action)}
              >
                <div className="flex items-center">
                  <item.icon className={`w-4 h-4 mr-3 ${
                    item.status === 'verified' ? 'text-green-600' : 
                    item.status === 'pending' ? 'text-yellow-600' : 'text-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className={`text-sm ${
                      item.status === 'verified' ? 'text-green-700' : 
                      item.status === 'pending' ? 'text-yellow-700' : 'text-gray-600'
                    }`}>
                      {item.value}
                    </p>
                  </div>
                </div>
                {(section.title === 'Account Settings' || item.action) && (
                  <div className="w-5 h-5 text-gray-400">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Logout */}
      <Card>
        <Button
          onClick={logout}
          variant="outline"
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </Card>
    </div>
  );
};