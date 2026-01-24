import React, { useState } from 'react';

const PaymentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    website: '',
    amountDue: '',
    currency: 'INR',
    dueDate: '',
    message: '',
    messageTitle: 'Payment Pending'
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({
      clientName: '',
      website: '',
      amountDue: '',
      currency: 'INR',
      dueDate: '',
      message: '',
      messageTitle: 'Payment Pending'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">New Payment Due</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Client Name"
          value={formData.clientName}
          onChange={(e) => setFormData({...formData, clientName: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          placeholder="Website URL"
          value={formData.website}
          onChange={(e) => setFormData({...formData, website: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          placeholder="Amount Due"
          value={formData.amountDue}
          onChange={(e) => setFormData({...formData, amountDue: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={formData.currency}
          onChange={(e) => setFormData({...formData, currency: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option>INR</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          placeholder="Message Title"
          value={formData.messageTitle}
          onChange={(e) => setFormData({...formData, messageTitle: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg md:col-span-2"
          rows="3"
        />
        <div className="md:col-span-2 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Create Payment
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
