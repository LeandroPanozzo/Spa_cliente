import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './services.css';
import fisioterapiaImage from '../pages/img/fisioterapiaImage.jpg';
import masajesImage from '../pages/img/masajesImage.jpg';
import tratamientoFacialImage from '../pages/img/tratamientoFacialImage.jpg';
import packCompletoImage from '../pages/img/packCompletoImage.jpg';

export function Services() {
  return (
    <div className="services-page">
      <div className="content-wrapper">
        <h1 className="services-title">Nuestros Servicios</h1>
        <p className="services-description">
          En Sentirse Bien Spa, ofrecemos una amplia gama de servicios diseñados para rejuvenecer su cuerpo y mente. 
          Nuestro equipo de expertos está dedicado a proporcionar una experiencia relajante y revitalizante.
        </p>

        <div className="services-grid">
          <ServiceCard 
            image={fisioterapiaImage}
            title="Fisioterapia"
            description="Nuestros fisioterapeutas expertos utilizan técnicas avanzadas para aliviar el dolor, mejorar la movilidad y promover la curación."
            price="Desde $60 por sesión"
          />
          <ServiceCard 
            image={masajesImage}
            title="Masajes"
            description="Disfrute de una variedad de técnicas de masaje, desde relajantes hasta terapéuticos, para aliviar la tensión y el estrés."
            price="Desde $80 por 60 minutos"
          />
          <ServiceCard 
            image={tratamientoFacialImage}
            title="Tratamiento Facial"
            description="Rejuvenezca su piel con nuestros tratamientos faciales personalizados, utilizando productos de alta calidad."
            price="Desde $90 por tratamiento"
          />
          <ServiceCard 
            image={packCompletoImage}
            title="Pack Completo"
            description="Experimente lo mejor de nuestro spa con un paquete completo que incluye masaje, tratamiento facial y más."
            price="Desde $200 por paquete"
          />
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ image, title, description, price }) {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleBookNowClick = () => {
    navigate('/appointments'); // Redirige a /appointments
  };

  return (
    <div className="service-card">
      <img src={image} alt={title} className="service-image" />
      <div className="service-content">
        <h2 className="service-title">{title}</h2>
        <p className="service-description">{description}</p>
        <p className="service-price">{price}</p>
        <button className="book-button" onClick={handleBookNowClick}>Reservar ahora</button>
      </div>
    </div>
  );
}
