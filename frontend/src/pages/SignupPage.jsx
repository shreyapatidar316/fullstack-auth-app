import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, useToast } from '../components/Toast';

// ── Password Strength Calculator ──────────────
const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: 'Weak',   cls: 'weak' };
  if (score === 2) return { level: 2, label: 'Fair',   cls: 'fair' };
  if (score === 3) return { level: 3, label: 'Good',   cls: 'good' };
  return              { level: 4, label: 'Strong', cls: 'strong' };
};

const strengthClass = (barIndex, level, cls) =>
  barIndex <= level ? `strength-bar active-${cls}` : 'strength-bar';

const SignupPage = () => {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const { toasts, removeToast, toast } = useToast();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors]    = useState({});
  const [loading, setLoading]  = useState(false);
  const [showPw, setShowPw]    = useState(false);
  const [showCPw, setShowCPw]  = useState(false);

  const strength = getStrength(formData.password);

  // ── Validation ──────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.name.trim())
      e.name = 'Full name is required.';
    else if (formData.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters.';

    if (!formData.email.trim())
      e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = 'Please enter a valid email address.';

    if (!formData.password)
      e.password = 'Password is required.';
    else if (formData.password.length < 6)
      e.password = 'Password must be at least 6 characters.';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = 'Must include uppercase, lowercase, and a number.';

    if (!formData.confirmPassword)
      e.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';

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
      const res = await signupUser({
        name:     formData.name.trim(),
        email:    formData.email,
        password: formData.password,
      });
      login(res.data.user, res.data.token);
      toast.success(`Account created! Welcome, ${res.data.user.name}! 🎉`);
      setTimeout(() => navigate('/dashboard', { replace: true }), 600);
    } catch (err) {
      const message = err.response?.data?.message || 'Sign up failed. Please try again.';
      toast.error(message);
      if (err.response?.status === 409) {
        setErrors({ email: 'This email is already registered.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="bg-animated" aria-hidden="true" />

      <main className="auth-layout">
        <div className="auth-container">

          {/* Logo */}
          <div className="auth-logo">
            <div className="logo-icon" aria-hidden="true">🔐</div>
            <h1>AuthApp</h1>
            <p>Create your free account</p>
          </div>

          {/* Card */}
          <div className="glass-card auth-card">
            <h2>Create account</h2>
            <p className="subtitle">Join thousands of users today — it's free</p>

            <form id="signup-form" onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className="form-group">
                <label htmlFor="signup-name" className="form-label">Full name</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">👤</span>
                  <input
                    id="signup-name"
                    type="text"
                    name="name"
                    className={`form-input${errors.name ? ' input-error' : ''}`}
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    aria-invalid={!!errors.name}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="field-error" role="alert">⚠ {errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">Email address</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">📧</span>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    className={`form-input${errors.email ? ' input-error' : ''}`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    aria-describedby={errors.email ? 'signup-email-error' : undefined}
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p id="signup-email-error" className="field-error" role="alert">⚠ {errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="signup-password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">🔑</span>
                  <input
                    id="signup-password"
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    className={`form-input form-input-right${errors.password ? ' input-error' : ''}`}
                    placeholder="Min. 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    aria-describedby="pw-strength"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    id="toggle-password-signup"
                    className="input-right-action"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>

                {/* Password strength indicator */}
                {formData.password && (
                  <div id="pw-strength" className="password-strength" aria-label={`Password strength: ${strength.label}`}>
                    <div className="strength-bars" aria-hidden="true">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={strengthClass(i, strength.level, strength.cls)} />
                      ))}
                    </div>
                    <span className={`strength-label ${strength.cls}`}>{strength.label}</span>
                  </div>
                )}

                {errors.password && (
                  <p className="field-error" role="alert">⚠ {errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="signup-confirm-password" className="form-label">Confirm password</label>
                <div className="input-wrapper">
                  <span className="input-icon" aria-hidden="true">🔒</span>
                  <input
                    id="signup-confirm-password"
                    type={showCPw ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-input form-input-right${errors.confirmPassword ? ' input-error' : ''}`}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    id="toggle-confirm-password"
                    className="input-right-action"
                    onClick={() => setShowCPw((p) => !p)}
                    aria-label={showCPw ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showCPw ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="field-error" role="alert">⚠ {errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit */}
              <button
                id="signup-submit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Creating account…
                  </>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            <div className="divider">or</div>

            <p className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" id="go-to-login">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SignupPage;
