// About.jsx
import React from 'react';
import './About.css';
import teamImage from './img/team_image.jpg';
import spaInteriorImage from './img/spa_interior.jpg';

export function About() {
  return (
    <div className="about-page">
      <div className="content-wrapper">
        <div className="hero-section">
          <div className="texto-superpuesto">
            <h1 className="lead">CONOZCA NUESTRA HISTORIA</h1>
            <img
              src={spaInteriorImage}
              alt="Interior del Spa"
              className="img-fluid spa-image"
            />
            <p className="lead">Descubra la esencia de Sentirse Bien Spa</p>
            <p className="parrafo-bienestar">
              Más de una década dedicada a su bienestar y relajación.
            </p>
          </div>
        </div>

        <div className="container">
          <h2 className="text-center mb-4">Sobre Sentirse Bien Spa</h2>
          <p className="parrafo-bienestar">
            Fundado en 2010, Sentirse Bien Spa nació con la misión de proporcionar
            un oasis de tranquilidad en medio del ajetreo diario. Nuestro equipo
            de expertos terapeutas y esteticistas se dedica a ofrecer
            tratamientos personalizados que rejuvenecen cuerpo y mente.
          </p>

          <div className="row align-items-center mb-5">
            <div className="col-md-6">
              <img src={teamImage} alt="Nuestro Equipo" className="img-fluid rounded team-image" />
            </div>
            <div className="col-md-6">
              <h3 className="text-center mb-3">Nuestro Equipo</h3>
              <p className="parrafo-bienestar">
                Contamos con un equipo de profesionales altamente calificados y
                apasionados por el bienestar. Cada miembro está comprometido con
                proporcionar una experiencia excepcional y personalizada para
                cada cliente.
              </p>
            </div>
          </div>

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
      </div>
    </div>
  );
}