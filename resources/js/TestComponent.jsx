import React, { useEffect } from 'react';

function TestComponent() {
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/test')
  .then(response => response.json())
  .then(data => console.log(data.message))  // Should log "API is working!"
  .catch(error => console.error('Error:', error));

  }, []);

  return <div>Check the console for API response</div>;
}

export default TestComponent;
