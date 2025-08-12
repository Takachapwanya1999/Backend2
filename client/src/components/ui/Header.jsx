import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../providers/UserProvider';
import SearchBar from './SearchBar';

export const Header = () => {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('homes');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/places')) {
      setActiveTab('homes');
    } else if (path.startsWith('/experiences')) {
      setActiveTab('experiences');
    } else if (path.startsWith('/services')) {
      setActiveTab('services');
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'homes':
        navigate('/');
        break;
      case 'experiences':
        navigate('/experiences');
        break;
      case 'services':
        navigate('/services');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-slate-800 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/images/main-logo.png" 
              alt="Airbnb" 
              className="w-8 h-8 mr-2"
            />
            <span className="text-2xl font-bold text-rose-400 hidden sm:inline">airbnb</span>
          </Link>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => handleTabClick('homes')}
              className={`flex items-center gap-2 px-4 py-3 rounded-full transition-colors relative ${
                activeTab === 'homes' 
                  ? 'text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-sm font-medium">Homes</span>
              {activeTab === 'homes' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-slate-100"></div>
              )}
            </button>
            
            <button
              onClick={() => handleTabClick('experiences')}
              className={`flex items-center gap-2 px-4 py-3 rounded-full transition-colors relative ${
                activeTab === 'experiences' 
                  ? 'text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-sm font-medium">Experiences</span>
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">NEW</span>
              {activeTab === 'experiences' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-slate-100"></div>
              )}
            </button>
            
            <button
              onClick={() => handleTabClick('services')}
              className={`flex items-center gap-2 px-4 py-3 rounded-full transition-colors relative ${
                activeTab === 'services' 
                  ? 'text-slate-100' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="text-sm font-medium">Services</span>
              <span className="bg-gray-700 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">NEW</span>
              {activeTab === 'services' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-slate-100"></div>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <Link 
              to="/account/places/new" 
              className="hidden lg:block text-sm font-medium text-slate-300 hover:text-slate-100 px-3 py-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              Become a host
            </Link>
            
            {/* Language/Region Button */}
            <button className="hidden md:block p-3 hover:bg-slate-700 rounded-full transition-colors">
              <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </button>
            
            {user ? (
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-sm font-medium text-red-400 hover:text-red-300 px-3 py-2 border border-red-500/30 rounded-full hover:bg-red-500/10 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 border border-slate-600 rounded-full py-2 px-4 hover:shadow-md transition-shadow bg-slate-700 hover:bg-slate-600"
                  >
                    <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    <div className="bg-slate-600 text-slate-200 rounded-full w-7 h-7 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="hidden lg:block font-medium text-sm text-slate-200">{user.name}</span>
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-lg border border-slate-600 py-2 z-50">
                      <Link 
                        to="/account" 
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 border-b border-slate-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="font-medium">Account</div>
                        <div className="text-slate-400">Manage your account</div>
                      </Link>
                      <Link 
                        to="/account/bookings" 
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Trips
                      </Link>
                      <Link 
                        to="/account/places" 
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Manage listings
                      </Link>
                      <Link 
                        to="/account/places/new" 
                        className="block px-4 py-3 text-sm text-slate-200 hover:bg-slate-700 border-b border-slate-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Airbnb your home
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-slate-700"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="flex items-center border border-slate-600 rounded-full hover:shadow-md transition-shadow bg-slate-700">
                  <Link 
                    to="/register" 
                    className="text-sm font-medium text-slate-200 hover:text-slate-100 px-4 py-3 hover:bg-slate-600 rounded-l-full transition-colors"
                  >
                    Sign up
                  </Link>
                  <div className="w-px h-6 bg-slate-600"></div>
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-slate-200 hover:text-slate-100 px-4 py-3 hover:bg-slate-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <div className="px-3">
                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden mt-4 flex justify-center">
          <div className="flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => handleTabClick('homes')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'homes' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Homes
            </button>
            <button
              onClick={() => handleTabClick('experiences')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'experiences' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Experiences
            </button>
            <button
              onClick={() => handleTabClick('services')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'services' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600'
              }`}
            >
              Services
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
