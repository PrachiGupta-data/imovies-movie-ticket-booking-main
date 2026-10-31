import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Horror', 'Comedy', 'Mythology', 'Crime', 'Biography'];
const FORMATS = [
  { label: 'All Formats', value: 'All', icon: 'bi-grid' },
  { label: 'IMAX 3D Laser', value: 'IMAX 3D', icon: 'bi-badge-hd' },
  { label: '4DX Motion', value: '4DX', icon: 'bi-controller' },
  { label: 'RealD 3D', value: '3D', icon: 'bi-eyeglasses' },
  { label: 'Standard 2D', value: '2D', icon: 'bi-tv' },
];

const LANGUAGES = [
  { label: 'All Languages', value: 'All' },
  { label: 'Hindi / Bollywood', value: 'Hindi' },
  { label: 'Telugu / South', value: 'Telugu' },
  { label: 'English / Hollywood', value: 'English' },
];

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const formatFromQuery = searchParams.get('format') || 'All';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState(formatFromQuery);
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'now_showing', 'coming_soon', 'indian'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [currentCity, setCurrentCity] = useState(
    localStorage.getItem('cinevo_city') || localStorage.getItem('cineverse_city') || 'Mumbai'
  );

  // Hero carousel state
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);

  // Sync city updates
  useEffect(() => {
    const handleCitySync = () => {
      setCurrentCity(localStorage.getItem('cinevo_city') || 'Mumbai');
    };
    window.addEventListener('city_changed', handleCitySync);
    return () => window.removeEventListener('city_changed', handleCitySync);
  }, []);

  // Sync format state with query params
  useEffect(() => {
    const qFormat = searchParams.get('format');
    if (qFormat && qFormat !== selectedFormat) {
      setSelectedFormat(qFormat);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedFormat, selectedLanguage, selectedTab]);

  // Auto-advance hero carousel every 6s
  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedGenre !== 'All') params.genre = selectedGenre;
      if (selectedFormat !== 'All') params.format = selectedFormat;
      if (selectedLanguage !== 'All') params.language = selectedLanguage;

      if (selectedTab === 'now_showing') params.status = 'now_showing';
      else if (selectedTab === 'coming_soon') params.status = 'coming_soon';

      const res = await api.get('/movies', { params });
      let fetched = res.data.movies || [];

      // Filter for Indian cinema tab if selected
      if (selectedTab === 'indian') {
        fetched = fetched.filter(
          (m) =>
            m.language?.toLowerCase().includes('hindi') ||
            m.language?.toLowerCase().includes('telugu') ||
            m.language?.toLowerCase().includes('kannada')
        );
      }

      setMovies(fetched);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Unable to load movies right now. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (fmtValue) => {
    setSelectedFormat(fmtValue);
    if (fmtValue === 'All') {
      searchParams.delete('format');
    } else {
      searchParams.set('format', fmtValue);
    }
    setSearchParams(searchParams);
  };

  // Filter & sort
  let displayedMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortBy === 'rating') {
    displayedMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'newest') {
    displayedMovies.sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
  } else if (sortBy === 'duration') {
    displayedMovies.sort((a, b) => (b.duration || 0) - (a.duration || 0));
  }

  const heroMovies = movies.slice(0, 5);
  const currentHero = heroMovies[heroIndex] || movies[0];

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|watch\?v=)([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url;
  };

  return (
    <div className="pb-5">
      {/* Hero Showcase Carousel */}
      {currentHero && selectedFormat === 'All' && selectedGenre === 'All' && selectedLanguage === 'All' && selectedTab === 'all' && !searchQuery && (
        <div
          className="position-relative text-white py-5 px-3 mb-5 d-flex align-items-center"
          style={{
            minHeight: '500px',
            background: `linear-gradient(to right, rgba(15,23,42,0.95) 25%, rgba(15,23,42,0.7) 65%, rgba(15,23,42,0.3) 100%), url(${currentHero.bannerUrl || currentHero.posterUrl}) center/cover no-repeat`,
            transition: 'background 0.8s ease-in-out',
          }}
        >
          <div className="container position-relative z-1">
            <div className="row align-items-center">
              <div className="col-lg-7 text-start">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-danger px-3 py-1 text-uppercase fw-bold">
                    <i className="bi bi-fire me-1"></i>
                    {currentHero.status === 'coming_soon' ? 'Upcoming Premiere' : 'Cinevo Spotlight'}
                  </span>
                  <span className="badge bg-white text-dark shadow-sm px-3 py-1">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i> In {currentCity}
                  </span>
                </div>

                <h1 className="display-4 fw-black text-white mb-2 brand-font">{currentHero.title}</h1>

                <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                  <span className="badge badge-gold px-2 py-1 fs-6">
                    ★ {currentHero.rating} IMDb
                  </span>
                  <span className="text-light small">{currentHero.duration} mins</span>
                  <span className="text-white-50 small">•</span>
                  <span className="text-light small">{currentHero.genre?.join(', ')}</span>
                  <span className="text-white-50 small">•</span>
                  <span className="text-light small">{currentHero.language || 'Hindi, English'}</span>
                </div>

                <p
                  className="text-light opacity-90 mb-4"
                  style={{
                    maxWidth: '620px',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {currentHero.description}
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <Link to={`/movie/${currentHero._id}`} className="btn-cine-primary fs-6 px-4 py-2">
                    <i className="bi bi-ticket-perforated-fill fs-5"></i>
                    <span>{currentHero.status === 'coming_soon' ? 'View Details' : 'Book Tickets'}</span>
                  </Link>

                  {currentHero.trailerUrl && (
                    <button
                      type="button"
                      className="btn btn-outline-light fs-6 px-4 py-2 d-flex align-items-center gap-2 rounded-3"
                      onClick={() => setActiveTrailerMovie(currentHero)}
                    >
                      <i className="bi bi-play-circle-fill fs-5 text-danger"></i>
                      <span>Watch Trailer</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Dots */}
          {heroMovies.length > 1 && (
            <div className="hero-carousel-nav">
              {heroMovies.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`hero-dot ${heroIndex === idx ? 'active' : ''}`}
                  onClick={() => setHeroIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Container */}
      <div className="container">
        {/* Main Category Tabs */}
        <div className="d-flex flex-wrap gap-2 mb-4 p-2 bg-white rounded-4 border shadow-sm">
          <button
            type="button"
            className={`btn px-4 py-2 rounded-3 fw-bold small ${
              selectedTab === 'all'
                ? 'btn-danger text-white shadow-sm'
                : 'btn-light text-dark'
            }`}
            onClick={() => setSelectedTab('all')}
          >
            <i className="bi bi-film me-2"></i> All Releases
          </button>
          <button
            type="button"
            className={`btn px-4 py-2 rounded-3 fw-bold small ${
              selectedTab === 'now_showing'
                ? 'btn-danger text-white shadow-sm'
                : 'btn-light text-dark'
            }`}
            onClick={() => setSelectedTab('now_showing')}
          >
            <i className="bi bi-fire me-2"></i> Now Showing
          </button>
          <button
            type="button"
            className={`btn px-4 py-2 rounded-3 fw-bold small ${
              selectedTab === 'coming_soon'
                ? 'btn-danger text-white shadow-sm'
                : 'btn-light text-dark'
            }`}
            onClick={() => setSelectedTab('coming_soon')}
          >
            <i className="bi bi-stars me-2 text-warning"></i> Upcoming Movies
          </button>
          <button
            type="button"
            className={`btn px-4 py-2 rounded-3 fw-bold small ${
              selectedTab === 'indian'
                ? 'btn-danger text-white shadow-sm'
                : 'btn-light text-dark'
            }`}
            onClick={() => setSelectedTab('indian')}
          >
            🇮🇳 Indian Cinema (Bollywood & South)
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div className="text-start">
            <h2 className="fw-black text-dark mb-1 brand-font d-flex align-items-center gap-2">
              <span>
                {selectedTab === 'coming_soon'
                  ? 'Upcoming Blockbusters'
                  : selectedTab === 'indian'
                  ? 'Indian Blockbusters'
                  : selectedTab === 'now_showing'
                  ? 'Now In Cinemas'
                  : 'Featured Movies'}
              </span>
              <span className="badge bg-danger bg-opacity-10 text-danger fs-6 py-1 px-2 border border-danger border-opacity-25 rounded-pill">
                {displayedMovies.length} Titles
              </span>
            </h2>
            <p className="text-secondary small mb-0">
              Browse movies, select screen format and choose your favorite seats in {currentCity}
            </p>
          </div>

          {/* Sort & Language selector */}
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm bg-white border text-dark shadow-sm"
              style={{ width: '160px' }}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>

            <select
              className="form-select form-select-sm bg-white border text-dark shadow-sm"
              style={{ width: '160px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Latest Releases</option>
              <option value="duration">Duration (Longest)</option>
            </select>
          </div>
        </div>

        {/* Screen Formats Filter Pills */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.value}
              type="button"
              className={`btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 py-1 ${
                selectedFormat === fmt.value
                  ? 'btn-danger fw-bold shadow-sm'
                  : 'btn-white bg-white border text-dark shadow-sm'
              }`}
              onClick={() => handleFormatChange(fmt.value)}
            >
              <i className={`bi ${fmt.icon}`}></i>
              <span>{fmt.label}</span>
            </button>
          ))}
        </div>

        {/* Genre Filter Chips */}
        <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              className={`btn btn-sm py-1 px-3 rounded-pill ${
                selectedGenre === genre
                  ? 'btn-dark text-white fw-bold shadow-sm'
                  : 'btn-light border text-secondary'
              }`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
            <p className="text-secondary mt-3">Loading blockbuster movies...</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-3 my-4">
            <i className="bi bi-exclamation-triangle-fill fs-4"></i>
            <div>
              <div className="fw-bold">Notice</div>
              <div className="small">{error}</div>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && displayedMovies.length > 0 && (
          <div className="row">
            {displayedMovies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onWatchTrailer={(m) => setActiveTrailerMovie(m)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayedMovies.length === 0 && !error && (
          <div className="glass-panel text-center py-5 px-4 my-4">
            <div className="display-4 text-secondary mb-3">
              <i className="bi bi-film"></i>
            </div>
            <h4 className="text-dark fw-bold">No movies found</h4>
            <p className="text-secondary small mb-4">
              Try adjusting your category, genre or screen format filters.
            </p>
            <button
              type="button"
              className="btn-cine-primary"
              onClick={() => {
                setSelectedTab('all');
                setSelectedGenre('All');
                setSelectedFormat('All');
                setSelectedLanguage('All');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Cinema Perks & F&B Promo Banner */}
        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="glass-panel p-4 text-start h-100">
              <div className="text-danger fs-2 mb-2">
                <i className="bi bi-badge-4k"></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">IMAX & Laser 4K</h5>
              <p className="text-secondary small mb-0">
                Next-generation dual laser projection paired with immersive multi-channel sound systems.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel p-4 text-start h-100">
              <div className="text-warning fs-2 mb-2">
                <i className="bi bi-cup-straw"></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">Gourmet Snacks & Bites</h5>
              <p className="text-secondary small mb-0">
                Fresh gourmet butter popcorn, loaded nachos, and chilled beverages delivered to your seat.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-panel p-4 text-start h-100">
              <div className="text-info fs-2 mb-2">
                <i className="bi bi-tag-fill"></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">Exclusive Promo Perks</h5>
              <p className="text-secondary small mb-0">
                Apply codes like <code>FIRST50</code> or <code>CINE100</code> at checkout for instant savings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Video Modal */}
      {activeTrailerMovie && (
        <div
          className="modal show d-block modal-backdrop-blur"
          tabIndex="-1"
          onClick={() => setActiveTrailerMovie(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-white text-dark rounded-4 overflow-hidden shadow-lg border-0">
              <div className="modal-header border-bottom py-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <i className="bi bi-play-circle text-danger"></i>
                  {activeTrailerMovie.title} — Official Trailer
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setActiveTrailerMovie(null)}
                ></button>
              </div>
              <div className="modal-body p-0" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={getYoutubeEmbedUrl(activeTrailerMovie.trailerUrl)}
                  title={`${activeTrailerMovie.title} Trailer`}
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

export default Home;
