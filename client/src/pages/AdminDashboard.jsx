import { PlaceImageCell } from './PlaceImageCell';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../utils/axios';
import { UserContext } from '../providers/UserProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from '../utils/toast';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'places', label: 'Places' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'reviews', label: 'Reviews' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useContext(UserContext);
  const [active, setActive] = useState('overview');

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="p-6 text-gray-100">Loading...</div>;
  }

  return (
    <div className="p-6 text-gray-100">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-2 rounded-md text-sm ${active === t.id ? 'bg-gray-800 text-white' : 'bg-gray-700/50 text-gray-200 hover:bg-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === 'overview' && <OverviewTab />}
        {active === 'users' && <UsersTab />}
        {active === 'places' && <PlacesTab />}
        {active === 'bookings' && <BookingsTab />}
        {active === 'reviews' && <ReviewsTab />}
      </div>
    </div>
  );
}

function Section({ title, children, actions }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {actions}
      </div>
      <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4">{children}</div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col p-4 bg-gray-800/60 border border-gray-700 rounded-lg min-w-[160px]">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-2xl font-semibold">{value}</span>
    </div>
  );
}

function useFetch(endpoint, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    axiosInstance
      .get(endpoint)
      .then(res => {
        if (!mounted) return;
        setData(res.data?.data || null);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Failed to load');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading, error, refetch: () => axiosInstance.get(endpoint).then(res => setData(res.data?.data || null)) };
}

function OverviewTab() {
  const places = useFetch('/places/admin/stats', ['places']);
  const bookings = useFetch('/bookings/stats', ['bookings']);
  const reviews = useFetch('/reviews/admin/stats', ['reviews']);

  return (
    <div className="space-y-6">
      <Section title="Key Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Stat label="Places" value={places.data?.overall?.total || 0} />
          <Stat label="Bookings" value={bookings.data?.overall?.total || 0} />
          <Stat label="Reviews" value={reviews.data?.overall?.total || 0} />
        </div>
      </Section>
    </div>
  );
}

function UsersTab() {
  const [q, setQ] = useState('');
  const { data, loading, error, refetch } = useFetch('/auth/users', ['users']);
  const users = data?.users || [];
  const filtered = useMemo(() => users.filter(u => (u.name || '').toLowerCase().includes(q.toLowerCase()) || (u.email || '').toLowerCase().includes(q.toLowerCase())), [users, q]);

  const toggleBan = async (id, active) => {
    try {
      if (active === false) {
        await axiosInstance.patch(`/auth/users/${id}/unban`);
      } else {
        await axiosInstance.patch(`/auth/users/${id}/ban`);
      }
      await refetch();
  const action = active === false ? 'unbanned' : 'banned';
  toast.success(`User ${action}`);
    } catch (e) {
  toast.error(e?.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <Section title="Users">
      <div className="mb-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or email" className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm" />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-400">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">Verified</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id} className="border-t border-gray-700">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.isAdmin ? 'Admin' : u.isHost ? 'Host' : 'User'}</td>
                <td className="py-2">{u.isVerified ? 'Yes' : 'No'}</td>
                <td className="py-2">{u.active === false ? 'Banned' : 'Active'}</td>
                <td className="py-2">
                  <button
                    onClick={() => toggleBan(u._id, u.active)}
                    className={`px-3 py-1.5 text-xs rounded-md ${u.active === false ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {u.active === false ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function PlacesTab() {
  const [q, setQ] = useState('');
  const { data, loading, error, refetch } = useFetch('/places', ['places-list']);
  const places = data?.places || [];
  const filtered = useMemo(() => places.filter(p => (p.title || '').toLowerCase().includes(q.toLowerCase())), [places, q]);
  const remove = async (id) => {
    try {
      await axiosInstance.delete(`/places/${id}`);
      await refetch();
      toast.success('Place deleted');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete place');
    }
  };

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', price: 0, status: 'active', featured: false, maxGuests: 1 });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title || '',
      price: p.price || 0,
      status: p.status || 'active',
      featured: !!p.featured,
      maxGuests: p.maxGuests || 1,
    });
    setErrors({});
    setApiError('');
  };
  const save = async () => {
    if (!editing) return;
    // validate
    const nextErrors = {};
  if (!form.title || !form.title.trim()) nextErrors.title = 'Title is required';
  if (form.price === '' || isNaN(Number(form.price)) || Number(form.price) < 5) nextErrors.price = 'Price must be at least $5';
  if (Number(form.price) > 10000) nextErrors.price = 'Price must be less than $10,000';
  if (form.maxGuests === '' || isNaN(Number(form.maxGuests)) || Number(form.maxGuests) < 1) nextErrors.maxGuests = 'Must be at least 1';
  if (Number(form.maxGuests) > 50) nextErrors.maxGuests = 'Max 50 guests';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    setApiError('');
    try {
      await axiosInstance.patch(`/places/${editing._id}`, form);
      toast.success('Place updated');
      setEditing(null);
      await refetch();
    } catch (e) {
      setApiError(e?.response?.data?.message || 'Failed to update place');
      toast.error(e?.response?.data?.message || 'Failed to update place');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section title="Places">
      <div className="mb-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title" className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm" />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p._id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg flex flex-col gap-2">
            <div className="mb-2">
              <PlaceImageCell place={p} />
            </div>
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-gray-400">{p.address}</div>
            <div className="mt-2 text-sm">${p.price} / night</div>
            <div className="mt-3">
              <button onClick={() => openEdit(p)} className="mr-2 px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 rounded-md">Edit</button>
              <button onClick={() => remove(p._id)} className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Edit Place</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-200">✕</button>
            </div>
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="text-gray-300">Title</span>
                <input className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} maxLength={100} placeholder="e.g. Cozy Apartment" />
                {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
              </label>
              <label className="block text-sm">
                <span className="text-gray-300">Price</span>
                <input type="number" min={5} max={10000} step={1} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="USD" />
                <span className="text-xs text-gray-500">Min $5, Max $10,000</span>
                {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
              </label>
              <label className="block text-sm">
                <span className="text-gray-300">Max Guests</span>
                <input type="number" min={1} max={50} step={1} className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={form.maxGuests} onChange={e => setForm({ ...form, maxGuests: Number(e.target.value) })} placeholder="1-50" />
                <span className="text-xs text-gray-500">1-50 guests</span>
                {errors.maxGuests && <p className="text-xs text-red-400 mt-1">{errors.maxGuests}</p>}
              </label>
              <label className="block text-sm">
                <span className="text-gray-300">Status</span>
                <select className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">draft</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="suspended">suspended</option>
                </select>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                <span>Featured</span>
              </label>
            </div>
            {apiError && <div className="mt-3 text-xs text-red-400">{apiError}</div>}
            <div className="mt-4 flex justify-end gap-2">
              <button disabled={saving} onClick={() => setEditing(null)} className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-60">Cancel</button>
              <button disabled={saving} onClick={save} className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

function BookingsTab() {
  const { data, loading, error, refetch } = useFetch('/bookings', ['bookings-list']);
  const bookings = data?.bookings || [];
  const remove = async (id) => {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      await refetch();
      toast.success('Booking deleted');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete booking');
    }
  };
  const [editing, setEditing] = useState(null);
  const [status, setStatus] = useState('pending');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const openEdit = (b) => {
    setEditing(b);
    setStatus(b.status || 'pending');
    setEditError('');
  };
  const save = async () => {
    if (!editing) return;
    const allowed = ['pending', 'confirmed', 'cancelled'];
    if (!allowed.includes(status)) {
      setEditError('Invalid status');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      await axiosInstance.patch(`/bookings/${editing._id}/status`, { status });
      toast.success('Booking updated');
      setEditing(null);
      await refetch();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to update booking';
      setEditError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };
  const checkIn = async (id) => {
    try { await axiosInstance.patch(`/bookings/${id}/check-in`); await refetch(); toast.success('Checked in'); } catch (e) { toast.error(e?.response?.data?.message || 'Failed to check-in'); }
  };
  const checkOut = async (id) => {
    try { await axiosInstance.patch(`/bookings/${id}/check-out`); await refetch(); toast.success('Checked out'); } catch (e) { toast.error(e?.response?.data?.message || 'Failed to check-out'); }
  };
  return (
    <Section title="Bookings">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-400">
            <tr>
              <th className="py-2">Guest</th>
              <th className="py-2">Place</th>
              <th className="py-2">Dates</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-t border-gray-700">
                <td className="py-2">{b.user?.name || '—'}</td>
                <td className="py-2">{b.place?.title || '—'}</td>
                <td className="py-2">{b.checkIn?.slice(0,10)} → {b.checkOut?.slice(0,10)}</td>
                <td className="py-2">${b.price}</td>
                <td className="py-2">{b.status || 'confirmed'}</td>
                <td className="py-2">
                  <button onClick={() => openEdit(b)} className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 rounded-md">Edit</button>
                  <button onClick={() => checkIn(b._id)} className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 rounded-md">Check-in</button>
                  <button onClick={() => checkOut(b._id)} className="px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-700 rounded-md">Check-out</button>
                  <button onClick={() => remove(b._id)} className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 rounded-md">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Edit Booking</h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-200">✕</button>
            </div>
            <label className="block text-sm">
              <span className="text-gray-300">Status</span>
              <select className="mt-1 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="pending">pending</option>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </label>
            {editError && <div className="mt-3 text-xs text-red-400">{editError}</div>}
            <div className="mt-4 flex justify-end gap-2">
              <button disabled={saving} onClick={() => setEditing(null)} className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-60">Cancel</button>
              <button disabled={saving} onClick={save} className="px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}

function ReviewsTab() {
  const [q, setQ] = useState('');
  const { data, loading, error } = useFetch('/reviews', ['reviews-list']);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data?.reviews || []);
  }, [data]);

  const filtered = useMemo(
    () => items.filter(r => (r.comment || '').toLowerCase().includes(q.toLowerCase()) || (r.user?.name || '').toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  const remove = async (id) => {
    try {
      await axiosInstance.delete(`/reviews/${id}`);
      setItems(prev => prev.filter(r => r._id !== id));
  toast.success('Review deleted');
    } catch (e) {
  toast.error(e?.response?.data?.message || 'Failed to delete review');
    }
  };

  return (
    <Section title="Reviews">
      <div className="mb-3 flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by text or author" className="flex-1 bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm" />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r._id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm"><span className="font-medium">{r.user?.name || 'Anonymous'}</span> on <span className="font-medium">{r.place?.title || '—'}</span></div>
                <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-yellow-400 text-sm">★ {r.rating}</div>
            </div>
            <p className="mt-2 text-sm">{r.comment}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => remove(r._id)} className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
