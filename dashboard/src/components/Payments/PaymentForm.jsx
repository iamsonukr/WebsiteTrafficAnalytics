import { useState, useEffect } from "react";
import { healthService } from "../../../api/axios";
import { Modal } from "../../../components/ui/modal";

const PaymentDue = ({ isOpen, onClose, paymentData = null, onSuccess }) => {
    const isEditing = !!paymentData;

    const [formData, setFormData] = useState({
        clientName: "",
        website: "",
        amountDue: "",
        currency: "INR",
        dueDate: "",
        paymentComplete: false,
        messageTitle: "Payment Pending",
        message: "",
        showOnHomepage: true
    });

    const [originalData, setOriginalData] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("");

    // Initialize form data when paymentData prop changes
    useEffect(() => {
        if (paymentData) {
            console.log("This is paymentData", paymentData);
            const initData = {
                clientName: paymentData.clientName || "",
                website: paymentData.website || "",
                amountDue: paymentData.amountDue || "",
                currency: paymentData.currency || "INR",
                dueDate: paymentData.dueDate ? new Date(paymentData.dueDate).toISOString().split('T')[0] : "",
                paymentComplete: paymentData.paymentComplete || false,
                messageTitle: paymentData.messageTitle || "Payment Pending",
                message: paymentData.message || "",
                showOnHomepage: paymentData.showOnHomepage ?? true
            };
            setFormData(initData);
            setOriginalData(initData);
        } else {
            // Reset to empty form for add mode
            const emptyData = {
                clientName: "",
                website: "",
                amountDue: "",
                currency: "INR",
                dueDate: "",
                paymentComplete: false,
                messageTitle: "Payment Pending",
                message: "",
                showOnHomepage: true
            };
            setFormData(emptyData);
            setOriginalData(null);
        }
    }, [paymentData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }

        // Clear success message when user starts typing
        if (success) setSuccess("");
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.clientName.trim()) {
            newErrors.clientName = "Client name is required";
        }

        if (!formData.website.trim()) {
            newErrors.website = "Website is required";
        }

        if (!formData.amountDue || formData.amountDue <= 0) {
            newErrors.amountDue = "Amount due must be greater than 0";
        }

        if (!formData.currency) {
            newErrors.currency = "Currency is required";
        }

        if (!formData.dueDate) {
            newErrors.dueDate = "Due date is required";
        }

        if (!formData.messageTitle.trim()) {
            newErrors.messageTitle = "Message title is required";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCancel = () => {
        if (isEditing && originalData) {
            setFormData({ ...originalData });
            setErrors({});
            setSuccess("");
        } else {
            setFormData({
                clientName: "",
                website: "",
                amountDue: "",
                currency: "INR",
                dueDate: "",
                paymentComplete: false,
                messageTitle: "Payment Pending",
                message: "",
                showOnHomepage: true
            });
        }
    };

    const submitPayment = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const payload = {
                clientName: formData.clientName,
                website: formData.website,
                amountDue: parseFloat(formData.amountDue),
                currency: formData.currency,
                dueDate: new Date(formData.dueDate).toISOString(),
                paymentComplete: formData.paymentComplete,
                messageTitle: formData.messageTitle,
                message: formData.message,
                showOnHomepage: formData.showOnHomepage
            };

            const endpoint = isEditing
                ? `/payment-due/payment-due/${paymentData._id}`
                : "/payment-due/payment-due";

            const method = isEditing ? 'put' : 'post';

            const response = await healthService[method](endpoint, payload);

            console.log(response);
            setSuccess(isEditing ? "Payment updated successfully!" : "Payment created successfully!");

            // Wait a moment to show success message, then close and refresh
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                }
                onClose();
            }, 1000);

        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                setErrors({ general: error.response.data.message || "Invalid data provided" });
            } else if (error.response?.status === 401) {
                setErrors({ general: "You are not authorized to perform this action" });
            } else if (error.response?.status === 404 && isEditing) {
                setErrors({ general: "Payment not found" });
            } else {
                setErrors({ general: "An error occurred. Please try again." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitPayment();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {isEditing ? "Update Payment Due" : "Create New Payment Due"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Client Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Client Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Client Name"
                            value={formData.clientName}
                            onChange={(e) => handleInputChange('clientName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {errors.clientName && (
                            <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
                        )}
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Website <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="example.com"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {errors.website && (
                            <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                        )}
                    </div>

                    {/* Amount Due */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount Due <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="15000"
                            value={formData.amountDue}
                            onChange={(e) => handleInputChange('amountDue', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            min="0"
                            step="0.01"
                        />
                        {errors.amountDue && (
                            <p className="mt-1 text-sm text-red-600">{errors.amountDue}</p>
                        )}
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Currency <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.currency}
                            onChange={(e) => handleInputChange('currency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                        {errors.currency && (
                            <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                        )}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {errors.dueDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                        )}
                    </div>

                    {/* Message Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Payment Pending"
                            value={formData.messageTitle}
                            onChange={(e) => handleInputChange('messageTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        {errors.messageTitle && (
                            <p className="mt-1 text-sm text-red-600">{errors.messageTitle}</p>
                        )}
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Your website services are temporarily limited..."
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows="3"
                        />
                        {errors.message && (
                            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                        )}
                    </div>

                    {/* Show on Homepage */}
                    <div className="md:col-span-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.showOnHomepage}
                                onChange={(e) => handleInputChange('showOnHomepage', e.target.checked)}
                                className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Show on Homepage
                            </span>
                        </label>
                    </div>

                    {/* Payment Complete (only show in edit mode) */}
                    {isEditing && (
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.paymentComplete}
                                    onChange={(e) => handleInputChange('paymentComplete', e.target.checked)}
                                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payment Complete
                                </span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading
                            ? (isEditing ? "Updating Payment..." : "Creating Payment...")
                            : (isEditing ? "Update Payment" : "Create Payment")
                        }
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default PayAmentDue;