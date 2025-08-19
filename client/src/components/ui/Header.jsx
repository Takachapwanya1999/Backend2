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
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
  });

  // Apply theme class to html root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

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
  <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Top row: logo and user controls */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/images/main-logo.png" alt="Airbnb" className="w-8 h-8 mr-2" />
            <span className="text-2xl font-bold text-rose-500 hidden sm:inline">airbnb</span>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <Link
              to="/account/places/new"
              className="hidden lg:block text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 px-3 py-2 rounded-full transition-colors"
            >
              Become a host
            </Link>
            <button className="hidden md:block p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zm9-10v2h3v-2h-3zM17.24 4.84l1.8-1.79 1.79 1.79-1.79 1.79-1.8-1.79zM12 6a6 6 0 100 12 6 6 0 000-12zm7 13.66l1.79 1.79-1.79 1.79-1.8-1.79 1.8-1.79zM4.84 17.24l-1.79 1.8-1.79-1.8 1.79-1.79 1.79 1.79z"/></svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="currentColor"><path d="M20.742 13.045a8.088 8.088 0 01-7.697 10.455 8.088 8.088 0 01-6.938-12.42 8.09 8.09 0 0011.78-8.9A10.09 10.09 0 0120.742 13.045z"/></svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-rose-600 hover:text-rose-700 px-3 py-2 border border-rose-200 rounded-full hover:bg-rose-50 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 border border-gray-300 dark:border-slate-700 rounded-full py-2 px-4 hover:shadow-md transition-shadow bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                    <div className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-full w-7 h-7 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="hidden lg:block font-medium text-sm text-gray-800 dark:text-slate-100">{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
                      <Link
                        to="/account"
                        className="block px-4 py-3 text-sm text-gray-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="font-medium">Account</div>
                        <div className="text-gray-500">Manage your account</div>
                      </Link>
                      <Link
                        to="/account/bookings"
                        className="block px-4 py-3 text-sm text-gray-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Trips
                      </Link>
                      <Link
                        to="/account/places"
                        className="block px-4 py-3 text-sm text-gray-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Manage listings
                      </Link>
                      <Link
                        to="/account/places/new"
                        className="block px-4 py-3 text-sm text-gray-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Airbnb your home
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-800 dark:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-800"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-full hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
                  <Link
                    to="/register"
                    className="text-sm font-medium text-gray-800 dark:text-slate-100 hover:text-gray-900 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-l-full transition-colors"
                  >
                    Sign up
                  </Link>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-800 dark:text-slate-100 hover:text-gray-900 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Log in
                  </Link>
                  <div className="px-3">
                    <svg className="w-4 h-4 text-gray-600 dark:text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs row */}
  <div className="hidden lg:flex items-center justify-center gap-10 text-gray-700 dark:text-slate-200">
          <button
            onClick={() => handleTabClick('homes')}
            className={`flex items-center gap-2 px-2 py-2 relative ${activeTab === 'homes' ? 'text-gray-900' : 'hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <span className="text-sm font-medium">Homes</span>
            {activeTab === 'homes' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gray-900 rounded-full" />}
          </button>
          <button
            onClick={() => handleTabClick('experiences')}
            className={`flex items-center gap-2 px-2 py-2 relative ${activeTab === 'experiences' ? 'text-gray-900' : 'hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="text-sm font-medium">Experiences</span>
            <span className="bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">NEW</span>
            {activeTab === 'experiences' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gray-900 rounded-full" />}
          </button>
          <button
            onClick={() => handleTabClick('services')}
            className={`flex items-center gap-2 px-2 py-2 relative ${activeTab === 'services' ? 'text-gray-900' : 'hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <span className="text-sm font-medium">Services</span>
            <span className="bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold">NEW</span>
            {activeTab === 'services' && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gray-900 rounded-full" />}
          </button>
        </div>

        {/* Search bar row */}
  <div className="py-4 flex justify-center">
          <div className="w-full max-w-5xl">
            <SearchBar compact={false} />
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
    <div className="lg:hidden border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex justify-center">
      <div className="flex bg-gray-100 dark:bg-slate-800 rounded-full p-1">
            <button
              onClick={() => handleTabClick('homes')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'homes' ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow' : 'text-gray-600 dark:text-slate-300'}`}
            >Homes</button>
            <button
              onClick={() => handleTabClick('experiences')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'experiences' ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow' : 'text-gray-600 dark:text-slate-300'}`}
            >Experiences</button>
            <button
              onClick={() => handleTabClick('services')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'services' ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow' : 'text-gray-600 dark:text-slate-300'}`}
            >Services</button>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto px-6 pb-3">
          <SearchBar compact={false} />
        </div>
      </div>
    </header>
  );
};
