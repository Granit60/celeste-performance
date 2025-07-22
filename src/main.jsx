import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';

import 'flag-icons/css/flag-icons.min.css';

import PlayerPage from './pages/PlayerPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="player/:id" element={<PlayerPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);