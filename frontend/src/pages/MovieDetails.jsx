import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  // Reviews state (persisted per movie in localStorage)
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    const key = `cinevo_reviews_${id}`;
    const stored = localStorage.getItem(key) || localStorage.getItem(`cineverse_reviews_${id}`);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
        return;
      } catch (e) {}
    }

    // Default sample reviews
    const defaultReviews = [
      {
        id: 'rev-1',
        author: 'Alex Henderson',
        rating: 5,
        date: '2 days ago',
        comment: 'Mind-blowing visual effects and phenomenal sound design in IMAX 3D. A true cinematic masterpiece!',
        verified: true,
      },
      {
        id: 'rev-2',
        author: 'Sarah Chen',
        rating: 4,
        date: 'Last week',
        comment: 'Intense pacing and great acting throughout. Definitely recommend watching in the best format possible.',
        verified: true,
      },
    ];
    setReviews(defaultReviews);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: user?.name || reviewAuthor.trim() || 'Anonymous Cinephile',
      rating: Number(reviewRating),
      date: 'Just now',
      comment: reviewComment.trim(),
      verified: !!user,
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem(`cinevo_reviews_${id}`, JSON.stringify(updated));

    setReviewComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data.movie);
      const fetchedShows = res.data.shows || [];
      setShows(fetchedShows);

      if (fetchedShows.length > 0) {
        setSelectedDate(fetchedShows[0].showDate);
      } else {
        setSelectedDate(new Date().toISOString().split('T')[0]);
      }
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Could not load movie information.');
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|watch\?v=)([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        <p className="text-secondary mt-3">Loading movie details & showtimes...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">{error || 'Movie not found.'}</div>
        <Link to="/" className="btn btn-outline-dark mt-3">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const availableDates = Array.from(new Set(shows.map((s) => s.showDate)));
  const filteredShows = shows.filter((s) => s.showDate === selectedDate);

  const groupedTheatres = filteredShows.reduce((acc, show) => {
    const theatreKey = show.theatreName;
    if (!acc[theatreKey]) {
      acc[theatreKey] = {
        name: show.theatreName,
        location: show.theatreLocation,
        shows: [],
      };
    }
    acc[theatreKey].shows.push(show);
    return acc;
  }, {});

  return (
    <div>
      {/* Movie Banner Backdrop Header */}
      <div
        className="position-relative text-white py-5"
        style={{
          background: `linear-gradient(to bottom, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.96) 100%), url(${movie.bannerUrl || movie.posterUrl}) center/cover no-repeat`,
        }}
      >
        <div className="container">
          <Link to="/" className="btn btn-sm btn-outline-light mb-4 text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i> Back to Catalog
          </Link>

          <div className="row align-items-center g-4">
            {/* Poster */}
            <div className="col-lg-3 col-md-4">
              <div className="movie-poster-box shadow-lg rounded-4 overflow-hidden border border-white border-opacity-25 position-relative">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
                  }}
                />
                {movie.trailerUrl && (
                  <button
                    type="button"
                    className="btn btn-danger position-absolute top-50 start-50 translate-middle rounded-circle p-3 shadow-lg"
                    onClick={() => setShowTrailer(true)}
                    title="Play Trailer"
                  >
                    <i className="bi bi-play-fill fs-3"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="col-lg-9 col-md-8 text-start">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="badge badge-gold px-2 py-1">
                  ★ {movie.rating} IMDb
                </span>
                <span className="badge bg-white text-dark">
                  {movie.language || 'English'}
                </span>
                <span className="text-white-50 small">•</span>
                <span className="text-light small">{movie.duration} mins</span>
              </div>

              <h1 className="display-4 fw-black text-white mb-3 brand-font">{movie.title}</h1>

              {/* Formats */}
              {movie.formats && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {movie.formats.map((fmt, idx) => (
                    <span
                      key={idx}
                      className={`badge ${
                        fmt.includes('IMAX')
                          ? 'badge-cyan'
                          : fmt.includes('4DX')
                          ? 'badge-crimson'
                          : 'bg-white text-dark'
                      } px-3 py-1`}
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              )}

              <p className="lead text-light opacity-90 mb-4" style={{ maxWidth: '800px', lineHeight: '1.6' }}>
                {movie.description}
              </p>

              <div className="row g-3 text-light opacity-80 small border-top border-white border-opacity-25 pt-3">
                <div className="col-sm-6">
                  <span className="text-white-50">Genre: </span>
                  <span className="fw-medium">{movie.genre?.join(', ')}</span>
                </div>
                <div className="col-sm-6">
                  <span className="text-white-50">Director: </span>
                  <span className="fw-medium">{movie.director || 'N/A'}</span>
                </div>
                <div className="col-12">
                  <span className="text-white-50">Cast: </span>
                  <span className="fw-medium">{movie.cast?.join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Showtimes & Reviews */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Left Column: Showtimes & Theatres */}
          <div className="col-lg-8 text-start">
            <h3 className="fw-black text-dark mb-3 brand-font d-flex align-items-center gap-2">
              <i className="bi bi-calendar3 text-danger"></i>
              <span>Select Date & Showtime</span>
            </h3>

            {/* Date Selector Tabs */}
            {availableDates.length > 0 ? (
              <div className="d-flex gap-2 overflow-auto pb-3 mb-4">
                {availableDates.map((dateStr) => {
                  const dateObj = new Date(dateStr + 'T00:00:00');
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                  const isSelected = selectedDate === dateStr;

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      className={`btn p-3 text-center rounded-3 ${
                        isSelected
                          ? 'btn-danger fw-bold shadow'
                          : 'btn-white bg-white border text-dark shadow-sm'
                      }`}
                      style={{ minWidth: '95px' }}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      <div className="small text-uppercase">{dayName}</div>
                      <div className="fs-5 fw-bold">{dayNum}</div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="alert alert-warning py-3">
                No active showtimes scheduled for this movie currently.
              </div>
            )}

            {/* Theatres & Shows Grouping */}
            {Object.keys(groupedTheatres).length > 0 ? (
              <div className="d-flex flex-column gap-4">
                {Object.values(groupedTheatres).map((theatre, idx) => (
                  <div key={idx} className="glass-panel p-4">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-3 mb-3 gap-2">
                      <div>
                        <h5 className="text-dark fw-bold mb-1 d-flex align-items-center gap-2">
                          <i className="bi bi-building text-danger"></i>
                          {theatre.name}
                        </h5>
                        <div className="text-secondary small">
                          <i className="bi bi-geo-alt me-1"></i>
                          {theatre.location}
                        </div>
                      </div>
                      <span className="badge bg-light border text-info small py-1 px-2 align-self-start align-self-sm-auto">
                        <i className="bi bi-shield-check me-1"></i> M-Ticket Available
                      </span>
                    </div>

                    {/* Showtimes Buttons */}
                    <div className="d-flex flex-wrap gap-3">
                      {theatre.shows.map((show) => {
                        const isAlmostFull = (show.bookedSeats?.length || 0) >= (show.totalSeats || 60) * 0.7;

                        return (
                          <Link
                            key={show._id}
                            to={`/book/${show._id}`}
                            className="btn btn-outline-danger d-flex flex-column align-items-center py-2 px-3 rounded-3 text-decoration-none position-relative bg-white shadow-sm"
                            style={{ minWidth: '120px' }}
                          >
                            <span className="fw-bold fs-6 text-dark">{show.showTime}</span>
                            <span className="badge badge-cyan mt-1" style={{ fontSize: '10px' }}>
                              {show.screenType}
                            </span>
                            {isAlmostFull && (
                              <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                                style={{ fontSize: '9px' }}
                              >
                                Filling Fast
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel text-center py-5">
                <i className="bi bi-clock-history fs-1 text-secondary mb-2 d-block"></i>
                <p className="text-secondary mb-0">No shows available for the selected date.</p>
              </div>
            )}
          </div>

          {/* Right Column: User Reviews & Ratings */}
          <div className="col-lg-4 text-start">
            <div className="glass-panel p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-dark mb-0 brand-font d-flex align-items-center gap-2">
                  <i className="bi bi-star-fill text-warning"></i>
                  Audience Reviews
                </h4>
                <span className="badge badge-gold px-2 py-1">★ {movie.rating} / 10</span>
              </div>

              {/* Leave a review form */}
              <form onSubmit={handleAddReview} className="mb-4 pb-4 border-bottom">
                <label className="form-label text-secondary small fw-bold">Rate this Movie</label>
                <div className="d-flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${reviewRating >= star ? 'active' : ''}`}
                      onClick={() => setReviewRating(star)}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ms-auto text-warning fw-bold align-self-center">{reviewRating} / 5</span>
                </div>

                {!user && (
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm bg-light border text-dark"
                      placeholder="Your name"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                    />
                  </div>
                )}

                <div className="mb-2">
                  <textarea
                    className="form-control form-control-sm bg-light border text-dark"
                    rows="2"
                    placeholder="Write your review or thoughts..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  ></textarea>
                </div>

                {reviewSuccess && (
                  <div className="alert alert-success py-1 px-2 small mb-2">
                    <i className="bi bi-check-circle me-1"></i> Review posted!
                  </div>
                )}

                <button type="submit" className="btn-cine-primary w-100 py-2 small">
                  <i className="bi bi-chat-left-text me-1"></i> Post Review
                </button>
              </form>

              {/* Reviews List */}
              <div className="d-flex flex-column gap-3" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-light rounded-3 border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-dark small d-flex align-items-center gap-1">
                        {rev.author}
                        {rev.verified && (
                          <i className="bi bi-patch-check-fill text-info" title="Verified Customer"></i>
                        )}
                      </span>
                      <span className="text-warning small">
                        {'★'.repeat(rev.rating)}
                      </span>
                    </div>
                    <p className="text-secondary small mb-1">{rev.comment}</p>
                    <span className="text-muted small" style={{ fontSize: '11px' }}>
                      {rev.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div
          className="modal show d-block modal-backdrop-blur"
          tabIndex="-1"
          onClick={() => setShowTrailer(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-white text-dark rounded-4 overflow-hidden shadow-lg border-0">
              <div className="modal-header border-bottom py-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-play-circle text-danger"></i>
                  {movie.title} — Official Trailer
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTrailer(false)}
                ></button>
              </div>
              <div className="modal-body p-0" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={getYoutubeEmbedUrl(movie.trailerUrl)}
                  title={`${movie.title} Trailer`}
                  className="w-100 h-100 border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
