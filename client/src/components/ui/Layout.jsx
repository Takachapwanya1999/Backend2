import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="bg-slate-900 min-h-screen">
      <Header />
      <div className="mx-auto flex min-h-screen max-w-screen-xl flex-col bg-slate-900 text-slate-100">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
