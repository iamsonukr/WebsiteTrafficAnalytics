import React, { useState } from 'react';
import { Edit2, Globe, Calendar, DollarSign, CheckCircle, XCircle, Eye, Maximize2 } from 'lucide-react';

const PaymentCard = ({ payment, onMarkPaid, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    clientName: payment.clientName || '',
    website: payment.website || '',
    amountDue: payment.amountDue || '',
    currency: payment.currency || 'INR',
    dueDate: payment.dueDate ? payment.dueDate.split('T')[0] : '',
    messageTitle: payment.messageTitle || '',
    message: payment.message || '',
    showOnHomepage: payment.showOnHomepage ?? true,
    showFullScreen: payment.showFullScreen ?? false
  });

  const isOverdue = new Date(payment.dueDate) < new Date() && !payment.paymentComplete;
  
  const getStatusColor = () => {
    if (payment.paymentComplete) return 'border-green-500 bg-green-50';
    if (isOverdue) return 'border-red-500 bg-red-50';
    return 'border-amber-500 bg-amber-50';
  };

  const handleSave = () => {
    onUpdate(payment._id, {
      ...editData,
      amountDue: parseFloat(editData.amountDue)
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      clientName: payment.clientName || '',
      website: payment.website || '',
      amountDue: payment.amountDue || '',
      currency: payment.currency || 'INR',
      dueDate: payment.dueDate ? payment.dueDate.split('T')[0] : '',
      messageTitle: payment.messageTitle || '',
      message: payment.message || '',
      showOnHomepage: payment.showOnHomepage ?? true,
      showFullScreen: payment.showFullScreen ?? false
    });
    setIsEditing(false);
  };

  const handleTogglePaid = () => {
    onUpdate(payment._id, { paymentComplete: !payment.paymentComplete });
  };

  const handleToggleHomepage = () => {
    onUpdate(payment._id, { showOnHomepage: !payment.showOnHomepage });
  };

  const handleToggleFullScreen = () => {
    onUpdate(payment._id, { showFullScreen: !payment.showFullScreen });
  };

  if (isEditing) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border-l-4 ${getStatusColor()} overflow-hidden`}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Edit Payment Details
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                value={editData.clientName}
                onChange={(e) => setEditData({...editData, clientName: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter client name"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Website *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  value={editData.website}
                  onChange={(e) => setEditData({...editData, website: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="example.com"
                />
              </div>
            </div>

            {/* Amount Due */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount Due *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={editData.amountDue}
                  onChange={(e) => setEditData({...editData, amountDue: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency *
              </label>
              <select
                value={editData.currency}
                onChange={(e) => setEditData({...editData, currency: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={editData.dueDate}
                  onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Message Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message Title *
              </label>
              <input
                value={editData.messageTitle}
                onChange={(e) => setEditData({...editData, messageTitle: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="e.g., Payment Reminder"
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message Content *
              </label>
              <textarea
                value={editData.message}
                onChange={(e) => setEditData({...editData, message: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                rows="4"
                placeholder="Enter the message to be displayed to the client..."
              />
            </div>

            {/* Display Settings */}
            <div className="md:col-span-2 bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Display Settings</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Show on Homepage
                  </label>
                </div>
                <button
                  onClick={() => setEditData({...editData, showOnHomepage: !editData.showOnHomepage})}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                    editData.showOnHomepage ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      editData.showOnHomepage ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                  <label className="text-sm font-medium text-gray-700">
                    Show as Fullscreen Modal
                  </label>
                </div>
                <button
                  onClick={() => setEditData({...editData, showFullScreen: !editData.showFullScreen})}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                    editData.showFullScreen ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      editData.showFullScreen ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-2 flex gap-3 pt-4 border-t">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border-l-4 ${getStatusColor()} overflow-hidden`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                {payment.clientName || 'N/A'}
              </h3>
              {payment.paymentComplete && (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Paid
                </span>
              )}
              {isOverdue && (
                <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  <XCircle className="w-3 h-3" />
                  Overdue
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <a 
                href={`https://${payment.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition"
              >
                {payment.website}
              </a>
            </div>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Message */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {payment.messageTitle}
          </h4>
          <p className="text-gray-700 leading-relaxed">{payment.message}</p>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Amount Due</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {payment.currency} {payment.amountDue?.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase">Due Date</span>
            </div>
            <p className={`text-lg font-bold ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {new Date(payment.dueDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* API Endpoint */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-700 mb-1">Payment API Endpoint</p>
          <code className="text-xs text-blue-900 break-all">
            https://websitetrafficanalytics.onrender.com/api/meta/site-config/{payment._id}
          </code>
        </div>

        {/* Toggle Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          {/* Payment Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Payment Status</span>
            </div>
            <button
              onClick={handleTogglePaid}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                payment.paymentComplete 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              <span className="text-white font-semibold text-sm">
                {payment.paymentComplete ? 'Paid' : 'Unpaid'}
              </span>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                payment.paymentComplete ? 'bg-green-800' : 'bg-gray-400'
              }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    payment.paymentComplete ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Homepage Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Show on Homepage</span>
            </div>
            <button
              onClick={handleToggleHomepage}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                payment.showOnHomepage 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              <span className="text-white font-semibold text-sm">
                {payment.showOnHomepage ? 'Visible' : 'Hidden'}
              </span>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                payment.showOnHomepage ? 'bg-purple-800' : 'bg-gray-400'
              }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    payment.showOnHomepage ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Fullscreen Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Fullscreen Modal</span>
            </div>
            <button
              onClick={handleToggleFullScreen}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all ${
                payment.showFullScreen 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              <span className="text-white font-semibold text-sm">
                {payment.showFullScreen ? 'Enabled' : 'Disabled'}
              </span>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                payment.showFullScreen ? 'bg-indigo-800' : 'bg-gray-400'
              }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    payment.showFullScreen ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;