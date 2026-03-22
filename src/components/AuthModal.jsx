import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, initialTab, onClose }) {
  const [tab, setTab] = useState(initialTab || 'login');
  const { login, register, loading } = useAuth();
  const modalRef = useRef(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regErrors, setRegErrors] = useState({});

  useEffect(() => { if (initialTab) setTab(initialTab); }, [initialTab]);

  // Focus trap — keep Tab cycling inside the modal
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;

    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      // Auto-focus first input after animation
      const timer = setTimeout(() => {
        const modal = modalRef.current;
        if (modal) {
          const firstInput = modal.querySelector('input');
          if (firstInput) firstInput.focus();
        }
      }, 100);
      return () => { clearTimeout(timer); document.body.style.overflow = ''; document.removeEventListener('keydown', handleKeyDown); };
    }
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose(); };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateLogin = () => {
    const errors = {};
    if (!loginEmail.trim()) errors.email = 'Email is required.';
    else if (!isValidEmail(loginEmail)) errors.email = 'Please enter a valid email.';
    if (!loginPassword) errors.password = 'Password is required.';
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors = {};
    if (!regFirstName.trim()) errors.firstName = 'First name is required.';
    if (!regLastName.trim()) errors.lastName = 'Last name is required.';
    if (!regEmail.trim()) errors.email = 'Email is required.';
    else if (!isValidEmail(regEmail)) errors.email = 'Please enter a valid email.';
    if (!regPassword) errors.password = 'Password is required.';
    else if (regPassword.length < 8) errors.password = 'Min 8 characters.';
    if (!regPasswordConfirm) errors.passwordConfirm = 'Please confirm your password.';
    else if (regPassword !== regPasswordConfirm) errors.passwordConfirm = 'Passwords do not match.';
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return [
      { width: '0%', color: 'transparent', label: '' },
      { width: '20%', color: '#ef4444', label: 'Weak' },
      { width: '40%', color: '#f59e0b', label: 'Fair' },
      { width: '60%', color: '#fbbf24', label: 'Good' },
      { width: '80%', color: '#10b981', label: 'Strong' },
      { width: '100%', color: '#00d4ff', label: 'Very Strong' },
    ][score];
  };
  const strength = getStrength(regPassword);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    const result = await login(loginEmail, loginPassword);
    if (result.success) setTimeout(() => onClose(), 400);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    const result = await register({ firstName: regFirstName, lastName: regLastName, email: regEmail, phone: regPhone, password: regPassword });
    if (result.success) setTimeout(() => onClose(), 400);
  };

  const ErrorMsg = ({ error }) => error ? <span className="field-error" role="alert"><i className="fas fa-exclamation-circle" /> {error}</span> : null;

  return (
    <div className={`modal-overlay${isOpen ? ' active' : ''}`} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={tab === 'login' ? 'Sign in' : 'Create account'}>
      <div className="modal" ref={modalRef}>
        <div className="modal-bg-effects">
          <div className="modal-orb modal-orb-1" />
          <div className="modal-orb modal-orb-2" />
          <div className="modal-orb modal-orb-3" />
        </div>

        <div className="modal-left">
          <div className="modal-left-content">
            <div className="modal-brand"><span className="logo-text">Tech<span>Mind</span></span></div>
            <h2>Welcome to<br />the center of<br />technology.</h2>
            <p>Start shopping with 50,000+ products, same-day shipping, and best price guarantee.</p>
            <div className="modal-features">
              <div className="modal-feature"><i className="fas fa-check-circle" /><span>Free shipping</span></div>
              <div className="modal-feature"><i className="fas fa-check-circle" /><span>Secure payment</span></div>
              <div className="modal-feature"><i className="fas fa-check-circle" /><span>Easy returns</span></div>
            </div>
          </div>
        </div>

        <div className="modal-right">
          <button className="modal-close" onClick={onClose} aria-label="Close dialog"><i className="fas fa-xmark" /></button>

          <div className="modal-tabs" role="tablist" aria-label="Authentication method">
            <button className={`modal-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setLoginErrors({}); }} role="tab" aria-selected={tab === 'login'} id="tab-login" aria-controls="panel-login">Sign In</button>
            <button className={`modal-tab${tab === 'register' ? ' active' : ''}`} onClick={() => { setTab('register'); setRegErrors({}); }} role="tab" aria-selected={tab === 'register'} id="tab-register" aria-controls="panel-register">Sign Up</button>
            <div className="tab-indicator" style={{ left: tab === 'login' ? '0' : '50%' }} />
          </div>

          {tab === 'login' && (
            <form className="auth-form" onSubmit={handleLoginSubmit} noValidate role="tabpanel" id="panel-login" aria-labelledby="tab-login">
              <div className="form-group">
                <div className="input-wrapper">
                  <i className="fas fa-envelope input-icon" />
                  <input type="email" placeholder="Email Address" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); setLoginErrors((p) => ({ ...p, email: '' })); }} aria-label="Email" aria-required="true" aria-invalid={!!loginErrors.email} />
                </div>
                <ErrorMsg error={loginErrors.email} />
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <i className="fas fa-lock input-icon" />
                  <input type={showLoginPw ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={(e) => { setLoginPassword(e.target.value); setLoginErrors((p) => ({ ...p, password: '' })); }} aria-label="Password" aria-required="true" aria-invalid={!!loginErrors.password} />
                  <button type="button" className="toggle-password" onClick={() => setShowLoginPw(!showLoginPw)} aria-label={showLoginPw ? 'Hide password' : 'Show password'}>
                    <i className={`fas ${showLoginPw ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
                <ErrorMsg error={loginErrors.password} />
              </div>
              <div className="form-options">
                <label className="checkbox-label"><input type="checkbox" /> <span>Remember me</span></label>
                <a href="#" className="forgot-link">Forgot password</a>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin" /> Signing in...</> : <><span>Sign In</span><i className="fas fa-arrow-right" /></>}
              </button>
              <div className="divider"><span>or</span></div>
              <div className="social-row">
                <button type="button" className="btn-social"><i className="fab fa-google" /> Google</button>
                <button type="button" className="btn-social"><i className="fab fa-apple" /> Apple</button>
              </div>
            </form>
          )}

          {tab === 'register' && (
            <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate role="tabpanel" id="panel-register" aria-labelledby="tab-register">
              <div className="form-row">
                <div className="form-group">
                  <div className="input-wrapper"><i className="fas fa-user input-icon" /><input type="text" placeholder="First Name" value={regFirstName} onChange={(e) => { setRegFirstName(e.target.value); setRegErrors((p) => ({ ...p, firstName: '' })); }} aria-label="First name" aria-required="true" aria-invalid={!!regErrors.firstName} /></div>
                  <ErrorMsg error={regErrors.firstName} />
                </div>
                <div className="form-group">
                  <div className="input-wrapper"><i className="fas fa-user input-icon" /><input type="text" placeholder="Last Name" value={regLastName} onChange={(e) => { setRegLastName(e.target.value); setRegErrors((p) => ({ ...p, lastName: '' })); }} aria-label="Last name" aria-required="true" aria-invalid={!!regErrors.lastName} /></div>
                  <ErrorMsg error={regErrors.lastName} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper"><i className="fas fa-envelope input-icon" /><input type="email" placeholder="Email Address" value={regEmail} onChange={(e) => { setRegEmail(e.target.value); setRegErrors((p) => ({ ...p, email: '' })); }} aria-label="Email" aria-required="true" aria-invalid={!!regErrors.email} /></div>
                <ErrorMsg error={regErrors.email} />
              </div>
              <div className="form-group">
                <div className="input-wrapper"><i className="fas fa-phone input-icon" /><input type="tel" placeholder="Phone (optional)" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} aria-label="Phone" /></div>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <i className="fas fa-lock input-icon" />
                  <input type={showRegPw ? 'text' : 'password'} placeholder="Password" value={regPassword} onChange={(e) => { setRegPassword(e.target.value); setRegErrors((p) => ({ ...p, password: '' })); }} aria-label="Password" aria-required="true" aria-invalid={!!regErrors.password} />
                  <button type="button" className="toggle-password" onClick={() => setShowRegPw(!showRegPw)} aria-label={showRegPw ? 'Hide password' : 'Show password'}><i className={`fas ${showRegPw ? 'fa-eye-slash' : 'fa-eye'}`} /></button>
                </div>
                <div className="password-strength" aria-live="polite">
                  <div className="strength-bar"><div className="strength-fill" style={{ width: strength.width, background: strength.color }} /></div>
                  <span className="strength-text" style={{ color: strength.color }}>{strength.label}</span>
                </div>
                <ErrorMsg error={regErrors.password} />
              </div>
              <div className="form-group">
                <div className="input-wrapper"><i className="fas fa-lock input-icon" /><input type="password" placeholder="Confirm Password" value={regPasswordConfirm} onChange={(e) => { setRegPasswordConfirm(e.target.value); setRegErrors((p) => ({ ...p, passwordConfirm: '' })); }} aria-label="Confirm password" aria-required="true" aria-invalid={!!regErrors.passwordConfirm} /></div>
                <ErrorMsg error={regErrors.passwordConfirm} />
              </div>
              <div className="form-options">
                <label className="checkbox-label"><input type="checkbox" required aria-required="true" /><span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</span></label>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin" /> Creating account...</> : <><span>Sign Up</span><i className="fas fa-arrow-right" /></>}
              </button>
              <div className="divider"><span>or</span></div>
              <div className="social-row">
                <button type="button" className="btn-social"><i className="fab fa-google" /> Google</button>
                <button type="button" className="btn-social"><i className="fab fa-apple" /> Apple</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
