// Home.jsx
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Make sure to import toast
import { healthService } from "../../api/axios";
import Users from "../Users/Users";
import LatestUsers from "../Users/LatestUsers";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const {UserRole} = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    // try {
    //   setLoading(true);
    //   setError(null);
      
    //   const response = await healthService.get('/poster/user/dashboard-data');
    //   console.log('API Response:', response);
    //     setDashboardData(response?.data?.data || null);
    // } catch (error) {
    //   console.error('Error fetching dashboard data:', error);
    //   setError('Error fetching dashboard data');
    //   toast.error('Error fetching dashboard data');
    // } finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | PayTrack Analytics - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for PayTrack Analytics - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-gray-500">Loading dashboard data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-red-500">{error}</div>
            </div>
          ) : (
            <EcommerceMetrics dashboardData={dashboardData} />
          )}

          {/* <MonthlySalesChart /> */}
        </div>
      

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
      {
        UserRole === 'admin' && <LatestUsers/>
      }
        
    </>
  );
}