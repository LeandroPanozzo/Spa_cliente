// Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import logo from '../pages/img/logo.jpeg';
import { Menu } from 'lucide-react';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/sentirseBien");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo-link">
          <div className="logo">
            Sentirse Bien
            <img src={logo} alt="Logo" />
          </div>
        </Link>
        <div className="nav-left"></div>

        <div className="nav-right">
          <button className="menu-toggle" onClick={toggleMenu}>
            <Menu size={24} />
          </button>
          <div className={`menu-items ${isMenuOpen ? 'open' : ''}`}>
            <a 
              href="https://www.mediafire.com/file/40cesbt1ce6fwgq/application-b6342982-ba26-4bc1-a6f2-9274d025ef5d.apk/file" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Descargar aplicación
            </a>
            {isAuthenticated ? (
              <button onClick={handleLogout}>Cerrar sesión</button>
            ) : (
              <>
                <Link to="/login">Iniciar sesión</Link>
                <Link to="/register">Registrarse</Link>
              </>
            )}
            
          </div>
        </div>
      </nav>

      <div className={`section-links ${isMenuOpen ? 'open' : ''}`}>
        <div className="links">
          <Link to="/">Home</Link>
          <Link to="/about">Sobre nosotros</Link>
          <Link to="/contact">Contactarse</Link>
          <Link to="/announcements">Anuncios</Link>
          <Link to="/services">Servicios</Link>
          <Link to="/commentsList">Comentarios</Link>
          <Link to="/Job">Empleo</Link>
          <Link to="/others">Otros</Link>
        </div>
      </div>
    </header>
  );
}
