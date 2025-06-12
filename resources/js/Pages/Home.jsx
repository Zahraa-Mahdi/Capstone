import React from "react";
import LottieAnimation from '../components/LottieAnimation'; 
import FeaturesSection from '../components/FeatureSection';
import Home1 from '../animations/Home1.json';
import App from '../components/IntroSection';
import PreFooter from '../components/preFooter';
import { TypeAnimation } from 'react-type-animation';
import './Home.css';
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import ImageShapes from "@/Components/ImageShape";
import { useEffect } from "react";
import AOS from 'aos';  
import 'aos/dist/aos.css';
import Reviews from '@/Components/Reviews';
import '@/Components/Reviews.css';


const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="home-container">
      <img src="grid3.gif" alt="Grid icon" className="grid-icon" />
      <div className="home-content">
        
        <div className="text-section">
          <h1 className="hero-heading">
            Your <span>Success</span> Journey Starts<br />With{' '}
            <TypeAnimation
              sequence={[
                'Us!',
                1500,
                '',
                500,
                'the Right University!',
                1500,
                '',
                500,
                'Smart Decisions!',
                1500
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              className="highlight"
              style={{ display: 'inline-block' }}
            />
          </h1>
          <p className="hero-paragraph">
            Exploring options for higher education, looking for specific programs, or just curious about the different campuses, we are here to make your journey easier.
          </p>
          <div className="cta-buttons">
            
            <button className="primary-button" onClick={() => navigate('/universities')}>Find University</button>
          </div>
        
        </div>
        

        {/* <div className="animation-section">
          <img src="./Home.png" alt="Students studying abroad" />
        </div> */}
      </div>

      {/* Existing Sections */}
    <div className="Sections">
      <section className="intro-wrapper" data-aos="fade-up">
      <App />
    </section>
    <section className="home-text-image-container" data-aos="fade-left">
      <img src="./arrow.gif" alt="Arrow pointing" className="arrow-gif" />
      <div className="text-content">
        <h1 style={{
          fontSize: '2.5rem',
          fontFamily: 'Share Tech, sans-serif',
          fontWeight: '100',
          textAlign: 'left',
          maxWidth: '430px'
        }}>
          With the Right <TypeAnimation
            sequence={['Major', 1500, '', 500, 'University', 1500, '']}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            style={{ display: 'inline-block', color: '#F76B25' }}
          />,<br /> You're Not Just Studying—You're Building Your Future Empire.
        </h1>
      </div>
      <div className="image-content">
        <ImageShapes />
      </div>
    </section>
    
    <div className="container-reviews">
    <Reviews />
    </div>   
    </div> 
  </div>
  );
}
export default Home;