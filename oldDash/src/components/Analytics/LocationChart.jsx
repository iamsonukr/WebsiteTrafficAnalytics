import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LocationChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Top Countries</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.slice(0, 5)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visitors" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LocationChart;