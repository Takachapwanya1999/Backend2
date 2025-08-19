import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './Footer';

const Layout = () => {
  return (
    <div className="bg-white min-h-screen text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col bg-white">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
