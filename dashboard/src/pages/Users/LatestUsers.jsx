import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { healthService } from "../../api/axios";
import { useState, useEffect } from "react";
import AddUser from "./AddUser";
import { useModal } from "../../hooks/useModal";
import { 
  Edit2, 
  RefreshCw, 
  UserPlus, 
  Users as UsersIcon, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Download
} from "lucide-react";

const LatestUsers = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false
  });

  const fetchUsers = async (page = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const response = await healthService.get(`/user/all-users?page=${page}&limit=${pagination.limit}`);
      console.log("All users are here", response);
      
      if (response?.data?.status === "success") {
        setUsers(response?.data?.data?.users || []);
        setPagination({
          currentPage: response?.data?.data?.pagination?.currentPage || 1,
          totalPages: response?.data?.data?.pagination?.totalPages || 1,
          totalCount: response?.data?.data?.pagination?.totalCount || 0,
          limit: response?.data?.data?.pagination?.limit || 10,
          hasNext: response?.data?.data?.pagination?.hasNext || false,
          hasPrev: response?.data?.data?.pagination?.hasPrev || false
        });
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, []);

  const handleEditModal = (user) => {
    setUser(user);
    openModal();
  };

  const handleAddModal = () => {
    setUser(null);
    openModal();
  };

  const handleRefresh = () => {
    fetchUsers(pagination.currentPage, true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  const handleDownloadInvoice = async (invoiceId, userId) => {
    try {
      // Call your API to get the invoice PDF
      const response = await healthService.get(`/invoices/${invoiceId}/pdf`, {
        responseType: 'blob'
      });
      
      // Create a blob URL and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice');
    }
  };

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

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getSubscriptionStatus = (subscription) => {
    if (!subscription?.expiryDate) return 'inactive';
    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    return expiry > now ? 'active' : 'expired';
  };

  if (loading && !refreshing) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && !users.length) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="p-8 text-center">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium">Failed to load users</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <Button 
            onClick={() => fetchUsers(1)}
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
    <div className=" mt-4 w-fit overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-white/[0.05] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <UsersIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Users ({pagination.totalCount})
          </h2>
          {error && users.length > 0 && (
            <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
              Sync Error
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Button 
            onClick={handleAddModal}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add User
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
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Username
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Role
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
                Last Login
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Subscription
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-xs uppercase tracking-wider dark:text-gray-400"
              >
                Invoice
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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="px-5 py-12 text-center">
                  <UsersIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                    No users found
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Get started by adding your first user
                  </p>
                  <Button 
                    onClick={handleAddModal}
                    variant="primary"
                    size="sm"
                    className="mt-4"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add First User
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              users.map((userData) => (
                <TableRow 
                  key={userData._id} 
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {/* User Info */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex-shrink-0">
                        {userData.profileImage ? (
                          <>
                            <img
                              width={40}
                              height={40}
                              src={userData.profileImage}
                              alt={userData.name || 'User'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.querySelector('.fallback-initials').style.display = 'flex';
                              }}
                            />
                            <div className="fallback-initials hidden w-full h-full items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">
                              {getInitials(userData.name)}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-sm font-semibold">
                            {getInitials(userData.name)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {userData.name || 'Unnamed User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          Joined {formatDate(userData.createdAt)}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Username */}
                  <TableCell className="px-4 py-3">
                    <span className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                      {userData.username || 'N/A'}
                    </span>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="px-4 py-3">
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {userData.email || 'N/A'}
                    </span>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="px-4 py-3">
                    <Badge
                      size="sm"
                      color={userData.role === 'admin' ? 'warning' : userData.role === 'moderator' ? 'info' : 'default'}
                    >
                      {userData.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'User'}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3">
                    <Badge
                      size="sm"
                      color={userData.isActive ? "success" : "error"}
                    >
                      {userData.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  {/* Last Login */}
                  <TableCell className="px-4 py-3">
                    <div className="text-sm">
                      {userData.lastLogin ? (
                        <>
                          <p className="text-gray-900 dark:text-gray-100 font-medium">
                            {formatDateTime(userData.lastLogin)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(() => {
                              const diff = Date.now() - new Date(userData.lastLogin).getTime();
                              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                              const hours = Math.floor(diff / (1000 * 60 * 60));
                              if (days > 0) return `${days}d ago`;
                              if (hours > 0) return `${hours}h ago`;
                              return 'Recent';
                            })()}
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Never</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Subscription */}
                  <TableCell className="px-4 py-3">
                    <div className="space-y-1">
                      {userData.subscription ? (
                        <>
                          <Badge
                            size="sm"
                            color={getSubscriptionStatus(userData.subscription) === 'active' ? 'success' : 'error'}
                          >
                            {userData.subscription.planName || 'Subscribed'}
                          </Badge>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <div>Start: {formatDateTime(userData.subscription.startDate)}</div>
                            <div>Expires: {formatDateTime(userData.subscription.expiryDate)}</div>
                          </div>
                        </>
                      ) : (
                        <Badge size="sm" color="default">
                          No Plan
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Invoice */}
                  <TableCell className="px-4 py-3">
                    {userData.subscription?.invoiceId ? (
                      <button
                        onClick={() => handleDownloadInvoice(userData.subscription.invoiceId, userData._id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Download Invoice"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Invoice</span>
                        <Download className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-500">No Invoice</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3">
                    <button 
                      onClick={() => handleEditModal(userData)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                      title="Edit user"
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 dark:border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Pagination Info */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {(pagination.currentPage - 1) * pagination.limit + 1}
            </span>
            {' '}-{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)}
            </span>
            {' '}of{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {pagination.totalCount}
            </span>
            {' '}users
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev || loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis && (
                        <span className="px-2 text-gray-400 dark:text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className={`
                          min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-colors
                          ${page === pagination.currentPage
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }
                          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>

            <Button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext || loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      <AddUser isOpen={isOpen} closeModal={closeModal} user={user} fetchUsers={() => fetchUsers(pagination.currentPage)} />
    </div>
  );
};

export default LatestUsers;