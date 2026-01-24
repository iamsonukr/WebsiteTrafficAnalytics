import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ArrowLeft, CreditCard, Tag, Percent } from 'lucide-react';
import { healthService } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { usePoster } from '../../context/PosterContext';
import { toast } from 'react-toastify';
import { capitalizePlanName } from '../PricingPlans/pricingComponents';


const CheckoutPage = () => {
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    
    const { cart } = usePoster();
    const { profileData, token, fetchSubscriptionData } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
        // Redirect if no plan selected
        console.log("This is cart", cart);
        console.log("This is profile", profileData);
    }, [])

    useEffect(() => {
        // Load Razorpay script
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
                document.body.appendChild(script);
            });
        };

        loadRazorpayScript();
    }, [cart, navigate]);

    if (!cart) {
        return null;
    }

    // Calculate prices
    const basePrice = cart.selectedPrice;
    const gstRate = 0.18; // 18% GST

    const gstAmount = parseFloat((basePrice * gstRate).toFixed(2));
    const totalBeforeDiscount = parseFloat((basePrice + gstAmount).toFixed(2));
    
    // Apply coupon discount on total price
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.couponDetails.type === 'flat') {
            discountAmount = appliedCoupon.couponDetails.value;
        } else if (appliedCoupon.couponDetails.type === 'percent') {
            discountAmount = (totalBeforeDiscount * appliedCoupon.couponDetails.value) / 100;
        }
        discountAmount = parseFloat(discountAmount.toFixed(2));
    }
    
    const finalPrice = parseFloat((totalBeforeDiscount - discountAmount).toFixed(2));

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setCouponLoading(true);

        try {
            const response = await healthService.post('/coupan/apply', {
                couponCode: couponCode.toUpperCase(),
                cartValue: totalBeforeDiscount
            });

            if (response.data.success) {
                setAppliedCoupon(response.data.data);
                toast.success('Coupon applied successfully! 🎉');
            } else {
                toast.error(response.data.message || 'Invalid coupon code');
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error('Coupon error:', error);
            const errorMsg = error?.response?.data?.message || 'Failed to apply coupon';
            toast.error(errorMsg);
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setAppliedCoupon(null);
        toast.info('Coupon removed');
    };

    const renderFeatures = (plan) => {
        const features = [
            {
                label: `${plan.photoUploadPerEvent || 0} ${plan.photoUploadPerEvent === 1 ? 'Photo' : 'Photos'} per Event`,
                enabled: true
            },
            {
                label: `${plan.templatePerEvent || 0} ${plan.templatePerEvent === 1 ? 'Template' : 'Templates'} per Event`,
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
            <li key={index} className="flex items-center py-2">
                {feature.enabled ? (
                    <Check className="w-5 h-5 mr-3 flex-shrink-0 text-green-500" />
                ) : (
                    <X className="w-5 h-5 mr-3 flex-shrink-0 text-gray-300 dark:text-gray-600" />
                )}
                <span className={`text-sm ${!feature.enabled
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                    {feature.label}
                </span>
            </li>
        ));
    };

    const handleSubscriptionUpdate = async (planId, paymentId, orderId) => {
        const currentDate = new Date();
        const endDate = new Date();
        endDate.setDate(currentDate.getDate() + 31);

        const planDetails = {
            subscriptionPlanId: planId,
            startDate: currentDate,
            endDate: endDate,
            paymentId,
            orderId,
            ...(appliedCoupon && { 
                couponCode: appliedCoupon.couponDetails.code,
                discountAmount: discountAmount 
            })
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
                toast.success("Subscription activated successfully! 🎉");
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2500);
            }

            return false;
        } catch (error) {
            console.error("Subscription update error:", error);
            toast.error("Failed to activate subscription");
            return false;
        }
    }

    const handlePayment = async () => {
        if (!window.Razorpay) {
            toast.error("Payment gateway not loaded. Please refresh the page.");
            return;
        }
        const currency = 'INR';
        const amount = Math.round(finalPrice * 100); // Use final price after discount
        const receiptId = `receipt_${Date.now()}`;

        try {
            setLoading(true);

            // Create order with final amount
            const orderResponse = await healthService.post(
                `/order/place`,
                {
                    amount,
                    currency,
                    receipt: receiptId,
                    planId: cart._id,
                    planName: cart.planName,
                    ...(appliedCoupon && { 
                        couponCode: appliedCoupon.couponDetails.code,
                        discountAmount: discountAmount 
                    })
                }
            );

            console.log("Order created:", orderResponse);

            const order = orderResponse.data.order || orderResponse.data;

            // Configure Razorpay payment window
            const razorpayId = import.meta.env.VITE_RAZORPAY_KEY_ID
            const paymentWindowConfig = {
                key: razorpayId,
                amount: order.amount,
                currency: order.currency,
                name: "Subscription Payment",
                description: `${capitalizePlanName(cart.planName)} Plan`,
                order_id: order.id,
                handler: async (response) => {
                    console.log("Payment Successful:", response);

                    try {
                        // Verify payment
                        const validateRes = await healthService.post(
                            `/order/verify`,
                            {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                planId: cart._id
                            }
                        );

                        console.log("Validation response:", validateRes.data);

                        if (validateRes.data.msg === "success" || validateRes.data.success) {
                            // Update subscription after successful payment
                            await handleSubscriptionUpdate(
                                cart._id,
                                response.razorpay_payment_id,
                                response.razorpay_order_id
                            );
                        } else {
                            toast.error("Payment verification failed");
                            setLoading(false);
                        }
                    } catch (error) {
                        console.error("Payment validation failed:", error);
                        toast.error("Payment verification failed. Please contact support.");
                        setLoading(false);
                    }
                },
                prefill: {
                    name: profileData?.name || "",
                    email: profileData?.email || "",
                    contact: profileData?.phone || ""
                },
                theme: {
                    color: "#3b82f6"
                },
                modal: {
                    ondismiss: () => {
                        console.log("Payment modal dismissed");
                        setLoading(false);
                    }
                }
            };

            // Create and open payment window
            const paymentWindow = new window.Razorpay(paymentWindowConfig);

            paymentWindow.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                toast.error(`Payment failed: ${response.error.description}`);
                setLoading(false);
            });

            paymentWindow.open();
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error("Error processing payment. Please try again.");
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/pricing')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Plans
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-8 py-10">
                        <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Review your subscription details below
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Plan Details */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Plan Details</h2>
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {capitalizePlanName(cart.planName)}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Monthly Subscription
                                    </p>

                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                        <h4 className="font-semibold mb-3">Features Included:</h4>
                                        <ul className="space-y-2">
                                            {renderFeatures(cart)}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Billing Details with Coupon */}
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
                                
                                {/* Coupon Section */}
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-6 mb-6 border-2 border-indigo-200 dark:border-indigo-500">
                                    <div className="flex items-center mb-3">
                                        <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                                        <h4 className="font-semibold text-gray-800 dark:text-white">Have a Coupon Code?</h4>
                                    </div>
                                    
                                    {!appliedCoupon ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="Enter coupon code"
                                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-600 dark:text-white uppercase"
                                                disabled={couponLoading}
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                                            >
                                                {couponLoading ? 'Applying...' : 'Apply'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    <div>
                                                        <span className="font-semibold text-green-800 dark:text-green-300">
                                                            {appliedCoupon.couponDetails.code}
                                                        </span>
                                                        <p className="text-xs text-green-700 dark:text-green-400">
                                                            {appliedCoupon.couponDetails.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleRemoveCoupon}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                                                <Percent className="w-4 h-4" />
                                                <span>
                                                    {appliedCoupon.couponDetails.type === 'flat'
                                                        ? `Flat ₹${appliedCoupon.couponDetails.value} off`
                                                        : `${appliedCoupon.couponDetails.value}% off`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* User Details */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                                    <div className="space-y-3 mb-6">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                            <p className="font-medium">{profileData?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="font-medium">{profileData?.email || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                            <p className="font-medium">{profileData?.phoneNumber || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                        <h4 className="font-semibold mb-3">Price Breakdown</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                                                <span className="font-medium">₹{basePrice}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                                                <span className="font-medium">₹{gstAmount}</span>
                                            </div>
                                            {appliedCoupon && (
                                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                                    <span className="font-medium">Coupon Discount</span>
                                                    <span className="font-semibold">- ₹{discountAmount}</span>
                                                </div>
                                            )}
                                            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total Amount</span>
                                                    <span className={appliedCoupon ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}>
                                                        ₹{finalPrice}
                                                    </span>
                                                </div>
                                                {appliedCoupon && (
                                                    <div className="text-right text-sm text-gray-500 dark:text-gray-400 line-through">
                                                        ₹{totalBeforeDiscount}
                                                    </div>
                                                )}
                                            </div>
                                            {appliedCoupon && (
                                                <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-600 rounded-lg p-2 text-center mt-2">
                                                    <p className="text-green-800 dark:text-green-300 text-sm font-semibold">
                                                        You saved ₹{discountAmount}! 🎉
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {loading ? (
                                        <span>Processing...</span>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Continue to Payment
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                    Secure payment powered by Razorpay
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;