import React, { useState } from 'react'


import { Link, useNavigate } from "react-router";

// You'll need to import these icons or replace with your icon components
import { EyeIcon, EyeCloseIcon } from "../../icons"; // Adjust path as needed
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/button/Button';
import { healthService } from '../../api/axios';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Assuming you might need user context

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear specific field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
        
        // Clear success message when user starts typing
        if (success) setSuccess("");
    };

    const validatePassword = (password) => {
        const errors = [];
        
        if (password.length < 8) {
            errors.push("at least 8 characters");
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push("one uppercase letter");
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push("one lowercase letter");
        }
        
        if (!/[0-9]/.test(password)) {
            errors.push("one number");
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
            errors.push("one special character");
        }
        
        return errors;
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate old password
        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = "Old password is required";
        }

        // Validate new password
        if (!formData.newPassword.trim()) {
            newErrors.newPassword = "New password is required";
        } else {
            const passwordErrors = validatePassword(formData.newPassword);
            if (passwordErrors.length > 0) {
                newErrors.newPassword = `Password must contain ${passwordErrors.join(", ")}`;
            }
        }

        // Validate confirm password
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Check if new password is same as old password
        if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = "New password must be different from old password";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const changePassword = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await healthService.post("/user/change-password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword:formData.confirmPassword
            });
            
            console.log(response);
            setSuccess("Password changed successfully!");
            
            // Reset form
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // Optional: Redirect after success
            setTimeout(() => {
                navigate("/profile"); // Adjust redirect path as needed
            }, 2000);

        } catch (error) {
            console.log(error);
            
            // Handle different error scenarios
            if (error.response?.status === 400) {
                setErrors({ currentPassword: "Current password is incorrect" });
            } else if (error.response?.status === 401) {
                setErrors({ general: "You are not authorized to perform this action" });
            } else {
                setErrors({ general: "An error occurred. Please try again." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        changePassword();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            changePassword();
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {errors.general}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                        {success}
                    </div>
                )}

                {/* Old Password */}
                <div>
                    <Label>
                        Old Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword.old ? "text" : "password"}
                            placeholder="Enter your current password"
                            value={formData.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className={errors.currentPassword ? "border-red-500" : ""}
                        />
                        <span
                            onClick={() => togglePasswordVisibility('old')}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                            {showPassword.old ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                        </span>
                    </div>
                    {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                    )}
                </div>

                {/* New Password */}
                <div>
                    <Label>
                        New Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword.new ? "text" : "password"}
                            placeholder="Enter your new password"
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className={errors.newPassword ? "border-red-500" : ""}
                        />
                        <span
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                            {showPassword.new ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                        </span>
                    </div>
                    {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character
                    </p>
                </div>

                {/* Confirm Password */}
                <div>
                    <Label>
                        Confirm Password <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword.confirm ? "text" : "password"}
                            placeholder="Confirm your new password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        <span
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                            {showPassword.confirm ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                        </span>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? "Changing Password..." : "Change Password"}
                </Button>
            </form>
        </div>
    );
};

export default ChangePassword;