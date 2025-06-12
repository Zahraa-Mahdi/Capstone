// Universities.jsx (with plain CSS classes instead of Tailwind)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Universities.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import FavoriteButton from '../Components/FavoriteButton';

const Universities = () => {
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState({
    text: '',
    major: '',
    location: '',
    certificate: ''
  });
  const [allLocations, setAllLocations] = useState([]);
  const [allMajors, setAllMajors] = useState([]);
  const [allCertificates, setAllCertificates] = useState(['BS', 'BA', 'BE', 'MS', 'MA', 'PhD']);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 9
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery.text) params.append('search', searchQuery.text);
        if (searchQuery.major) params.append('major', searchQuery.major);
        if (searchQuery.location) params.append('location', searchQuery.location);
        if (searchQuery.certificate) params.append('certificate', searchQuery.certificate);

        const response = await axios.get(`/api/universities?${params.toString()}`);

        if (response.data.success) {
          const { universities, majors, locations } = response.data.data;
          setUniversities(universities.data || []);
          setFilteredUniversities(universities.data || []);
          setPagination({
            currentPage: universities.current_page || 1,
            lastPage: universities.last_page || 1,
            total: universities.total || 0,
            perPage: universities.per_page || 9
          });

          // Set majors and locations from API response
          setAllMajors(majors || []);
          setAllLocations(locations || []);
        }
        
        // Check if user is admin
        const userData = JSON.parse(localStorage.getItem('user'));
        setIsAdmin(userData?.role === 'admin');
      } catch (error) {
        console.error("API Error:", error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  const fetchPage = async (page) => {
    setLoading(true);
    setError(null);
    
    const controller = new AbortController();
    
    try {
      const params = new URLSearchParams({ page });
      if (searchQuery.text) params.append('search', searchQuery.text);
      if (searchQuery.major) params.append('major', searchQuery.major);
      if (searchQuery.location) params.append('location', searchQuery.location);
      if (searchQuery.certificate) params.append('certificate', searchQuery.certificate);
      
      const response = await axios.get(`/api/universities?${params.toString()}`, {
        signal: controller.signal
      });
      
      if (response?.data?.success) {
        const { universities } = response.data.data;
        setUniversities(universities.data || []);
        setFilteredUniversities(universities.data || []);
        setPagination({
          currentPage: universities.current_page || 1,
          lastPage: universities.last_page || 1,
          total: universities.total || 0,
          perPage: universities.per_page || 9
        });
      } else {
        setError(response?.data?.message || 'Failed to load universities');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was aborted, do nothing
        return;
      }
      console.error('API Error:', error);
      setError(error.response?.data?.message || 'Failed to load universities');
    } finally {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchPage(page);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    // The useEffect will trigger the search since we added searchQuery as a dependency
  };

  const handleReset = () => {
    setSearchQuery({
      text: '',
      major: '',
      location: '',
      certificate: ''
    });
    // The useEffect will trigger and fetch all universities
  };

  const handleDelete = async (code) => {
    if (!window.confirm('Are you sure you want to delete this university?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/universities/${code}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUniversities(universities.filter(uni => uni.code !== code));
    } catch (err) {
      setError('Failed to delete university');
      console.error('Error:', err);
    }
  };

  const handleViewDetails = (code) => {
    // Reset any existing errors before navigation
    setError(null);
    navigate(`/universities/${code}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="university-page">
      <h1 className="title" data-aos="fade-down">Universities</h1>

      <div className="search-block" data-aos="fade-up" data-aos-delay="200">
        <form onSubmit={handleSearch} className="filters">
          <div className="search-group">
            <input
              type="text"
              name="text"
              value={searchQuery.text}
              onChange={handleChange}
              placeholder="Search universities..."
              className="search-input"
            />
          </div>
          <div className="filters">
            <select name="major" value={searchQuery.major} onChange={handleChange} className="filter-select">
              <option value="">All Majors</option>
              {allMajors.map((major, index) => (
                <option key={`major-${major}-${index}`} value={major}>
                  {major}
                </option>
              ))}
            </select>

            <select name="location" value={searchQuery.location} onChange={handleChange} className="filter-select">
              <option value="">All Locations</option>
              {allLocations.map((location, index) => (
                <option key={`location-${location}-${index}`} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <select name="certificate" value={searchQuery.certificate} onChange={handleChange} className="filter-select">
              <option value="">All Certificates</option>
              {allCertificates.map((cert, index) => (
                <option key={`cert-${cert}-${index}`} value={cert}>{cert}</option>
              ))}
            </select>
            <div className="button-group">
              <button type="submit" className="search-button">
                <i className="fas fa-search"></i>
                Search
              </button>
              <button type="button" onClick={handleReset} className="reset-button">
                <i className="fas fa-sync-alt"></i>
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="university-grid">
        {filteredUniversities.length === 0 ? (
          <p className="no-results" data-aos="fade-up">No universities found.</p>
        ) : (
          filteredUniversities.map((uni, index) => (
            <div 
              className="university-card" 
              key={uni.code}
              data-aos="fade-up"
              data-aos-delay={200 + (index % 3) * 100}
            >
              <img
                src={`/images/universities/${uni.image}`}
                alt={`${uni.name} logo`}
                className="university-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/university-default.png';
                }}
              />
              <h2 className="university-name">{uni.name}</h2>

              <div className="university-info">
                {uni.addresses && uni.addresses.length > 0 && (
                  <div className="location">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{uni.addresses[0]}</span>
                  </div>
                )}

                {uni.website && (
                  <div className="website">
                    <i className="fas fa-globe"></i>
                    <a href={uni.website} target="_blank" rel="noopener noreferrer">
                      {uni.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="card-buttons">
                <button onClick={() => handleViewDetails(uni.code)}>View Details</button>
                <FavoriteButton 
                  universityId={uni.code}
                  isAuthenticated={isAuthenticated}
                />
                {isAdmin && (
                  <>
                    <Link 
                      to={`/admin/universities/${uni.code}/edit`}
                      className="edit-button"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(uni.code)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.lastPage > 1 && (
  <div className="pagination" data-aos="fade-up">
    <button
      onClick={() => handlePageChange(pagination.currentPage - 1)}
      disabled={pagination.currentPage === 1}
      className="pagination-button"
    >
      Previous
    </button>

    {[...Array(pagination.lastPage)].map((_, index) => (
      <button
        key={index + 1}
        onClick={() => handlePageChange(index + 1)}
        className={`pagination-button ${pagination.currentPage === index + 1 ? 'active' : ''}`}
      >
        {index + 1}
      </button>
    ))}

    <button
      onClick={() => handlePageChange(pagination.currentPage + 1)}
      disabled={pagination.currentPage === pagination.lastPage}
      className="pagination-button"
    >
      Next
    </button>
  </div>
)}

    </div>
  );
};

export default Universities;
