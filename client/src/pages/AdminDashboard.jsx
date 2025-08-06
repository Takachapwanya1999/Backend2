import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../providers/UserProvider';
import axiosInstance from '../utils/axios';

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect if not admin
  if (!user?.isAdmin) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const [usersRes, placesRes, bookingsRes] = await Promise.all([
        axiosInstance.get('/auth/users'),
        axiosInstance.get('/places'),
        axiosInstance.get('/bookings')
      ]);

      setUsers(usersRes.data.slice(0, 10)); // Latest 10 users
      setPlaces(placesRes.data.slice(0, 10)); // Latest 10 places
      setBookings(bookingsRes.data.slice(0, 10)); // Latest 10 bookings

      // Calculate stats
      setStats({
        totalUsers: usersRes.data.length,
        totalPlaces: placesRes.data.length,
        totalBookings: bookingsRes.data.length,
        totalRevenue: bookingsRes.data.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/auth/users/${userId}`);
        fetchAdminData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        await axiosInstance.delete(`/places/${placeId}`);
        fetchAdminData(); // Refresh data
      } catch (error) {
        console.error('Error deleting place:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-300 mt-1">Manage your Airbnb clone platform</p>
            </div>
            <button
              onClick={fetchAdminData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 focus:ring-offset-gray-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Overview', icon: '📊' },
              { id: 'users', name: 'Users', icon: '👥' },
              { id: 'places', name: 'Properties', icon: '🏠' },
              { id: 'bookings', name: 'Bookings', icon: '📅' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-rose-400 text-rose-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 overflow-hidden rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">👥</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400">
                          Total Users
                        </dt>
                        <dd className="text-2xl font-bold text-white">
                          {stats.totalUsers || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏠</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400">
                          Total Properties
                        </dt>
                        <dd className="text-2xl font-bold text-white">
                          {stats.totalPlaces || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📅</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400">
                          Total Bookings
                        </dt>
                        <dd className="text-2xl font-bold text-white">
                          {stats.totalBookings || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 overflow-hidden rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-900/50 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💰</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-400">
                          Total Revenue
                        </dt>
                        <dd className="text-2xl font-bold text-white">
                          ${stats.totalRevenue?.toFixed(2) || '0.00'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Properties Showcase */}
            <div className="mb-8">
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">Featured Properties</h3>
                  <p className="text-sm text-gray-400 mt-1">Showcase of premium listings</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Sample Featured Property 1 */}
                    <div className="relative overflow-hidden rounded-lg group cursor-pointer">
                      <img
                        src="/assets/hero.png"
                        alt="Modern Villa"
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="font-semibold text-lg mb-1">Modern Luxury Villa</h4>
                        <p className="text-sm opacity-90 mb-2">Melbourne, Australia</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">$450/night</span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span className="text-sm">4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Featured Property 2 */}
                    <div className="relative overflow-hidden rounded-lg group cursor-pointer">
                      <img
                        src="/assets/view.png"
                        alt="Cozy Cabin"
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="font-semibold text-lg mb-1">Cozy Mountain Cabin</h4>
                        <p className="text-sm opacity-90 mb-2">Aspen, Colorado</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">$280/night</span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span className="text-sm">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sample Featured Property 3 */}
                    <div className="relative overflow-hidden rounded-lg group cursor-pointer">
                      <img
                        src="/assets/search.png"
                        alt="Beachfront House"
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h4 className="font-semibold text-lg mb-1">Beachfront Paradise</h4>
                        <p className="text-sm opacity-90 mb-2">Malibu, California</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">$650/night</span>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            <span className="text-sm">4.9</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                <div className="px-6 py-5 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">Recent Users</h3>
                  <p className="text-sm text-gray-400 mt-1">Latest registered users</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {users.slice(0, 5).map(user => (
                      <div key={user._id} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-300">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.isAdmin ? 'bg-purple-900/60 text-purple-200' :
                            user.isHost ? 'bg-blue-900/60 text-blue-200' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {user.isAdmin ? 'Admin' : user.isHost ? 'Host' : 'User'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                <div className="px-6 py-5 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-white">Recent Bookings</h3>
                  <p className="text-sm text-gray-400 mt-1">Latest booking activity</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map(booking => (
                      <div key={booking._id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {booking.place?.title || 'Unknown Place'}
                          </p>
                          <p className="text-sm text-gray-400">
                            ${booking.totalPrice}
                          </p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-900/60 text-green-200'
                            : booking.status === 'pending'
                            ? 'bg-yellow-900/60 text-yellow-200'
                            : 'bg-red-900/60 text-red-200'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">User Management</h3>
              <p className="text-sm text-gray-400 mt-1">Manage all registered users</p>
            </div>
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-300">
                                {user.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.isAdmin ? 'bg-purple-900/60 text-purple-200' :
                            user.isHost ? 'bg-blue-900/60 text-blue-200' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {user.isAdmin ? 'Admin' : user.isHost ? 'Host' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Places Tab */}
        {activeTab === 'places' && (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Property Management</h3>
              <p className="text-sm text-gray-400 mt-1">Manage all listed properties</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {places.map(place => (
                  <div key={place._id} className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {place.photos && place.photos[0] && (
                          <img
                            src={place.photos[0]}
                            alt={place.title}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h4 className="text-lg font-medium text-white">
                            {place.title}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {place.address}
                          </p>
                          <p className="text-sm font-medium text-white mt-1">
                            ${place.price}/night
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePlace(place._id)}
                        className="text-red-400 hover:text-red-300 px-3 py-2 border border-red-600/50 rounded-lg text-sm font-medium transition-colors hover:bg-red-900/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Booking Management</h3>
              <p className="text-sm text-gray-400 mt-1">View and manage all bookings</p>
            </div>
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {bookings.map(booking => (
                      <tr key={booking._id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {booking.place?.title || 'Unknown Place'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {booking.place?.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {booking.user?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {booking.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {booking.checkIn && new Date(booking.checkIn).toLocaleDateString()} - 
                          {booking.checkOut && new Date(booking.checkOut).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          ${booking.totalPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-900/60 text-green-200'
                              : booking.status === 'pending'
                              ? 'bg-yellow-900/60 text-yellow-200'
                              : 'bg-red-900/60 text-red-200'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
