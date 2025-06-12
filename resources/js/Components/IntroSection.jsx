import React from 'react';
import './IntroSection.css';

const IntroSection = () => {
  const tools = [
    {
      title: "Find Your Perfect Fit",
      description: "Get personalized college suggestions, see your chances, and compare the costs of schools on your list.",
      image: "./Collge.jpg",
      alt: "College search screenshot",
      bgColorClass: "bg-lavander"
    },
    {
      title: "Search for Scholarships",
      description: "Browse our extensive and up-to-date database to find scholarships to help you pay for school.",
      image: "./Scholarships.jpg",
      alt: "Scholarship information",
      bgColorClass: "bg-sky-blue"
    },
    {
      title: "Discover Your Dream Career",
      description: "Take our college major quiz and explore career options and colleges offering programs you're interested in.",
      image: "./Majors.jpg",
      alt: "Major search example",
      bgColorClass: "bg-yellow"
    }
  ];

  return (
    <section className="intro-section">
      <div className="intro-container">
        <p>Tools for <span className="unique-underline">every</span> step of your journey.</p>

        <div className="tools-grid">
          {tools.map((tool, index) => (
            <a 
              href={tool.link} 
              key={index} 
              className={`tool-card-wrapper ${tool.bgColorClass}`}
            >
              <div className="tool-card">
                <div className="tool-text">
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  </div>
                  <img src={tool.image} alt={tool.alt} loading="lazy"className="tool-image"/>
                  </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
