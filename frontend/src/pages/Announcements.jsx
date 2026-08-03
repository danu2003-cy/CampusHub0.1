import React, { useEffect, useState } from 'react';
import announcementApi from '../api/announcementApi';
import clubApi from '../api/clubApi';
import toast from 'react-hot-toast';

/**
 * Announcements page — lists, creates, edits, and deletes announcements.
 */
function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ clubId: '', title: '', content: '', postedById: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAnnouncements();
    loadClubs();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const response = await announcementApi.getAll();
      setAnnouncements(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  };

  const loadClubs = async () => {
    try {
      const response = await clubApi.getAll();
      setClubs(response.data);
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
    setForm({ clubId: '', title: '', content: '', postedById: user.id || '' });
    setShowForm(true);
  };

  const openEdit = (announcement) => {
    setEditingId(announcement.id);
    setForm({
      clubId: announcement.clubId || '',
      title: announcement.title || '',
      content: announcement.content || '',
      postedById: announcement.postedById || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.clubId) {
      toast.error('Title and Club are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        clubId: Number(form.clubId),
        title: form.title.trim(),
        content: form.content.trim(),
        postedById: form.postedById ? Number(form.postedById) : null,
      };

      if (editingId) {
        await announcementApi.update(editingId, payload);
        toast.success('Announcement updated.');
      } else {
        await announcementApi.create(payload);
        toast.success('Announcement created.');
      }

      setShowForm(false);
      setEditingId(null);
      loadAnnouncements();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await announcementApi.remove(id);
      toast.success('Announcement deleted.');
      loadAnnouncements();
    } catch (error) {
      toast.error('Failed to delete announcement.');
    }
  };

  const clubName = (clubId) => {
    const club = clubs.find((c) => c.id === clubId);
    return club ? club.name : `Club ${clubId}`;
  };

  return (
    <div className="page">
      <h1>Announcements</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-success btn-icon" onClick={openCreate}>
          + Add Announcement
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : announcements.length === 0 ? (
        <p style={{ color: '#888', fontStyle: 'italic' }}>No announcements yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Club</th>
              <th>Content</th>
              <th>Posted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{clubName(a.clubId)}</td>
                <td>{a.content || '-'}</td>
                <td>{a.postedAt ? new Date(a.postedAt).toLocaleString() : '-'}</td>
                <td>
                  <span className="row-actions">
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(a)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Delete</button>
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
            <h2>{editingId ? 'Edit Announcement' : 'Add Announcement'}</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Title *
                <input name="title" value={form.title} onChange={handleChange} maxLength={150} autoFocus />
              </label>
              <label>
                Club *
                {clubs.length > 0 ? (
                  <select name="clubId" value={form.clubId} onChange={handleChange}>
                    <option value="">Select a club</option>
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input name="clubId" type="number" min="1" value={form.clubId} onChange={handleChange} placeholder="Club ID" />
                )}
              </label>
              <label>
                Content
                <textarea name="content" rows={3} value={form.content} onChange={handleChange} placeholder="Announcement content..." />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
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

export default Announcements;
