import React, { useEffect, useState, useContext } from "react";
import { API_URL } from '../../lib/api';
// TODO: Refactor all axios calls below to use fetch and API_URL.
import { UserContext } from "../../providers/UserProvider";

const TABS = [
  { key: "users", label: "Users" },
  { key: "places", label: "Places" },
  { key: "bookings", label: "Bookings" },
  { key: "reviews", label: "Reviews" },
];

export default function AdminDashboard() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [places, setPlaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return;
    setLoading(true);
    Promise.all([
      axios.get("/admin/users"),
      axios.get("/admin/places"),
      axios.get("/admin/bookings"),
      axios.get("/admin/reviews"),
    ])
      .then(([usersRes, placesRes, bookingsRes, reviewsRes]) => {
        setUsers(usersRes.data);
        setPlaces(placesRes.data);
        setBookings(bookingsRes.data);
        setReviews(reviewsRes.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch admin data.");
        setLoading(false);
      });
  }, [user]);

  if (!user || user.role !== "admin") {
    return <div className="p-8 text-center text-red-500">Access denied. Admins only.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded ${activeTab === tab.key ? "bg-gray-800 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-900 rounded shadow p-4">
        {activeTab === "users" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="py-2">{u._id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "places" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Places</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Title</th>
                  <th>Owner</th>
                </tr>
              </thead>
              <tbody>
                {places.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="py-2">{p._id}</td>
                    <td>{p.title}</td>
                    <td>{p.owner?.name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Bookings</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th>User</th>
                  <th>Place</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="py-2">{b._id}</td>
                    <td>{b.user?.name || "-"}</td>
                    <td>{b.place?.title || "-"}</td>
                    <td>{b.checkIn?.slice(0, 10)}</td>
                    <td>{b.checkOut?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "reviews" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th>User</th>
                  <th>Place</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id} className="border-t">
                    <td className="py-2">{r._id}</td>
                    <td>{r.user?.name || "-"}</td>
                    <td>{r.place?.title || "-"}</td>
                    <td>{r.rating}</td>
                    <td>{r.comment}</td>
                    <td>{r.status || "pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
