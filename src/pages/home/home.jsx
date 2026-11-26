import car_full_image from "../../../public/images/car_full_image.png";
import front_view_tribber from "../../../public/images/front-view-tribber.jpg";
import Founders from "./founders";
import homeContent from "./home-content.json";

const NAV_LINKS = ["Fleet", "Experience", "Packages", "Enquiry"];
const { bentoCards, plans, policyNotes } = homeContent;

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.5a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

export default function Home({ onAdminOpen }) {
  const [activeLink, setActiveLink] = useState("Fleet");
  const [scrolled, setScrolled] = useState(false);
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const logoHoldRef = useRef({ start: 0, timer: null });

  // Create refs for each section
  const heroRef = useRef(null);
  const experienceRef = useRef(null);
  const investmentRef = useRef(null);
  const conciergeRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Update active link based on scroll position
      const sections = [
        { name: "Fleet", ref: heroRef },
        { name: "Experience", ref: experienceRef },
        { name: "Packages", ref: investmentRef },
        { name: "Enquiry", ref: conciergeRef },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom > 150) {
            setActiveLink(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (sectionName) => {
    const sectionMap = {
      Fleet: heroRef,
      Experience: experienceRef,
      Packages: investmentRef,
      Enquiry: conciergeRef,
    };

    const ref = sectionMap[sectionName];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setActiveLink(sectionName);
    }
  };

  const handleEnquireClick = () => {
    setShowEnquiryPopup(true);
  };

  const handleClosePopup = () => {
    setShowEnquiryPopup(false);
  };

  const handleLogoPointerDown = () => {
    logoHoldRef.current.start = Date.now();
    logoHoldRef.current.timer = window.setTimeout(() => {
      logoHoldRef.current.timer = null;
    }, 5000);
  };

  const handleLogoPointerUp = () => {
    const { start, timer } = logoHoldRef.current;
    if (timer) {
      window.clearTimeout(timer);
    }

    logoHoldRef.current.timer = null;
    const holdDuration = Date.now() - start;
    logoHoldRef.current.start = 0;

    if (holdDuration >= 3000 && holdDuration <= 5000) {
      sessionStorage.setItem("adminmodeenable", "true");
      onAdminOpen?.();
    }
  };

  const handleLogoPointerCancel = () => {
    const { timer } = logoHoldRef.current;
    if (timer) {
      window.clearTimeout(timer);
    }
    logoHoldRef.current = { start: 0, timer: null };
  };

  const PHONE_NUMBER = "9498059432";
  const DEFAULT_WHATSAPP_MESSAGE =
    "Hi Ren Rental Team, I would like to book the Renault Triber rental. Please assist with availability and pricing.";

  const handleDownloadBrochure = () => {
    // Download the brochure image from public folder instead of opening it in-browser
    const link = document.createElement("a");
    link.href = "/images/broucher.png";
    link.download = "broucher.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppBookingClick = () => {
    window.open(
      `https://wa.me/91${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`,
      "_blank",
    );
  };

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/ren.rental", "_blank");
  };

  const handleMailClick = () => {
    window.location.href = "mailto:ren.rental.2026@gmail.com";
  };

  return (
    <div className="ed-root">
      {/* NAVBAR */}
      <nav className={`ed-navbar${scrolled ? " ed-navbar--scrolled" : ""}`}>
        <div
          className="ed-logo"
          onPointerCancel={handleLogoPointerCancel}
          onPointerDown={handleLogoPointerDown}
          onPointerLeave={handleLogoPointerCancel}
          onPointerUp={handleLogoPointerUp}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          Ren Rental
        </div>
        <div className="ed-nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              className={`ed-nav-link${activeLink === link ? " ed-nav-link--active" : ""}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link);
              }}
            >
              {link}
            </a>
          ))}
        </div>
        <div className="ed-nav-actions">
          <button className="ed-btn-enquiry" onClick={handleEnquireClick}>
            ENQUIRE NOW
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="ed-hero" ref={heroRef}>
        <div className="ed-hero-bg">
          <img src={car_full_image} alt="Renault Triber 2026 Gold" />
          <div className="ed-hero-overlay" />
        </div>
        <div className="ed-hero-content">
          <div className="ed-badge">
            <span>FAMILY FAVORITE. FIRST-CLASS COMFORT.</span>
          </div>
          <h1 className="ed-hero-title">
            Drive Beyond <br />
            <span className="ed-text-glow">Luxury.</span>
          </h1>
          <p className="ed-hero-desc">
            Experience ultimate group travel comfort. The Renault Triber
            features a highly adaptable 7-seat layout, smart space utilization,
            and an efficient turbo drive—perfect for city weekend getaways or
            long family road trips.
          </p>
          <div className="ed-hero-btns">
            <button
              className="ed-btn-primary"
              onClick={handleWhatsAppBookingClick}
            >
              BOOK YOUR DATES
            </button>
            <button
              className="ed-btn-outline"
              onClick={() => scrollToSection("Experience")}
            >
              EXPLORE SPECS
            </button>
          </div>
        </div>
        <div className="ed-hero-stats">
          <div className="ed-stat-item">
            <span className="ed-stat-label">Engine</span>
            <span className="ed-stat-value">1.0L Turbo</span>
          </div>
          <div className="ed-stat-divider" />
          <div className="ed-stat-item">
            <span className="ed-stat-label">Capacity</span>
            <span className="ed-stat-value">7 Seats</span>
          </div>
          <div className="ed-stat-divider" />
          <div className="ed-stat-item">
            <span className="ed-stat-label">Efficiency</span>
            <span className="ed-stat-value">15 KM/L</span>
          </div>
        </div>
      </section>

      {/* BENTO EXPERIENCE */}
      <section className="ed-experience" ref={experienceRef}>
        <div className="ed-section-header">
          <h2>The Perfect Road-Trip Companion</h2>
          <p>
            Engineered for flexibility, comfort, and unforgettable group
            journeys. Discover a rental that perfectly fits your family and your
            luggage.
          </p>
        </div>
        <div className="ed-bento-grid">
          {bentoCards.map((card) => (
            <div
              key={card.title}
              className={`ed-bento-card ed-bento-card--${card.size}`}
            >
              <img src={card.src} alt={card.alt} />
              <div className="ed-bento-content">
                {card.tag && <span className="ed-bento-tag">{card.tag}</span>}
                <h3 className="ed-bento-title">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="ed-investment" ref={investmentRef}>
        <div className="ed-section-header">
          <span
            className="ed-bento-tag"
            style={{ display: "block", marginBottom: 8 }}
          >
            Reservation Plans
          </span>
          <h2>Self-Drive Packages</h2>
        </div>
        <div className="ed-pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.type}
              className={`ed-pricing-card${plan.featured ? " ed-pricing-card--featured" : " ed-glass-panel"}`}
            >
              {plan.badge && (
                <div className="ed-featured-badge">{plan.badge}</div>
              )}
              <h4 className="ed-card-type">{plan.type}</h4>
              <p
                className={`ed-card-subtitle${plan.featured ? " ed-card-subtitle--featured" : ""}`}
              >
                {plan.subtitle}
              </p>
              <div className="ed-price-row">
                <span className="ed-price-val">{plan.price}</span>
                <span className="ed-price-unit">{plan.unit}</span>
              </div>
              <ul className="ed-feature-list">
                {plan.features.map((f) => (
                  <li key={f} className="ed-feature-item">
                    <span className="material-symbols-outlined">
                      {plan.icon}
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.featured ? (
                <button
                  className="ed-btn-reserve ed-metallic-gradient"
                  onClick={handleWhatsAppBookingClick}
                >
                  RESERVE NOW
                </button>
              ) : (
                <button
                  className="ed-btn-select"
                  onClick={handleWhatsAppBookingClick}
                >
                  RESERVE NOW
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="ed-policy-notes-container">
          {policyNotes.map((note, index) => (
            <div key={index} className="ed-policy-note">
              <p className="ed-policy-note-text">
                <span className="ed-policy-note-asterisk">*</span>
                <span className="material-symbols-outlined ed-policy-note-icon">
                  {note.icon}
                </span>
                {note.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CONCIERGE */}
      <section className="ed-concierge-section" ref={conciergeRef}>
        <div className="ed-concierge-card ed-glass-panel">
          <div className="ed-concierge-img">
            <img src={front_view_tribber} alt="Elite Concierge" />
          </div>
          <div className="ed-concierge-info">
            <span className="ed-bento-tag">24/7 DEDICATED SUPPORT</span>
            <h2>Your Rental Partner</h2>
            <p className="ed-hero-desc" style={{ maxWidth: "100%" }}>
              Whether you need help selecting the perfect package or require
              on-road assistance, our team is available around the clock to
              ensure a seamless, hassle-free rental experience.
            </p>
            <div className="ed-contact-box">
              <div className="ed-contact-item">
                <div className="ed-icon-wrapper">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="ed-contact-label">Mobile 24/7</p>
                  <p className="ed-contact-value">9498059432</p>
                </div>
              </div>
              <div className="ed-contact-item">
                <div className="ed-icon-wrapper">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <p className="ed-contact-label">Office</p>
                  <p className="ed-contact-address">
                    Komarapalayam, TN - 638183
                  </p>
                </div>
              </div>
            </div>
            <div className="ed-concierge-btns">
              <button
                className="ed-btn-primary ed-metallic-gradient"
                onClick={handleEnquireClick}
              >
                ENQUIRE NOW
              </button>
              <button
                className="ed-btn-outline"
                onClick={handleDownloadBrochure}
              >
                BROCHURE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <Founders />

      {/* FOOTER */}
      <footer className="ed-footer">
        <div className="ed-footer-brand">
          <div className="ed-logo">Ren Rental</div>
          <p className="ed-copyright">
            © 2026 REN RENTAL. ALL RIGHTS RESERVED. PRECISION ENGINEERED RENTAL.
          </p>
        </div>
        <div className="ed-social-icons">
          <div
            className="ed-social-btn"
            onClick={handleInstagramClick}
            style={{ cursor: "pointer" }}
          >
            <InstagramIcon />
          </div>
          <div
            className="ed-social-btn"
            onClick={handleWhatsAppBookingClick}
            style={{ cursor: "pointer" }}
          >
            <span className="material-symbols-outlined">chat</span>
          </div>
          <div
            className="ed-social-btn"
            onClick={handleMailClick}
            style={{ cursor: "pointer" }}
          >
            <span className="material-symbols-outlined">mail</span>
          </div>
        </div>
      </footer>

      {/* ENQUIRY POPUP */}
      {showEnquiryPopup && (
        <div className="ed-popup-overlay" onClick={handleClosePopup}>
          <div
            className="ed-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ed-popup-close" onClick={handleClosePopup}>
              ×
            </button>
            <h2 className="ed-popup-title">Ren Enquiry</h2>
            <p className="ed-popup-subtitle">
              Get help choosing the right Renault Triber rental and confirm your
              dates.
            </p>
            <div className="ed-popup-buttons">
              <button
                className="ed-popup-btn ed-popup-btn-call"
                onClick={() => window.open("tel:+919498059432")}
              >
                <span className="material-symbols-outlined">call</span>
                Call 9498059432
              </button>
              <button
                className="ed-popup-btn ed-popup-btn-whatsapp"
                onClick={handleWhatsAppBookingClick}
              >
                <span className="material-symbols-outlined">chat</span>
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
