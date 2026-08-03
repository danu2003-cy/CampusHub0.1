import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Clubs from '../pages/Clubs';
import Events from '../pages/Events';
import Registrations from '../pages/Registrations';
import Announcements from '../pages/Announcements';
import Feedback from '../pages/Feedback';
import NotFound from '../pages/NotFound';

/**
 * Central routing configuration.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/clubs" element={<Clubs />} />
      <Route path="/events" element={<Events />} />
      <Route path="/registrations" element={<Registrations />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
