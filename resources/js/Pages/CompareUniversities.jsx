import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CompareUniversities.css';
import { FaUniversity, FaMoneyBillWave, FaGraduationCap } from 'react-icons/fa';

const CompareUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversities, setSelectedUniversities] = useState([null, null]);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [allMajors, setAllMajors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/universities');
        if (response.data.success) {
          const { universities, majors } = response.data.data;
          setUniversities(universities.data || []);
          setAllMajors(majors || []);
        }
      } catch (error) {
        setError('Failed to load universities');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter universities based on selected major
  const getAvailableUniversities = (selectedIndex) => {
    if (!selectedMajor) return universities;

    return universities.filter(uni => {
      // Skip the university that's already selected in the other slot
      const otherIndex = selectedIndex === 0 ? 1 : 0;
      if (selectedUniversities[otherIndex]?.id === uni.id) return false;

      // Check if university offers the selected major
      return uni.faculties?.some(faculty =>
        faculty.majors?.some(major => major.name === selectedMajor)
      );
    });
  };

  const handleUniversitySelect = (university, index) => {
    const newSelected = [...selectedUniversities];
    newSelected[index] = university;
    setSelectedUniversities(newSelected);
  };

  const handleMajorSelect = (major) => {
    setSelectedMajor(major);
    // Reset university selections when major changes
    setSelectedUniversities([null, null]);
  };

  if (loading) {
    return (
      <div className="compare-container">
        <div className="loading">Loading universities...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="compare-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="compare-container">
      <h1 className="compare-title">Compare Universities</h1>
      
      {/* Major Selection */}
      <div className="major-selection">
        <h3>Select a Major to Compare</h3>
        <select 
          onChange={(e) => handleMajorSelect(e.target.value)}
          value={selectedMajor}
          className="major-select"
        >
          <option value="">Choose a major...</option>
          {allMajors.map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
      </div>

      {/* University Selection */}
      <div className="selection-container">
        {[0, 1].map((index) => {
          const availableUniversities = getAvailableUniversities(index);
          
          return (
            <div key={index} className="university-selector">
              <h3>Select University {index + 1}</h3>
              <select 
                onChange={(e) => handleUniversitySelect(
                  universities.find(u => u.id === parseInt(e.target.value)),
                  index
                )}
                value={selectedUniversities[index]?.id || ''}
                disabled={selectedMajor === ''}
              >
                <option value="">Choose a university...</option>
                {availableUniversities.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Error Messages */}
      {selectedMajor === '' && (
        <div className="comparison-message">
          Please select a major to compare universities.
        </div>
      )}
      {selectedMajor !== '' && getAvailableUniversities(0).length < 2 && (
        <div className="comparison-message">
          Not enough universities offer this major for comparison.
        </div>
      )}

      {/* Comparison Table */}
      {selectedUniversities[0] && selectedUniversities[1] && (
        <div className="comparison-table">
          <div className="comparison-header">
            <div className="column">Criteria</div>
            <div className="column">{selectedUniversities[0].name}</div>
            <div className="column">{selectedUniversities[1].name}</div>
          </div>

          {/* Programs Section */}
          <div className="comparison-section">
            <div className="section-header">
              <FaGraduationCap className="section-icon" />
              <h3>Selected Major: {selectedMajor}</h3>
            </div>
            <div className="comparison-row">
              <div className="column">Faculty</div>
              <div className="column">
                {selectedUniversities[0].faculties
                  ?.find(f => f.majors?.some(m => m.name === selectedMajor))
                  ?.name || 'N/A'}
              </div>
              <div className="column">
                {selectedUniversities[1].faculties
                  ?.find(f => f.majors?.some(m => m.name === selectedMajor))
                  ?.name || 'N/A'}
              </div>
            </div>
            <div className="comparison-row">
              <div className="column">Degree</div>
              <div className="column">
                {selectedUniversities[0].faculties
                  ?.find(f => f.majors?.some(m => m.name === selectedMajor))
                  ?.majors?.find(m => m.name === selectedMajor)
                  ?.degree || 'N/A'}
              </div>
              <div className="column">
                {selectedUniversities[1].faculties
                  ?.find(f => f.majors?.some(m => m.name === selectedMajor))
                  ?.majors?.find(m => m.name === selectedMajor)
                  ?.degree || 'N/A'}
              </div>
            </div>
          </div>

          {/* General Information */}
          <div className="comparison-section">
            <div className="section-header">
              <FaUniversity className="section-icon" />
              <h3>General Information</h3>
            </div>
            <div className="comparison-row">
              <div className="column">Location</div>
              <div className="column">
                {selectedUniversities[0].addresses?.[0] || 'N/A'}
              </div>
              <div className="column">
                {selectedUniversities[1].addresses?.[0] || 'N/A'}
              </div>
            </div>
            <div className="comparison-row">
              <div className="column">Website</div>
              <div className="column">
                {selectedUniversities[0].website ? (
                  <a href={selectedUniversities[0].website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                ) : 'N/A'}
              </div>
              <div className="column">
                {selectedUniversities[1].website ? (
                  <a href={selectedUniversities[1].website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                ) : 'N/A'}
              </div>
            </div>
          </div>

          {/* Admission Requirements */}
          <div className="comparison-section">
            <div className="section-header">
              <FaGraduationCap className="section-icon" />
              <h3>Admission Requirements</h3>
            </div>
            <div className="comparison-row">
              <div className="column">Language Requirements</div>
              <div className="column">
                {selectedUniversities[0].admission_requirements?.undergraduate?.language_requirements ? (
                  <ul>
                    {Object.entries(selectedUniversities[0].admission_requirements.undergraduate.language_requirements).map(([test, requirement]) => (
                      <li key={test}>{test}: {requirement}</li>
                    ))}
                  </ul>
                ) : 'N/A'}
              </div>
              <div className="column">
                {selectedUniversities[1].admission_requirements?.undergraduate?.language_requirements ? (
                  <ul>
                    {Object.entries(selectedUniversities[1].admission_requirements.undergraduate.language_requirements).map(([test, requirement]) => (
                      <li key={test}>{test}: {requirement}</li>
                    ))}
                  </ul>
                ) : 'N/A'}
              </div>
            </div>
            <div className="comparison-row">
              <div className="column">Intake Periods</div>
              <div className="column">
                {selectedUniversities[0].admission_requirements?.undergraduate?.intake_periods ? (
                  <ul>
                    {Object.entries(selectedUniversities[0].admission_requirements.undergraduate.intake_periods).map(([period, date]) => (
                      <li key={period}>{period}: {date}</li>
                    ))}
                  </ul>
                ) : 'N/A'}
              </div>
              <div className="column">
                {selectedUniversities[1].admission_requirements?.undergraduate?.intake_periods ? (
                  <ul>
                    {Object.entries(selectedUniversities[1].admission_requirements.undergraduate.intake_periods).map(([period, date]) => (
                      <li key={period}>{period}: {date}</li>
                    ))}
                  </ul>
                ) : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareUniversities; 