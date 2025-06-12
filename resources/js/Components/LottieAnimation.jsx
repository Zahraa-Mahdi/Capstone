import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieAnimation = ({ animationData, width = '100%', maxWidth = '8000px', className = '' }) => {
  const container = useRef(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => anim.destroy();
  }, [animationData]);

  return (
    <div
      style={{ width, maxWidth }}
      ref={container}
      className={className} // Add the dynamic class here
    ></div>
  );
};

export default LottieAnimation;
