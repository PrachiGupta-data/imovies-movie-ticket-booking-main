import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function BookingConfirmation() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fnbData, setFnbData] = useState(null);

  useEffect(() => {
    fetchBooking();
    const storedFnb = localStorage.getItem(`cinevo_fnb_${id}`) || localStorage.getItem(`cineverse_fnb_${id}`);
    if (storedFnb) {
      try {
        setFnbData(JSON.parse(storedFnb));
      } catch (e) {}
    }
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data.booking);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Could not retrieve booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        <p className="text-secondary mt-3">Generating your digital cinema ticket pass...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error || 'Booking not found'}</div>
        <Link to="/" className="btn btn-outline-dark mt-3">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <div className="display-4 text-success mb-2">
          <i className="bi bi-check-circle-fill"></i>
        </div>
        <h2 className="fw-black text-dark mb-1 brand-font">Reservation Confirmed!</h2>
        <p className="text-secondary">
          Your digital e-ticket has been generated and sent to{' '}
          <span className="text-dark fw-semibold">{booking.user?.email}</span>
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          {/* Digital E-Ticket Pass (Light Luxury Style) */}
          <div className="ticket-wrapper p-4 p-sm-5 printable-ticket text-start">
            {/* Ticket Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <div>
                <span className="badge bg-danger px-2 py-1 small fw-bold mb-1">CINEVO DIGITAL PASS</span>
                <h4 className="fw-black text-dark mb-0 brand-font">{booking.movie?.title}</h4>
              </div>
              <div className="text-end">
                <span className="badge badge-cyan px-2 py-1">{booking.show?.screenType || 'IMAX 3D'}</span>
              </div>
            </div>

            {/* Cineplex & Showtime Details */}
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="text-secondary small">Cineplex & Screen</div>
                <div className="fw-bold text-dark">{booking.show?.theatreName}</div>
                <div className="text-secondary small">{booking.show?.theatreLocation}</div>
              </div>

              <div className="col-sm-6 text-sm-end">
                <div className="text-secondary small">Date & Showtime</div>
                <div className="fw-bold text-dark">{booking.show?.showDate}</div>
                <div className="text-danger fw-bold fs-6">{booking.show?.showTime}</div>
              </div>
            </div>

            {/* Seats Badges */}
            <div className="mb-4 p-3 bg-light rounded-3 border">
              <div className="text-secondary small mb-2">Reserved Seats ({booking.seats?.length}):</div>
              <div className="d-flex flex-wrap gap-2">
                {booking.seats?.map((seat, idx) => (
                  <span key={idx} className="badge bg-success px-3 py-2 fs-6 fw-bold">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Food & Beverage if ordered */}
            {fnbData && fnbData.cart && (
              <div className="mb-4 p-3 bg-light rounded-3 border small">
                <div className="text-danger fw-bold mb-1">🍿 Add-on Snacks & Drinks:</div>
                <div className="text-secondary">
                  Food and beverages will be served directly to your seats upon entry.
                </div>
              </div>
            )}

            {/* Perforation Line */}
            <div className="ticket-perforation"></div>

            {/* Ticket Stub Footer: Reference & QR Placeholder */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
              <div>
                <div className="text-secondary small">Booking Reference Code</div>
                <div className="fw-black fs-4 text-dark letter-spacing-2 brand-font">
                  {booking.bookingReference}
                </div>
                <div className="text-success small fw-semibold mt-1">
                  <i className="bi bi-shield-check me-1"></i> Paid ₹{booking.totalAmount}
                </div>
              </div>

              {/* Scannable Barcode */}
              <div className="text-center p-2 bg-light border rounded-3 d-inline-block">
                <div className="d-flex gap-1 justify-content-center align-items-end" style={{ height: '40px' }}>
                  {[3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        width: `${h > 2 ? 3 : 2}px`,
                        height: `${h * 9}px`,
                        background: '#0f172a',
                      }}
                    />
                  ))}
                </div>
                <div className="text-dark small fw-bold" style={{ fontSize: '9px', letterSpacing: '2px' }}>
                  SCAN AT GATE
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button type="button" className="btn btn-outline-dark px-4 py-2" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i> Print / Save Ticket
            </button>
            <Link to="/" className="btn-cine-primary px-4 py-2 text-decoration-none">
              <i className="bi bi-film me-2"></i> Browse More Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
