import React, { useState, useEffect } from 'react'
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { healthService } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import FileInput from './../../components/form/input/FileInput';

const AddUser = ({ isOpen, closeModal, user, fetchUsers }) => {

    const { UserRole } = useAuth()
    const [profileImage, setProfilePic] = useState(null)


    useEffect(()=>{
        console.log("this is user",user)
    },[])
    
    // Separate state for frame uploads
    const [frameUploads, setFrameUploads] = useState({
        frameOne: null,
        frameTwo: null,
        frameThree: null
    });

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        bio: '',
        isActive: true,
        activeFrame: 'frameOne' // Default active frame
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Initialize form data when modal opens or user changes
    useEffect(() => {
        if (isOpen) {
            if (user) {
                // Edit mode - populate with user data
                setFormData({
                    name: user.name || '',
                    username: user.username || '',
                    email: user.email || '',
                    password: '', // Don't show existing password
                    phoneNumber: user.phoneNumber || user.phone || '',
                    bio: user.bio || '',
                    isActive: user.isActive !== undefined ? user.isActive : true,
                    activeFrame: user.activeFrame || 'frameOne'
                });
            } else {
                // Add mode - reset to empty
                setFormData({
                    name: '',
                    username: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    bio: '',
                    isActive: true,
                    activeFrame: 'frameOne'
                });
            }
            setProfilePic(null);
            setFrameUploads({
                frameOne: null,
                frameTwo: null,
                frameThree: null
            });
            setErrors({});
        }
    }, [isOpen, user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateFile = (file, fieldName) => {
        if (!file) return { isValid: true };

        const maxSize = 1048576; // 1 MB
        const allowedTypes = ['image/png'];

        if (file.size > maxSize) {
            return { 
                isValid: false, 
                error: 'File size must be less than 1 MB' 
            };
        }

        if (!allowedTypes.includes(file.type)) {
            return { 
                isValid: false, 
                error: 'Only PNG files are allowed' 
            };
        }

        return { isValid: true };
    };

    const handleProfilePic = (e) => {
        const file = e.target.files?.[0];
        
        if (!file) {
            setProfilePic(null);
            return;
        }

        const validation = validateFile(file, 'profileImage');
        
        if (validation.isValid) {
            setErrors(prev => ({
                ...prev,
                profileImage: ''
            }));
            setProfilePic(file);
        } else {
            setErrors(prev => ({
                ...prev,
                profileImage: validation.error
            }));
            setProfilePic(null);
        }
    };

    const handleFrameChange = (frameName) => (e) => {
        const file = e.target.files?.[0];
        
        if (!file) {
            return;
        }

        const validation = validateFile(file, frameName);
        
        if (validation.isValid) {
            setErrors(prev => ({
                ...prev,
                [frameName]: ''
            }));
            setFrameUploads(prev => ({
                ...prev,
                [frameName]: file
            }));
            console.log(`📁 Frame selected: ${frameName}`, file.name);
        } else {
            setErrors(prev => ({
                ...prev,
                [frameName]: validation.error
            }));
            setFrameUploads(prev => ({
                ...prev,
                [frameName]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }

        // Phone number validation (optional but validated if provided)
        if (formData.phoneNumber && formData.phoneNumber.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(formData.phoneNumber)) {
                newErrors.phoneNumber = 'Phone number format is invalid';
            } else if (formData.phoneNumber.replace(/\D/g, '').length < 10) {
                newErrors.phoneNumber = 'Phone number must be at least 10 digits';
            }
        }

        // Bio validation (optional but validated if provided)
        if (formData.bio && formData.bio.trim()) {
            if (formData.bio.trim().length > 500) {
                newErrors.bio = 'Bio must be less than 500 characters';
            }
        }

        // Password validation (only for new users)
        if (!user) {
            if (!formData.password.trim()) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
        } else {
            // For edit mode, only validate if password is provided
            if (formData.password && formData.password.trim() && formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDelete = async () => {
        if (!user?._id) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`
        );
        if (!confirmDelete) return;

        try {
            setLoading(true);
            const response = await healthService.delete(`/user/delete-user/${user._id}`);

            if (response.data.status === "success") {
                alert("User deleted successfully");
                closeModal();
                window.location.reload();
            } else {
                alert(response.data.message || "Failed to delete user");
            }
        } catch (error) {
            console.error('Delete error:', error);
            const errorMessage = error.response?.data?.message || "Error deleting user";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            let response;

            // Create FormData for multipart request
            const payload = new FormData();

            // Add text fields
            payload.append('name', formData.name.trim());
            payload.append('username', formData.username.trim());
            payload.append('email', formData.email.trim());
            payload.append('isActive', formData.isActive);
            payload.append('activeFrame', formData.activeFrame);

            if (formData.password && formData.password.trim()) {
                payload.append('password', formData.password);
            }

            if (formData.phoneNumber && formData.phoneNumber.trim()) {
                payload.append('phoneNumber', formData.phoneNumber.trim());
            }

            if (formData.bio && formData.bio.trim()) {
                payload.append('bio', formData.bio.trim());
            }

            // Add profile picture if selected
            if (profileImage) {
                payload.append('profileImage', profileImage);
                console.log('✅ Adding profileImage:', profileImage.name);
            }

            // Add frame files if selected
            if (frameUploads.frameOne) {
                payload.append('frameOne', frameUploads.frameOne);
                console.log('✅ Adding frameOne:', frameUploads.frameOne.name);
            }
            if (frameUploads.frameTwo) {
                payload.append('frameTwo', frameUploads.frameTwo);
                console.log('✅ Adding frameTwo:', frameUploads.frameTwo.name);
            }
            if (frameUploads.frameThree) {
                payload.append('frameThree', frameUploads.frameThree);
                console.log('✅ Adding frameThree:', frameUploads.frameThree.name);
            }

            // Log FormData contents
            console.log("=== FormData Contents ===");
            for (let pair of payload.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes)`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }

            if (user) {
                // Update existing user
                console.log("Sending this payload",payload)
                response = await healthService.put(`/user/admin/update-profile/${user._id}`, payload);
                
                if (response.status === 200) {
                    alert("User updated successfully");
                    // return
                    closeModal();
                    window.location.reload();
                } else {
                    alert(response.data?.message || "Update failed");
                }
            } else {
                // Create new user
                response = await healthService.post('/user/register', payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200 || response.status === 201) {
                    alert("User added successfully");
                    closeModal();
                    window.location.reload();
                } else {
                    alert(response.data?.message || "Registration failed");
                }
            }
            fetchUsers()
            closeModal()
        } catch (error) {
            console.error('Save error:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                "Error saving user";
            alert(errorMessage);
        } finally {
            setLoading(false);
            
        }
    };

    const isEditMode = !!user;

    return (
        <div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            {isEditMode ? 'Edit User' : 'Add New User'}
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            {isEditMode
                                ? 'Update user details to keep information current.'
                                : 'Enter user details to create a new account.'
                            }
                        </p>
                    </div>

                    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    User Information
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    {/* Name Field */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="name">
                                            Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>
                                        )}
                                    </div>

                                    {/* Username Field */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="username">
                                            Username <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="Enter username"
                                            className={errors.username ? 'border-red-500' : ''}
                                        />
                                        {errors.username && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.username}</span>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="email">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter email address"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>
                                        )}
                                    </div>

                                    {/* Phone Number Field */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="phoneNumber">
                                            Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            placeholder="Enter phone number"
                                            className={errors.phoneNumber ? 'border-red-500' : ''}
                                        />
                                        {errors.phoneNumber && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.phoneNumber}</span>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="password">
                                            {isEditMode ? 'New Password' : 'Password'} 
                                            {!isEditMode && <span className="text-red-500"> *</span>}
                                            {isEditMode && <span className="text-gray-400 text-xs"> (Leave blank to keep current)</span>}
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                                            className={errors.password ? 'border-red-500' : ''}
                                        />
                                        {errors.password && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>
                                        )}
                                    </div>

                                    {/* Profile Image Field */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="profileImage">
                                            Profile Image 
                                            <span className="text-gray-400 text-xs"> (PNG only, max 1 MB)</span>
                                            <span className="text-gray-400 text-xs"> (Optional)</span>
                                        </Label>
                                        <FileInput
                                            id="profileImage"
                                            onChange={handleProfilePic}
                                            accept=".png"
                                            className={errors.profileImage ? 'border-red-500' : ''}
                                        />
                                        {profileImage && (
                                            <p className="text-xs text-green-600 mt-1">
                                                ✓ {profileImage.name}
                                            </p>
                                        )}
                                        {!profileImage && isEditMode && user?.profileImage && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Current: {user.profileImage.split('/').pop()}
                                            </p>
                                        )}
                                        {errors.profileImage && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.profileImage}</span>
                                        )}
                                    </div>

                                    {/* Bio Field */}
                                    <div className="col-span-2">
                                        <Label htmlFor="bio">
                                            Bio <span className="text-gray-400 text-xs">(max 500 characters)</span>
                                            <span className="text-gray-400 text-xs"> (Optional)</span>
                                        </Label>
                                        <textarea
                                            id="bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Enter a short bio"
                                            rows="3"
                                            maxLength="500"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none ${
                                                errors.bio ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <div className="flex justify-between items-center mt-1">
                                            <div>
                                                {errors.bio && (
                                                    <span className="text-red-500 text-xs">{errors.bio}</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {formData.bio.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    {/* Active Status Checkbox */}
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                            />
                                            <Label htmlFor="isActive" className="cursor-pointer mb-0">
                                                Active User
                                            </Label>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                                            Inactive users cannot log in to the system
                                        </p>
                                    </div>

                                    {/* Frames Section */}
                                    <div className="col-span-2">
                                        <h5 className="mb-4 mt-4 text-lg font-medium text-gray-800 dark:text-white/90 border-t pt-4">
                                            Profile Frames <span className="text-gray-400 text-xs">(Optional)</span>
                                        </h5>
                                    </div>

                                    {/* Frame One */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="frameOne">
                                            Frame One
                                            <span className="text-gray-400 text-xs"> (PNG only, max 1 MB)</span>
                                        </Label>
                                        <FileInput
                                            id="frameOne"
                                            onChange={handleFrameChange('frameOne')}
                                            accept=".png"
                                            className={errors.frameOne ? 'border-red-500' : ''}
                                        />
                                        {frameUploads.frameOne && (
                                            <p className="text-xs text-green-600 mt-1">
                                                ✓ New: {frameUploads.frameOne.name}
                                            </p>
                                        )}
                                        {!frameUploads.frameOne && isEditMode && user?.frameOne && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Current: {user.frameOne.split('/').pop()}
                                            </p>
                                        )}
                                        {errors.frameOne && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.frameOne}</span>
                                        )}
                                    </div>

                                    {/* Frame Two */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="frameTwo">
                                            Frame Two
                                            <span className="text-gray-400 text-xs"> (PNG only, max 1 MB)</span>
                                        </Label>
                                        <FileInput
                                            id="frameTwo"
                                            onChange={handleFrameChange('frameTwo')}
                                            accept=".png"
                                            className={errors.frameTwo ? 'border-red-500' : ''}
                                        />
                                        {frameUploads.frameTwo && (
                                            <p className="text-xs text-green-600 mt-1">
                                                ✓ New: {frameUploads.frameTwo.name}
                                            </p>
                                        )}
                                        {!frameUploads.frameTwo && isEditMode && user?.frameTwo && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Current: {user.frameTwo.split('/').pop()}
                                            </p>
                                        )}
                                        {errors.frameTwo && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.frameTwo}</span>
                                        )}
                                    </div>

                                    {/* Frame Three */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="frameThree">
                                            Frame Three
                                            <span className="text-gray-400 text-xs"> (PNG only, max 1 MB)</span>
                                        </Label>
                                        <FileInput
                                            id="frameThree"
                                            onChange={handleFrameChange('frameThree')}
                                            accept=".png"
                                            className={errors.frameThree ? 'border-red-500' : ''}
                                        />
                                        {frameUploads.frameThree && (
                                            <p className="text-xs text-green-600 mt-1">
                                                ✓ New: {frameUploads.frameThree.name}
                                            </p>
                                        )}
                                        {!frameUploads.frameThree && isEditMode && user?.frameThree && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Current: {user.frameThree.split('/').pop()}
                                            </p>
                                        )}
                                        {errors.frameThree && (
                                            <span className="text-red-500 text-xs mt-1 block">{errors.frameThree}</span>
                                        )}
                                    </div>

                                    {/* Active Frame Selector */}
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label htmlFor="activeFrame">
                                            Active Frame
                                        </Label>
                                        <select
                                            id="activeFrame"
                                            name="activeFrame"
                                            value={formData.activeFrame}
                                            onChange={handleInputChange}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="frameOne">Frame One</option>
                                            <option value="frameTwo">Frame Two</option>
                                            <option value="frameThree">Frame Three</option>
                                        </select>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Select which frame to display on the profile
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 px-2 mt-6 flex-wrap lg:justify-end">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={closeModal}
                                disabled={loading}
                                type="button"
                            >
                                Cancel
                            </Button>

                            {(isEditMode && UserRole === "admin") && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    type="button"
                                    className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    {loading ? 'Deleting...' : 'Delete User'}
                                </Button>
                            )}

                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={loading}
                                type="button"
                            >
                                {loading
                                    ? (isEditMode ? 'Updating...' : 'Creating...')
                                    : (isEditMode ? 'Update User' : 'Create User')
                                }
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default AddUser