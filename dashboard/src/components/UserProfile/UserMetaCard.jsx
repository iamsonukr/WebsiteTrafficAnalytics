import { useModal } from "../../hooks/useModal";

import { Pencil, PencilRuler } from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import { usePoster } from "../../context/PosterContext";
import { Link, useNavigate } from "react-router";

export default function UserMetaCard({ profileData }) {
  const { isOpen, openModal, closeModal } = useModal();
  const { baseUrl, formatImageUrl } = usePoster()
  const navigate = useNavigate();


  if (!profileData) {
    return <> Loading ... </>
  }
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className=" overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
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
            </div>

            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {profileData?.name || "N/A"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profileData?.role || "N/A"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  @{profileData?.username || "N/A"}
                </p>
              </div>
            </div>
            
          </div>

          <div className="flex gap-4 flex-row w-full justify-center xl:justify-end">
            {/* Edit Button */}
            <button
              onClick={openModal}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <Pencil size={16} />
              Edit
            </button>

            {/* Upgrade Plan Button */}
            <Link to="/pricing">
              <button
                className="flex items-center gap-2 rounded-full border border-indigo-500 bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 dark:border-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Upgrade Plan
              </button>
            </Link>
          </div>
        </div>
      </div>
      <EditProfileModal isOpen={isOpen} closeModal={closeModal} profileData={profileData} />

    </>
  );
}