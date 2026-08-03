import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Top navigation bar.
 */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">CampusHub</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/clubs">Clubs</Link>
        <Link to="/events">Events</Link>
        <Link to="/announcements">Announcements</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
