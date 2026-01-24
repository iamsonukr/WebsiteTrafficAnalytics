import { useState } from "react";
import { Trash2, Edit, RefreshCw, Plus, Copy, Check } from "lucide-react";
import { toast } from "react-toastify";

const PaymentsDueList = ({
  payments,
  loading,
  error,
  refreshing,
  pagination,
  toggleLoading,
  onEdit,
  onAdd,
  onRefresh,
  onDelete,
  onRetry,
  onPageChange,
  onToggle
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const handleDeleteClick = (paymentId) => {
    setDeleteConfirm(paymentId);
  };

  const confirmDelete = (paymentId) => {
    onDelete(paymentId);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  const copyToClipboard = (paymentId) => {
    const url = `https://websitetrafficanalytics.onrender.com/api/meta/site-config/${paymentId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(paymentId);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      toast.error('Failed to copy URL');
    });
  };

  const ToggleSwitch = ({ checked, loading, onChange, label }) => (
    <button
      onClick={onChange}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-brand-600' : 'bg-gray-200'
      }`}
      title={label}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <RefreshCw className="h-3 w-3 animate-spin text-white" />
        </span>
      )}
    </button>
  );

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-brand-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="px-2 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payments Due
        </h1>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="px-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={onAdd}
            className="px-2 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  API URL
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount Due
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Show Homepage
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Full Screen
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Message Title
                </th>
                <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="10" className="px-2 py-12 text-center text-gray-500">
                    No payments found. Click "Add Payment" to create one.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.clientName}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {payment.website}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 group">
                        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-[200px] truncate">
                          https://websitetrafficanalytics.onrender.com/api/meta/site-config/{payment._id}
                        </div>
                        <button
                          onClick={() => copyToClipboard(payment._id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="Copy URL"
                        >
                          {copiedId === payment._id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amountDue, payment.currency)}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(payment.dueDate)}
                      </div>
                    </td>
                 <td className="px-2 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={payment.paymentComplete}
                          loading={toggleLoading[`${payment._id}-paymentComplete`]}
                          onChange={() => onToggle(payment._id, 'paymentComplete', payment.paymentComplete, true)}
                          label="Payment Complete"
                        />
                        <span className={`text-xs font-medium ${
                          payment.paymentComplete ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {payment.paymentComplete ? 'Complete' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <ToggleSwitch
                        checked={payment.showOnHomepage}
                        loading={toggleLoading[`${payment._id}-showOnHomepage`]}
                        onChange={() => onToggle(payment._id, 'showOnHomepage', payment.showOnHomepage)}
                        label="Show on Homepage"
                      />
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap">
                      <ToggleSwitch
                        checked={payment.showFullScreen}
                        loading={toggleLoading[`${payment._id}-showFullScreen`]}
                        onChange={() => onToggle(payment._id, 'showFullScreen', payment.showFullScreen)}
                        label="Show Full Screen"
                      />
                    </td>
                    <td className="px-2 py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {payment.messageTitle}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(payment)}
                          className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        {deleteConfirm === payment._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmDelete(payment._id)}
                              className="text-red-600 hover:text-red-900 text-xs font-semibold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="text-gray-600 hover:text-gray-900 text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteClick(payment._id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white dark:bg-gray-800 px-2 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-2">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="ml-3 relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsDueList;