import { useState } from 'react'
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from '../../context/AuthContext';
import FileInput from '../form/input/FileInput';
import { healthService } from '../../api/axios';

const EditProfileModal = ({ isOpen, closeModal, profileData }) => {
  const { setProfileData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // LOCAL STATE for file uploads - ye zaroori hai kyunki File objects ko direct profileData mein store nahi karna chahiye
  const [fileUploads, setFileUploads] = useState({
    profileImage: null,
    frameOne: null,
    frameTwo: null,
    frameThree: null
  });

  // Helper functions for name handling
  const getFirstName = (fullName) => fullName?.split(' ')[0] || "";
  const getLastName = (fullName) => {
    const parts = fullName?.split(' ') || [];
    return parts.length > 1 ? parts.slice(1).join(' ') : "";
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData?.name?.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!profileData?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (profileData?.phoneNumber && !/^\+?[\d\s-()]+$/.test(profileData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File validation function
  const validateFile = (file) => {
    if (!file) return { isValid: true };
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (file.size > maxSize) {
      return { isValid: false, error: "File size should be less than 5MB" };
    }
    
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "Please select a valid image file (JPEG, PNG, GIF, WebP)" };
    }
    
    return { isValid: true };
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add userId 
      formData.append('userId', profileData?._id);
      formData.append('id', profileData?._id);
      
      // Add all NEW file uploads FIRST
      Object.keys(fileUploads).forEach(key => {
        if (fileUploads[key] instanceof File) {
          formData.append(key, fileUploads[key]);
          console.log(`✅ Appending NEW FILE: ${key}`, fileUploads[key].name, fileUploads[key].size);
        }
      });
      
      // List of fields to include in the update
      const fieldsToUpdate = ['name', 'email', 'phoneNumber', 'bio', 'hindiUsername', 'hindiBio', 'username'];
      
      // Process only the specified fields from profileData
      fieldsToUpdate.forEach(key => {
        const value = profileData[key];
        
        // Skip empty/null values
        if (value === null || value === undefined || value === '') {
          return;
        }
        
        formData.append(key, value);
      });
      
      // Log what's being sent
      console.log("=== FormData Contents ===");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes)`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      console.log("========================");

      const response = await healthService.post('/user/update-profile', formData);
      
      console.log("✅ Response:", response);
      
      // Update the local profile data with the response
      if (response?.data?.data) {
        setProfileData(response.data.data);
      }
      
      // Clear file uploads after successful save
      setFileUploads({
        profileImage: null,
        frameOne: null,
        frameTwo: null,
        frameThree: null
      });
      
      // Success feedback
      alert("Profile updated successfully!");
      
      closeModal();
      
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      console.error("Error response:", error.response?.data);
      
      // Error feedback
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      alert(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generic file change handler for any field
  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const validation = validateFile(file);
      
      if (validation.isValid) {
        // Clear error for this field
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        
        // Store file in LOCAL state for file uploads
        setFileUploads(prev => ({
          ...prev,
          [field]: file
        }));
        
        console.log(`📁 File selected for ${field}:`, file.name, file.size, file.type);
      } else {
        // Set error for this specific field
        setErrors(prev => ({ ...prev, [field]: validation.error }));
      }
    }
  };

  return (
    <div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          
          <div className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>First Name *</Label>
                    <Input
                      type="text"
                      value={getFirstName(profileData?.name)}
                      onChange={(e) => {
                        const lastName = getLastName(profileData?.name);
                        handleInputChange("name", `${e.target.value} ${lastName}`.trim());
                      }}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Profile Image</Label>
                    <FileInput 
                      onChange={handleFileChange("profileImage")}
                      className={`custom-class ${errors.profileImage ? "border-red-500" : ""}`}
                      accept="image/*"
                    />
                    {errors.profileImage && (
                      <p className="mt-1 text-sm text-red-500">{errors.profileImage}</p>
                    )}
                    {fileUploads.profileImage ? (
                      <p className="mt-1 text-xs text-green-600">New file: {fileUploads.profileImage.name}</p>
                    ) : profileData?.profileImage && typeof profileData.profileImage === 'string' ? (
                      <p className="mt-1 text-xs text-gray-500">Current: {profileData.profileImage.split('/').pop()}</p>
                    ) : null}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      value={getLastName(profileData?.name)}
                      onChange={(e) => {
                        const firstName = getFirstName(profileData?.name);
                        handleInputChange("name", `${firstName} ${e.target.value}`.trim());
                      }}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Hindi Name</Label>
                    <Input
                      type="text"
                      value={profileData?.hindiUsername || ""}
                      onChange={(e) => {
                        handleInputChange("hindiUsername", e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      value={profileData?.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={profileData?.phoneNumber || ""}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input
                      type="text"
                      value={profileData?.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Hindi Bio</Label>
                    <Input
                      type="text"
                      value={profileData?.hindiBio || ""}
                      onChange={(e) => handleInputChange("hindiBio", e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                 

                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={closeModal}
                type="button"
                disabled={isLoading}
              >
                Close
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EditProfileModal