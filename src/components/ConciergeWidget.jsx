import { useCallback, useEffect, useState } from "react";
import CalendarDatePicker from "./CalendarDatePicker";
import "./concierge-widget.scss";

const MOBILE_INPUT_PATTERN = /^\d{0,10}$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const NAME_PATTERN = /^[\p{L}\p{M}0-9][\p{L}\p{M}0-9 .'-]{0,79}$/u;
const EMAIL_PATTERN =
  /^[A-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;

function getToday() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function isValidTravelDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < getToday()) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function PhoneIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 18 18 6M6 6l12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export default function ConciergeWidget({
  carName = "Renault Triber 2026",
  onSubmit,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [travelDate, setTravelDate] = useState("");
  const [showDateError, setShowDateError] = useState(false);
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null);

  const resetForm = useCallback(() => {
    setIsCalendarOpen(false);
    setTravelDate("");
    setShowDateError(false);
    setMobile("");
    setName("");
    setEmail("");
    setErrors({});
    setSubmitFeedback(null);
  }, []);

  const closeWidget = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    resetForm();
    setIsOpen(false);
  }, [isSubmitting, resetForm]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeWidget();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeWidget, isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const dateIsValid = isValidTravelDate(travelDate);
    const nextErrors = {};

    if (!MOBILE_PATTERN.test(mobile)) {
      nextErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }
    if (trimmedName && !NAME_PATTERN.test(trimmedName)) {
      nextErrors.name = "Use up to 80 letters, numbers, spaces, apostrophes, or hyphens.";
    }
    if (
      trimmedEmail &&
      (trimmedEmail.length > 254 || !EMAIL_PATTERN.test(trimmedEmail))
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    setSubmitFeedback(null);
    setShowDateError(!dateIsValid);

    if (!dateIsValid) {
      setIsCalendarOpen(true);
    }

    if (!dateIsValid || Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitFeedback({ type: "sending", message: "Sending your request..." });

    let request;
    try {
      request = onSubmit({
        travelDate,
        mobile,
        name: trimmedName,
        email: trimmedEmail,
      });
    } catch (error) {
      request = Promise.reject(error);
    }

    Promise.resolve(request)
      .then((result) => {
        setSubmitFeedback({
          type: result?.emailSent ? "success" : "error",
          message: result?.emailSent
            ? result.whatsappPopupOpened
              ? "Your request email was sent. WhatsApp should be open; press Send there too. Use the link below if it did not open."
              : "Your request email was sent. Use the WhatsApp link below if you want to send a message too."
            : result?.whatsappPopupOpened
              ? "Your email was not sent. WhatsApp may be open, but no email was delivered. Please retry the email."
              : "Your email was not sent. Please retry or call Ren Rental; you can also open WhatsApp below.",
          whatsappUrl: result?.whatsappUrl,
        });
      })
      .catch((error) => {
        console.error("Callback request submission failed:", error);
        setSubmitFeedback({
          type: "error",
          message:
            error?.message === "EMAILJS_NOT_CONFIGURED"
              ? "Email delivery is not configured yet. Please call Ren Rental."
              : "We couldn't process your request. Please try again or call Ren Rental.",
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const toggleWidget = () => {
    if (isOpen) {
      closeWidget();
      return;
    }

    resetForm();
    setIsOpen(true);
  };

  return (
    <>
      {isOpen && (
        <div
          aria-hidden="true"
          className="rr-concierge-widget__backdrop"
        />
      )}

      <aside
        aria-label="Callback request form"
        className="rr-concierge-widget"
      >
        {isOpen && (
          <section
            aria-label="Check availability and request a callback"
            className="rr-concierge-widget__card"
            id="concierge-callback-card"
          >
            <header className="rr-concierge-widget__header">
              <div>
                <div className="rr-concierge-widget__vehicle-row">
                  <span className="rr-concierge-widget__vehicle">
                    {carName}
                  </span>
                  <span
                    aria-label="Concierge online"
                    className="rr-concierge-widget__online-dot"
                  />
                </div>
                <h2 className="rr-concierge-widget__title">
                  Check availability &amp; request a callback
                </h2>
                <p className="rr-concierge-widget__subtitle">
                  Submitting sends your request details by email and pre-fills
                  WhatsApp. Press Send there to share them.
                </p>
              </div>
              <button
                aria-label="Close callback form"
                className="rr-concierge-widget__close"
                disabled={isSubmitting}
                onClick={closeWidget}
                type="button"
              >
                <CloseIcon />
              </button>
            </header>

            <form
              className="rr-concierge-widget__form"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="rr-concierge-widget__field">
                <label htmlFor="concierge-travel-date">
                  Preferred travel date
                </label>
                <div className="rr-concierge-widget__calendar">
                  <CalendarDatePicker
                    date={travelDate}
                    describedBy={
                      showDateError ? "concierge-travel-date-error" : undefined
                    }
                    id="concierge-travel-date"
                    isOpen={isCalendarOpen}
                    label="preferred travel"
                    minDate={getToday()}
                    onDateChange={(date) => {
                      setTravelDate(date);
                      setShowDateError(false);
                      setSubmitFeedback(null);
                    }}
                    onOpenChange={setIsCalendarOpen}
                    portal
                  />
                </div>
                {showDateError && (
                  <p
                    className="rr-concierge-widget__date-error"
                    id="concierge-travel-date-error"
                    role="alert"
                  >
                    Please select a travel date.
                  </p>
                )}
              </div>

              <div className="rr-concierge-widget__field">
                <label htmlFor="concierge-mobile">
                  Mobile number <span>*</span>
                </label>
                <div className="rr-concierge-widget__phone-input">
                  <span className="rr-concierge-widget__country-code">
                    <span>IN</span>
                    +91
                  </span>
                  <input
                    aria-describedby={errors.mobile ? "concierge-mobile-error" : undefined}
                    aria-invalid={Boolean(errors.mobile)}
                    autoComplete="off"
                    id="concierge-mobile"
                    inputMode="numeric"
                    name="mobile"
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setSubmitFeedback(null);
                      if (MOBILE_INPUT_PATTERN.test(value)) {
                        setMobile(value);
                        setErrors((current) => ({ ...current, mobile: "" }));
                      } else {
                        setErrors((current) => ({
                          ...current,
                          mobile: "Only 10 digits are allowed.",
                        }));
                      }
                    }}
                    pattern="[6-9][0-9]{9}"
                    placeholder="Mobile Number"
                    required
                    type="tel"
                    value={mobile}
                  />
                </div>
                {errors.mobile && (
                  <p
                    className="rr-concierge-widget__field-error"
                    id="concierge-mobile-error"
                    role="alert"
                  >
                    {errors.mobile}
                  </p>
                )}
              </div>

              <details className="rr-concierge-widget__additional">
                <summary>
                  <span>Additional contact details (optional)</span>
                  <span aria-hidden="true" className="rr-concierge-widget__caret">
                    ▾
                  </span>
                </summary>
                <div className="rr-concierge-widget__optional-fields">
                  <input
                    aria-describedby={errors.name ? "concierge-name-error" : undefined}
                    aria-invalid={Boolean(errors.name)}
                    autoComplete="off"
                    maxLength={80}
                    name="name"
                    onChange={(event) => {
                      setName(event.currentTarget.value);
                      setErrors((current) => ({ ...current, name: "" }));
                      setSubmitFeedback(null);
                    }}
                    placeholder="Full name (optional)"
                    type="text"
                    value={name}
                  />
                  {errors.name && (
                    <p
                      className="rr-concierge-widget__field-error"
                      id="concierge-name-error"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                  <input
                    aria-describedby={errors.email ? "concierge-email-error" : undefined}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="off"
                    maxLength={254}
                    name="email"
                    onChange={(event) => {
                      setEmail(event.currentTarget.value);
                      setErrors((current) => ({ ...current, email: "" }));
                      setSubmitFeedback(null);
                    }}
                    placeholder="Email address (optional)"
                    type="email"
                    value={email}
                  />
                  {errors.email && (
                    <p
                      className="rr-concierge-widget__field-error"
                      id="concierge-email-error"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </details>

              <button
                className="rr-concierge-widget__submit"
                disabled={
                  isSubmitting || submitFeedback?.type === "success"
                }
                type="submit"
              >
                <span>
                  {isSubmitting
                    ? "Sending request..."
                    : submitFeedback?.type === "success"
                      ? "Request sent"
                      : "Request callback now"}
                </span>
                <svg
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="m14 5 7 7-7 7m7-7H3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                </svg>
              </button>

              <p className="rr-concierge-widget__trust-note">
                Your contact details are included in the email and pre-filled
                in WhatsApp. Press Send in WhatsApp to share them.
              </p>
              {submitFeedback && (
                <p
                  aria-live="polite"
                  className={`rr-concierge-widget__submit-feedback rr-concierge-widget__submit-feedback--${submitFeedback.type}`}
                  role={submitFeedback.type === "error" ? "alert" : "status"}
                >
                  {submitFeedback.message}
                </p>
              )}
              {submitFeedback?.whatsappUrl && (
                  <a
                    className="rr-concierge-widget__whatsapp-fallback"
                    href={submitFeedback.whatsappUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Open WhatsApp
                  </a>
              )}
            </form>
          </section>
        )}

        <button
          aria-controls="concierge-callback-card"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close callback form" : "Request a callback"}
          className={`rr-concierge-widget__launcher${isOpen ? " rr-concierge-widget__launcher--active" : ""}`}
          disabled={isSubmitting}
          onClick={toggleWidget}
          type="button"
        >
          {isOpen ? (
            <>
              <span className="rr-concierge-widget__launcher-icon">
                <CloseIcon />
              </span>
              <span className="rr-concierge-widget__active-label">
                Callback form open
              </span>
            </>
          ) : (
            <>
              <span className="rr-concierge-widget__phone-orb">
                <PhoneIcon />
                <span className="rr-concierge-widget__pulse">
                  <span />
                </span>
              </span>
              <span className="rr-concierge-widget__launcher-copy">
                <span className="rr-concierge-widget__launcher-heading">
                  <span>Request callback</span>
                  <span className="rr-concierge-widget__separator" />
                  <span className="rr-concierge-widget__live">Live</span>
                </span>
                <span className="rr-concierge-widget__launcher-caption">
                  Check dates &amp; availability
                </span>
              </span>
              <svg
                aria-hidden="true"
                className="rr-concierge-widget__launcher-arrow"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="m9 18 6-6-6-6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
              </svg>
            </>
          )}
        </button>
      </aside>
    </>
  );
}
