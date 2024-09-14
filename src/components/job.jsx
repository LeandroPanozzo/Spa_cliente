import React from 'react';
import './Job.css';

export function Job() {
    return (
        <div className="job-page">
            <div className="content-wrapper">
                <div className="hero-section">
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1 className="lead">ÚNETE A NUESTRO EQUIPO</h1>
                        <p className="parrafo-bienestar">Estamos buscando profesionales apasionados para unirse a nuestra clínica de masajes.</p>
                    </div>
                </div>
                <div className="container">
                    <h2 className="text-center mb-4">Oportunidades de Empleo</h2>
                    <div className="job-description">
                        <h3>Aptitudes y Estudios Requeridos:</h3>
                        <ul>
                            <li>Título en Fisioterapia o Masoterapia</li>
                            <li>Experiencia mínima de 2 años en masajes terapéuticos</li>
                            <li>Conocimiento en técnicas de relajación y rehabilitación</li>
                            <li>Excelentes habilidades de comunicación y atención al cliente</li>
                            <li>Capacidad para trabajar en equipo</li>
                        </ul>
                    </div>
                    <div className="application-section">
                        <h3>¿Interesado en unirte a nosotros?</h3>
                        <p>Envía tu currículum a: <a href="mailto:empleos@clinicademasajes.com">empleos@clinicademasajes.com</a></p>
                    </div>
                    <div className="button-container">
                        <a href="mailto:empleos@clinicademasajes.com" className="btn-apply">Enviar CV</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
