import React, { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { healthService } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { usePoster } from '../../context/PosterContext';
import { capitalizePlanName, getButtonStyle, getButtonText } from './pricingComponents';

const PricingDashboard = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
    const { profileData } = useAuth();
    const { setCart, cart } = usePoster();
    const navigate = useNavigate();

    const yearlyDiscount = import.meta.env.VITE_YEARLY_DISCOUNT_PERCENTAGE || 0.10;

    const getPlans = async () => {
        try {
            const response = await healthService.get('/subscription/subscription-plans')
            const sortedPlans = response.data.data.sort((a, b) => a.price - b.price)
            setPlans(sortedPlans)
        } catch (error) {
            console.log(error)
            toast.error("Failed to load plans")
            setPlans([])
        }
    }

    useEffect(() => {
        getPlans();
    }, []);

    const formatPrice = (price) => {
        if (price === 0) return '₹0';
        return `₹${Math.round(price)}`;
    };

    const getPeriod = (price) => {
        if (price === 0) return 'forever';
        return billingCycle === 'monthly' ? 'per month' : 'per year';
    };

    const getDisplayPrice = (plan) => {
        if (plan.price === 0) return 0;
        return billingCycle === 'monthly' ? plan.price : plan.yearlyPrice;
    };

    const calculateSavings = (plan) => {
        if (plan.price === 0) return 0;
        return Math.round(plan.price * 12 * yearlyDiscount);
    };

    const renderFeatures = (plan) => {
        const features = [
            {
                label: `${plan.templatePerEvent || 0} ${plan.templatePerEvent === 1 ? 'Template' : 'Templates'} per Event`,
                enabled: true
            },
            {
                label: `${plan.photoUploadPerEvent || 0} ${plan.photoUploadPerEvent === 1 ? 'Photo Update' : 'Photos Update'} per User`,
                enabled: true
            },
            {
                label: 'Watermark',
                enabled: plan.showWatermark
            },
            {
                label: 'Designation Feature',
                enabled: plan.showDesignation
            }
        ];

        return features.map((feature, index) => (
            <li key={index} className="flex items-center">
                {feature.enabled ? (
                    <Check 
                        className="w-5 h-5 mr-3 flex-shrink-0 text-green-500" 
                    />
                ) : (
                    <X 
                        className="w-5 h-5 mr-3 flex-shrink-0 text-gray-300 dark:text-gray-600" 
                    />
                )}
                <span className={`text-sm ${
                    !feature.enabled 
                        ? 'text-gray-400 dark:text-gray-500 line-through' 
                        : ''
                }`}>
                    {feature.label}
                </span>
            </li>
        ));
    };

    const handleSubscriptionUpdate = async (planId) => {
        const currentDate = new Date();
        const endDate = new Date();
        endDate.setDate(currentDate.getDate() + 31);

        const planDetails = {
            subscriptionPlanId: planId,
            startDate: currentDate,
            endDate: endDate
        }

        const subMappingId = profileData?.subscriptionDetails?._id;
        
        if (!subMappingId) {
            toast.error("Subscription details not found");
            return false;
        }

        try {
            const response = await healthService.post(
                `/subscription-mapping/update-subscription-mapping/${subMappingId}`, 
                planDetails
            );
            
            if (response?.status === 200) {
                toast.success("Free Plan Activated Successfully! 🎉");
                navigate('/dashboard');
                return true;
            }
            
            return false;
        } catch (error) {
            console.error("Subscription update error:", error);
            toast.error("Failed to activate plan");
            return false;
        }
    }

    const handleChoosePlan = async (plan) => {
        console.log("Plan selected:", plan.planName, "ID:", plan._id);
        
        // For free plans, directly activate
        if (plan.price === 0) {
            setLoading(true);
            await handleSubscriptionUpdate(plan._id);
            setLoading(false);
            window.location.reload();
            return;
        }

        // For paid plans, set cart with selected billing cycle
        const cartPlan = {
            ...plan,
            selectedBillingCycle: billingCycle,
            selectedPrice: getDisplayPrice(plan)
        };
        setCart(cartPlan);
        navigate('/checkout');
    };

    return (
        <div>
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Choose Your Perfect Plan</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Start free, upgrade when you need more
                        </p>

                        {/* Billing Cycle Toggle */}
                        <div className="flex justify-center mt-8">
                            <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-white dark:bg-gray-800">
                                <button
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                        billingCycle === 'monthly'
                                            ? 'bg-brand-600 text-white shadow-sm'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                        billingCycle === 'yearly'
                                            ? 'bg-brand-600 text-white shadow-sm'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    Yearly
                                    <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full">
                                        Save {Math.round(yearlyDiscount * 100)}%
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan, index) => (
                            <div 
                                key={plan._id || index} 
                                className="relative rounded-2xl p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {capitalizePlanName(plan.planName)}
                                    </h3>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">
                                            {formatPrice(getDisplayPrice(plan))}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            /{getPeriod(plan.price)}
                                        </span>
                                    </div>
                                    {billingCycle === 'yearly' && plan.price > 0 && (
                                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            Save ₹{calculateSavings(plan)} per year
                                        </div>
                                    )}
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {renderFeatures(plan)}
                                </ul>

                                <button 
                                    onClick={() => handleChoosePlan(plan)} 
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle(plan.planName)}`}
                                >
                                    {loading ? 'Processing...' : getButtonText(plan.planName)}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PricingDashboard