import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import './Layout.css';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="main-scrollable">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
