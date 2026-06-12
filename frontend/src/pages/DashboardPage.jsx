import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

// ── Helpers ──────────────────────────────────
const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

const formatDate = (iso) => {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

const timeAgo = (iso) => {
  if (!iso) return '';
  const secs = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (secs < 60)   return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)} minutes ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} hours ago`;
  return `${Math.floor(secs / 86400)} days ago`;
};

// ── Dashboard Page ───────────────────────────
const DashboardPage = () => {
  const { user: ctxUser } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [fetchErr, setFetchErr] = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data.user);
      } catch (err) {
        setFetchErr('Could not load profile. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayUser = profile || ctxUser;

  return (
    <>
      <div className="bg-animated" aria-hidden="true" />
      <Navbar />

      <div className="dashboard-layout">
        <div className="dashboard-content">

          {/* Hero */}
          <header className="dashboard-hero">
            <h2>
              Welcome back,{' '}
              <span>{displayUser?.name?.split(' ')[0] || 'User'}</span>! 👋
            </h2>
            <p>Here's your account overview — everything looks great.</p>
          </header>

          {/* Stats */}
          <section aria-label="Account statistics">
            <div className="stats-grid">
              <div className="glass-card stat-card">
                <div className="stat-icon" aria-hidden="true">🛡️</div>
                <div className="stat-value">Active</div>
                <div className="stat-label">Account Status</div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" aria-hidden="true">🔐</div>
                <div className="stat-value">JWT</div>
                <div className="stat-label">Auth Method</div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" aria-hidden="true">📅</div>
                <div className="stat-value" style={{ fontSize: '1.1rem' }}>
                  {formatDate(displayUser?.createdAt)}
                </div>
                <div className="stat-label">Member Since</div>
              </div>
            </div>
          </section>

          {/* Profile & Info */}
          <section className="profile-section" aria-label="Profile details">

            {/* Profile Card */}
            <div className="glass-card profile-card">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <div className="spinner" style={{ width: 32, height: 32 }} />
                </div>
              ) : fetchErr ? (
                <p style={{ color: 'var(--color-error)', fontSize: '0.9rem' }}>{fetchErr}</p>
              ) : (
                <>
                  <div
                    className="profile-avatar-lg"
                    aria-label={`Profile avatar for ${displayUser?.name}`}
                  >
                    {getInitials(displayUser?.name)}
                  </div>

                  <div className="profile-name">{displayUser?.name}</div>
                  <div className="profile-email">{displayUser?.email}</div>

                  <div className="profile-badge">
                    Verified Account
                  </div>

                  <div className="tech-stack" aria-label="Tech stack badges">
                    <span className="tech-badge">React</span>
                    <span className="tech-badge">Node.js</span>
                    <span className="tech-badge">Express</span>
                    <span className="tech-badge">PostgreSQL</span>
                    <span className="tech-badge">JWT</span>
                    <span className="tech-badge">bcrypt</span>
                  </div>
                </>
              )}
            </div>

            {/* Info Card */}
            <div className="glass-card info-card">
              <h3>Account Details</h3>

              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{displayUser?.name || '—'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Email Address</span>
                <span className="info-value">{displayUser?.email || '—'}</span>
              </div>

              <div className="info-row">
                <span className="info-label">User ID</span>
                <span className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  #{displayUser?.id || '—'}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Registered</span>
                <span className="info-value">{formatDate(displayUser?.createdAt)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Account Age</span>
                <span className="info-value">{timeAgo(displayUser?.createdAt)}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Password</span>
                <span className="info-value" style={{ letterSpacing: '0.2em', color: 'var(--color-text-muted)' }}>
                  ●●●●●●●●
                </span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default DashboardPage;
