import React from 'react';
import './About.css';
import teamImage from './img/team_image.jpg';
import spaInteriorImage from './img/spa_interior.jpg';

export function About() {
  return (
    <div className="about-page">
      {/* Hero Section 1 */}
      <div 
        className="hero-image-container" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${spaInteriorImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          height: '100vh', 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'column',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="texto-superpuesto">
          <h1 className="lead text-center">
            CONOZCA NUESTRA HISTORIA
          </h1>
          <p className="lead text-center">
            Descubra la esencia de Sentirse Bien Spa
          </p>
          <p className="parrafo-bienestar text-center" style={{color: 'white'}}>
            Más de una década dedicada a su bienestar y relajación.
          </p>
        </div>
      </div>

      {/* Hero Section 2 */}
      <div 
        className="hero-image-container" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${teamImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          height: '100vh', 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          flexDirection: 'column', 
          marginTop: '20px',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="texto-superpuesto">
          <div className="container">
            <h3 className="lead text-center">
              Nuestro Equipo
            </h3>
            <p className="parrafo-bienestar text-center" style={{color: 'white'}}>
              Contamos con un equipo de profesionales altamente calificados...
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="valores-section">
        <h3 className="text-center mb-4">Nuestros Valores</h3>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="valor-card">
              <h4>Excelencia</h4>
              <p>Nos esforzamos por ofrecer el más alto estándar en todos nuestros tratamientos y servicios de masajes, asegurando una experiencia inigualable que supera las expectativas de nuestros clientes.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="valor-card">
              <h4>Bienestar Integral</h4>
              <p>Creemos en un enfoque holístico para el cuidado de nuestros clientes. Nuestros masajes no solo alivian tensiones físicas, sino que también promueven un equilibrio emocional y mental, ayudando a cada individuo a alcanzar un estado óptimo de bienestar.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="valor-card">
              <h4>Innovación</h4>
              <p>Constantemente buscamos las últimas técnicas y tratamientos en el mundo del masaje para ofrecer lo mejor a nuestros clientes. Nuestra clínica se dedica a integrar nuevas metodologías y tecnologías para proporcionar resultados efectivos y una experiencia moderna.</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="valor-card">
              <h4>Atención Personalizada</h4>
              <p>Entendemos que cada persona es única, por lo que ofrecemos tratamientos personalizados adaptados a las necesidades individuales de cada cliente. Nuestro equipo de terapeutas trabaja en estrecha colaboración con cada cliente para desarrollar un plan de tratamiento que se ajuste perfectamente a sus objetivos de bienestar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
