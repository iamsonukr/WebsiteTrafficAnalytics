import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { healthService } from "../../api/axios";
import { toast } from "react-toastify";
import AddWebsites from "./AddWebsites";
import WebsitesList from "./WebsitesList";

const Websites = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [payments, setPayments] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toggleLoading, setToggleLoading] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10
  });

  useEffect(() => {
    fetchPayments(pagination.currentPage);
  }, []);

  const fetchPayments = async (page = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await healthService.get('/payment-due/payment-due', {
        params: {
          page: page,
          limit: pagination.limit
        }
      });
      
      console.log('API Response:', response);
      
      if (response?.data?.success) {
        setPayments(response?.data?.data || []);
        
        // Update pagination when API provides it
        if (response?.data?.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setError('Failed to fetch payments');
        toast.error('Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Error fetching payments');
      toast.error('Error fetching payments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // const handleToggle = async (paymentId, field, currentValue) => {
  //   // Set loading state for this specific toggle
  //   setToggleLoading(prev => ({ ...prev, [`${paymentId}-${field}`]: true }));

  //   try {
  //     // Find the payment to get all its data
  //     const payment = payments.find(p => p._id === paymentId);
  //     if (!payment) {
  //       toast.error('Payment not found');
  //       return;
  //     }

  //     // Create updated payload with toggled field
  //     const updatedPayload = {
  //       clientName: payment.clientName,
  //       website: payment.website,
  //       amountDue: payment.amountDue,
  //       currency: payment.currency,
  //       dueDate: payment.dueDate,
  //       paymentComplete: payment.paymentComplete,
  //       messageTitle: payment.messageTitle,
  //       message: payment.message,
  //       showOnHomepage: payment.showOnHomepage,
  //       showFullScreen: payment.showFullScreen,
  //       [field]: !currentValue // Toggle the specific field
  //     };

  //     const response = await healthService.put(
  //       `/payment-due/payment-due/${paymentId}`,
  //       updatedPayload
  //     );

  //     if (response?.data?.success) {
  //       // Update the specific payment in state
  //       setPayments(prev => prev.map(p => 
  //         p._id === paymentId 
  //           ? { ...p, [field]: !currentValue }
  //           : p
  //       ));
        
  //       toast.success(`${field} updated successfully`);
  //     } else {
  //       toast.error(`Failed to update ${field}`);
  //     }
  //   } catch (error) {
  //     console.error(`Error updating ${field}:`, error);
  //     toast.error(`Error updating ${field}`);
  //   } finally {
  //     setToggleLoading(prev => ({ ...prev, [`${paymentId}-${field}`]: false }));
  //   }
  // };

  const handleToggle = async (paymentId, field, currentValue, isPaymentComplete = false) => {
  // Determine which fields need to be updated
  const fieldsToUpdate = isPaymentComplete && !currentValue 
    ? ['paymentComplete', 'showOnHomepage', 'showFullScreen']
    : [field];

  // Set loading state for all affected toggles
  setToggleLoading(prev => {
    const newState = { ...prev };
    fieldsToUpdate.forEach(f => {
      newState[`${paymentId}-${f}`] = true;
    });
    return newState;
  });

  try {
    // Find the payment to get all its data
    const payment = payments.find(p => p._id === paymentId);
    if (!payment) {
      toast.error('Payment not found');
      return;
    }

    // Create updated payload
    const updatedPayload = {
      clientName: payment.clientName,
      website: payment.website,
      amountDue: payment.amountDue,
      currency: payment.currency,
      dueDate: payment.dueDate,
      paymentComplete: payment.paymentComplete,
      messageTitle: payment.messageTitle,
      message: payment.message,
      showOnHomepage: payment.showOnHomepage,
      showFullScreen: payment.showFullScreen,
    };

    // Apply updates based on the action
    if (isPaymentComplete && !currentValue) {
      // When marking payment as complete, disable both display options
      updatedPayload.paymentComplete = true;
      updatedPayload.showOnHomepage = false;
      updatedPayload.showFullScreen = false;
    } else {
      // Normal single field toggle
      updatedPayload[field] = !currentValue;
    }

    const response = await healthService.put(
      `/payment-due/payment-due/${paymentId}`,
      updatedPayload
    );

    if (response?.data?.success) {
      // Update the payment in state
      setPayments(prev => prev.map(p => {
        if (p._id === paymentId) {
          if (isPaymentComplete && !currentValue) {
            return {
              ...p,
              paymentComplete: true,
              showOnHomepage: false,
              showFullScreen: false
            };
          } else {
            return { ...p, [field]: !currentValue };
          }
        }
        return p;
      }));
      
      const message = isPaymentComplete && !currentValue
        ? 'Payment marked as complete. Display options disabled.'
        : `${field} updated successfully`;
      toast.success(message);
    } else {
      toast.error(`Failed to update ${field}`);
    }
  } catch (error) {
    console.error(`Error updating ${field}:`, error);
    toast.error(`Error updating ${field}`);
  } finally {
    // Clear loading state for all affected toggles
    setToggleLoading(prev => {
      const newState = { ...prev };
      fieldsToUpdate.forEach(f => {
        newState[`${paymentId}-${f}`] = false;
      });
      return newState;
    });
  }
};

  const handleEditModal = (payment) => {
    setPaymentData(payment);
    openModal();
  };

  const handleAddModal = () => {
    setPaymentData(null);
    openModal();
  };

  const handleRefresh = () => {
    fetchPayments(pagination.currentPage, true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPayments(newPage);
    }
  };

  const handleRetry = () => {
    fetchPayments(pagination.currentPage);
  };

  const onDelete = async (paymentId) => {
    console.log("Deleting payment:", paymentId);
    
    try {
      const response = await healthService.delete(`/payment-due/payment-due--------/${paymentId}`);
      console.log(response);
      
      if (response?.data?.success) {
        toast.success("Payment deleted successfully");
        
        // If we deleted the last item on a page (not page 1), go to previous page
        if (payments.length === 1 && pagination.currentPage > 1) {
          fetchPayments(pagination.currentPage - 1);
        } else {
          fetchPayments(pagination.currentPage);
        }
      } else {
        toast.error("Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Error deleting payment");
    }
  };

  const handleModalClose = () => {
    console.log("Closing");
    setPaymentData(null);
    closeModal();
  };

  const handlePaymentSuccess = () => {
    fetchPayments(pagination.currentPage);
    handleModalClose();
  };

  return (
    <>
      <WebsitesList
        payments={payments}
        loading={loading}
        error={error}
        refreshing={refreshing}
        pagination={pagination}
        toggleLoading={toggleLoading}
        onEdit={handleEditModal}
        onAdd={handleAddModal}
        onRefresh={handleRefresh}
        onDelete={onDelete}
        onRetry={handleRetry}
        onPageChange={handlePageChange}
        onToggle={handleToggle}
      />
      
      {/* Modal */}
      {isOpen && (
        <AddWebsites
          isOpen={isOpen}
          onClose={handleModalClose}
          paymentData={paymentData}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default Websites;