import React, { useState } from 'react';
import { Edit2, Globe, Calendar, DollarSign, CheckCircle, XCircle, Eye, Maximize2, X, Save } from 'lucide-react';

const PaymentTable = ({ payments, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (payment) => {
    setEditingId(payment._id);
    setEditData({
      clientName: payment.clientName || '',
      website: payment.website || '',
      amountDue: payment.amountDue || '',
      currency: payment.currency || 'INR',
      dueDate: payment.dueDate ? payment.dueDate.split('T')[0] : '',
      messageTitle: payment.messageTitle || '',
      message: payment.message || '',
      showOnHomepage: payment.showOnHomepage ?? true,
      showFullScreen: payment.showFullScreen ?? false,
      paymentComplete: payment.paymentComplete ?? false
    });
  };

  const handleSave = (paymentId) => {
    onUpdate(paymentId, {
      ...editData,
      amountDue: parseFloat(editData.amountDue)
    });
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleToggle = (paymentId, field, currentValue) => {
    onUpdate(paymentId, { [field]: !currentValue });
  };

  const isOverdue = (dueDate, paymentComplete) => {
    return new Date(dueDate) < new Date() && !paymentComplete;
  };

  const getStatusBadge = (payment) => {
    if (payment.paymentComplete) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
          <CheckCircle className="w-3 h-3" />
          Paid
        </span>
      );
    }
    if (isOverdue(payment.dueDate, payment.paymentComplete)) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
          <XCircle className="w-3 h-3" />
          Overdue
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
        <Calendar className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const ToggleButton = ({ enabled, onClick }) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">Payment Records</h2>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Client Info
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Payment Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Display
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments?.map((payment) => (
              <tr
                key={payment._id}
                className={`hover:bg-gray-50 transition-colors ${
                  editingId === payment._id ? 'bg-blue-50' : ''
                }`}
              >
                {/* Client Info */}
                <td className="px-6 py-4">
                  {editingId === payment._id ? (
                    <div className="space-y-2">
                      <input
                        value={editData.clientName}
                        onChange={(e) => setEditData({ ...editData, clientName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Client Name"
                      />
                      <input
                        value={editData.website}
                        onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Website"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-gray-900">{payment.clientName}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Globe className="w-3 h-3" />
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
                  )}
                </td>

                {/* Payment Details */}
                <td className="px-6 py-4">
                  {editingId === payment._id ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={editData.amountDue}
                          onChange={(e) => setEditData({ ...editData, amountDue: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Amount"
                        />
                        <select
                          value={editData.currency}
                          onChange={(e) => setEditData({ ...editData, currency: e.target.value })}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                      <input
                        type="date"
                        value={editData.dueDate}
                        onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        {payment.currency} {payment.amountDue?.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(payment.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                </td>

                {/* Message */}
                <td className="px-6 py-4 max-w-md">
                  {editingId === payment._id ? (
                    <div className="space-y-2">
                      <input
                        value={editData.messageTitle}
                        onChange={(e) => setEditData({ ...editData, messageTitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Message Title"
                      />
                      <textarea
                        value={editData.message}
                        onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Message"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{payment.messageTitle}</div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">{payment.message}</div>
                      <div className="mt-2 text-xs text-blue-600 font-mono truncate">
                        ID: {payment._id}
                      </div>
                    </div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-2">
                    {getStatusBadge(payment)}
                    {editingId === payment._id ? (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-700">Paid:</span>
                        <ToggleButton
                          enabled={editData.paymentComplete}
                          onClick={() => setEditData({ ...editData, paymentComplete: !editData.paymentComplete })}
                        />
                      </div>
                    ) : (
                      <ToggleButton
                        enabled={payment.paymentComplete}
                        onClick={() => handleToggle(payment._id, 'paymentComplete', payment.paymentComplete)}
                      />
                    )}
                  </div>
                </td>

                {/* Display Settings */}
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-3">
                    {/* Homepage Toggle */}
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600 w-20">Homepage</span>
                      {editingId === payment._id ? (
                        <ToggleButton
                          enabled={editData.showOnHomepage}
                          onClick={() => setEditData({ ...editData, showOnHomepage: !editData.showOnHomepage })}
                        />
                      ) : (
                        <ToggleButton
                          enabled={payment.showOnHomepage}
                          onClick={() => handleToggle(payment._id, 'showOnHomepage', payment.showOnHomepage)}
                        />
                      )}
                    </div>

                    {/* Fullscreen Toggle */}
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600 w-20">Fullscreen</span>
                      {editingId === payment._id ? (
                        <ToggleButton
                          enabled={editData.showFullScreen}
                          onClick={() => setEditData({ ...editData, showFullScreen: !editData.showFullScreen })}
                        />
                      ) : (
                        <ToggleButton
                          enabled={payment.showFullScreen}
                          onClick={() => handleToggle(payment._id, 'showFullScreen', payment.showFullScreen)}
                        />
                      )}
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                    {editingId === payment._id ? (
                      <>
                        <button
                          onClick={() => handleSave(payment._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all text-sm font-medium"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(payment)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!payments || payments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No payment records found</p>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;