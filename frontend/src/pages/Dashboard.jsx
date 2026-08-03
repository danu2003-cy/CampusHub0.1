import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import UpcomingEvents from '../components/UpcomingEvents';
import clubApi from '../api/clubApi';
import announcementApi from '../api/announcementApi';

/**
 * Landing page after login.
 */
function Dashboard() {
  const [clubs, setClubs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubsRes, announcementsRes] = await Promise.all([
          clubApi.getAll(),
          announcementApi.getAll()
        ]);
        
        // For "My Clubs", ideally we would filter by clubs the user is a member of,
        // but since we just have a general list for now, we'll show up to 3 clubs.
        setClubs(clubsRes.data.slice(0, 3));
        
        // Show up to 3 recent announcements
        setAnnouncements(announcementsRes.data.slice(-3).reverse());
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      
      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <div className="card-grid">
          <Card title="My Clubs">
            {clubs.length > 0 ? (
              <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                {clubs.map(club => (
                  <li key={club.id} style={{ marginBottom: '0.5rem' }}>
                    <strong>{club.name}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No clubs joined yet.</p>
            )}
          </Card>
          
          <Card title="Upcoming Events">
            <UpcomingEvents limit={5} />
          </Card>
          
          <Card title="Recent Announcements">
            {announcements.length > 0 ? (
              <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                {announcements.map(ann => (
                  <li key={ann.id} style={{ marginBottom: '0.5rem' }}>
                    <strong>{ann.title}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{ann.content}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No recent announcements.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
