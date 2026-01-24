import { useState, useEffect } from "react";
import { useModal } from "../../../hooks/useModal";
import SubscriptionsList from "./SubscriptionList";
import { healthService } from "../../../api/axios";
// import { usePoster } from "../../../context/PosterContext";
import AddSubscription from "../AddSubscription/AddSubscription";

const Subscription = () => {
  const { isOpen, openModal, closeModal } = useModal();
  // const {subscriptions}=usePoster()
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSubscriptions = async (isRefresh = false) => {
    try {
      const response = await healthService.get('/subscription/admin/subscription-plan');
      console.log("This is the poster",response);

      if (response?.data?.status === "success") {
        setSubscriptionData(response?.data?.data);
        console.log(response);
      } else {
        setError('Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setError('Error fetching subscriptions');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleEditModal = (subscription) => {
    setSelectedSubscription(subscription);
    openModal();
  };

  const handleAddModal = () => {
    setSelectedSubscription(null); // Clear selected subscription for add mode
    openModal();
  };

  const handleRefresh = () => {
    fetchSubscriptions(true);
  };

  return (
    <>
      <SubscriptionsList
        subscriptions={subscriptionData}
        loading={loading}
        error={error}
        refreshing={refreshing}
        onEdit={handleEditModal}
        onAdd={handleAddModal}
        onRefresh={handleRefresh}
        onRetry={handleRefresh}
      />

      {/* Modal */}
      <AddSubscription
        isOpen={isOpen}
        closeModal={closeModal}
        subscriptionData={selectedSubscription}
      />
    </>
  );
};

export default Subscription;