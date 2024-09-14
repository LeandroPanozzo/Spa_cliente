// Others.jsx
import React from 'react';
import './Others.css';

// Importar las imágenes
import interior1 from '../pages/img/interior1.jpg';
import interior2 from '../pages/img/interior2.jpg';
import team1 from '../pages/img/team1.jpg';
import worker1 from '../pages/img/worker1.jpg';
import exterior1 from '../pages/img/exterior1.jpg';
import worker2 from '../pages/img/worker2.jpg';
import interior3 from '../pages/img/interior3.jpg';
import team2 from '../pages/img/team2.jpg';

export function Others() {
  const images = [
    { src: interior1, alt: 'Sala de masajes' },
    { src: interior2, alt: 'Sala de jacuzzi' },
    { src: team1, alt: 'Equipo de terapeutas' },
    { src: worker1, alt: 'Terapeuta en acción' },
    { src: exterior1, alt: 'Jardin' },
    { src: worker2, alt: 'Nuestras herramientas' },
    { src: interior3, alt: 'Sala de espera' },
    { src: team2, alt: 'Equipo de masajistas' },
  ];

  return (
    <div className="others-page">
      <div className="content-wrapper">
        <h2 className="gallery-title">Nuestro Espacio y Equipo</h2>
        <p className="gallery-description">
          Descubre el ambiente relajante y el equipo profesional que hace de Sentirse Bien Spa un lugar único para tu bienestar.
        </p>
        <div className="image-gallery">
          {images.map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image.src} alt={image.alt} className="gallery-image" />
              <div className="image-overlay">
                <p>{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
