import React, { useEffect, useState } from 'react';
import feedbackApi from '../api/feedbackApi';
import eventApi from '../api/eventApi';
import toast from 'react-hot-toast';

/**
 * Feedback page — lists, creates, edits, and deletes event feedback.
 */
function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ eventId: '', userId: '', rating: '', comments: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFeedback();
    loadEvents();
  }, []);

  const loadFeedback = async () => {
    try {
      const response = await feedbackApi.getAll();
      setFeedbackList(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load feedback.');
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    setEditingId(null);
    setForm({ eventId: '', userId: user.id || '', rating: '5', comments: '' });
    setShowForm(true);
  };

  const openEdit = (fb) => {
    setEditingId(fb.id);
    setForm({
      eventId: fb.eventId || '',
      userId: fb.userId || '',
      rating: fb.rating != null ? String(fb.rating) : '',
      comments: fb.comments || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.eventId || !form.userId) {
      toast.error('Event and User are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        eventId: Number(form.eventId),
        userId: Number(form.userId),
        rating: form.rating ? Number(form.rating) : null,
        comments: form.comments.trim(),
      };

      if (editingId) {
        await feedbackApi.update(editingId, payload);
        toast.success('Feedback updated.');
      } else {
        await feedbackApi.create(payload);
        toast.success('Feedback submitted.');
      }

      setShowForm(false);
      setEditingId(null);
      loadFeedback();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save feedback.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await feedbackApi.remove(id);
      toast.success('Feedback deleted.');
      loadFeedback();
    } catch (error) {
      toast.error('Failed to delete feedback.');
    }
  };

  const eventTitle = (eventId) => {
    const ev = events.find((e) => e.id === eventId);
    return ev ? ev.title : `Event ${eventId}`;
  };

  return (
    <div className="page">
      <h1>Feedback</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-success btn-icon" onClick={openCreate}>
          + Submit Feedback
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : feedbackList.length === 0 ? (
        <p style={{ color: '#888', fontStyle: 'italic' }}>No feedback yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>User ID</th>
              <th>Rating</th>
              <th>Comments</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((fb) => (
              <tr key={fb.id}>
                <td>{eventTitle(fb.eventId)}</td>
                <td>{fb.userId}</td>
                <td>{'★'.repeat(fb.rating || 0)}{'☆'.repeat(5 - (fb.rating || 0))}</td>
                <td>{fb.comments || '-'}</td>
                <td>{fb.submittedAt ? new Date(fb.submittedAt).toLocaleString() : '-'}</td>
                <td>
                  <span className="row-actions">
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(fb)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(fb.id)}>Delete</button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal-overlay" role="presentation" onMouseDown={() => !saving && setShowForm(false)}>
          <div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Feedback' : 'Submit Feedback'}</h2>
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
              <label>
                Rating (1-5)
                <input name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} placeholder="5" />
              </label>
              <label>
                Comments
                <textarea name="comments" rows={3} value={form.comments} onChange={handleChange} placeholder="Share your thoughts about the event..." />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? 'Saving...' : 'Submit'}
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

export default Feedback;
