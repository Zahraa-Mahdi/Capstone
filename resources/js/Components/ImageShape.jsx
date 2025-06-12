import React from 'react';
import './ImageShape.css';

const ImageShape = () => {
return (
    <div className="blobs-container">
      {/* Main blob with image */}
      <div 
        className="blob main-blob"
        style={{
          '--blob-color-1': 'var(--sky-blue)',
          '--blob-color-2': 'var(--light-blue)'
        }}
      >
        
      </div>
      
      {/* Supporting blobs with opposite movements */}
      <div 
        className="blob opposite-blob-1"
        style={{
          '--blob-color-1': 'var(--yellow)',
          '--blob-color-2': 'var(--orange)'
        }}
      ></div>
      
      <div 
        className="blob opposite-blob-2"
        style={{
          '--blob-color-1': 'var(--lavander)',
          '--blob-color-2': 'var(--indigo)'
        }}
      >
        <img 
          src="./image.jpg" 
          alt="Content" 
          className="blob-image"
        />
      </div>
    </div>
  );
};
export default ImageShape;