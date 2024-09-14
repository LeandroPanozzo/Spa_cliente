import './TaskPag.css';
import spaImage from './img/spa_img.jpg';
import fisioterapiaImage from './img/fisioterapiaImage.jpg';
import masajesImage from './img/masajesImage.jpg';
import tratamientoFacialImage from './img/tratamientoFacialImage.jpg';
import packCompletoImage from './img/packCompletoImage.jpg';

export function TaskPag() {
    return (
        <div className="task-page">
            <div className="content-wrapper">
                <div className="hero-section">
                    <div className="texto-superpuesto">
                        <h1 className="lead">
                            HACIENDO TU VIDA MÁS CONFORTABLE
                        </h1>
                        <img
                            src={spaImage}
                            alt="Imagen Spa"
                            className="img-fluid spa-image"
                        />
                        <p className="lead">Bienvenido a nuestro oasis de relajación y belleza.</p>
                        <p className="parrafo-bienestar">Descubre nuestros servicios y comienza tu viaje hacia el bienestar.</p>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <a className="btn btn-success btn-lg" href="#" role="button">
                                Reservar ahora
                            </a>
                            <a className="btn btn-outline-info btn-lg" href="#" role="button">
                                Ver servicios
                            </a>
                        </div>
                    </div>
                </div>

                

                <div className="container">
                    <h2 className="text-center mb-4">Bienvenido a Sentirse Bien Spa</h2>
                    <p className="parrafo-bienestar">
                        Ofrecemos una variedad de tratamientos de spa para rejuvenecer tu cuerpo y mente. Nuestro equipo de expertos está
                        dedicado a proporcionar una experiencia relajante y revitalizante.
                    </p>
                    {/* Sección de video con título centrado */}
                    <div className="video-section text-center">
                    <h2 className="text-center mb-4" style={{ color: '#5ec75e' }}>Tour por el spa</h2>

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
                    <div className="row text-center servicios">
                        <div className="col-md-3 mb-4">
                            <div className="card service-card">
                                <img src={fisioterapiaImage} className="card-img-top img-fluid img-tarjeta" alt="Fisioterapia" />
                                <div className="card-body">
                                    <h5 className="card-title texto-pequeño">Fisioterapia</h5>
                                    <a href="/appointments" className="btn-footer-style">
                                        Leer más
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card service-card">
                                <img src={masajesImage} className="card-img-top img-fluid img-tarjeta" alt="Masajes" />
                                <div className="card-body">
                                    <h5 className="card-title texto-pequeño">Masajes</h5>
                                    <a href="/appointments" className="btn-footer-style">
                                        Leer más
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card service-card">
                                <img src={tratamientoFacialImage} className="card-img-top img-fluid img-tarjeta" alt="Tratamiento Facial" />
                                <div className="card-body">
                                    <h5 className="card-title texto-pequeño">Tratamiento Facial</h5>
                                    <a href="/appointments" className="btn-footer-style">
                                        Leer más
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="card service-card">
                                <img src={packCompletoImage} className="card-img-top img-fluid img-tarjeta img-tarjeta-margen" alt="Pack Completo" />
                                <div className="card-body">
                                    <h5 className="card-title texto-pequeño">Pack Completo</h5>
                                    <a href="/appointments" className="btn-footer-style">
                                        Leer más
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
