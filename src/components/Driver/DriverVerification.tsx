import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { 
  FileText, 
  Car, 
  Shield, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Camera,
  CreditCard,
  User,
  Phone,
  ArrowLeft
} from 'lucide-react';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
  status: 'pending' | 'completed' | 'rejected';
}

export const DriverVerification: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Load saved progress from localStorage
  const loadSavedProgress = () => {
    const saved = localStorage.getItem('driver_verification_progress');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      currentStep: 0,
      formData: {
        // Personal Information
        fullName: user?.name || '',
        phoneNumber: user?.phone || '',
        address: '',
        dateOfBirth: '',
        
        // Vehicle Information
        vehicleMake: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        licensePlate: '',
        
        // Documents
        driversLicense: null,
        vehicleRegistration: null,
        insurance: null,
        profilePhoto: null
      },
      completedSteps: []
    };
  };

  const savedProgress = loadSavedProgress();
  const [currentStep, setCurrentStep] = useState(savedProgress.currentStep);
  const [formData, setFormData] = useState(savedProgress.formData);
  const [completedSteps, setCompletedSteps] = useState(savedProgress.completedSteps);

  // Save progress to localStorage
  const saveProgress = (step: number, data: any, completed: number[]) => {
    const progress = {
      currentStep: step,
      formData: data,
      completedSteps: completed
    };
    localStorage.setItem('driver_verification_progress', JSON.stringify(progress));
  };

  const [initialFormData] = useState({
    // Personal Information
    fullName: user?.name || '',
    phoneNumber: user?.phone || '',
    address: '',
    dateOfBirth: '',
    
    // Vehicle Information
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    licensePlate: '',
    
    // Documents
    driversLicense: null as File | null,
    vehicleRegistration: null as File | null,
    insurance: null as File | null,
    profilePhoto: null as File | null
  });

  const verificationSteps: VerificationStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Provide your personal details and contact information',
      icon: User,
      required: true,
      status: completedSteps.includes(0) ? 'completed' : 'pending'
    },
    {
      id: 'vehicle',
      title: 'Vehicle Information',
      description: 'Enter details about your vehicle',
      icon: Car,
      required: true,
      status: completedSteps.includes(1) ? 'completed' : 'pending'
    },
    {
      id: 'documents',
      title: 'Document Upload',
      description: 'Upload required documents for verification',
      icon: FileText,
      required: true,
      status: completedSteps.includes(2) ? 'completed' : 'pending'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your information and submit for approval',
      icon: Shield,
      required: true,
      status: completedSteps.includes(3) ? 'completed' : 'pending'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    saveProgress(currentStep, newFormData, completedSteps);
  };

  const handleFileUpload = (field: string, file: File | null) => {
    const newFormData = { ...formData, [field]: file };
    setFormData(newFormData);
    saveProgress(currentStep, newFormData, completedSteps);
  };

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Personal Information
        return !!(formData.fullName && formData.phoneNumber && formData.address && formData.dateOfBirth);
      case 1: // Vehicle Information
        return !!(formData.vehicleMake && formData.vehicleModel && formData.vehicleYear && 
                 formData.vehicleColor && formData.licensePlate);
      case 2: // Documents
        return !!(formData.driversLicense && formData.vehicleRegistration && 
                 formData.insurance && formData.profilePhoto);
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Mark current step as completed
      const newCompletedSteps = [...completedSteps];
      if (!newCompletedSteps.includes(currentStep)) {
        newCompletedSteps.push(currentStep);
        setCompletedSteps(newCompletedSteps);
      }
      
      if (currentStep < verificationSteps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        saveProgress(nextStep, formData, newCompletedSteps);
      }
    } else {
      addNotification({
        type: 'error',
        title: 'Incomplete Information',
        message: 'Please fill in all required fields before proceeding'
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      saveProgress(prevStep, formData, completedSteps);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate document upload and verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark verification as completed
    const verificationStatus = {
      isVerified: true,
      completedSteps: [0, 1, 2, 3],
      submittedAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('driver_verification_status', JSON.stringify(verificationStatus));
    
    // Clear progress since verification is complete
    localStorage.removeItem('driver_verification_progress');
    
    addNotification({
      type: 'success',
      title: 'Verification Submitted',
      message: 'Verification completed! You can now go online and start earning.'
    });
    
    setLoading(false);
    
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const renderPersonalInformation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
      
      <Input
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => handleInputChange('fullName', e.target.value)}
        placeholder="Enter your full legal name"
        required
      />
      
      <Input
        label="Phone Number"
        value={formData.phoneNumber}
        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        placeholder="+234 XXX XXX XXXX"
        required
      />
      
      <Input
        label="Home Address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        placeholder="Enter your residential address"
        required
      />
      
      <Input
        label="Date of Birth"
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
        required
      />
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-blue-900">Important Note</h4>
            <p className="text-sm text-blue-700 mt-1">
              Ensure all information matches your official documents. Any discrepancies may delay your verification process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVehicleInformation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Vehicle Make"
          value={formData.vehicleMake}
          onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
          placeholder="e.g., Toyota, Honda, Nissan"
          required
        />
        
        <Input
          label="Vehicle Model"
          value={formData.vehicleModel}
          onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
          placeholder="e.g., Camry, Accord, Altima"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Year"
          type="number"
          value={formData.vehicleYear}
          onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
          placeholder="e.g., 2020"
          required
        />
        
        <Input
          label="Color"
          value={formData.vehicleColor}
          onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
          placeholder="e.g., Black, White, Silver"
          required
        />
      </div>
      
      <Input
        label="License Plate Number"
        value={formData.licensePlate}
        onChange={(e) => handleInputChange('licensePlate', e.target.value)}
        placeholder="e.g., LAG 123 ABC"
        required
      />
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Car className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-yellow-900">Vehicle Requirements</h4>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Vehicle must be 2015 or newer</li>
              <li>• Must have valid registration and insurance</li>
              <li>• Vehicle must pass safety inspection</li>
              <li>• Must be in good working condition</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const FileUploadField: React.FC<{
    label: string;
    description: string;
    file: File | null;
    onChange: (file: File | null) => void;
    icon: React.ComponentType<any>;
  }> = ({ label, description, file, onChange, icon: Icon }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
      <div className="text-center">
        <Icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <h4 className="font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        {file ? (
          <div className="flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600 font-medium">{file.name}</span>
            <button
              onClick={() => onChange(null)}
              className="text-red-600 hover:text-red-800"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => onChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </div>
          </label>
        )}
      </div>
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FileUploadField
          label="Driver's License"
          description="Upload a clear photo of your valid driver's license"
          file={formData.driversLicense}
          onChange={(file) => handleFileUpload('driversLicense', file)}
          icon={CreditCard}
        />
        
        <FileUploadField
          label="Vehicle Registration"
          description="Upload your vehicle registration document"
          file={formData.vehicleRegistration}
          onChange={(file) => handleFileUpload('vehicleRegistration', file)}
          icon={FileText}
        />
        
        <FileUploadField
          label="Insurance Certificate"
          description="Upload valid vehicle insurance certificate"
          file={formData.insurance}
          onChange={(file) => handleFileUpload('insurance', file)}
          icon={Shield}
        />
        
        <FileUploadField
          label="Profile Photo"
          description="Upload a clear photo of yourself"
          file={formData.profilePhoto}
          onChange={(file) => handleFileUpload('profilePhoto', file)}
          icon={Camera}
        />
      </div>
      
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-red-900">Document Requirements</h4>
            <ul className="text-sm text-red-700 mt-1 space-y-1">
              <li>• All documents must be clear and readable</li>
              <li>• Documents must be current and not expired</li>
              <li>• Accepted formats: JPG, PNG, PDF (max 5MB each)</li>
              <li>• Information must match across all documents</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Information</h3>
      
      {/* Personal Information Review */}
      <Card>
        <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Full Name:</span>
            <span className="font-medium">{formData.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium">{formData.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Address:</span>
            <span className="font-medium">{formData.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date of Birth:</span>
            <span className="font-medium">{formData.dateOfBirth}</span>
          </div>
        </div>
      </Card>
      
      {/* Vehicle Information Review */}
      <Card>
        <h4 className="font-medium text-gray-900 mb-3">Vehicle Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle:</span>
            <span className="font-medium">{formData.vehicleMake} {formData.vehicleModel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Year:</span>
            <span className="font-medium">{formData.vehicleYear}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Color:</span>
            <span className="font-medium">{formData.vehicleColor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">License Plate:</span>
            <span className="font-medium">{formData.licensePlate}</span>
          </div>
        </div>
      </Card>
      
      {/* Documents Review */}
      <Card>
        <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
        <div className="space-y-2">
          {[
            { label: 'Driver\'s License', file: formData.driversLicense },
            { label: 'Vehicle Registration', file: formData.vehicleRegistration },
            { label: 'Insurance Certificate', file: formData.insurance },
            { label: 'Profile Photo', file: formData.profilePhoto }
          ].map((doc) => (
            <div key={doc.label} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{doc.label}:</span>
              <div className="flex items-center">
                {doc.file ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-600 font-medium">Uploaded</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-600">Missing</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-green-900">Ready to Submit</h4>
            <p className="text-sm text-green-700 mt-1">
              Your verification will be reviewed within 24-48 hours. You'll receive an email notification once approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInformation();
      case 1:
        return renderVehicleInformation();
      case 2:
        return renderDocumentUpload();
      case 3:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mr-4 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Verification</h1>
          </div>
        </div>
        <p className="text-gray-600 mt-2">
          Complete your verification to start earning with Speed
        </p>
        {completedSteps.length > 0 && (
          <div className="mt-2 text-sm text-green-600">
            Progress saved: {completedSteps.length} of {verificationSteps.length} steps completed
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {verificationSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                completedSteps.includes(index)
                  ? 'bg-green-600 border-green-600 text-white'
                  : index === currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : index < currentStep 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < verificationSteps.length - 1 && (
                <div className={`w-16 h-0.5 ml-2 ${
                  completedSteps.includes(index) ? 'bg-green-600' : index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {verificationSteps.map((step, index) => (
            <div key={step.id} className="text-center" style={{ width: '120px' }}>
              <p className={`text-xs font-medium ${
                completedSteps.includes(index) 
                  ? 'text-green-600' 
                  : index === currentStep 
                  ? 'text-blue-600' 
                  : 'text-gray-400'
              }`}>
                {step.title}
              </p>
              {completedSteps.includes(index) && (
                <p className="text-xs text-green-500 mt-1">✓ Completed</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        {renderStepContent()}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {currentStep < verificationSteps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!validateStep(currentStep)}
            >
              Complete Verification
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};