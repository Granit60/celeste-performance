import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Header.css";

export default function Header() {
  const location = useLocation();

  const locale = location.pathname.includes('/fr_FR') ? 'fr_FR' : 'en_US';

  return (
    <header className="header">
      <div className="flex">
        <h1><span className="col2">Celeste</span><span className="col1">Performance</span></h1>
        <nav className="nav">
          <div><Link to="/">Home</Link></div>
          <div><Link to="/search">Search</Link></div>
          <div><Link to="/about">About</Link></div>
        </nav>
      </div>
    </header>
  );
}