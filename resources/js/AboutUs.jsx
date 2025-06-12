import React from 'react';
import './AboutUs.css';
import LottieAnimation from './components/LottieAnimation';
import Home1 from './animations/Home1.json';
import FeaturesSection from './components/FeatureSection';
import Profiles from './Components/Enrollment';

const AboutUs = () => (
  <div className="Container">
    <div className="about-container">
      <div className="about-content">
        <div className="text-section">
          <h1 className="hero-heading">Welcome to UniCity</h1>
          <p className="hero-paragraph">
            Our website is dedicated to providing students and parents with comprehensive information about universities across Lebanon.
            Whether you're exploring options for higher education, looking for specific programs, or just curious about the different campuses,
            we are here to make your journey easier.
          </p>
        </div>
        <div className="animation-section">
          <LottieAnimation animationData={Home1} />
        </div>
      </div>
    </div>
    
    <div className="container-enrollment">
        <Profiles />
    </div>
    <div data-aos="fade-up" data-aos-delay="400"><FeaturesSection /></div>

  </div>
);

export default AboutUs;
