import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import registrationApi from '../api/registrationApi';
import eventApi from '../api/eventApi';
import toast from 'react-hot-toast';

/**
 * Registrations page — lists, creates, updates status, and deletes registrations.
 */
function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ eventId: '', userId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRegistrations();
    loadEvents();
  }, []);

  const loadRegistrations = async () => {
    try {
      const response = await registrationApi.getAll();
      setRegistrations(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load registrations.');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await eventApi.getAll({ page: 0, size: 100 });
      const data = response.data;
      setEvents(Array.isArray(data) ? data : (data.content || []));
    } catch (error) {
      console.error(error);
    }
  };

  const openCreate = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    setForm({ eventId: '', userId: user.id || '' });
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.eventId || !form.userId) {
      toast.error('Event and User are required.');
      return;
    }

    setSaving(true);
    try {
      await registrationApi.create({
        eventId: Number(form.eventId),
        userId: Number(form.userId),
      });
      toast.success('Registration created.');
      setShowForm(false);
      loadRegistrations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await registrationApi.update(id, { status: 'CONFIRMED' });
      toast.success('Registration confirmed.');
      loadRegistrations();
    } catch (error) {
      toast.error('Failed to confirm.');
    }
  };

  const handleCancel = async (id) => {
    try {
      await registrationApi.cancel(id);
      toast.success('Registration cancelled.');
      loadRegistrations();
    } catch (error) {
      toast.error('Failed to cancel.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      await registrationApi.remove(id);
      toast.success('Registration deleted.');
      loadRegistrations();
    } catch (error) {
      toast.error('Failed to delete registration.');
    }
  };

  const columns = [
    { key: 'eventTitle', label: 'Event' },
    { key: 'userId', label: 'User ID' },
    { key: 'status', label: 'Status' },
    { key: 'registeredAt', label: 'Registered At' },
    { key: 'actions', label: 'Actions' },
  ];

  const data = registrations.map((r) => ({
    id: r.id,
    eventTitle: r.eventTitle || `Event ${r.eventId}`,
    userId: r.userId,
    status: (
      <span style={{
        padding: '0.2rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 600,
        backgroundColor: r.status === 'CONFIRMED' ? '#dcfce7' : r.status === 'CANCELLED' ? '#fee2e2' : '#fef9c3',
        color: r.status === 'CONFIRMED' ? '#166534' : r.status === 'CANCELLED' ? '#991b1b' : '#854d0e',
      }}>
        {r.status}
      </span>
    ),
    registeredAt: r.registeredAt ? new Date(r.registeredAt).toLocaleString() : '-',
    actions: (
      <span className="row-actions">
        {r.status === 'PENDING' && (
          <button className="btn btn-success btn-sm" onClick={() => handleConfirm(r.id)}>Confirm</button>
        )}
        {r.status !== 'CANCELLED' && (
          <button className="btn btn-warning btn-sm" onClick={() => handleCancel(r.id)}>Cancel</button>
        )}
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>Delete</button>
      </span>
    ),
  }));

  return (
    <div className="page">
      <h1>Registrations</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-success btn-icon" onClick={openCreate}>
          + Register for Event
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table columns={columns} data={data} />
      )}

      {showForm && (
        <div className="modal-overlay" role="presentation" onMouseDown={() => !saving && setShowForm(false)}>
          <div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <h2>Register for Event</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Event *
                {events.length > 0 ? (
                  <select name="eventId" value={form.eventId} onChange={handleChange}>
                    <option value="">Select an event</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                ) : (
                  <input name="eventId" type="number" min="1" value={form.eventId} onChange={handleChange} placeholder="Event ID" />
                )}
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? 'Registering...' : 'Register'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)} disabled={saving}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registrations;
