import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SeatMatrix from '../components/SeatMatrix';

const FNB_ITEMS = [
  {
    id: 'fnb-popcorn',
    name: 'Jumbo Caramel Butter Popcorn',
    price: 220,
    icon: '🍿',
    desc: 'Warm, crispy caramel coated corn',
  },
  {
    id: 'fnb-nachos',
    name: 'Loaded Nachos & Jalapeño Dip',
    price: 190,
    icon: '🧀',
    desc: 'Crispy corn tortilla with warm cheese sauce',
  },
  {
    id: 'fnb-coke',
    name: 'Chilled Coca-Cola (Large 500ml)',
    price: 120,
    icon: '🥤',
    desc: 'Served ice-cold with fresh fizz',
  },
  {
    id: 'fnb-combo',
    name: 'Blockbuster Duo Combo',
    price: 420,
    icon: '🎬',
    desc: '2 Large Popcorns + 2 Large Sodas (Save ₹200)',
  },
];

const AVAILABLE_COUPONS = [
  { code: 'FIRST50', discount: 50, type: 'flat', label: 'Flat ₹50 Off' },
  { code: 'CINE100', discount: 100, type: 'flat', minTotal: 400, label: 'Flat ₹100 Off (Min ₹400)' },
  { code: 'VIP20', discount: 0.20, type: 'percent', label: '20% Off Tickets' },
];

function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Food & Beverage state
  const [fnbCart, setFnbCart] = useState({});

  // Promo code state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/shows/${showId}`);
      setShow(res.data.show);
    } catch (err) {
      console.error('Error loading show details:', err);
      setError('Could not fetch seat availability for this show.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeat = (seatObj) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.seatNumber === seatObj.seatNumber);
      if (exists) {
        return prev.filter((s) => s.seatNumber !== seatObj.seatNumber);
      } else {
        if (prev.length >= 8) {
          alert('You can select a maximum of 8 seats per booking.');
          return prev;
        }
        return [...prev, seatObj];
      }
    });
  };

  const handleUpdateFnb = (itemId, change) => {
    setFnbCart((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + change);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  // Calculations
  const ticketSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const fnbSubtotal = Object.entries(fnbCart).reduce((sum, [itemId, qty]) => {
    const item = FNB_ITEMS.find((f) => f.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 30 : 0;
  const taxes = Math.round(convenienceFee * 0.18);
  const rawTotal = ticketSubtotal + fnbSubtotal + convenienceFee + taxes;

  // Coupon calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'flat') {
      discountAmount = appliedCoupon.discount;
    } else if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round(ticketSubtotal * appliedCoupon.discount);
    }
  }
  discountAmount = Math.min(discountAmount, rawTotal);
  const grandTotal = Math.max(0, rawTotal - discountAmount);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError('');

    const found = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (!found) {
      setCouponError('Invalid coupon code. Try FIRST50 or CINE100.');
      return;
    }

    if (found.minTotal && rawTotal < found.minTotal) {
      setCouponError(`Minimum total amount must be ₹${found.minTotal} to use this coupon.`);
      return;
    }

    setAppliedCoupon(found);
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      navigate('/login', { state: { returnUrl: `/book/${showId}` } });
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat to proceed.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        showId: show._id,
        seats: selectedSeats.map((s) => s.seatNumber),
        seatDetails: selectedSeats,
        totalAmount: grandTotal,
      };

      const res = await api.post('/bookings', payload);
      const newBooking = res.data.booking;

      // Save F&B details locally
      if (Object.keys(fnbCart).length > 0) {
        localStorage.setItem(
          `cinevo_fnb_${newBooking._id}`,
          JSON.stringify({
            cart: fnbCart,
            subtotal: fnbSubtotal,
            coupon: appliedCoupon ? appliedCoupon.code : null,
          })
        );
      }

      navigate(`/confirmation/${newBooking._id}`);
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || 'Failed to complete booking. Please try again.');
      fetchShowDetails();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        <p className="text-secondary mt-3">Loading interactive seat layout...</p>
      </div>
    );
  }

  if (error && !show) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/" className="btn btn-outline-dark mt-3">Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header Info */}
      <div className="glass-panel p-4 mb-4 text-start">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <Link to={`/movie/${show.movie?._id}`} className="text-secondary small text-decoration-none mb-1 d-inline-block">
              <i className="bi bi-arrow-left me-1"></i> Change Showtimes
            </Link>
            <h2 className="fw-black text-dark mb-1 brand-font">{show.movie?.title}</h2>
            <div className="text-secondary small d-flex flex-wrap align-items-center gap-2">
              <span className="text-dark fw-medium">{show.theatreName}</span>
              <span>•</span>
              <span className="badge badge-cyan">{show.screenType}</span>
              <span>•</span>
              <span>{show.showDate}</span>
              <span>•</span>
              <span className="text-danger fw-bold">{show.showTime}</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 align-self-start align-self-md-auto">
            <div className="text-md-end">
              <span className="text-secondary small d-block">Tier Pricing</span>
              <span className="text-warning small fw-bold">VIP: ₹{show.ticketPrice?.vip}</span>{' '}
              <span className="text-primary small fw-bold ms-1">Prem: ₹{show.ticketPrice?.premium}</span>{' '}
              <span className="text-dark small fw-bold ms-1">Reg: ₹{show.ticketPrice?.regular}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Interactive Seat Matrix */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 p-sm-5 text-center position-relative">
            {/* Screen indicator curve */}
            <div className="theatre-screen-curve"></div>

            {/* Matrix component */}
            <SeatMatrix
              show={show}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
            />

            {/* Legend */}
            <div className="d-flex flex-wrap justify-content-center gap-4 mt-5 pt-3 border-top small">
              <div className="d-flex align-items-center gap-2">
                <div className="seat available" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
                <span className="text-secondary">Available</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="seat selected" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
                <span className="text-secondary">Selected</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="seat booked" style={{ width: '22px', height: '22px', cursor: 'default' }}></div>
                <span className="text-secondary">Sold Out</span>
              </div>
            </div>
          </div>

          {/* Food & Beverage Add-ons Section */}
          <div className="glass-panel p-4 mt-4 text-start">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold text-dark mb-0 brand-font d-flex align-items-center gap-2">
                <span className="fs-4">🍿</span>
                <span>Add Cinema Snacks & Drinks</span>
              </h4>
              <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1 rounded-pill small">
                Delivered to Seat
              </span>
            </div>

            <div className="row g-3">
              {FNB_ITEMS.map((item) => {
                const qty = fnbCart[item.id] || 0;

                return (
                  <div key={item.id} className="col-md-6">
                    <div className="fnb-item-card d-flex align-items-center justify-content-between gap-3 h-100">
                      <div className="d-flex align-items-center gap-3">
                        <span className="fs-2">{item.icon}</span>
                        <div>
                          <div className="fw-bold text-dark small">{item.name}</div>
                          <div className="text-secondary" style={{ fontSize: '11px' }}>
                            {item.desc}
                          </div>
                          <div className="text-danger fw-bold small mt-1">₹{item.price}</div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center gap-2 bg-light rounded-pill p-1 border">
                        <button
                          type="button"
                          className="btn btn-sm btn-white text-dark rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => handleUpdateFnb(item.id, -1)}
                          disabled={qty === 0}
                        >
                          -
                        </button>
                        <span className="px-2 small fw-bold text-dark">{qty}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger text-white rounded-circle p-0 d-flex align-items-center justify-content-center"
                          style={{ width: '24px', height: '24px' }}
                          onClick={() => handleUpdateFnb(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary & Coupons */}
        <div className="col-lg-4 text-start">
          <div className="glass-panel p-4 position-sticky" style={{ top: '80px' }}>
            <h4 className="fw-bold text-dark mb-3 brand-font d-flex align-items-center gap-2">
              <i className="bi bi-receipt text-danger"></i>
              Booking Summary
            </h4>

            {error && <div className="alert alert-danger py-2 px-3 small mb-3">{error}</div>}

            {/* Selected Seats summary */}
            <div className="mb-3">
              <div className="text-secondary small mb-1">Selected Seats ({selectedSeats.length})</div>
              {selectedSeats.length > 0 ? (
                <div className="d-flex flex-wrap gap-1">
                  {selectedSeats.map((s) => (
                    <span key={s.seatNumber} className="badge bg-danger px-2 py-1">
                      {s.seatNumber} ({s.tier})
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-muted small fst-italic">No seats chosen yet</div>
              )}
            </div>

            {/* Snacks ordered snippet */}
            {fnbSubtotal > 0 && (
              <div className="mb-3 p-2 bg-light rounded border small">
                <div className="fw-bold text-dark mb-1">Cinema Snacks:</div>
                {Object.entries(fnbCart).map(([id, qty]) => {
                  const item = FNB_ITEMS.find((f) => f.id === id);
                  return (
                    <div key={id} className="d-flex justify-content-between text-secondary">
                      <span>{item?.name} x{qty}</span>
                      <span>₹{(item?.price || 0) * qty}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Coupon / Promo Box */}
            <div className="mb-3 pt-3 border-top">
              <label className="form-label text-secondary small fw-bold">Promotional Code</label>

              {appliedCoupon ? (
                <div className="d-flex justify-content-between align-items-center p-2 rounded bg-success bg-opacity-10 border border-success border-opacity-50">
                  <div className="small">
                    <span className="badge bg-success me-2">{appliedCoupon.code}</span>
                    <span className="text-success fw-bold">Saved ₹{discountAmount}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger p-0 text-decoration-none"
                    onClick={handleRemoveCoupon}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm bg-white border text-dark"
                      placeholder="e.g. FIRST50"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleApplyCoupon()}
                      disabled={!couponInput}
                    >
                      Apply
                    </button>
                  </div>

                  {/* 1-click popular coupons */}
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {AVAILABLE_COUPONS.map((c) => (
                      <span
                        key={c.code}
                        className="coupon-tag"
                        onClick={() => handleApplyCoupon(c.code)}
                      >
                        {c.code}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {couponError && (
                <div className="text-danger small mt-1" style={{ fontSize: '11px' }}>
                  {couponError}
                </div>
              )}
            </div>

            {/* Bill itemization */}
            <div className="border-top pt-3 small text-secondary d-flex flex-column gap-2 mb-3">
              <div className="d-flex justify-content-between">
                <span>Tickets Subtotal</span>
                <span className="text-dark fw-medium">₹{ticketSubtotal}</span>
              </div>

              {fnbSubtotal > 0 && (
                <div className="d-flex justify-content-between">
                  <span>Food & Beverage</span>
                  <span className="text-dark fw-medium">₹{fnbSubtotal}</span>
                </div>
              )}

              <div className="d-flex justify-content-between">
                <span>Convenience Fee</span>
                <span className="text-dark fw-medium">₹{convenienceFee}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>Integrated GST (18%)</span>
                <span className="text-dark fw-medium">₹{taxes}</span>
              </div>

              {discountAmount > 0 && (
                <div className="d-flex justify-content-between text-success fw-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center pt-2 border-top fs-5 text-dark fw-bold">
                <span>Grand Total</span>
                <span className="text-danger brand-font">₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              className="btn-cine-primary w-100 py-3 fs-6"
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length === 0 || submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Confirming Reservation...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-lock-fill me-1"></i>
                  {user ? `Pay & Book ₹${grandTotal}` : 'Sign In to Complete Booking'}
                </>
              )}
            </button>

            <div className="text-center text-muted small mt-2" style={{ fontSize: '11px' }}>
              🔒 100% Safe & Instant Ticket Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelection;
