import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-20 lg:ml-64 w-[calc(100%-5rem)] lg:w-[calc(100%-16rem)]">
        {/* We can place a top header here if needed, or let Dashboard handle its own padding */}
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
