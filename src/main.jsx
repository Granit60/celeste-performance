import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';

import 'flag-icons/css/flag-icons.min.css';

import PlayerPage from './pages/PlayerPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="about" element={<AboutPage />} />

          <Route path="player/:id" element={<PlayerPage />} />
          <Route path="leaderboard" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);