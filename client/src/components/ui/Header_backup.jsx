import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../providers/UserProvider';
import SearchBar from './SearchBar';

export const Header = () => {
  const { user } = useContext(UserContext);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <svg className="w-8 h-8 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-2xl font-bold text-red-500">airbnb</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/account/places/new" 
                  className="hidden md:block text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Airbnb your home
                </Link>
                
                            {user ? (
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 border border-red-200 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/account"
                  className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md transition-shadow"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                  <div className="bg-gray-500 text-white rounded-full w-7 h-7 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  to="/register" 
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Sign up
                </Link>
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  Log in
                </Link>
                <div className="border border-gray-300 rounded-full p-2 hover:shadow-md transition-shadow">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
};
