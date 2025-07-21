import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
