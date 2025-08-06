import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../../providers/UserProvider';
import axiosInstance from '../../utils/axios';

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPlaces: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching admin data...');
      
      // Fetch data from actual API endpoints
      const [usersResponse, placesResponse, bookingsResponse, placesStatsResponse] = await Promise.all([
        axiosInstance.get('/auth/users'),
        axiosInstance.get('/places'),
        axiosInstance.get('/bookings'),
        axiosInstance.get('/places/admin/stats')
      ]);

      console.log('Admin data fetched successfully:', {
        users: usersResponse.data.length,
        places: placesResponse.data.length,
        bookings: bookingsResponse.data.length
      });

      // Calculate stats from the responses
      const totalUsers = usersResponse.data.length || 0;
      const totalPlaces = placesResponse.data.length || 0;
      const totalBookings = bookingsResponse.data.length || 0;
      
      // Calculate total revenue from bookings
      const totalRevenue = bookingsResponse.data.reduce((sum, booking) => {
        return sum + (booking.totalPrice || 0);
      }, 0);

      setStats({
        totalUsers,
        totalPlaces,
        totalBookings,
        totalRevenue
      });
      
      // Set users data (limit to recent 10 users)
      const recentUsers = usersResponse.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin || false,
          createdAt: user.createdAt
        }));
      setUsers(recentUsers);
      
      // Set places data (limit to recent 10 places)
      const recentPlaces = placesResponse.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(place => ({
          _id: place._id,
          title: place.title,
          owner: place.owner?.name || 'Unknown',
          price: place.price,
          status: place.status || 'active'
        }));
      setPlaces(recentPlaces);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      
      // Set error message based on the type of error
      if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (error.response?.status === 401) {
        setError('Authentication required. Please log in.');
      } else if (error.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load admin data. Please try again.');
      }
      
      // Fallback to empty data on error
      setStats({
        totalUsers: 0,
        totalPlaces: 0,
        totalBookings: 0,
        totalRevenue: 0
      });
      setUsers([]);
      setPlaces([]);
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You don't have admin privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-300 h-64 rounded-lg"></div>
            <div className="bg-gray-300 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchAdminData();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your Airbnb clone platform</p>
        </div>
        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Places</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalPlaces}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-yellow-600">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="py-3 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="py-3 text-sm text-gray-500">{user.email}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isAdmin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Places */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Places</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Owner</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {places.map((place) => (
                    <tr key={place._id}>
                      <td className="py-3 text-sm font-medium text-gray-900">{place.title}</td>
                      <td className="py-3 text-sm text-gray-500">{place.owner}</td>
                      <td className="py-3 text-sm text-gray-900">${place.price}/night</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          place.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {place.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
