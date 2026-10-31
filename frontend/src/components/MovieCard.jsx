import React from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ movie, onWatchTrailer }) {
  return (
    <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
      <div className="cine-card h-100 d-flex flex-column p-3 text-start">
        {/* Poster Wrapper */}
        <div className="movie-poster-box mb-3 position-relative">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
            }}
          />

          {/* Top Rating Badge */}
          {movie.rating > 0 && (
            <div className="position-absolute top-0 end-0 m-2 badge badge-gold d-flex align-items-center gap-1 shadow-sm px-2 py-1">
              <i className="bi bi-star-fill text-warning"></i>
              <span className="fw-bold">{movie.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Language & Status Badge */}
          <div className="position-absolute bottom-0 start-0 m-2 d-flex gap-1">
            <span className="badge bg-white text-dark shadow-sm border small fw-medium">
              {movie.language || 'English'}
            </span>
            {movie.status === 'coming_soon' && (
              <span className="badge bg-warning text-dark small fw-bold">Coming Soon</span>
            )}
          </div>

          {/* Quick Trailer Play Button */}
          {movie.trailerUrl && (
            <button
              type="button"
              className="btn btn-sm btn-white bg-white text-danger position-absolute top-0 start-0 m-2 rounded-circle border shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: '32px', height: '32px' }}
              title="Watch Trailer"
              onClick={(e) => {
                e.preventDefault();
                if (onWatchTrailer) onWatchTrailer(movie);
              }}
            >
              <i className="bi bi-play-fill fs-5"></i>
            </button>
          )}
        </div>

        {/* Screen Formats */}
        {movie.formats && movie.formats.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-2">
            {movie.formats.map((fmt, idx) => (
              <span
                key={idx}
                className={`badge ${
                  fmt.includes('IMAX')
                    ? 'badge-cyan'
                    : fmt.includes('4DX')
                    ? 'badge-crimson'
                    : 'bg-light text-secondary border'
                }`}
                style={{ fontSize: '10px' }}
              >
                {fmt}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h5 className="text-dark fw-bold text-truncate mb-1 brand-font" title={movie.title}>
          {movie.title}
        </h5>

        {/* Genre & Duration */}
        <div className="d-flex flex-wrap align-items-center gap-1 mb-2">
          {movie.genre?.slice(0, 2).map((g, idx) => (
            <span key={idx} className="badge bg-light text-secondary border small fw-normal">
              {g}
            </span>
          ))}
          {movie.duration && (
            <span className="text-secondary small ms-auto d-flex align-items-center gap-1">
              <i className="bi bi-clock"></i>
              {movie.duration}m
            </span>
          )}
        </div>

        {/* Synopsis snippet */}
        <p
          className="text-secondary small mb-3 flex-grow-1"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.45',
          }}
        >
          {movie.description}
        </p>

        {/* Action Button */}
        {movie.status === 'coming_soon' ? (
          <Link
            to={`/movie/${movie._id}`}
            className="btn btn-outline-danger w-100 text-decoration-none mt-auto fw-semibold d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-calendar-event"></i>
            <span>Upcoming • Details & Trailer</span>
          </Link>
        ) : (
          <Link
            to={`/movie/${movie._id}`}
            className="btn-cine-primary w-100 text-decoration-none mt-auto"
          >
            <i className="bi bi-ticket-perforated-fill"></i>
            <span>Book Tickets</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default MovieCard;
