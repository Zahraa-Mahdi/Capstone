import React from 'react';
import './SpringCard.css';

function SpringCard({ icon, title, description }) {
  return (
    <div className="feature-item">
      <div className="spring-card">
        <div className="icon-wrapper">{icon}</div>
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

export default SpringCard;
