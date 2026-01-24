import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { Edit2, RefreshCw, Plus, CreditCard, Check, X } from "lucide-react";

const SubscriptionsList = ({
  subscriptions,
  loading,
  error,
  refreshing,
  onEdit,
  onAdd,
  onRefresh,
  onRetry
}) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatPrice = (price) => {
    if (price === 0 || price === null || price === undefined) return 'Free';
    return `₹${price.toFixed(2)}`;
  };

  const renderFeatures = (subscription) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">Photos:</span>
          <span>{subscription.photoUploadPerEvent || 0}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">Templates:</span>
          <span>{subscription.templatePerEvent || 0}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-gray-600 dark:text-gray-400">Watermark:</span>
          {subscription.showWatermark ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-red-500" />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium text-gray-600 dark:text-gray-400">Designation:</span>
          {subscription.showDesignation ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-red-500" />
          )}
        </div>
      </div>
    );
  };

  const getPlanBadgeColor = (planName) => {
    switch (planName?.toLowerCase()) {
      case 'free':
        return 'secondary';
      case 'basic':
        return 'warning';
      case 'premium':
        return 'success';
      case 'pro':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'canceled':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'secondary';
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error && !subscriptions.length) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Failed to load subscriptions</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button 
            onClick={onRetry}
            variant="primary"
            className="mt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.05] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Subscriptions ({subscriptions.length})
          </h2>
          {error && subscriptions.length > 0 && (
            <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
              Sync Error
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Button 
            onClick={onAdd}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Subscription
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Plan ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Plan Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Yearly Price
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Features
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Created
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Updated
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="px-5 py-12 text-center">
                  <CreditCard className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                    No subscriptions found
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Get started by adding your first subscription plan
                  </p>
                  <Button 
                    onClick={onAdd}
                    variant="primary"
                    size="sm"
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Subscription
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
                <TableRow 
                  key={subscription._id} 
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {/* Plan ID */}
                  <TableCell className="px-5 py-4">
                    <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      {subscription.subscriptionPlanId || 'N/A'}
                    </p>
                  </TableCell>

                  {/* Plan Name */}
                  <TableCell className="px-5 py-4">
                    <Badge
                      size="sm"
                      color={getPlanBadgeColor(subscription.planName)}
                      className="capitalize"
                    >
                      {subscription.planName || 'Unknown'}
                    </Badge>
                  </TableCell>

                  {/* Price */}
                  <TableCell className="px-5 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(subscription.price)}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(subscription.yearlyPrice)}
                    </span>
                  </TableCell>

                  {/* Features */}
                  <TableCell className="px-5 py-4">
                    {renderFeatures(subscription)}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-5 py-4">
                    <Badge
                      size="sm"
                      color={getStatusBadgeColor(subscription.status)}
                      className="capitalize"
                    >
                      {subscription.status || 'Unknown'}
                    </Badge>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="px-5 py-4">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {formatDate(subscription.createdAt)}
                    </span>
                  </TableCell>

                  {/* Updated Date */}
                  <TableCell className="px-5 py-4">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {formatDate(subscription.updatedAt)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-5 py-4">
                    <button 
                      onClick={() => onEdit(subscription)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                      title="Edit Subscription"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubscriptionsList;