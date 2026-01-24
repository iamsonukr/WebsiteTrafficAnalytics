import { useState } from "react";

// SubscriptionFormComponent.js  
const SubscriptionFormComponent = ({ formData, onInputChange, errors, isLoading, isEditing }) => {
    const planOptions = ['free', 'basic', 'premium'];

    const handleNumberInput = (field, value) => {
        // Only allow positive integers
        if (value === '' || /^\d+$/.test(value)) {
            onInputChange(field, value === '' ? '' : parseInt(value, 10));
        }
    };

    return (
        <div className="space-y-6">
            {/* Plan Name and Price - Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Plan Name Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Plan Name <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.planName}
                        onChange={(e) => onInputChange('planName', e.target.value)}
                        disabled={isLoading}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                            errors.planName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } ${isLoading ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                    >
                        <option value="">Select a plan</option>
                        {planOptions.map((plan) => (
                            <option key={plan} value={plan}>
                                {plan.charAt(0).toUpperCase() + plan.slice(1)}
                            </option>
                        ))}
                    </select>
                    {errors.planName && (
                        <p className="mt-1 text-sm text-red-600">{errors.planName}</p>
                    )}
                </div>

                {/* Price Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Monthly Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        placeholder="Enter monthly price"
                        value={formData.price}
                        onChange={(e) => onInputChange('price', e.target.value)}
                        disabled={isLoading}
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                            errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } ${isLoading ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                    />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                </div>

                {/* Yearly Price Input - Read Only */}
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Yearly Price (Auto-calculated: Monthly × 12 - 10% discount)
                    </label>
                    <input
                        type="number"
                        placeholder="Auto-calculated"
                        value={formData.yearlyPrice}
                                                onChange={(e) => onInputChange('yearlyPrice', e.target.value)}

                        step="0.01"
                        className="w-full px-3 py-2 border rounded-md shadow-sm bg-gray-100 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 border-gray-300"
                    />
                  {formData.yearlyPrice && (
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Saves ₹{formData.price ? Math.round(parseFloat(formData.price) * 12 * 0.1) : '0'} per year (10% discount)
    </p>
)}
                </div>
            </div>

            {/* Feature Fields Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Plan Features
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Photo Upload Per Event */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Photos per Event <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter number of photos"
                            value={formData.photoUploadPerEvent}
                            onChange={(e) => handleNumberInput('photoUploadPerEvent', e.target.value)}
                            disabled={isLoading}
                            min="0"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                                errors.photoUploadPerEvent ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } ${isLoading ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                        />
                        {errors.photoUploadPerEvent && (
                            <p className="mt-1 text-sm text-red-600">{errors.photoUploadPerEvent}</p>
                        )}
                    </div>

                    {/* Template Per Event */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Templates per Event <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter number of templates"
                            value={formData.templatePerEvent}
                            onChange={(e) => handleNumberInput('templatePerEvent', e.target.value)}
                            disabled={isLoading}
                            min="0"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
                                errors.templatePerEvent ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } ${isLoading ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                        />
                        {errors.templatePerEvent && (
                            <p className="mt-1 text-sm text-red-600">{errors.templatePerEvent}</p>
                        )}
                    </div>

                    {/* Watermark Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Show Watermark <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={() => onInputChange('showWatermark', !formData.showWatermark)}
                                disabled={isLoading}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    formData.showWatermark ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        formData.showWatermark ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {formData.showWatermark ? 'Yes' : 'No'}
                            </span>
                        </div>
                        {errors.showWatermark && (
                            <p className="mt-1 text-sm text-red-600">{errors.showWatermark}</p>
                        )}
                    </div>

                    {/* Designation Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enable Designation <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={() => onInputChange('showDesignation', !formData.showDesignation)}
                                disabled={isLoading}
                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    formData.showDesignation ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        formData.showDesignation ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {formData.showDesignation ? 'Yes' : 'No'}
                            </span>
                        </div>
                        {errors.showDesignation && (
                            <p className="mt-1 text-sm text-red-600">{errors.showDesignation}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Toggle */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                </label>
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => onInputChange('status', formData.status === 'active' ? 'inactive' : 'active')}
                        disabled={isLoading}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                            formData.status === 'active' ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                formData.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                    </button>
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formData.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionFormComponent;