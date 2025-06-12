import React from 'react';
import Enrollment from '@/Components/Enrollment';
import Reviews from '@/Components/Reviews';
import Footer from '@/Components/Footer';
import '@/Components/Reviews.css';

const About = () => {
    return (
        <div className="about-page">
            <main className="main-content">
                <Enrollment />
                <Reviews />
            </main>
            <Footer />
        </div>
    );
};

export default About; 