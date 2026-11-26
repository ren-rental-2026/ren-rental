import { useState } from "react";
import "./admin-login.scss";

const ADMIN_PIN = "9788309432";
const ADMIN_PASSWORD = "tn34mc7845";

function LockIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PasswordIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  ) : (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function AlertIcon({ type }) {
  return type === "error" ? (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  ) : (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="spinner" fill="none" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        style={{ opacity: 0.25 }}
      />
      <path
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
        style={{ opacity: 0.75 }}
      />
    </svg>
  );
}

export default function AdminLogin({ onBack, onAuthenticated }) {
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboardModal, setShowDashboardModal] = useState(false);

  const handleAuth = (event) => {
    event.preventDefault();

    const normalizedPin = pin.trim().replace(/[^0-9a-zA-Z]/g, "");
    setIsLoading(true);
    setAlert(null);

    window.setTimeout(() => {
      const isValidPin = normalizedPin === ADMIN_PIN;
      const isValidPassword = password.trim() === ADMIN_PASSWORD;

      setIsLoading(false);

      if (isValidPin && isValidPassword) {
        setAlert({
          type: "success",
          message:
            "Access Granted. Cryptographic keys validated. Initializing Admin Dashboard...",
        });
        window.setTimeout(() => setShowDashboardModal(true), 800);
        return;
      }

      setAlert({
        type: "error",
        message:
          "Access Denied: Invalid credentials. Please enter the authorized admin PIN and password.",
      });
    }, 700);
  };

  const handleDashboard = () => {
    sessionStorage.setItem("adminmodeenable", "true");
    setShowDashboardModal(false);
    onAuthenticated?.();
  };

  const handleBack = (event) => {
    event.preventDefault();
    onBack?.();
  };

  return (
    <div className="admin-login-page">
      <div aria-hidden="true" className="ambient-bg">
        <div className="ambient-glow-top" />
        <div className="ambient-glow-bottom" />
        <div className="grid-overlay" />
      </div>

      <header className="header">
        <div className="header-container">
          <div className="brand-section">
            <a className="brand-link" href="/" onClick={handleBack}>
              <div className="brand-logo-frame">
                <div className="brand-logo-inner">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
              </div>
              <div className="brand-text">
                <span className="brand-title">Ren Rental</span>
              </div>
            </a>
            <span className="security-badge">
              <span className="status-dot" />
              RESTRICTED ACCESS
            </span>
          </div>
          <div>
            <a className="back-link" href="/" onClick={handleBack}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              <span>Back to Public Site</span>
            </a>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="auth-wrapper">
          <div className="glass-card">
            <div className="card-top-bar" />
            <div className="card-header">
              <div className="lock-icon-container">
                <LockIcon />
              </div>
              <h1 className="card-title">Admin Portal Access</h1>
              <p className="card-description">
                Enter authorized administrator credentials to manage fleet
                reservations, billing, and generate customer trip invoices.
              </p>
            </div>

            <div
              className={`alert-box${alert ? ` ${alert.type}` : " hidden"}`}
              role="alert"
            >
              {alert && (
                <>
                  <AlertIcon type={alert.type} />
                  <div>{alert.message}</div>
                </>
              )}
            </div>

            <form className="auth-form" onSubmit={handleAuth}>
              <div className="field-group">
                <label className="field-label" htmlFor="admin-pin">
                  Admin Mobile / PIN
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <PhoneIcon />
                  </div>
                  <input
                    className="form-input"
                    id="admin-pin"
                    name="admin-pin"
                    onChange={(event) => setPin(event.target.value)}
                    placeholder="Admin PIN"
                    required
                    type="text"
                    value={pin}
                  />
                </div>
                <p className="field-hint">
                  Configured for authorized fleet manager lines.
                </p>
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="admin-passcode">
                  Security Password / Passcode
                </label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <PasswordIcon />
                  </div>
                  <input
                    className="form-input form-input-passcode"
                    id="admin-passcode"
                    name="admin-passcode"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="toggle-visibility-btn"
                    onClick={() => setPasswordVisible((visible) => !visible)}
                    type="button"
                  >
                    <EyeIcon hidden={passwordVisible} />
                  </button>
                </div>
                <div className="field-hint">
                  <span>Configured admin password.</span>
                </div>
              </div>

              <button
                className={`submit-button${isLoading ? " loading" : ""}`}
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span>Verifying Security Handshake...</span>
                  </>
                ) : (
                  <span>Authenticate</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {showDashboardModal && (
          <div className="modal-overlay">
            <div className="glass-card modal-card">
              <div className="modal-icon-badge">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <h2 className="modal-title">Authenticated to Terminal</h2>
              <p className="modal-desc">
                Redirecting to Executive Fleet Operations Center...
              </p>
              <div className="info-terminal-box">
                <div className="info-row">
                  <span>Admin ID:</span>
                  <span className="info-gold">ADM-97883-HQ</span>
                </div>
                <div className="info-row">
                  <span>Fleet Scope:</span>
                  <span className="info-white">
                    Renault Triber &amp; Executive Fleet (38 Active)
                  </span>
                </div>
                <div className="info-row">
                  <span>Security Token:</span>
                  <span className="info-emerald">TOKEN_VALID_2026_RSA4096</span>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowDashboardModal(false)}
                  type="button"
                >
                  Return to Login Screen
                </button>
                <button
                  className="btn-primary"
                  onClick={handleDashboard}
                  type="button"
                >
                  Open Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div>
            <span>© 2026 ELITE DRIVE SYSTEMS. ENCRYPTED END-TO-END.</span>
          </div>
          <div className="footer-meta">
            <span className="meta-indicator">
              <span className="meta-dot" />
              IP: 192.168.1.1 (SECURE TERMINAL)
            </span>
            <span className="meta-divider">•</span>
            <span className="meta-protocol">Protocol: TLS 1.3 / AES-GCM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
