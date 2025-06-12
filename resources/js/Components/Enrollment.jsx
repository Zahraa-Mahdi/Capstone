import React from 'react';
import './Enrollment.css';
import { useEffect, useRef, useState } from 'react';

const enrollmentData = [
  {
    title: "Find the right course for you",
    text: "Our course matching tool features thousands of programmes and uses your personal study preferences to find the right course for you.",
    imgSrc: "./1.gif",
    link: "/universities",
    linkText: "Find your course"
  },
  {
    title: "Easily compare universities with QS rankings",
    text: "Filter our rankings by region or subject to compare university performance in factors that matter to you including reputation, employability and sustainability.",
    imgSrc: "./2.gif",
    link: "/compare",
    linkText: "Compare universities"
  },
  {
    title: "Need more advice on where to study?",
    text: "Learn more about student experiences at universities in the world's most incredible cities and get advice on visas, finding accommodation and fun things to do once you've arrived.",
    imgSrc: "./3.gif",
    link: "#",
    linkText: "Get study advice"
  }
];

const Enrollment = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressHeight, setProgressHeight] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;

      // Calculate how much of the container has been scrolled through
      const scrolledPastContainer = window.scrollY - (container.offsetTop - windowHeight);
      const totalScrollableDistance = containerHeight + windowHeight;
      
      // Calculate progress percentage
      const progress = (scrolledPastContainer / totalScrollableDistance) * 100;
      const clampedProgress = Math.min(Math.max(progress, 0), 100);
      setProgressHeight(clampedProgress);

      // Update active section based on progress
      const sections = container.querySelectorAll('.section');
      const sectionHeight = totalScrollableDistance / sections.length;
      const currentSectionIndex = Math.floor(scrolledPastContainer / sectionHeight);
      
      if (currentSectionIndex >= 0 && currentSectionIndex < sections.length) {
        setActiveIndex(currentSectionIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index) => {
    const section = containerRef.current.querySelectorAll('.section')[index];
    if (section) {
      const offset = 20;
      const targetScroll = section.offsetTop - offset;
      
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="enrollment-container" ref={containerRef}>
      <div className="enrollment-header">
        <h2>How we can support you</h2>
        <p className="subtitle">
          We're here to support you through all stages of the university journey; whether it's researching institutions, navigating admissions.
        </p>
      </div>
      
      <div className="enrollment-sections">
        <div className="progress-tracker">
          <div className="progress-line">
            <div 
              className="progress-fill" 
              style={{ height: `${progressHeight}%` }}
            ></div>
          </div>
          
          {enrollmentData.map((_, index) => (
            <div
              key={index}
              className={`progress-marker ${index === activeIndex ? 'active' : ''}`}
              onClick={() => scrollToSection(index)}
            />
          ))}
        </div>

        <div className="sections-wrapper">
          {enrollmentData.map((section, index) => (
            <div className="section-enrollment" key={index}>
              <div className="section-content">
                <div className="section-image">
                  <img src={section.imgSrc} alt="" loading="lazy" />
                </div>
                <div className="section-text">
                  <h3>{section.title}</h3>
                  <p>{section.text}</p>
                  <a href={section.link} className="section-link">
                    {section.linkText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Enrollment;