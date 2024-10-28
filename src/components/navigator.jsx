import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Link } from "react-router-dom";
import './Navigator.css';
import { useAuth } from "./AuthContext";

export const Navigator = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isOwner, isProfessional, isSecretary } = useAuth();
  
  const hamburgerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toggleSidebar: () => setIsOpen(prevState => !prevState)
  }));

  const toggleSidebar = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleOutsideClick = (event) => {
    if (isOpen && !event.target.closest('.sidebar') && !hamburgerRef.current?.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleEscKey = (event) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('mousedown', handleOutsideClick);
      
      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [isOpen, isAuthenticated]);

  // Si el usuario no está autenticado, no renderizamos nada
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="nav-left">
      <button className="hamburger" onClick={toggleSidebar} ref={hamburgerRef}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="content-section">
          <h3 className="text-center">Administración</h3>
          <div className="button-group">
            {isOwner && (
              <>
                <Link to="/clients" className="list-group-item">Listado de Usuarios</Link>
                <Link to="/clients-by-day" className="list-group-item">Clientes por Día</Link>
                <Link to="/services" className="list-group-item">Lista y Creación de Servicios</Link>
              </>
            )}
            {(isOwner || isProfessional) && (
              <Link to="/clients-by-professional" className="list-group-item">Clientes por Profesional</Link>
            )}
            {isProfessional && (
              <Link to="/appointments-by-professional" className="list-group-item">Servicios a Prestar</Link>
            )}
            {(isSecretary || isOwner) && (
              <Link to="/payments-list" className="list-group-item">Pagos</Link>
            )}
            {!isProfessional && (
              <>
                <Link to="/contact" className="list-group-item">Contactarse</Link>
                <Link to="/appointments" className="list-group-item">Turnos</Link>
              </>
            )}
            <Link to="/commentsList" className="list-group-item">Comentarios</Link>
            <Link to="/announcements" className="list-group-item">Anuncios</Link>
            <Link to="/user" className="list-group-item">Perfil</Link>
          </div>
        </div>
      </div>
    </div>
  );
});