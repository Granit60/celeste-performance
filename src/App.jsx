import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { RandomisedIcon as Lisa } from './components/RandomisedIcon';

export default function App() {
  return (
    <div className="layout">
      <Lisa></Lisa>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
