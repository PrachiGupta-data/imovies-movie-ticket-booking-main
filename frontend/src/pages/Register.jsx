import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
      <div className="card bg-white border p-4 p-md-5 rounded-4 shadow w-100" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-3 p-2 shadow-sm text-white mb-2"
            style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', width: '48px', height: '48px' }}
          >
            <i className="bi bi-person-plus fs-3"></i>
          </span>
          <h3 className="fw-black text-dark mb-1 brand-font">Join Cinevo</h3>
          <p className="text-secondary small">Create an account to book seats & receive exclusive offers</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label text-dark small fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control bg-light border text-dark"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label text-dark small fw-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control bg-light border text-dark"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label text-dark small fw-semibold">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control bg-light border text-dark"
              placeholder="+1 555 123 4567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="row g-2 mb-4 text-start">
            <div className="col-6">
              <label className="form-label text-dark small fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                className="form-control bg-light border text-dark"
                placeholder="••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label text-dark small fw-semibold">Confirm</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control bg-light border text-dark"
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        <div className="text-center text-secondary small">
          Already have an account?{' '}
          <Link to="/login" className="text-danger text-decoration-none fw-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
