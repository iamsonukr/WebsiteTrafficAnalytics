import { useState, useEffect } from "react";
import { healthService } from "../../../api/axios";
import SubscriptionFormComponent from "./SubscriptionFormComponent";
import { Modal } from "../../../components/ui/modal";

// Main AddSubscription Component
const AddSubscription = ({ isOpen, closeModal, subscriptionData = null }) => {
    const isEditing = !!subscriptionData;

    const [formData, setFormData] = useState({
        planName: "",
        status: "active",
        price: "",
        yearlyPrice: "",
        photoUploadPerEvent: 1,
        templatePerEvent: 1,
        showWatermark: true,
        showDesignation: false
    });
    
    const [originalData, setOriginalData] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState("");

    // Calculate yearly price automatically
    useEffect(() => {
        if (formData.price && !isNaN(parseFloat(formData.price))) {
            const monthlyPrice = parseFloat(formData.price);
            const yearlyPrice = (monthlyPrice * 12 * 0.9).toFixed(2); // 10% discount
            setFormData(prev => ({
                ...prev,
                yearlyPrice: yearlyPrice
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                yearlyPrice: ""
            }));
        }
    }, [formData.price]);

    const handleDelete = async () => {
        if (!isEditing || !subscriptionData?._id) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this subscription?");
        if (!confirmDelete) return;
        setIsLoading(true);
        setErrors({});
        try {
            const response = await healthService.delete(`/subscription/admin/subscription-plan/${subscriptionData._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response);
            setSuccess("Subscription deleted successfully!");
            setTimeout(() => {
                closeModal();
            }, 1500);
        } catch (error) {
            console.log(error); 
            if (error.response?.status === 400) {
                setErrors({ general: error.response.data.message || "Invalid request" });
            } else if (error.response?.status === 401) {
                setErrors({ general: "You are not authorized to perform this action" });
            } else if (error.response?.status === 404) {
                setErrors({ general: "Subscription not found" });
            } else {
                setErrors({ general: "An error occurred. Please try again." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize form data when subscriptionData prop changes
    useEffect(() => {
        if (subscriptionData) {
            console.log("This is subscriptionData", subscriptionData);
            const monthlyPrice = subscriptionData.price || "";
            const yearlyPrice = monthlyPrice ? Math.round(parseFloat(monthlyPrice) * 12 * 0.10) : "";
            
            const initData = {
                planName: subscriptionData.planName || "",
                status: subscriptionData.status === "active" ? "active" : "inactive",
                price: monthlyPrice,
                yearlyPrice: yearlyPrice,
                photoUploadPerEvent: subscriptionData.photoUploadPerEvent || 1,
                templatePerEvent: subscriptionData.templatePerEvent || 1,
                showWatermark: subscriptionData.showWatermark !== undefined ? subscriptionData.showWatermark : true,
                showDesignation: subscriptionData.showDesignation !== undefined ? subscriptionData.showDesignation : false
            };
            setFormData(initData);
            setOriginalData(initData);
        } else {
            const emptyData = {
                planName: "",
                status: "active",
                price: "",
                yearlyPrice: "",
                photoUploadPerEvent: 1,
                templatePerEvent: 1,
                showWatermark: true,
                showDesignation: false
            };
            setFormData(emptyData);
            setOriginalData(null);
        }
    }, [subscriptionData]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
        if (success) setSuccess("");
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.planName || formData.planName.trim() === "") {
            newErrors.planName = "Plan name is required";
        }
        
        if (!formData.price || formData.price === "") {
            newErrors.price = "Price is required";
        } else if (parseFloat(formData.price) < 0) {
            newErrors.price = "Price cannot be negative";
        }
        
        if (!formData.photoUploadPerEvent || formData.photoUploadPerEvent === "") {
            newErrors.photoUploadPerEvent = "Photos per event is required";
        } else if (parseInt(formData.photoUploadPerEvent) < 0) {
            newErrors.photoUploadPerEvent = "Photos per event cannot be negative";
        }
        
        if (!formData.templatePerEvent || formData.templatePerEvent === "") {
            newErrors.templatePerEvent = "Templates per event is required";
        } else if (parseInt(formData.templatePerEvent) < 0) {
            newErrors.templatePerEvent = "Templates per event cannot be negative";
        }
        
        if (formData.showWatermark === undefined || formData.showWatermark === null) {
            newErrors.showWatermark = "Watermark setting is required";
        }
        
        if (formData.showDesignation === undefined || formData.showDesignation === null) {
            newErrors.showDesignation = "Designation setting is required";
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
                planName: "",
                status: "active",
                price: "",
                yearlyPrice: "",
                photoUploadPerEvent: 1,
                templatePerEvent: 1,
                showWatermark: true,
                showDesignation: false
            });
        }
    };

    const addSubscription = async () => {
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        setErrors({});
        console.log("This is subscription data", subscriptionData);
        
        try {
            const apiData = {
                planName: formData.planName,
                status: formData.status,
                price: parseFloat(formData.price),
                yearlyPrice: parseFloat(formData.yearlyPrice),
                photoUploadPerEvent: parseInt(formData.photoUploadPerEvent),
                templatePerEvent: parseInt(formData.templatePerEvent),
                showWatermark: formData.showWatermark,
                showDesignation: formData.showDesignation
            };

            const endpoint = isEditing
                ? `/subscription/admin/subscription-plan/${subscriptionData._id}`
                : "/subscription/admin/add-subscription-plan";

            const response = await healthService.post(endpoint, apiData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log(response);
            setSuccess(isEditing ? "Subscription updated successfully!" : "Subscription added successfully!");
            
            if (!isEditing) {
                setFormData({
                    planName: "",
                    status: "active",
                    price: "",
                    yearlyPrice: "",
                    photoUploadPerEvent: 1,
                    templatePerEvent: 1,
                    showWatermark: true,
                    showDesignation: false
                });
            }
            
            setTimeout(() => {
                closeModal();
            }, 1500);
            
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                setErrors({ general: error.response.data.message || "Invalid data provided" });
            } else if (error.response?.status === 401) {
                setErrors({ general: "You are not authorized to perform this action" });
            } else if (error.response?.status === 404 && isEditing) {
                setErrors({ general: "Subscription not found" });
            } else {
                setErrors({ general: "An error occurred. Please try again." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addSubscription();
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                {isEditing ? "Update Subscription" : "Add New Subscription"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-2">
                {errors.general && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                        {errors.general}
                    </div>
                )}
                
                {success && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                        {success}
                    </div>
                )}

                <div className="gap-1">
                    <SubscriptionFormComponent
                        formData={formData}
                        onInputChange={handleInputChange}
                        errors={errors}
                        isLoading={isLoading}
                        isEditing={isEditing}
                    />
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading
                            ? (isEditing ? "Updating Subscription..." : "Adding Subscription...")
                            : (isEditing ? "Update Subscription" : "Add Subscription")
                        }
                    </button>
                    {isEditing && (
                        <>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="flex-1 flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex-1 flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default AddSubscription;