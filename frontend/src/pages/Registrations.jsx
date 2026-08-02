import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import registrationApi from '../api/registrationApi';
/**
 * Registrations page - shows a student's event registrations.
 * TODO (Member 5): fetch real data from registrationApi and render it here.
 */
function Registrations() {
    const [registrations, setRegistrations] = useState([]);
  const columns = [
    { key: 'eventTitle', label: 'Event' },
    { key: 'status', label: 'Status' },
    { key: 'registeredAt', label: 'Registered At' },
  ];

  const placeholderData = [];

  return (
    <div className="page">
      <h1>Registrations</h1>
      <p>Placeholder page - registration list will be loaded from the API.</p>
      <Table columns={columns} data={placeholderData} />
    </div>
  );
}

export default Registrations;
