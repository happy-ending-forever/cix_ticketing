import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '../context/Store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MOCK_CINEMAS } from '../constants';

const SALES_DATA = [
  { name: 'Mon', tickets: 120, revenue: 6000000 },
  { name: 'Tue', tickets: 132, revenue: 6600000 },
  { name: 'Wed', tickets: 101, revenue: 5050000 },
  { name: 'Thu', tickets: 154, revenue: 7700000 },
  { name: 'Fri', tickets: 290, revenue: 14500000 },
  { name: 'Sat', tickets: 430, revenue: 21500000 },
  { name: 'Sun', tickets: 380, revenue: 19000000 },
];

export const Admin = () => {
  const { user } = useStore();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="bg-dark-800 px-4 py-2 rounded-lg border border-dark-700">
           <span className="text-gray-400 text-sm">Welcome back, </span>
           <span className="font-bold text-brand-400">{user.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="text-gray-400 text-sm font-medium">Total Sales (Today)</h3>
            <p className="text-2xl font-bold mt-2 text-white">IDR 14,500,000</p>
         </div>
         <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="text-gray-400 text-sm font-medium">Tickets Sold</h3>
            <p className="text-2xl font-bold mt-2 text-white">290</p>
         </div>
         <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="text-gray-400 text-sm font-medium">Occupancy Rate</h3>
            <p className="text-2xl font-bold mt-2 text-brand-400">78%</p>
         </div>
         <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
            <h3 className="text-gray-400 text-sm font-medium">Active Cinemas</h3>
            <p className="text-2xl font-bold mt-2 text-white">{MOCK_CINEMAS.length}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
          <h3 className="text-lg font-bold mb-6">Weekly Ticket Sales</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="tickets" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
          <h3 className="text-lg font-bold mb-6">Revenue Trend</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  formatter={(value) => `IDR ${value.toLocaleString()}`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#2dd4bf" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="p-6 border-b border-dark-700">
           <h3 className="text-lg font-bold">Cinema Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-dark-900 text-gray-200 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {MOCK_CINEMAS.map(cinema => (
                <tr key={cinema.id} className="hover:bg-dark-700/50">
                  <td className="px-6 py-4">{cinema.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{cinema.name}</td>
                  <td className="px-6 py-4">{cinema.city}</td>
                  <td className="px-6 py-4"><span className="bg-green-500/10 text-green-400 px-2 py-1 rounded-full text-xs">Active</span></td>
                  <td className="px-6 py-4">
                     <button className="text-brand-400 hover:text-brand-300 mr-3">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};