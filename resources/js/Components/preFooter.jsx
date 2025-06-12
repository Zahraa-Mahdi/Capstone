import React from 'react';
import LottieAnimation from './LottieAnimation'; 
import footer from '../animations/footer.json'; 
import './PreFooter.css'; 
import { TypeAnimation } from 'react-type-animation';


const PreFooter = () => {
  return (
    <div className="pre-footer-section">
        <p className="intro-text">Get Ready to{' '}
        <TypeAnimation
        sequence={[
          ' search', // Types "Us!"
          1500,   // Waits 1.5s
          '',     // Deletes
          500,
          ' filter',
          1500,
          '', 
          500,
          ' discover',
          1500
        ]}
        wrapper="span"
        cursor={true}
        repeat={Infinity}
        style={{ display: 'inline-block', color: '#E03268' }}
      />Your University With<br/>a Platform That Thinks Like You Do
      </p>
      <button className="start-button">Start Now</button>
    <div className="lottie-wrapper">
        <LottieAnimation animationData={footer} className="pre-footer-lottie" />
    </div>
      
    </div>
  );
};

export default PreFooter;
