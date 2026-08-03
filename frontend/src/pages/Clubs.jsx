import React, { useEffect, useState } from 'react';
import clubApi from '../api/clubApi';
import toast from 'react-hot-toast';

/**
 * Clubs page — lists, creates, edits, deletes clubs, and views members.
 */
function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', createdById: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    try {
      const response = await clubApi.getAll();
      setClubs(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load clubs.');
    } finally {
      setLoading(false);
    }
  };

  const viewMembers = async (club) => {
    try {
      const response = await clubApi.getMembers(club.id);
      setSelectedClub(club);
      setMembers(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load members.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreate = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    setEditingId(null);
    setForm({ name: '', description: '', createdById: user.id || '' });
    setShowForm(true);
  };

  const openEdit = (club) => {
    setEditingId(club.id);
    setForm({
      name: club.name || '',
      description: club.description || '',
      createdById: club.createdById || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Club name is required.');
      return;
    }
    if (!form.createdById) {
      toast.error('Creator user ID is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        createdById: Number(form.createdById),
      };

      if (editingId) {
        await clubApi.update(editingId, payload);
        toast.success('Club updated.');
      } else {
        await clubApi.create(payload);
        toast.success('Club created.');
      }

      setShowForm(false);
      setEditingId(null);
      loadClubs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save club.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this club? All members, events, and announcements under this club will also be removed.')) return;
    try {
      await clubApi.remove(id);
      toast.success('Club deleted.');
      if (selectedClub && selectedClub.id === id) {
        setSelectedClub(null);
        setMembers([]);
      }
      loadClubs();
    } catch (error) {
      toast.error('Failed to delete club.');
    }
  };

  return (
    <div className="page">
      <h1>Clubs</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-success btn-icon" onClick={openCreate}>
          + Add Club
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : clubs.length === 0 ? (
        <p style={{ color: '#888', fontStyle: 'italic' }}>No clubs yet. Create the first one!</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Club Name</th>
              <th>Description</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clubs.map((club) => (
              <tr key={club.id}>
                <td>{club.name}</td>
                <td>{club.description || '-'}</td>
                <td>User {club.createdById}</td>
                <td>
                  <span className="row-actions">
                    <button className="btn btn-sm" onClick={() => viewMembers(club)}>Members</button>
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(club)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(club.id)}>Delete</button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedClub && (
        <>
          <h2>{selectedClub.name} — Members</h2>
          {members.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic' }}>No members in this club.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Role</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.userId}</td>
                    <td>{member.roleInClub}</td>
                    <td>{member.joinedAt ? new Date(member.joinedAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {showForm && (
        <div className="modal-overlay" role="presentation" onMouseDown={() => !saving && setShowForm(false)}>
          <div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Club' : 'Add Club'}</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Club Name *
                <input name="name" value={form.name} onChange={handleChange} maxLength={150} autoFocus placeholder="Computer Science Society" />
              </label>
              <label>
                Description
                <textarea name="description" rows={3} value={form.description} onChange={handleChange} placeholder="What is this club about?" />
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

export default Clubs;