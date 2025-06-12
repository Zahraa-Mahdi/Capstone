import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './UniversityDetails.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FavoriteButton from '../Components/FavoriteButton';

const UniversityDetails = () => {
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { code } = useParams();
  const navigate = useNavigate();

  // Function to try different image formats
  const getImageUrl = (universityCode, imageNumber) => {
    const formats = ['jpg', 'jpeg', 'png', 'webp'];
    return formats.map(format => `/images/universities/${universityCode}/${imageNumber}.${format}`);
  };

  // Update the images array to use university-specific images with multiple format support
  const getUniversityImages = (universityCode) => [
    { 
      sources: getImageUrl(universityCode, 1),
      alt: 'Campus View', 
      size: 'large' 
    },
    { 
      sources: getImageUrl(universityCode, 2),
      alt: 'Library', 
      size: 'medium' 
    },
    { 
      sources: getImageUrl(universityCode, 3),
      alt: 'Student Life', 
      size: 'medium' 
    },
    { 
      sources: getImageUrl(universityCode, 4),
      alt: 'Facilities', 
      size: 'small' 
    },
    { 
      sources: getImageUrl(universityCode, 5),
      alt: 'Sports Complex', 
      size: 'small' 
    }
  ];

  // Function to try loading different image formats
  const handleImageError = (e, sources, currentIndex = 0) => {
    if (currentIndex < sources.length - 1) {
      // Try next format
      e.target.src = sources[currentIndex + 1];
      e.target.onerror = (err) => handleImageError(err, sources, currentIndex + 1);
    } else {
      // If all formats fail, use default image
      e.target.onerror = null;
      e.target.src = '/images/university-default.png';
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });

    // Check authentication status
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authStateChanged', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authStateChanged', checkAuth);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUniversity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/universities/${code}`, {
          signal: controller.signal
        });
        
        if (!isMounted) return;

        if (response.data.success && response.data.data) {
          setUniversity(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load university details');
        }
      } catch (err) {
        if (!isMounted) return;
        
        if (err.name === 'AbortError') {
          // Request was aborted, do nothing
          return;
        }

        console.error('Error fetching university:', err);
        if (err.response?.status === 404) {
          setError('University not found');
        } else {
          setError(err.response?.data?.message || 'An error occurred while loading university details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (code) {
      fetchUniversity();
    } else {
      setError('No university code provided');
      setLoading(false);
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [code]);

  const formatContactNumbers = (contactNumbers) => {
    if (!contactNumbers) return [];
    
    // If it's a string, try to parse it as JSON
    if (typeof contactNumbers === 'string') {
      try {
        return JSON.parse(contactNumbers);
      } catch (e) {
        return [contactNumbers];
      }
    }
    
    // If it's already an array, return it
    if (Array.isArray(contactNumbers)) {
      return contactNumbers;
    }
    
    // If it's a single number, wrap it in array
    return [contactNumbers];
  };

  const formatAddresses = (addresses) => {
    if (!addresses) return [];
    
    // If it's a string, try to parse it as JSON
    if (typeof addresses === 'string') {
      try {
        return JSON.parse(addresses);
      } catch (e) {
        return [addresses];
      }
    }
    
    // If it's already an array, return it
    if (Array.isArray(addresses)) {
      return addresses;
    }
    
    // If it's a single address, wrap it in array
    return [addresses];
  };

  const formatDegrees = (degrees) => {
    if (!degrees) return [];
    
    // If it's a string, try to parse it as JSON
    if (typeof degrees === 'string') {
      try {
        return JSON.parse(degrees);
      } catch (e) {
        console.error('Error parsing degrees:', e);
        return [];
      }
    }
    
    // If it's already an array, return it
    if (Array.isArray(degrees)) {
      return degrees;
    }
    
    // If it's an object, wrap it in array
    if (typeof degrees === 'object') {
      return [degrees];
    }
    
    return [];
  };

  const formatLanguageRequirements = (requirements) => {
    if (!requirements) return [];
    
    // If it's a string, try to parse it as JSON
    if (typeof requirements === 'string') {
      try {
        return Object.entries(JSON.parse(requirements));
      } catch (e) {
        console.error('Error parsing language requirements:', e);
        return [];
      }
    }
    
    // If it's already an object, convert to array of entries
    if (typeof requirements === 'object' && !Array.isArray(requirements)) {
      return Object.entries(requirements);
    }
    
    // If it's already an array of entries, return it
    if (Array.isArray(requirements)) {
      return requirements;
    }
    
    return [];
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading university details...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-content">
        <i className="fas fa-exclamation-circle"></i>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/universities')} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Back to Universities
        </button>
      </div>
    </div>
  );

  if (!university) return (
    <div className="error-container">
      <div className="error-content">
        <i className="fas fa-university"></i>
        <h2>University Not Found</h2>
        <p>The requested university could not be found.</p>
        <button onClick={() => navigate('/universities')} className="back-button">
          <i className="fas fa-arrow-left"></i>
          Back to Universities
        </button>
      </div>
    </div>
  );

  const contactNumbers = formatContactNumbers(university.contact_numbers);
  const addresses = formatAddresses(university.addresses);
  const degrees = formatDegrees(university.degrees);

  return (
    <div className="university-details-container">
      <div className="university-details">
        <div className="university-header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={() => navigate('/universities')} className="back-link">
                <i className="fas fa-arrow-left"></i>
                Back to Universities
              </button>
              <h1>{university.name}</h1>
              <div className="university-meta">
                {university.website && (
                  <a href={university.website} target="_blank" rel="noopener noreferrer" className="website-link">
                    <i className="fas fa-globe"></i>
                    Visit Website
                  </a>
                )}
                {university.email && (
                  <a href={`mailto:${university.email}`} className="email-link">
                    <i className="fas fa-envelope"></i>
                    {university.email}
                  </a>
                )}
              </div>
            </div>
            <div className="header-right">
              <FavoriteButton 
                universityId={university.code}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>

        {/* Image Gallery Section */}
        <div className="image-gallery-section">
          <div className="masonry-grid">
            {getUniversityImages(university.code).map((image, index) => (
              <div 
                key={index} 
                className={`masonry-item ${image.size}`}
                onClick={() => setSelectedImage(image.sources[0])} // Use first format as default
              >
                <img
                  src={image.sources[0]} // Try first format first
                  alt={`${university.name} - ${image.alt}`}
                  onError={(e) => handleImageError(e, image.sources)}
                />
                <div className="image-overlay">
                  <span>{image.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="image-modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content">
              <img 
                src={selectedImage} 
                alt="University"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/university-default.png';
                }}
              />
              <button className="close-button" onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}

        <div className="university-content">
          <div className="quick-info-section">
            <div className="info-card">
              <i className="fas fa-book"></i>
              <h3>Study System</h3>
              <p>{university.study_system?.study_modes?.[0] || 'Credit Hours'}</p>
            </div>
          </div>

          <div className="section contact-section">
            <h2>Contact Information</h2>
            <div className="contact-grid">
              {contactNumbers.length > 0 && (
                <div className="contact-item">
                  <h3><i className="fas fa-phone"></i> Phone Numbers</h3>
                  <ul>
                    {contactNumbers.map((number, index) => (
                      <li key={index}>{number}</li>
                    ))}
                  </ul>
                </div>
              )}
              {addresses.length > 0 && (
                <div className="contact-item">
                  <h3><i className="fas fa-map-marker-alt"></i> Addresses</h3>
                  <ul>
                    {addresses.map((address, index) => (
                      <li key={index}>{address}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {university.faculties && university.faculties.length > 0 && (
            <div className="section faculties-section">
              <h2>Faculties and Programs</h2>
              <div className="faculties-grid">
                {university.faculties.map(faculty => (
                  <div key={faculty.id} className="faculty-card">
                    <div className="faculty-header">
                      <i className="fas fa-book-reader"></i>
                      <h3>{faculty.name}</h3>
                    </div>
                    {faculty.majors && faculty.majors.length > 0 && (
                      <div className="majors-list">
                        <h4>Available Programs:</h4>
                        <ul>
                          {faculty.majors.map(major => (
                            <li key={major.id}>
                              <span className="major-name">{major.name}</span>
                              {major.degree && (
                                <span className="major-degree">
                                  <i className="fas fa-graduation-cap"></i>
                                  {major.degree}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {university.admission_requirements && (
            <div className="section requirements-section">
              <h2>Admission Requirements</h2>
              <div className="requirements-content">
                {university.admission_requirements.undergraduate && (
                  <div className="requirement-group">
                    <h3>Undergraduate Requirements</h3>
                    
                    {university.admission_requirements.undergraduate.minimum_gpa && (
                      <div className="requirement-item">
                        <h4><i className="fas fa-chart-line"></i> Minimum GPA</h4>
                        <p>{university.admission_requirements.undergraduate.minimum_gpa}</p>
                      </div>
                    )}

                    {university.admission_requirements.undergraduate.required_documents && (
                      <div className="requirement-item">
                        <h4><i className="fas fa-file-alt"></i> Required Documents</h4>
                        <ul>
                          {university.admission_requirements.undergraduate.required_documents.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {university.admission_requirements.undergraduate.language_requirements && (
                      <div className="requirement-item">
                        <h4><i className="fas fa-language"></i> Language Requirements</h4>
                        <ul>
                          {Object.entries(university.admission_requirements.undergraduate.language_requirements).map(([test, score]) => (
                            <li key={test}>
                              <strong>{test}:</strong> {typeof score === 'string' ? score : JSON.stringify(score)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {university.admission_requirements.undergraduate.intake_periods && (
                      <div className="requirement-item">
                        <h4><i className="fas fa-calendar-alt"></i> Intake Periods</h4>
                        <ul>
                          {Object.entries(university.admission_requirements.undergraduate.intake_periods).map(([period, date]) => (
                            <li key={period}>
                              <strong>{period.charAt(0).toUpperCase() + period.slice(1)}:</strong> {date}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;