import { useEffect } from "react";
import { usePoster } from "../../context/PosterContext";
import { useModal } from "../../hooks/useModal";
import { Pencil } from "lucide-react";

export default function UserInfoCard({ profileData }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { formatImageUrl } = usePoster()

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = () => {
    console.log("Saving changes...");
    closeModal();
  };

  // Check if subscription is currently active
  const isSubscriptionActive = () => {
    if (!profileData?.subscriptionDetails) return false;
    const { startDate, endDate } = profileData.subscriptionDetails;
    if (!startDate || !endDate) return false;
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  useEffect(() => {
    let objectUrl;
    if (profileData?.profileImage instanceof File) {
      objectUrl = URL.createObjectURL(profileData.profileImage);
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [profileData?.profileImage]);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Left Section */}
        <div className="flex-1">
          {/* <div className="flex items-center gap-4 mb-6">
            {profileData?.profileImage && (
              <img
                src={
                  profileData.profileImage instanceof File
                    ? URL.createObjectURL(profileData.profileImage) // file object → blob URL
                    : formatImageUrl(profileData.profileImage) 
                }
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            )}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                User Profile Information
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                @{profileData?.username || "N/A"}
              </p>
            </div>
          </div> */}

          {/* Personal Information Section */}
          <div className="mb-8">
            <h5 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Personal Information
            </h5>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Full Name (English)
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profileData?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Full Name (Hindi)
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profileData?.hindiUsername || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Role
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">
                  {profileData?.role || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Account Status
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${profileData?.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                  ></span>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {profileData?.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Member Since
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDate(profileData?.createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Bio
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profileData?.bio || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Hindi Bio
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profileData?.hindiBio || "N/A"}
                </p>
              </div>

            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-8">
            <h5 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Contact Information
            </h5>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Email Address
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profileData?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profileData?.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Information Section */}
          <div>
            <h5 className="text-md font-semibold text-gray-700 dark:text-white/80 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              Subscription Information
            </h5>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Subscription Status
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${isSubscriptionActive() ? "bg-green-500" : "bg-red-500"
                      }`}
                  ></span>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {isSubscriptionActive() ? "Active" : "No Active Subscription"}
                  </p>
                </div>
              </div>

              {profileData?.subscriptionDetails?.autoRenew !== undefined && (
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Auto Renewal
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${profileData.subscriptionDetails.autoRenew ? "bg-blue-500" : "bg-gray-500"
                        }`}
                    ></span>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profileData.subscriptionDetails.autoRenew ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              )}
              {profileData?.subscriptionDetails?.subscriptionPlanId?.planName !== undefined && (
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                   Plan name
                  </p>
                  <div className="flex items-center gap-2">
                   
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {profileData.subscriptionDetails?.subscriptionPlanId?.planName?.toUpperCase()}

                    </p>
                  </div>
                </div>
              )}

              {profileData?.subscriptionDetails?.startDate && (
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Subscription Start Date
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(profileData.subscriptionDetails.startDate)}
                  </p>
                </div>
              )}

              {profileData?.subscriptionDetails?.endDate && (
                <div>
                  <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    Subscription End Date
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {formatDate(profileData.subscriptionDetails.endDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Button */}
        {/* <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <Pencil size={18} />
          Edit
        </button> */}
      </div>
    </div>
  );
}