import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Sidebar navigation, mainly used inside the Dashboard area.
 */
function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/clubs">Clubs</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/registrations">Registrations</Link></li>
        <li><Link to="/announcements">Announcements</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
