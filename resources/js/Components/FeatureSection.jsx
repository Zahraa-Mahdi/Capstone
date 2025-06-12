import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import './FeaturesSection.css';
import { useInView } from 'react-intersection-observer';

const stats = [
  { value: 210000, suffix: '+', label: 'Students enrolled /year', className: 'yellow' },
  { value: 100, suffix: '+', label: 'Universities and Institues profiles', className: 'orange' },
  { value: 70, suffix: ' Million USD', label: 'In scholarship value', className: 'teal' },
  { value: 100, suffix: ' Hours', label: 'of time savings', className: 'fuchsia' },
];


const StatCard = ({ value, suffix, label, className, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.2 }}
    >
      <div className={`stat-box ${className}`}>
        <span className="stat-number">
          {inView ? <CountUp end={value} duration={2} /> : '0'}{suffix}
        </span>
      </div>
      <p className="stat-label">{label}</p>
    </motion.div>
  );
};

const FeatureSection = () => {
  return (
    <section className="feature-section">
      <div className="feature-image-container">
        <img src="./about1.gif" alt="Decorative background" className="background-image" />
        
        <div className="feature-overlay-content">
          <h2 className="feature-title">
            
          </h2>
          <div className="stat-grid">
            {stats.map((stat, idx) => (
              <StatCard key={idx} index={idx} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
