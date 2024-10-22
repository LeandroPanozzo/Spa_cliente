import React from 'react';
import './TaskPag.css';
import { useAuth } from '../components/AuthContext'; // Importa el hook de autenticación
import spaImage from './img/spa_img.jpg'; 
import fisioterapiaImage from './img/fisioterapiaImage.jpg';
import masajesImage from './img/masajesImage.jpg';
import tratamientoFacialImage from './img/tratamientoFacialImage.jpg';
import packCompletoImage from './img/packCompletoImage.jpg';
import relajacionImage from './img/relajacion_img.jpg';
import sobreNosotrosImage from './img/sobreNosotrosNoautenticatedIMG.jpg';
import inicioImage from './img/InicioNoAutenticadoIMG.jpg';
import inicioSesionUsuarioImage from './img/InicioSecionUsuario.jpg';
import inicioSesionProfesionalImage from './img/InicioSecionProfesional.jpg';
import { Navigator }from '../components/navigator';

export function TaskPag() {
  const { isAuthenticated, isOwner, isProfessional, isSecretary } = useAuth(); // Obtén el estado de autenticación y roles
  const navigatorRef = React.useRef(); // Crear una referencia para el Navigator

  const openNavigator = () => {
    // Utiliza la referencia del Navigator para abrir la barra lateral
    if (navigatorRef.current) {
      navigatorRef.current.toggleSidebar(); // Llama a la función toggleSidebar del Navigator
    }
  };
  const renderAuthenticatedContent = () => {
    if (isOwner) {
      return (
        <>
        <div
              className="sobre-nosotros-section"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${inicioImage})`, //quiero que ocupe todo el ancho y largo
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
            
             <h2 className="text-center mb-4 text-overlay" style={{ fontSize: '3rem', color: '#fff', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}>Bienvenido, Administrador</h2>
              <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
                Como Owner, tienes el control completo sobre todas las operaciones del spa. No solo puedes gestionar a todos los 
                usuarios, controlar los servicios y obtener informes detallados, sino que también tienes acceso a herramientas 
                avanzadas para optimizar el funcionamiento de tu negocio.
              </p>
              <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
                - <strong>Gestión integral de usuarios:</strong> Administra a los profesionales, secretarias, y clientes con facilidad. 
                Asigna permisos, organiza equipos de trabajo y monitorea el desempeño.
              </p>
              <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
                - <strong>Control total de los servicios:</strong> Personaliza los servicios ofrecidos, ajusta precios y crea promociones 
                especiales. Añade nuevos tratamientos o modifica los existentes en cualquier momento.
              </p>
              {/* Botón "Empezar" para abrir el Navigator */}
            <button className="btn-footer-style" onClick={openNavigator}>
              Empezar
            </button>

            </div>
          
        </>
      );
    } else if (isProfessional) {
      return (
        <>
       <div 
        className="sobre-nosotros-section"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),url(${inicioSesionProfesionalImage}`, //quiero que ocupe todo el ancho y largo
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
        }}
      >
        <h2 className="text-center mb-4 text-overlay" style={{ fontSize: '3rem', color: '#fff', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}>Bienvenido, Profesional</h2>
        <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
          Como Profesional en Sentirse Bien Spa, tienes todas las herramientas necesarias para gestionar tu día de manera eficiente.
          Revisa tu agenda de citas, consulta los servicios que vas a prestar, y organiza tu tiempo para garantizar una atención 
          de calidad a cada cliente.
        </p>
        <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
          - <strong>Agenda y citas:</strong> Accede a tu calendario personal donde podrás ver todas las citas del día, semana o 
          mes. Gestiona cambios de última hora y mantén un control claro de tus horarios.
        </p>
        <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
          - <strong>Consulta de servicios:</strong> Visualiza los servicios que debes prestar a cada cliente, con todos los 
          detalles necesarios para brindar una atención personalizada y profesional.
        </p>
        {/* Botón "Empezar" para abrir el Navigator */}
        <button className="btn-footer-style" onClick={openNavigator}>
              Empezar
            </button>
      </div>

          
        </>
      );
    } else if (isSecretary) {
      return (
        <>
        <div
          className="sobre-nosotros-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${inicioSesionProfesionalImage}`, //quiero que ocupe todo el ancho y largo
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
          }}
        >
        <h2 className="text-center mb-4 text-overlay" style={{ fontSize: '3rem', color: '#fff', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}>Bienvenido, Secretaria</h2>
          <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
            Como Secretaria de Sentirse Bien Spa, eres una pieza clave en el funcionamiento diario del negocio. Tu responsabilidad 
            es asegurarte de que todo fluya sin problemas, manteniendo un equilibrio perfecto entre la gestión de citas y la satisfacción del cliente.
          </p>
          <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
            - <strong>Gestión de pagos:</strong> Procesa y registra los pagos de los clientes de manera eficiente. Asegúrate de que 
            todas las transacciones se realicen sin inconvenientes, manteniendo un control claro de los ingresos.
          </p>
          {/* Botón "Empezar" para abrir el Navigator */}
          <button className="btn-footer-style" onClick={openNavigator}>
              Empezar
            </button>
        </div>
          
        </>
      );
    } else {
      return (
        <>
        <div
          className="sobre-nosotros-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${inicioSesionUsuarioImage})`, //quiero que ocupe todo el ancho y largo
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
          }}
        >
        <h2 className="text-center mb-4 text-overlay" style={{ fontSize: '3rem', color: '#fff', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}>Bienvenido a Sentirse Bien Spa</h2>
          <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
            En Sentirse Bien Spa, estamos comprometidos a ofrecerte una experiencia única y revitalizante. Nuestros servicios 
            están diseñados pensando en tu bienestar físico y mental, brindándote momentos de relax y cuidado personal que te harán 
            sentir renovado.
          </p>
          <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
            - <strong>Servicios personalizados:</strong> Elige entre una variedad de tratamientos, desde masajes relajantes hasta 
            terapias especializadas. Cada sesión está adaptada a tus necesidades individuales para maximizar los beneficios.
          </p>
          {/* Botón "Empezar" para abrir el Navigator */}
          <button className="btn-footer-style" onClick={openNavigator}>
              Empezar
            </button>
        </div>
        </>
      );
    }
  };

  return (
    <div>
      <div className="container">
        {/* Mostrar contenido dependiendo de la autenticación */}
        {!isAuthenticated ? (
          <>
            {/* Contenido para usuarios no autenticados */}
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
                flexDirection: 'column',
              }}
            >
              <h2 className="text-center mb-4 text-overlay" style={{ fontSize: '3rem', color: '#fff', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)' }}>
                Bienvenido a Sentirse Bien Spa
              </h2>
              <p className="parrafo-bienestar text-overlay" style={{ fontSize: '1.5rem', color: '#fff', textShadow: '0 0 5px rgba(0, 0, 0, 0.5)', maxWidth: '600px', textAlign: 'center' }}>
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
                padding: '50px',
              }}
            >
              {/* Sección de video tour */}
              <div className="video-section text-center" style={{ marginTop: '20px' }}>
                <h2 className="text-center mb-4" style={{ color: '#ffffff' }}>Tour por el spa</h2>
                <div className="video-container">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/0iYHohOXMNs"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
  
              {/* Sección de servicios con tarjetas */}
              <div className="row text-center servicios" style={{ marginTop: '20px' }}>
                {[
                  { title: 'Fisioterapia', image: fisioterapiaImage },
                  { title: 'Masajes', image: masajesImage },
                  { title: 'Tratamiento Facial', image: tratamientoFacialImage },
                  { title: 'Pack Completo', image: packCompletoImage },
                ].map(service => (
                  <div className="col-md-3 mb-4" key={service.title}>
                    <div className="card service-card">
                      <img src={service.image} className="card-img-top img-fluid img-tarjeta" alt={service.title} />
                      <div className="card-body">
                        <h5 className="card-title texto-pequeño">{service.title}</h5>
                        <a href="/services" className="btn-footer-style">Leer más</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Nueva sección de invitación a registro */}
              <div className="registration-prompt text-center" style={{ marginTop: '40px', color: '#ffffff' }}>
                <p style={{ fontSize: '1.5rem' }}>¿Quieres tener estos beneficios? Regístrate aquí:</p>
                <a href="/register" className="btn-footer-style" style={{ padding: '10px 20px', fontSize: '1.25rem' }}>
                  Registrarse
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Contenido para usuarios autenticados */}
            <div
              className="image-section"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${inicioImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              {renderAuthenticatedContent()}
            </div>
  
            {/* Sección sobre nosotros para usuarios autenticados */}
            <div
              className="sobre-nosotros-section"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${sobreNosotrosImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <h2 style={{ color: '#fff' }}>Sobre Nosotros</h2>
              <p style={{ color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
                En Sentirse Bien Spa, nos enorgullecemos de ofrecer tratamientos que revitalizan tanto el cuerpo como la mente. Con años de experiencia en el sector, nuestros especialistas están comprometidos con tu bienestar.
              </p>
            </div>
          </>
        )}
  
        {/* Renderizar el componente Navigator y pasarle la referencia */}
        <Navigator ref={navigatorRef} />
      </div>
    </div>
  );
  
}
