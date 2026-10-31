import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Kolkata', 'Chennai', 'New York', 'London'];

function Profile() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [bookingsCount, setBookingsCount] = useState(0);
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem('cinevo_city') || localStorage.getItem('cineverse_city') || 'Mumbai'
  );
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserBookings();
  }, [user]);

  const fetchUserBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookingsCount(res.data.bookings?.length || 0);
    } catch (err) {
      console.error('Error fetching bookings count:', err);
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    localStorage.setItem('cinevo_city', city);
    window.dispatchEvent(new Event('city_changed'));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          {/* Header Card */}
          <div className="glass-panel p-4 p-md-5 mb-4 position-relative overflow-hidden text-start">
            <div
              className="position-absolute top-0 end-0 p-4 text-secondary opacity-10 d-none d-md-block"
              style={{ fontSize: '8rem', lineHeight: 1 }}
            >
              <i className="bi bi-person-badge"></i>
            </div>

            <div className="d-flex flex-column flex-md-row align-items-center gap-4 position-relative z-1">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                style={{
                  width: '90px',
                  height: '90px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                  fontSize: '2.5rem',
                  color: '#fff',
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="text-center text-md-start">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                  <h2 className="fw-black text-dark mb-0">{user.name}</h2>
                  <span className={`badge ${isAdmin ? 'bg-danger' : 'badge-gold'} px-3 py-1 rounded-pill`}>
                    <i className={`bi ${isAdmin ? 'bi-shield-check' : 'bi-award-fill'} me-1`}></i>
                    {isAdmin ? 'System Administrator' : 'Cinevo VIP Member'}
                  </span>
                </div>
                <p className="text-secondary mb-2">{user.email}</p>
                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                  <span className="badge bg-light border text-dark py-1 px-3">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i> {selectedCity}
                  </span>
                  <span className="badge badge-gold py-1 px-3">
                    <i className="bi bi-star-fill me-1"></i> 240 CinePoints
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="glass-panel p-4 text-center h-100">
                <div className="text-danger fs-2 mb-1">
                  <i className="bi bi-ticket-perforated"></i>
                </div>
                <h3 className="fw-black text-dark mb-0">{bookingsCount}</h3>
                <p className="text-secondary small mb-0">Total Bookings Made</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-panel p-4 text-center h-100">
                <div className="text-warning fs-2 mb-1">
                  <i className="bi bi-gift"></i>
                </div>
                <h3 className="fw-black text-dark mb-0">3 Active</h3>
                <p className="text-secondary small mb-0">Coupons & Perks</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="glass-panel p-4 text-center h-100">
                <div className="text-info fs-2 mb-1">
                  <i className="bi bi-camera-reels"></i>
                </div>
                <h3 className="fw-black text-dark mb-0">Sci-Fi</h3>
                <p className="text-secondary small mb-0">Top Favorite Genre</p>
              </div>
            </div>
          </div>

          {/* Settings & Preferences */}
          <div className="row g-4 text-start">
            <div className="col-md-6">
              <div className="glass-panel p-4 h-100">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-sliders2 text-danger"></i>
                  Cinema Preferences
                </h5>

                <label className="form-label text-secondary small">Default City / Region</label>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleCityChange(city)}
                      className={`btn btn-sm ${
                        selectedCity === city
                          ? 'btn-danger fw-bold'
                          : 'btn-outline-secondary'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                <div className="d-flex flex-column gap-2">
                  <Link to="/my-bookings" className="btn-cine-primary w-100">
                    <i className="bi bi-ticket-detailed me-1"></i> View My Tickets & History
                  </Link>
                  <Link to="/" className="btn-cine-secondary w-100 text-center">
                    <i className="bi bi-film me-1"></i> Browse Current Movies
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="glass-panel p-4 h-100">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-person-gear text-danger"></i>
                  Account Information
                </h5>

                {isSaved && (
                  <div className="alert alert-success py-2 px-3 small mb-3">
                    <i className="bi bi-check-circle-fill me-1"></i> Profile updated successfully!
                  </div>
                )}

                <form onSubmit={handleSaveProfile}>
                  <div className="mb-3">
                    <label className="form-label text-secondary small">Full Name</label>
                    <input
                      type="text"
                      className="form-control bg-light border text-dark"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary small">Email Address</label>
                    <input
                      type="email"
                      className="form-control bg-light border text-muted"
                      value={user.email}
                      disabled
                    />
                    <small className="text-muted">Email cannot be changed.</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-secondary small">Phone Number</label>
                    <input
                      type="text"
                      className="form-control bg-light border text-dark"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-outline-danger w-100 fw-semibold">
                    <i className="bi bi-save me-1"></i> Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
