import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import PageMeta from "../components/common/PageMeta";
import { useEffect, useState } from "react";
import { healthService } from "../api/axios";
import UserInfoCard from "../components/UserProfile/UserInfoCard";

export default function UserProfiles() {
  const[profileData,setProfileData]=useState()

     const fetchProfileData = async () => {
        try {
            const response = await healthService.get('/user/profile-detail');
            console.log("This is the profule data fetched",response);
            setProfileData(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(()=>{
      fetchProfileData()
    },[])

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | PayTrack Analytics - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for PayTrack Analytics - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard profileData={profileData}/>
          <UserInfoCard profileData={profileData} />
          {/* <UserAddressCard /> */}
        </div>
      </div>
    </>
  );
}
