import React from 'react';
import './TaskPag.css';
import spaImage from './img/spa_img.jpg'; 
import fisioterapiaImage from './img/fisioterapiaImage.jpg';
import masajesImage from './img/masajesImage.jpg';
import tratamientoFacialImage from './img/tratamientoFacialImage.jpg';
import packCompletoImage from './img/packCompletoImage.jpg';
import relajacionImage from './img/relajacion_img.jpg';

export function HomeLoged() {
    return (
        <div>
            <div >
                {/* Main content */}
                <div className="container">
                    {/* Section with image background */}
                    
                    <div 
  className="image-section" 
  style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${spaImage})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    height: '100vh', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'column'
  }}
>
  <h2 
    className="text-center mb-4 text-overlay" 
    style={{
      fontSize: '3rem', 
      color: '#fff', 
      textShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
    }}
  >
    Bienvenido a Sentirse Bien Spa
  </h2>
  <p 
    className="parrafo-bienestar text-overlay" 
    style={{
      fontSize: '1.5rem', 
      color: '#fff', 
      textShadow: '0 0 5px rgba(0, 0, 0, 0.5)', 
      maxWidth: '600px', 
      textAlign: 'center'
    }}
  >
    Ofrecemos una variedad de tratamientos de spa para rejuvenecer tu cuerpo y mente. Nuestro equipo de expertos está dedicado a proporcionar una experiencia relajante y revitalizante.
  </p>
</div>

                    {/* Contenedor con imagen de fondo para video y tarjetas */}
                    <div 
  className="relajacion-section" 
  style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${relajacionImage})`, 
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    padding: '50px'
  }}
>
  {/* Video tour section */}
  <div className="video-section text-center" style={{ marginTop: '20px'}}>
    <h2 className="text-center mb-4" style={{ color: '#ffffff' }}>Tour por el spa</h2>
    <div className="video-container">
      <iframe 
        width="560" 
        height="315" 
        src="https://www.youtube.com/embed/0iYHohOXMNs" 
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen>
      </iframe>
    </div>
  </div>

  {/* Services section with cards */}
  <div className="row text-center servicios" style={{ marginTop: '20px'}}>
    {[ 
      { title: 'Fisioterapia', image: fisioterapiaImage },
      { title: 'Masajes', image: masajesImage },
      { title: 'Tratamiento Facial', image: tratamientoFacialImage },
      { title: 'Pack Completo', image: packCompletoImage }
    ].map(service => (
      <div className="col-md-3 mb-4" key={service.title}>
        <div className="card service-card">
          <img src={service.image} className="card-img-top img-fluid img-tarjeta" alt={service.title} />
          <div className="card-body">
            <h5 className="card-title texto-pequeño">{service.title}</h5>
            <a href="/appointments" className="btn-footer-style">Leer más</a>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
                </div>
            </div>
        </div>
    );
}