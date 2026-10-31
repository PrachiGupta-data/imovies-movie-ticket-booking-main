import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CinevoLogo from './CinevoLogo';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Kolkata', 'Chennai', 'New York', 'London'];

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState(
    localStorage.getItem('cinevo_city') || localStorage.getItem('cineverse_city') || 'Mumbai'
  );

  // Live Search state
  const [navSearch, setNavSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchPopover, setShowSearchPopover] = useState(false);

  const dropdownRef = useRef(null);
  const cityRef = useRef(null);
  const searchRef = useRef(null);

  // Sync city updates across components
  useEffect(() => {
    const handleCitySync = () => {
      setCurrentCity(localStorage.getItem('cinevo_city') || 'Mumbai');
    };
    window.addEventListener('city_changed', handleCitySync);
    return () => window.removeEventListener('city_changed', handleCitySync);
  }, []);

  // Close menus whenever route changes
  useEffect(() => {
    setIsNavOpen(false);
    setIsDropdownOpen(false);
    setIsCityOpen(false);
    setShowSearchPopover(false);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setIsCityOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Live movie search query
  useEffect(() => {
    if (!navSearch.trim()) {
      setSearchResults([]);
      setShowSearchPopover(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.get('/movies', { params: { search: navSearch.trim() } });
        setSearchResults(res.data.movies || []);
        setShowSearchPopover(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [navSearch]);

  const handleCitySelect = (city) => {
    setCurrentCity(city);
    localStorage.setItem('cinevo_city', city);
    setIsCityOpen(false);
    window.dispatchEvent(new Event('city_changed'));
  };

  const handleLogout = () => {
    logout();
    setIsNavOpen(false);
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-lg py-2 sticky-top border-bottom"
      style={{
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        borderColor: '#e2e8f0',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="container">
        {/* Brand Logo - Cinevo */}
        <div className="d-flex align-items-center gap-3">
          <Link
            className="navbar-brand d-flex align-items-center mb-0 p-0 text-decoration-none"
            to="/"
            onClick={() => setIsNavOpen(false)}
          >
            <CinevoLogo size={38} />
          </Link>

          {/* City Selector Dropdown */}
          <div className="position-relative d-none d-md-block" ref={cityRef}>
            <button
              type="button"
              className="btn btn-sm bg-light border text-dark py-1 px-3 rounded-pill d-flex align-items-center gap-2"
              onClick={() => setIsCityOpen((prev) => !prev)}
            >
              <i className="bi bi-geo-alt-fill text-danger"></i>
              <span className="fw-medium small">{currentCity}</span>
              <i className="bi bi-chevron-down small text-secondary"></i>
            </button>

            {isCityOpen && (
              <div
                className="position-absolute glass-panel p-2 mt-2 shadow-lg"
                style={{ width: '200px', zIndex: 1060, backgroundColor: '#ffffff' }}
              >
                <div className="text-secondary small fw-bold px-2 py-1 mb-1">SELECT CITY</div>
                <div className="d-flex flex-column gap-1" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {CITIES.map((c) => (
                    <div
                      key={c}
                      className={`city-item small d-flex justify-content-between align-items-center ${
                        currentCity === c ? 'active fw-bold' : ''
                      }`}
                      onClick={() => handleCitySelect(c)}
                    >
                      <span>{c}</span>
                      {currentCity === c && <i className="bi bi-check-lg text-danger"></i>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="position-relative mx-lg-4 my-2 my-lg-0 flex-grow-1" style={{ maxWidth: '420px' }} ref={searchRef}>
          <div className="input-group">
            <span className="input-group-text bg-light border text-secondary ps-3">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-sm bg-light border text-dark shadow-none"
              placeholder="Search movies, genres, actors..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSearchPopover(true);
              }}
            />
            {navSearch && (
              <button
                className="btn btn-sm btn-light border text-secondary"
                type="button"
                onClick={() => {
                  setNavSearch('');
                  setShowSearchPopover(false);
                }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>

          {/* Search Results Popover */}
          {showSearchPopover && (
            <div className="search-results-popover p-2">
              {isSearching ? (
                <div className="text-center py-3 text-secondary small">
                  <div className="spinner-border spinner-border-sm text-danger me-2" role="status"></div>
                  Searching movies...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-3 text-secondary small">
                  No movies found matching "{navSearch}"
                </div>
              ) : (
                searchResults.map((m) => (
                  <Link
                    key={m._id}
                    to={`/movie/${m._id}`}
                    className="search-item"
                    onClick={() => {
                      setShowSearchPopover(false);
                      setNavSearch('');
                    }}
                  >
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div className="flex-grow-1 text-start overflow-hidden">
                      <div className="text-dark fw-bold text-truncate small">{m.title}</div>
                      <div className="text-secondary small d-flex align-items-center gap-2">
                        <span className="badge badge-gold py-0 px-1" style={{ fontSize: '10px' }}>
                          ★ {m.rating}
                        </span>
                        <span>{m.genre?.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                    <span className="btn btn-sm btn-outline-danger py-0 px-2 small">Book</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="navbar-toggler border-0 p-2 text-dark"
          type="button"
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <i className={`bi ${isNavOpen ? 'bi-x-lg' : 'bi-list'} fs-3`}></i>
        </button>

        {/* Nav Links & User Session */}
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show mt-3 mt-lg-0' : ''}`} id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <Link className="nav-link text-dark fw-medium px-2" to="/" onClick={() => setIsNavOpen(false)}>
                <i className="bi bi-film me-1 text-danger"></i> Movies
              </Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link className="nav-link text-dark fw-medium px-2" to="/my-bookings" onClick={() => setIsNavOpen(false)}>
                  <i className="bi bi-ticket-perforated me-1 text-success"></i> My Tickets
                </Link>
              </li>
            )}

            {/* User Dropdown or Login CTA */}
            {user ? (
              <li className="nav-item dropdown ms-lg-2 position-relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="btn btn-sm bg-white border text-dark rounded-pill px-3 py-1 d-flex align-items-center gap-2 shadow-sm"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                    style={{ width: '26px', height: '26px', background: 'var(--primary-color)', fontSize: '12px' }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="small fw-semibold">{user.name?.split(' ')[0]}</span>
                  <i className="bi bi-chevron-down small text-secondary"></i>
                </button>

                {isDropdownOpen && (
                  <div
                    className="position-absolute end-0 glass-panel p-2 mt-2 shadow-lg"
                    style={{ width: '220px', zIndex: 1060, backgroundColor: '#ffffff' }}
                  >
                    <div className="px-3 py-2 border-bottom border-light mb-1">
                      <div className="fw-bold text-dark small text-truncate">{user.name}</div>
                      <div className="text-secondary small text-truncate" style={{ fontSize: '11px' }}>
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="dropdown-item text-dark py-2 px-3 rounded small d-flex align-items-center gap-2"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="bi bi-person text-info"></i> My Profile & Perks
                    </Link>

                    <Link
                      to="/my-bookings"
                      className="dropdown-item text-dark py-2 px-3 rounded small d-flex align-items-center gap-2"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i className="bi bi-ticket-detailed text-success"></i> Booking History
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-item text-warning py-2 px-3 rounded small d-flex align-items-center gap-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <i className="bi bi-shield-lock-fill"></i> Admin Console
                      </Link>
                    )}

                    <div className="border-top my-1"></div>

                    <button
                      type="button"
                      className="dropdown-item text-danger py-2 px-3 rounded small d-flex align-items-center gap-2"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li className="nav-item ms-lg-2">
                <Link
                  to="/login"
                  className="btn-cine-primary text-decoration-none py-1 px-3 small"
                  onClick={() => setIsNavOpen(false)}
                >
                  <i className="bi bi-person-fill"></i> Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
