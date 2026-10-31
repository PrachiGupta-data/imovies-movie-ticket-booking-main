import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Could not load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seats will be released.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await api.post(`/bookings/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' } : b
        )
      );
    } catch (err) {
      alert(err.message || 'Error cancelling booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container text-center py-5">
        <h4 className="text-dark mb-3">Please sign in to view your bookings</h4>
        <Link to="/login" className="btn-cine-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 text-start">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2 brand-font">
            <i className="bi bi-ticket-perforated-fill text-danger"></i>
            <span>My Bookings</span>
          </h2>
          <p className="text-secondary small mb-0">
            View, download, or manage all your Cinevo digital tickets
          </p>
        </div>

        <Link to="/" className="btn btn-outline-danger btn-sm">
          <i className="bi bi-plus-lg me-1"></i> Book More
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-secondary mt-3">Retrieving your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel text-center py-5">
          <i className="bi bi-ticket-detailed display-4 text-secondary mb-3 d-block"></i>
          <h4 className="text-dark fw-bold">No Bookings Yet</h4>
          <p className="text-secondary small mb-4">You haven't booked any movie tickets yet.</p>
          <Link to="/" className="btn-cine-primary text-decoration-none">
            Explore Movies Now
          </Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {bookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'cancelled';

            return (
              <div
                key={booking._id}
                className={`card bg-white border rounded-4 p-4 shadow-sm ${
                  isCancelled ? 'opacity-75' : ''
                }`}
              >
                <div className="row g-4 align-items-center">
                  {/* Poster */}
                  <div className="col-md-2 col-sm-3 text-center">
                    <img
                      src={booking.movie?.posterUrl}
                      alt={booking.movie?.title}
                      className="img-fluid rounded-3 shadow-sm"
                      style={{ maxHeight: '140px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="col-md-7 col-sm-9">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h5 className="fw-bold text-dark mb-0">{booking.movie?.title}</h5>
                      <span
                        className={`badge ${
                          isCancelled ? 'bg-danger' : 'bg-success'
                        } text-uppercase small`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <p className="small text-secondary mb-2">
                      <i className="bi bi-geo-alt text-danger me-1"></i>
                      {booking.show?.theatreName} •{' '}
                      <i className="bi bi-calendar3 me-1"></i>
                      {booking.show?.showDate} at{' '}
                      <span className="text-danger fw-bold">{booking.show?.showTime}</span>
                    </p>

                    <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                      <span className="text-secondary small">Seats:</span>
                      {booking.seats?.map((seat) => (
                        <span key={seat} className="badge bg-light text-dark border">
                          {seat}
                        </span>
                      ))}
                    </div>

                    <div className="small text-secondary">
                      Ref: <span className="text-dark font-monospace fw-bold">{booking.bookingReference}</span> • Total Paid: <span className="text-success fw-bold">₹{booking.totalAmount}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-md-3 text-md-end d-flex flex-md-column gap-2 justify-content-center">
                    <Link
                      to={`/confirmation/${booking._id}`}
                      className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-center gap-1"
                    >
                      <i className="bi bi-qr-code"></i>
                      <span>View Ticket</span>
                    </Link>

                    {!isCancelled && (
                      <button
                        className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-1"
                        disabled={cancellingId === booking._id}
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        {cancellingId === booking._id ? (
                          <span>Cancelling...</span>
                        ) : (
                          <>
                            <i className="bi bi-x-circle"></i>
                            <span>Cancel Ticket</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
