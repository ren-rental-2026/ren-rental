import { useState, useEffect, useRef } from "react";
import "./home.scss";
import car_full_image from "../../../public/images/car_full_image.png";
import front_view_tribber from "../../../public/images/front-view-tribber.jpg";

const NAV_LINKS = ["Fleet", "Experience", "Packages", "Enquiry"];

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.5a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.67.15-.198.297-.766.967-.94 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.373-.025-.522-.075-.148-.67-1.612-.916-2.206-.242-.579-.487-.5-.67-.51-.173-.007-.373-.009-.572-.009-.198 0-.52.074-.793.373-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.883 1.213 3.082.149.198 2.095 3.2 5.076 4.487.709.306 1.26.488 1.691.624.71.226 1.357.194 1.868.118.57-.085 1.758-.719 2.006-1.414.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18.18A8.18 8.18 0 113.82 12 8.193 8.193 0 0112 20.18z" />
  </svg>
);

const BENTO_CARDS = [
  {
    alt: "Triber Interior",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_YOjmVSz7jK6piMO2X3gBMRszVlLDkhd3toE5qLl1f9Obne7d0ixQA0OuQwCbJm2QrfIj80xC_WcXmukLQgWVD22yJSq9U4rIlr8DUz6YH6sucmfc699Vqm1ANed1bvHICRqgQS-gCb2lpYYps4mvrzIeMhe3V0T5pAdGq_hRf427dJXN5sVCKcE3_k6uNuMBGO2UfZZ5GT7pN39rMSe2J0Ob0j62hHvfl8N13D_NwSH5b7rS9OpDzIeVPGh7m4tbjRWVT2kGp5iu",
    tag: "ROOM TO BREATHE",
    title: "Spacious 7 Seater",
    size: "large",
  },
  {
    alt: "Infotainment Screen",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVhJUg0OuFstbOpVRgPmr9FTAXbjfuA1tO40jAUPtfZcBdttqOSpT2HA6Qof0bdLLbAJkn3yvpCsQC47QDwRMYb_SyRSWT0JtgwiwcPnBXcimQnOGgEmo5-DqN4gkMc9si2jIb2rmSNPK_V52s92qB45-3Aw24zYB5ZhRoicUMeONuTBcFm3hbRT-7P5bWhpw1Dbto24KcjPwfINyDI0aDv1Sp2HLgIEEvqo_W5o_aNuWF8gAh1jxFvN96LsqhvKocdXlP3uw_LyVH",
    tag: "Technology",
    title: "Touchscreen Infotainment",
    size: "vertical",
  },
  {
    alt: "Climate Control",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9uiviPwfbt_Mfeg5k873BBVGqMvSApMdrm0E8pacudXe2yus7Akhgbhs--1lVW_Ek21RLqRzqorllm69dR2tahG4LodEVRTRcQsznaxK1zHnfDmGwcknDRNa4vJSZw4kLFNdwitF4fzW3C8Warn512KkAGtR_ITiD-DUksbr5ayWPTnJWc4Lb7gcpY39HAxwJutmVJ8n7FVuOyq3X_yu_v3jfULWO0em28IVJgdCkAf-EVPZrhl0pSJjPHUdC1R2-Hp_N1eIHQGdD",
    title: "Convenience",
    tag: "Climate Control",
    size: "small",
  },
  {
    alt: "Triber Boot Space",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ507g742oNLui_paoZfgrn2HRcbVZ0U9MhD920FgWmJ5Igq4f9nrYSW259j8iSliVn76tCR10AtuS3QzHwAfHUEDA9QXsBqY_nhd1jB2-2O1MdD8BdHzKVEy95ECUD0yAm5EVdTHBA4oEqBO_QAk_lgUriJ8J0aSVeuxqzEvld5Q1Cw6KxSHXTfRx2MbObMKWnmVNSLGmkrDvsvu9wYuy-Fxvh2jhyiB0Rl8R5Hcbl5omUittTnMcvaqwAU4-i6qQSGKIfE6il06O",
    tag: "Versatility",
    title: "625L Flexible Boot Space",
    size: "medium",
  },
];

const POLICY_NOTES = [
  {
    icon: "local_gas_station",
    text: "Fuel cost not included. We follow a Full-to-Full fuel policy.",
  },
  {
    icon: "person",
    text: "Professional drivers available at additional cost.",
  },
  {
    icon: "toll",
    text: "Toll charges, Interstate tax, and e-pass charges are excluded.",
  },
];

const PLANS = [
  {
    type: "Basic Drive",
    subtitle: "Perfect for Short City Trips",
    price: "₹2500",
    unit: "/ DAY",
    features: [
      "250 KM Included",
      "Free cancellation",
      "Insurance included",
      "Doorstep Delivery & Pickup",
      "Extra KM @ ₹10/KM (Up to 300 KM)",
    ],
    featured: false,
    icon: "check_circle",
  },

  {
    type: "STANDARD DRIVE",
    subtitle: "Most preferred for family travel",
    price: "₹3000",
    unit: "/ DAY",
    features: [
      "300 KM Included",
      "Free cancellation",
      "Insurance included",
      "Doorstep Delivery & Pickup",
      "Extra KM @ ₹11/KM",
    ],
    featured: true,
    badge: "Most Booked",
    icon: "verified",
  },

  {
    type: "Outstation Drive",
    subtitle: "Perfect for long-distance journeys",
    price: "₹11",
    unit: "/ KM",
    features: [
      "Pay per KM",
      "Free cancellation",
      "Insurance included",
      "Doorstep Delivery & Pickup",
      "Interstate Travel Allowed",
    ],
    featured: false,
    icon: "check_circle",
  },
];

export default function Home() {
  const [activeLink, setActiveLink] = useState("Fleet");
  const [scrolled, setScrolled] = useState(false);
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);

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

  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/91${PHONE_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`,
      "_blank",
    );
  };

  const handleBookNowClick = () => {
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
        <div className="ed-logo">Ren Rental</div>
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
            <button className="ed-btn-primary" onClick={handleBookNowClick}>
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
          {BENTO_CARDS.map((card) => (
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
          {PLANS.map((plan) => (
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
                  onClick={handleBookNowClick}
                >
                  RESERVE NOW
                </button>
              ) : (
                <button className="ed-btn-select" onClick={handleBookNowClick}>
                  RESERVE NOW
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="ed-policy-notes-container">
          {POLICY_NOTES.map((note, index) => (
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
            onClick={handleWhatsAppClick}
            style={{ cursor: "pointer" }}
          >
            <WhatsAppIcon />
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
                onClick={handleWhatsAppClick}
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
