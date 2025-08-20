import React, { useEffect, useState } from "react";
import "./BookingCard.css";

function BookingCard() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [logIn, setLogIn] = useState(true); // Added logIn state set to true

    useEffect(() => {
        fetch("https://backend2-ixjt.onrender.com/api/bookings")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch bookings");
                return res.json();
            })
            .then((data) => {
                setBookings(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="booking-list">
            {bookings.length === 0 ? (
                <div>No bookings found.</div>
            ) : (
                bookings.map((booking) => (
                    <div key={booking._id} className="booking-card">
                        <h3 className="booking-title">{booking.place?.name || "No place name"}</h3>
                        <p><span className="label">Guest:</span> {booking.guest || "N/A"}</p>
                        <p><span className="label">Host:</span> {booking.host || "N/A"}</p>
                        <p><span className="label">Check-in:</span> {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}</p>
                        <p><span className="label">Check-out:</span> {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "N/A"}</p>
                        <p>
                            <span className="label">Total Guests:</span>{" "}
                            {booking.guests
                                ? booking.guests.adults + booking.guests.children + booking.guests.infants
                                : "N/A"}
                        </p>
                        <p>
                            <span className="label">Total Price:</span>{" "}
                            {booking.pricing
                                ? `${booking.pricing.currency} ${booking.pricing.total}`
                                : "N/A"}
                        </p>
                        <p><span className="label">Status:</span> {booking.status || "N/A"}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default BookingCard;
