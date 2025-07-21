import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import PlayerPage from './pages/PlayerPage';
import HomePage from './pages/HomePage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<HomePage />} />
          <Route path="player/:id" element={<PlayerPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);