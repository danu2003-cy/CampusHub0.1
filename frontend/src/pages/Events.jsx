import React, { useEffect, useState } from 'react';
import Table from '../components/Table';
import toast from 'react-hot-toast';
import eventApi from '../api/eventApi';
import { formatEventDate, toInputDate } from '../utils/dateFormat';
import {
  IconCalendar,
  IconCheck,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from '../components/icons';
import '../styles/modal.css';
import '../styles/ui.css';

const PAGE_SIZES = [5, 10, 20];

const EMPTY_PAGE = {
  content: [],
  number: 0,
  totalPages: 0,
  totalElements: 0,
  first: true,
  last: true,
};

const EMPTY_FORM = {
  title: '',
  clubId: '',
  description: '',
  eventDate: '',
  location: '',
};

function buildPayload(form) {
  const payload = {
    title: form.title.trim(),
    clubId: Number(form.clubId),
  };

  if (form.description.trim()) {
    payload.description = form.description.trim();
  }

  if (form.eventDate) {
    payload.eventDate = form.eventDate;
  }

  if (form.location.trim()) {
    payload.location = form.location.trim();
  }

  return payload;
}

function Events() {
  const [pageData, setPageData] = useState(EMPTY_PAGE);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(PAGE_SIZES[0]);
  const [sortField, setSortField] = useState('eventDate');
  const [sortDir, setSortDir] = useState('asc');

  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [reloadToken, setReloadToken] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  function reload() {
    setReloadToken((token) => token + 1);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(search);
      setPage(0);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    eventApi
      .getAll({ page, size, sort: `${sortField},${sortDir}`, search: appliedSearch })
      .then((response) => {
        if (!ignore) {
          setPageData(response.data || EMPTY_PAGE);
          setError(null);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError('Could not load events. Is the backend running on port 8081?');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, size, sortField, sortDir, appliedSearch, reloadToken]);

  useEffect(() => {
    let ignore = false;

    eventApi
      .getClubOptions()
      .then((response) => {
        if (!ignore) {
          setClubs(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch(() => {
        /* falls back to a plain club id input */
      });

    return () => {
      ignore = true;
    };
  }, []);

  // deleting the last row on a page can leave us beyond the final page, with
  // an empty table even though events still exist
  useEffect(() => {
    if (page > 0 && pageData.content.length === 0 && pageData.totalElements > 0) {
      setPage(0);
    }
  }, [page, pageData]);

  function toggleSort(field) {
    if (sortField === field) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }

    setPage(0);
  }

  function sortableHeader(label, field) {
    const active = sortField === field;

    return (
      <button type="button" className="th-sort" onClick={() => toggleSort(field)}>
        {label}
        <span className="th-sort-arrow">{active ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}</span>
      </button>
    );
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  function closeDeleteConfirm() {
    setDeleteTarget(null);
    setDeleteError(null);
  }

  useEffect(() => {
    const dialogOpen = showForm || deleteTarget !== null;
    if (!dialogOpen) {
      return undefined;
    }

    function handleKeyDown(e) {
      if (e.key !== 'Escape' || saving || deleting) {
        return;
      }

      if (showForm) {
        closeForm();
      } else {
        closeDeleteConfirm();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showForm, deleteTarget, saving, deleting]);

  useEffect(() => {
    if (!showForm && deleteTarget === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showForm, deleteTarget]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(event) {
    setEditingId(event.id);
    setForm({
      title: event.title || '',
      clubId: event.clubId != null ? String(event.clubId) : '',
      description: event.description || '',
      eventDate: toInputDate(event.eventDate),
      location: event.location || '',
    });
    setFormError(null);
    setShowForm(true);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }

    if (!form.clubId) {
      setFormError('Club is required - every event belongs to a club.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const payload = buildPayload(form);
    const request = editingId
      ? eventApi.update(editingId, payload)
      : eventApi.create(payload);

    request
      .then(() => reload())
      .then(() => {
        toast.success(editingId ? 'Event updated' : 'Event created');
        closeForm();
      })
      .catch((err) => {
        setFormError(err.response?.data?.message || 'Could not save the event.');
      })
      .finally(() => setSaving(false));
  }

  function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    const { title } = deleteTarget;

    eventApi
      .remove(deleteTarget.id)
      .then(() => reload())
      .then(() => {
        toast.success(`Deleted "${title}"`);
        closeDeleteConfirm();
      })
      .catch((err) => {
        setDeleteError(err.response?.data?.message || 'Could not delete the event.');
      })
      .finally(() => setDeleting(false));
  }

  const clubNamesById = new Map(clubs.map((club) => [club.id, club.name]));

  function clubNameFor(event) {
    if (event.clubId == null) {
      return '-';
    }

    return clubNamesById.get(event.clubId) || `Club ${event.clubId}`;
  }

  const columns = [
    { key: 'title', label: sortableHeader('Event Title', 'title') },
    { key: 'club', label: sortableHeader('Club', 'club.name') },
    { key: 'eventDate', label: sortableHeader('Date', 'eventDate') },
    { key: 'location', label: sortableHeader('Location', 'location') },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: 'Actions' },
  ];

  const rows = pageData.content.map((event) => ({
    id: event.id,
    title: event.title,
    club: clubNameFor(event),
    eventDate: formatEventDate(event.eventDate),
    location: event.location || '-',
    description: event.description ? (
      <span className="events-desc">{event.description}</span>
    ) : (
      '-'
    ),
    actions: (
      <span className="row-actions">
        <button
          type="button"
          className="btn btn-warning btn-sm btn-icon"
          onClick={() => openEdit(event)}
        >
          <IconPencil />
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm btn-icon"
          onClick={() => setDeleteTarget(event)}
        >
          <IconTrash />
          Delete
        </button>
      </span>
    ),
  }));

  const searching = appliedSearch.trim().length > 0;

  return (
    <div className="page">
      <h1>Events</h1>

      {loading && <p>Loading events...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="events-toolbar">
            <button
              type="button"
              className="btn btn-success btn-icon"
              onClick={openCreate}
            >
              <IconPlus />
              Add Event
            </button>

            <label className="events-search">
              Search events
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by title, club or location"
              />
            </label>
          </div>

          {pageData.totalElements === 0 ? (
            <div className="events-empty">
              <span className="events-empty-icon" aria-hidden="true">
                <IconCalendar />
              </span>

              {searching ? (
                <>
                  <p className="events-empty-title">
                    No events match &quot;{appliedSearch.trim()}&quot;
                  </p>
                  <p className="events-empty-hint">
                    Try a different title, club or location.
                  </p>
                  <button
                    type="button"
                    className="btn btn-secondary btn-icon"
                    onClick={() => setSearch('')}
                  >
                    <IconX />
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="events-empty-title">No events yet</p>
                  <p className="events-empty-hint">
                    Add the first event and it will show up here.
                  </p>
                  <button
                    type="button"
                    className="btn btn-success btn-icon"
                    onClick={openCreate}
                  >
                    <IconPlus />
                    Add Event
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="events-table">
                <Table columns={columns} data={rows} />
              </div>

              <div className="pager">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={pageData.first}
                >
                  Previous
                </button>

                <span className="pager-status">
                  Page {pageData.number + 1} of {Math.max(1, pageData.totalPages)}
                  {' - '}
                  {pageData.totalElements} event
                  {pageData.totalElements === 1 ? '' : 's'}
                </span>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={pageData.last}
                >
                  Next
                </button>

                <label className="pager-size">
                  Rows
                  <select
                    value={size}
                    onChange={(e) => {
                      setSize(Number(e.target.value));
                      setPage(0);
                    }}
                  >
                    {PAGE_SIZES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </>
          )}
        </>
      )}

      {deleteTarget && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={() => {
            if (!deleting) {
              closeDeleteConfirm();
            }
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-heading"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="delete-confirm-heading">Delete event?</h2>

            <p>
              <strong>{deleteTarget.title}</strong> will be permanently deleted.
            </p>
            <p className="error">
              Any registrations and feedback for this event will be deleted as well.
              This cannot be undone.
            </p>

            {deleteError && <p className="error">{deleteError}</p>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-danger btn-icon"
                onClick={handleDelete}
                disabled={deleting}
              >
                <IconTrash />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={closeDeleteConfirm}
                disabled={deleting}
              >
                <IconX />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="modal-overlay"
          role="presentation"
          onMouseDown={() => {
            if (!saving) {
              closeForm();
            }
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-form-heading"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 id="event-form-heading">{editingId ? 'Edit Event' : 'Add Event'}</h2>

            <form className="form" onSubmit={handleSubmit}>
              <label>
                Title *
                <input
                  type="text"
                  value={form.title}
                  maxLength={150}
                  autoFocus
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Intro to Web Development Workshop"
                />
              </label>

              <label>
                Club *
                {clubs.length > 0 ? (
                  <select
                    value={form.clubId}
                    onChange={(e) => updateField('clubId', e.target.value)}
                  >
                    <option value="">Select a club</option>
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    min="1"
                    value={form.clubId}
                    onChange={(e) => updateField('clubId', e.target.value)}
                    placeholder="Club id, e.g. 4"
                  />
                )}
              </label>

              <label>
                Date and time
                <input
                  type="datetime-local"
                  value={form.eventDate}
                  onChange={(e) => updateField('eventDate', e.target.value)}
                />
              </label>

              <label>
                Location
                <input
                  type="text"
                  value={form.location}
                  maxLength={200}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Room 204, Engineering Block"
                />
              </label>

              <label>
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="What is this event about?"
                />
              </label>

              {formError && <p className="error">{formError}</p>}

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn btn-success btn-icon"
                  disabled={saving}
                >
                  <IconCheck />
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-icon"
                  onClick={closeForm}
                  disabled={saving}
                >
                  <IconX />
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

export default Events;
