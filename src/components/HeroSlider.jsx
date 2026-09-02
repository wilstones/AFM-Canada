import { useState, useEffect } from 'react';
import './HeroSlider.css';

const slides = [1, 2, 3, 4, 5, 6].map(
  (n) => `${import.meta.env.BASE_URL}hero-${n}.jpg`
);

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slider">
      {slides.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`AFM in Canada community photo ${index + 1}`}
          className={`hero-slide ${index === current ? 'active' : ''}`}
        />
      ))}
      <div className="hero-slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-slider-dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;