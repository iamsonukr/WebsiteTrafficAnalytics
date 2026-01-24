import React, { useState, useEffect } from 'react';
import { API_BASE, ENDPOINTS } from '../../config/api';
import { getAuthHeaders } from '../../utils/authUtils';
import PaymentForm from './PaymentForm';
import PaymentCard from './PaymentCard';

const PaymentsTab = () => {
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.PAYMENTS}`);
      const data = await res.json();
      setPayments(data.data || []);
    } catch (err) {
      console.error('Fetch payments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (formData) => {
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.PAYMENTS}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          amountDue: parseFloat(formData.amountDue),
          createdBy: '507f1f77bcf86cd799439011'
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        fetchPayments();
        setShowForm(false);
      } else {
        alert('Failed to create payment: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Create payment error: ' + err.message);
    }
  };

  const handleUpdatePayment = async (id, updateData) => {
    try {
      const res = await fetch(`${API_BASE}${ENDPOINTS.SINGLE_PAYMENT(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        fetchPayments();
      } else {
        alert('Failed to update payment: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Update error: ' + err.message);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await fetch(`${API_BASE}${ENDPOINTS.SINGLE_PAYMENT(id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ paymentComplete: true })
      });
      fetchPayments();
    } catch (err) {
      alert('Update error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Dues</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Payment'}
        </button>
      </div>

      {showForm && (
        <PaymentForm 
          onSubmit={handleCreatePayment} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading payments...</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {payments.map((payment) => (
          <PaymentCard 
            key={payment._id} 
            payment={payment} 
            onMarkPaid={handleMarkPaid}
            onUpdate={handleUpdatePayment}
          />
        ))}
      </div>

      {!loading && payments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No payment dues found</p>
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;