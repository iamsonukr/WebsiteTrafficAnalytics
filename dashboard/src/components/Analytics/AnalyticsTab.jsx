import React, { useState, useEffect } from 'react';
import { API_BASE, ENDPOINTS } from '../../config/api';
import { getAuthHeaders } from '../../utils/authUtils';
import DateFilter from './DateFilter';
import StatsCard from './StatsCard';
import DeviceChart from './DeviceChart';
import BrowserChart from './BrowserChart';
import LocationChart from './LocationChart';
import TimeChart from './TimeChart';

const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (dateRange.startDate) query.append('startDate', dateRange.startDate);
      if (dateRange.endDate) query.append('endDate', dateRange.endDate);
      
      const res = await fetch(`${API_BASE}${ENDPOINTS.ANALYTICS}?${query}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setAnalytics(data.analytics);
    } catch (err) {
      console.error('Fetch analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const overall = analytics?.overall?.[0];

  return (
    <div className="space-y-6">
      <DateFilter 
        dateRange={dateRange} 
        onDateChange={setDateRange} 
        onApply={fetchAnalytics} 
      />

      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading analytics...</div>
        </div>
      )}

      {!loading && overall && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Visitors" 
              value={overall.totalVisitors} 
              color="blue" 
            />
            <StatsCard 
              title="Unique Visitors" 
              value={overall.uniqueVisitors?.length || 0} 
              color="green" 
            />
            <StatsCard 
              title="Avg Page Views" 
              value={overall.avgPageViews?.toFixed(1) || 0} 
              color="purple" 
            />
            <StatsCard 
              title="Returning Visitors" 
              value={overall.returningVisitors} 
              color="orange" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DeviceChart data={analytics.deviceStats} />
            <BrowserChart data={analytics.browserStats} />
            <LocationChart data={analytics.locationStats} />
            <TimeChart data={analytics.timeStats} />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsTab;