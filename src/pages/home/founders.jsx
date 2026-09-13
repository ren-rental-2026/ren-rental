import { useState } from "react";
import "./founders.scss";
import foundersData from "../../data/founders.json";

export default function Founders() {
  const { title, subtitle, founders } = foundersData;

  const handleCallDesk = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone.replace("+", "")}`, "_blank");
  };

  const handleInstagram = (instagram) => {
    window.open(`https://instagram.com/${instagram}`, "_blank");
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <section className="ed-founder-section">
      {/* SECTION HEADER */}
      <div className="ed-section-header">
        <div className="ed-tag-badge">
          <span className="material-symbols-outlined">workspace_premium</span>
          <span>EXECUTIVE BOARD & FOUNDING GOVERNANCE</span>
        </div>
        <h2 className="ed-founders-title">
          Architects of <span className="ed-text-gradient">Exclusivity.</span>
        </h2>
        <p className="ed-founders-subtitle">{subtitle}</p>
      </div>

      {/* FOUNDERS GRID */}
      <div className="ed-founders-grid">
        {founders.map((founder) => (
          <div key={founder.id} className="ed-founder-card">
            {/* TOP GRADIENT BAR */}
            <div className="ed-card-top-bar"></div>

            {/* HEADER SECTION */}
            <div className="ed-founder-header">
              <div className="ed-founder-badge">
                <span className="material-symbols-outlined">verified</span>
                <span>EXECUTIVE BOARD</span>
              </div>
              <div className="ed-founder-status">
                <span className="ed-status-dot"></span>
                <span>ACTIVE</span>
              </div>
            </div>

            {/* FOUNDER INFO */}
            <div className="ed-founder-info">
              <div className="ed-founder-avatar">
                {founder.image ? (
                  <img src={founder.image} alt={founder.name} />
                ) : (
                  <div className="ed-avatar-icon">
                    <span className="material-symbols-outlined">
                      {founder.icon}
                    </span>
                  </div>
                )}
              </div>
              <div className="ed-founder-details">
                <div className="ed-founder-role">{founder.role}</div>
                <h3 className="ed-founder-name">{founder.name}</h3>
                <p className="ed-founder-subtitle-text">{founder.subtitle}</p>
              </div>
            </div>

            {/* QUOTE SECTION */}
            <div className="ed-founder-quote">
              <p>"{founder.quote}"</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="ed-founder-actions">
              <button
                className="ed-btn-call"
                onClick={() => handleCallDesk(founder.phone)}
              >
                <span className="material-symbols-outlined">call</span>
                CALL
              </button>
              <button
                className="ed-btn-social ed-btn-whatsapp"
                onClick={() => handleWhatsApp(founder.whatsapp)}
              >
                <span className="material-symbols-outlined">chat</span>
                WhatsApp
              </button>
              <button
                className="ed-btn-social ed-btn-instagram"
                onClick={() => handleInstagram(founder.instagram)}
                title="Instagram"
              >
                <span className="material-symbols-outlined">photo_camera</span>
              </button>
              <button
                className="ed-btn-social ed-btn-instagram"
                onClick={() => handleEmail(founder.email)}
                title="Email"
              >
                <span className="material-symbols-outlined">mail</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
