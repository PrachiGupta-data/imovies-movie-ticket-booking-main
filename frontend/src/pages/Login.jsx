import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = location.state?.returnUrl || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate(returnUrl);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoUser = () => {
    setEmail('demo@imovies.com');
    setPassword('demo123');
  };

  const handleFillAdmin = () => {
    setEmail('admin@imovies.com');
    setPassword('admin123');
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="card bg-white border p-4 p-md-5 rounded-4 shadow w-100" style={{ maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-3 p-2 shadow-sm text-white mb-2"
            style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', width: '48px', height: '48px' }}
          >
            <i className="bi bi-film fs-3"></i>
          </span>
          <h3 className="fw-black text-dark mb-1 brand-font">Welcome to Cinevo</h3>
          <p className="text-secondary small">Sign in to book seats & manage your tickets</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label text-dark small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border text-secondary">
                <i className="bi bi-envelope"></i>
              </span>
              <input
                type="email"
                className="form-control bg-light border text-dark"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4 text-start">
            <label className="form-label text-dark small fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border text-secondary">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control bg-light border text-dark"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-cine-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Demo Quick Fill Buttons */}
        <div className="p-3 rounded-3 bg-light border mb-3 text-center">
          <div className="text-secondary small mb-2 fw-semibold">Quick Testing Credentials:</div>
          <div className="d-flex gap-2 justify-content-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleFillDemoUser}
            >
              Demo User
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-warning"
              onClick={handleFillAdmin}
            >
              Admin User
            </button>
          </div>
        </div>

        <div className="text-center text-secondary small">
          Don't have an account?{' '}
          <Link to="/register" className="text-danger text-decoration-none fw-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
