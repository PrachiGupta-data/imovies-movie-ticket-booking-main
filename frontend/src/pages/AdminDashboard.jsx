import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Add Movie Form state
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    duration: 120,
    language: 'English',
    releaseDate: new Date().toISOString().split('T')[0],
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    rating: 8.0,
    director: '',
    cast: '',
  });

  // Create Showtime Form state
  const [showForm, setShowForm] = useState({
    movie: '',
    theatreName: 'PVR ICON: Gold Class',
    theatreLocation: 'Phoenix Mall',
    screenType: 'IMAX 3D',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '06:00 PM',
    regularPrice: 250,
    premiumPrice: 400,
    vipPrice: 600,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resBookings, resMovies] = await Promise.all([
        api.get('/bookings/all'),
        api.get('/movies'),
      ]);
      setBookings(resBookings.data.bookings || []);
      const movieList = resMovies.data.movies || [];
      setMovies(movieList);

      if (movieList.length > 0 && !showForm.movie) {
        setShowForm((prev) => ({ ...prev, movie: movieList[0]._id }));
      }
    } catch (err) {
      console.error('Error loading admin records:', err);
      setStatusMessage({ type: 'danger', text: 'Failed to retrieve administrative records.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...movieForm,
        genre: movieForm.genre.split(',').map((g) => g.trim()),
        cast: movieForm.cast.split(',').map((c) => c.trim()),
        duration: Number(movieForm.duration),
        rating: Number(movieForm.rating),
      };

      await api.post('/movies', payload);
      setStatusMessage({ type: 'success', text: `Movie "${movieForm.title}" registered successfully!` });
      setMovieForm({
        title: '',
        description: '',
        genre: 'Action, Sci-Fi',
        duration: 120,
        language: 'English',
        releaseDate: new Date().toISOString().split('T')[0],
        posterUrl: '',
        bannerUrl: '',
        trailerUrl: '',
        rating: 8.0,
        director: '',
        cast: '',
      });
      loadData();
    } catch (err) {
      setStatusMessage({ type: 'danger', text: err.message || 'Error saving movie.' });
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        movieId: showForm.movie,
        theatreName: showForm.theatreName,
        theatreLocation: showForm.theatreLocation,
        screenType: showForm.screenType,
        showDate: showForm.showDate,
        showTime: showForm.showTime,
        ticketPrice: {
          regular: Number(showForm.regularPrice),
          premium: Number(showForm.premiumPrice),
          vip: Number(showForm.vipPrice),
        },
      };

      await api.post('/shows', payload);
      setStatusMessage({ type: 'success', text: 'New showtime scheduled successfully!' });
      loadData();
    } catch (err) {
      setStatusMessage({ type: 'danger', text: err.message || 'Error scheduling showtime.' });
    }
  };

  const totalTicketingRevenue = bookings
    .filter((b) => b.bookingStatus !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="container py-5 text-start">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-black text-dark mb-1 d-flex align-items-center gap-2 brand-font">
            <i className="bi bi-speedometer2 text-danger"></i>
            <span>Cinevo Administrative Control</span>
          </h2>
          <p className="text-secondary small mb-0">
            Manage movie inventory, configure showtimes, and monitor system bookings
          </p>
        </div>

        <span className="badge badge-gold px-3 py-2 fw-bold">
          <i className="bi bi-shield-check me-1"></i> Admin: {user?.name}
        </span>
      </div>

      {statusMessage.text && (
        <div className={`alert alert-${statusMessage.type} alert-dismissible fade show`}>
          {statusMessage.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setStatusMessage({ type: '', text: '' })}
          ></button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-white border p-3 rounded-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small">Total Platform Bookings</div>
                <div className="fs-3 fw-bold text-dark">{bookings.length}</div>
              </div>
              <span className="badge bg-primary p-3 rounded-circle fs-4 text-white">
                <i className="bi bi-ticket-perforated"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-white border p-3 rounded-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small">Active Movie Catalog</div>
                <div className="fs-3 fw-bold text-dark">{movies.length}</div>
              </div>
              <span className="badge bg-danger p-3 rounded-circle fs-4 text-white">
                <i className="bi bi-film"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-white border p-3 rounded-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small">Gross Ticketing Revenue</div>
                <div className="fs-3 fw-bold text-success">₹{totalTicketingRevenue}</div>
              </div>
              <span className="badge bg-success p-3 rounded-circle fs-4 text-white">
                <i className="bi bi-cash-stack"></i>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            className={`nav-link px-4 ${activeTab === 'bookings' ? 'active btn-cine-primary text-white' : 'btn btn-white bg-white border text-dark shadow-sm'}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="bi bi-list-check me-2"></i> All Bookings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-4 ${activeTab === 'add-movie' ? 'active btn-cine-primary text-white' : 'btn btn-white bg-white border text-dark shadow-sm'}`}
            onClick={() => setActiveTab('add-movie')}
          >
            <i className="bi bi-plus-circle me-2"></i> Add Movie
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link px-4 ${activeTab === 'add-show' ? 'active btn-cine-primary text-white' : 'btn btn-white bg-white border text-dark shadow-sm'}`}
            onClick={() => setActiveTab('add-show')}
          >
            <i className="bi bi-calendar-plus me-2"></i> Schedule Showtime
          </button>
        </li>
      </ul>

      {/* Tab 1: All Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="card bg-white border rounded-4 p-4 shadow-sm">
          <h5 className="fw-bold text-dark mb-3">Live Platform Reservations</h5>
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-danger"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4 text-secondary">No bookings found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-secondary small">
                    <th>Ref ID</th>
                    <th>Customer</th>
                    <th>Movie</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="fw-bold font-monospace text-dark small">{b.bookingReference}</td>
                      <td>
                        <div className="fw-semibold text-dark small">{b.user?.name || 'Customer'}</div>
                        <div className="text-secondary small" style={{ fontSize: '11px' }}>
                          {b.user?.email}
                        </div>
                      </td>
                      <td className="fw-medium text-dark small">{b.movie?.title}</td>
                      <td>
                        <span className="badge bg-light text-dark border small">{b.seats?.join(', ')}</span>
                      </td>
                      <td className="fw-bold text-success small">₹{b.totalAmount}</td>
                      <td>
                        <span
                          className={`badge ${
                            b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-danger'
                          } text-uppercase`}
                          style={{ fontSize: '10px' }}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="text-secondary small">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Add Movie Form */}
      {activeTab === 'add-movie' && (
        <div className="card bg-white border rounded-4 p-4 shadow-sm" style={{ maxWidth: '800px' }}>
          <h5 className="fw-bold text-dark mb-3">Register New Movie Title</h5>
          <form onSubmit={handleCreateMovie}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label text-dark small fw-semibold">Movie Title</label>
                <input
                  type="text"
                  className="form-control bg-light border text-dark"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  placeholder="e.g. Gladiator II"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark small fw-semibold">Language</label>
                <input
                  type="text"
                  className="form-control bg-light border text-dark"
                  value={movieForm.language}
                  onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                  placeholder="English"
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label text-dark small fw-semibold">Description / Synopsis</label>
                <textarea
                  className="form-control bg-light border text-dark"
                  rows="3"
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  placeholder="Plot summary..."
                  required
                ></textarea>
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark small fw-semibold">Genres (comma-separated)</label>
                <input
                  type="text"
                  className="form-control bg-light border text-dark"
                  value={movieForm.genre}
                  onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                  placeholder="Action, Sci-Fi, Adventure"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-dark small fw-semibold">Duration (Mins)</label>
                <input
                  type="number"
                  className="form-control bg-light border text-dark"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label text-dark small fw-semibold">Rating (0 - 10)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control bg-light border text-dark"
                  value={movieForm.rating}
                  onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark small fw-semibold">Poster Image URL</label>
                <input
                  type="url"
                  className="form-control bg-light border text-dark"
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  placeholder="https://image.tmdb.org/..."
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark small fw-semibold">Banner Image URL</label>
                <input
                  type="url"
                  className="form-control bg-light border text-dark"
                  value={movieForm.bannerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                  placeholder="https://image.tmdb.org/..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark small fw-semibold">Director</label>
                <input
                  type="text"
                  className="form-control bg-light border text-dark"
                  value={movieForm.director}
                  onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                  placeholder="e.g. Ridley Scott"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark small fw-semibold">Cast (comma-separated)</label>
                <input
                  type="text"
                  className="form-control bg-light border text-dark"
                  value={movieForm.cast}
                  onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                  placeholder="Paul Mescal, Pedro Pascal"
                />
              </div>
            </div>

            <button type="submit" className="btn-cine-primary mt-4 px-4 py-2">
              <i className="bi bi-save me-2"></i> Save Movie
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Create Showtime Form */}
      {activeTab === 'add-show' && (
        <div className="card bg-white border rounded-4 p-4 shadow-sm" style={{ maxWidth: '800px' }}>
          <h5 className="fw-bold text-dark mb-3">Schedule Cinema Screening</h5>
          <form onSubmit={handleCreateShow}>
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label text-dark small fw-semibold">Select Movie</label>
                <select
                  className="form-select bg-light border text-dark"
                  value={showForm.movie}
                  onChange={(e) => setShowForm({ ...showForm, movie: e.target.value })}
                  required
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.language})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark small fw-semibold">Theatre / Cineplex</label>
                <input
                  type="text"
                  className="form-control bg-light border text-dark"
                  value={showForm.theatreName}
                  onChange={(e) => setShowForm({ ...showForm, theatreName: e.target.value })}
                  placeholder="PVR ICON: Gold Class"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-dark small fw-semibold">Location</label>
                <input
                  type="text"
                  className="form-control bg-light border text-dark"
                  value={showForm.theatreLocation}
                  onChange={(e) => setShowForm({ ...showForm, theatreLocation: e.target.value })}
                  placeholder="City Center Mall"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark small fw-semibold">Screen Format</label>
                <select
                  className="form-select bg-light border text-dark"
                  value={showForm.screenType}
                  onChange={(e) => setShowForm({ ...showForm, screenType: e.target.value })}
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX 2D">IMAX 2D</option>
                  <option value="IMAX 3D">IMAX 3D</option>
                  <option value="4DX">4DX</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark small fw-semibold">Show Date</label>
                <input
                  type="date"
                  className="form-control bg-light border text-dark"
                  value={showForm.showDate}
                  onChange={(e) => setShowForm({ ...showForm, showDate: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark small fw-semibold">Show Time</label>
                <input
                  type="text"
                  className="form-control bg-light border text-dark"
                  value={showForm.showTime}
                  onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
                  placeholder="07:30 PM"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark small fw-semibold">Regular Tier Price (₹)</label>
                <input
                  type="number"
                  className="form-control bg-light border text-dark"
                  value={showForm.regularPrice}
                  onChange={(e) => setShowForm({ ...showForm, regularPrice: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark small fw-semibold">Premium Tier Price (₹)</label>
                <input
                  type="number"
                  className="form-control bg-light border text-dark"
                  value={showForm.premiumPrice}
                  onChange={(e) => setShowForm({ ...showForm, premiumPrice: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label text-dark small fw-semibold">VIP Tier Price (₹)</label>
                <input
                  type="number"
                  className="form-control bg-light border text-dark"
                  value={showForm.vipPrice}
                  onChange={(e) => setShowForm({ ...showForm, vipPrice: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-cine-primary mt-4 px-4 py-2">
              <i className="bi bi-clock-history me-2"></i> Schedule Showtime
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
