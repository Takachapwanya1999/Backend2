import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7V10C2 16 6 20 12 22C18 20 22 16 22 10V7L12 2M12 4.07L20 8.13V10C20 14.66 16.91 18.15 12 20C7.09 18.15 4 14.66 4 10V8.13L12 4.07Z"/>
              </svg>
              <span className="text-lg font-bold text-red-500">airbnb</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Find unique places to stay and experiences around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Help Center</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Safety Information</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Cancellation Options</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Diversity & Belonging</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Accessibility</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Guest Referrals</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Airbnb.org</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li><Link to="/account/places/new" className="text-gray-600 hover:text-gray-900 text-sm">Become a Host</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Host Resources</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Community Forum</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-gray-900 text-sm">Hosting Responsibly</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-600">
                © 2024 Airbnb Clone - Zaio Bootcamp Capstone Project
              </p>
              <div className="flex space-x-4">
                <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy</Link>
                <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Terms</Link>
                <Link to="#" className="text-sm text-gray-600 hover:text-gray-900">Sitemap</Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">English (US)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">$</span>
                <span className="text-sm text-gray-600">USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
