import React, { useState } from 'react';
import { Tag, Percent, Check, AlertCircle, ShoppingCart } from 'lucide-react';

export default function ApplyCoupon() {
  const [couponCode, setCouponCode] = useState('');
  const [cartValue, setCartValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleApplyCoupon = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:5000/api/coupan/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_JWT_TOKEN_HERE` // Replace with actual token
        },
        body: JSON.stringify({
          couponCode: couponCode.toUpperCase(),
          cartValue: parseFloat(cartValue)
        })
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.data);
        setError(null);
      } else {
        setError(data.message);
        setResponse(null);
      }
    } catch (err) {
      setError('Failed to apply coupon. Please try again.');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCouponCode('');
    setCartValue('');
    setResponse(null);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (couponCode && cartValue >= 1000) {
      handleApplyCoupon();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Apply Coupon</h1>
          <p className="text-gray-600">Enter your coupon code to get amazing discounts</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div>
            {/* Coupon Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code (e.g., SAVE100)"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg uppercase"
                />
                <Tag className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Cart Value Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cart Value (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={cartValue}
                  onChange={(e) => setCartValue(e.target.value)}
                  placeholder="Enter cart value (Min: 1000)"
                  min="1000"
                  step="0.01"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                />
                <ShoppingCart className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum cart value: ₹1000</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleApplyCoupon}
                disabled={loading || !couponCode || !cartValue || cartValue < 1000}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Applying...' : 'Apply Coupon'}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Coupon Invalid</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Response */}
        {response && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-green-800">Coupon Applied Successfully!</h3>
            </div>

            {/* Coupon Details */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-gray-700">
                  {response.couponDetails.code}
                </span>
                <span className="text-gray-500">-</span>
                <span className="text-gray-600">{response.couponDetails.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Percent className="w-4 h-4" />
                <span>
                  {response.couponDetails.type === 'flat' 
                    ? `Flat ₹${response.couponDetails.value} off`
                    : `${response.couponDetails.value}% off`
                  }
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Original Amount:</span>
                <span className="font-semibold">₹{response.originalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span className="font-semibold">- ₹{response.discountAmount.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-300"></div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Final Amount:</span>
                <span className="text-green-600">₹{response.finalAmount.toFixed(2)}</span>
              </div>
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                <p className="text-green-800 font-semibold">
                  You saved ₹{response.discountAmount.toFixed(2)}! 🎉
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Coupons */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-gray-800 mb-3">Sample Coupons to Try:</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div>
                <span className="font-semibold text-indigo-700">SAVE100</span>
                <span className="text-gray-600 text-sm ml-2">- Flat ₹100 off</span>
              </div>
              <button
                onClick={() => setCouponCode('SAVE100')}
                className="text-indigo-600 text-sm font-semibold hover:text-indigo-800"
              >
                Apply
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div>
                <span className="font-semibold text-indigo-700">PERCENT20</span>
                <span className="text-gray-600 text-sm ml-2">- 20% off</span>
              </div>
              <button
                onClick={() => setCouponCode('PERCENT20')}
                className="text-indigo-600 text-sm font-semibold hover:text-indigo-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}