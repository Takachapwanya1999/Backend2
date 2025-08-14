import React, { useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '../utils/axios';
import { UserContext } from '../providers/UserProvider';
import { useNavigate } from 'react-router-dom';

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
  const { data, loading, error } = useFetch('/auth/users', ['users']);
  const users = data?.users || [];
  const filtered = useMemo(() => users.filter(u => (u.name || '').toLowerCase().includes(q.toLowerCase()) || (u.email || '').toLowerCase().includes(q.toLowerCase())), [users, q]);

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
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id} className="border-t border-gray-700">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.isAdmin ? 'Admin' : u.isHost ? 'Host' : 'User'}</td>
                <td className="py-2">{u.isVerified ? 'Yes' : 'No'}</td>
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
  const { data, loading, error } = useFetch('/places', ['places-list']);
  const places = data?.places || [];
  const filtered = useMemo(() => places.filter(p => (p.title || '').toLowerCase().includes(q.toLowerCase())), [places, q]);

  return (
    <Section title="Places">
      <div className="mb-3">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title" className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm" />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p._id} className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-gray-400">{p.address}</div>
            <div className="mt-2 text-sm">${p.price} / night</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BookingsTab() {
  const { data, loading, error } = useFetch('/bookings', ['bookings-list']);
  const bookings = data?.bookings || [];
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    } catch (e) {
      // ignore
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
