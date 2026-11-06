import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '@/components/ui/Toast';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory bg-grain selection:bg-lime selection:text-forest-dark">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

