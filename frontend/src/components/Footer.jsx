import React from 'react';
import { Link } from 'react-router-dom';
import CinevoLogo from './CinevoLogo';

function Footer() {
  return (
    <footer className="py-5 mt-auto border-top" style={{ backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' }}>
      <div className="container">
        <div className="row g-4 mb-4 text-start">
          {/* Brand info */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-3">
              <CinevoLogo size={36} />
            </div>
            <p className="small text-secondary mb-3" style={{ lineHeight: '1.6' }}>
              Next-generation cinema ticketing ecosystem. Discover premiere blockbusters, choose your favorite tiered seats in real time, and enjoy seamless digital e-passes with zero wait times.
            </p>
            <div className="d-flex gap-3 fs-5 text-secondary">
              <span className="hover-danger cursor-pointer"><i className="bi bi-instagram"></i></span>
              <span className="hover-danger cursor-pointer"><i className="bi bi-twitter-x"></i></span>
              <span className="hover-danger cursor-pointer"><i className="bi bi-youtube"></i></span>
              <span className="hover-danger cursor-pointer"><i className="bi bi-facebook"></i></span>
            </div>
          </div>

          {/* Formats & Tech */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-dark fw-bold mb-3 brand-font">Auditorium Formats</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li><span>IMAX with Dual Laser 4K</span></li>
              <li><span>Dolby Atmos Spatial Audio</span></li>
              <li><span>4DX Multi-Sensory Motion</span></li>
              <li><span>Director's Gold Class Lounge</span></li>
              <li><span>RealD 3D High Contrast</span></li>
            </ul>
          </div>

          {/* Quick Demo Access */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-dark fw-bold mb-3 brand-font">Instant Testing Accounts</h6>
            <div className="bg-white p-3 rounded-3 border small shadow-sm">
              <div className="mb-2">
                <span className="text-danger fw-bold">Admin:</span> admin@imovies.com / admin123
              </div>
              <div className="mb-2">
                <span className="text-primary fw-bold">Customer:</span> demo@imovies.com / demo123
              </div>
              <div className="text-muted" style={{ fontSize: '11px' }}>
                💡 Click the 1-click autofill buttons on the Sign In page!
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-dark fw-bold mb-3 brand-font">VIP Premiere Club</h6>
            <p className="small text-secondary mb-2">Get early access tickets, secret discount codes & premiere invites.</p>
            <div className="input-group mb-2">
              <input
                type="email"
                className="form-control form-control-sm bg-white border text-dark"
                placeholder="Enter your email"
              />
              <button className="btn btn-danger btn-sm px-3" type="button">
                Join
              </button>
            </div>
            <div className="text-muted small" style={{ fontSize: '11px' }}>
              Use coupon code <code>FIRST50</code> for ₹50 off your first booking!
            </div>
          </div>
        </div>

        <div className="pt-3 border-top d-flex flex-wrap justify-content-between align-items-center small text-secondary">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Cinevo Entertainment Inc. All rights reserved.
          </p>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            <span>Terms of Service</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Support Helpdesk</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
