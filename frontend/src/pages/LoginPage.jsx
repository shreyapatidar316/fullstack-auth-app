import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, useToast } from '../components/Toast';

const LoginPage = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();
  const { toasts, removeToast, toast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  // ── Field-level Validation ──────────────────
  const validate = () => {
    const e = {};
    if (!formData.email.trim())
      e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Please enter a valid email address.';
    if (!formData.password)
      e.password = 'Password is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  // ── Submit ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email: formData.email, password: formData.password });
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 🎉`);
      setTimeout(() => navigate(from, { replace: true }), 500);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      if (err.response?.status === 401) {
        setErrors({ password: 'Invalid email or password.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Animated background */}
      <div className="bg-animated" aria-hidden="true" />

      <main className="auth-layout">
        <div className="auth-container">

          {/* Logo */}
          <div className="auth-logo">
            <div className="logo-icon" aria-hidden="true">🔐</div>
            <h1>AuthApp</h1>
            <p>Secure · Fast · Modern</p>
          </div>

          {/* Card */}
          <div className="glass-card auth-card">
            <h2>Welcome back</h2>
            <p className="subtitle">Sign in to your account to continue</p>

            <form id="login-form" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email address</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">📧</span>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    className={`form-input${errors.email ? ' input-error' : ''}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="field-error" role="alert">
                    ⚠ {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="login-password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">🔑</span>
                  <input
                    id="login-password"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    className={`form-input form-input-right${errors.password ? ' input-error' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    id="toggle-password-login"
                    className="input-right-action"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="field-error" role="alert">
                    ⚠ {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>

            <div className="divider">or</div>

            <p className="auth-footer">
              Don't have an account?{' '}
              <Link to="/signup" id="go-to-signup">Create one free</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
