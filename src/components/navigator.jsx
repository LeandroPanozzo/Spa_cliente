//navigator.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Navigator.css';
import { useAuth } from "./AuthContext";

export function Navigator() {
  const [isOpen, setIsOpen] = useState(false);
  const {isAuthenticated, logout} = useAuth(); 
  

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="nav-left">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div>
          <h1 className="text-center">Sentirse Bien</h1>
        </div>
        <div className="content-section">
          <h3>Elementos</h3>
          <div className="button-group">
            <button className="list-group-item">
              <Link to="/contact">Contactarse</Link>
            </button>
            <button className="list-group-item">
              <Link to="/announcements">Anuncios</Link>
            </button>
            <button className="list-group-item">
              <Link to="/services">Servicios</Link>
            </button>
            {isAuthenticated &&
            <button className="list-group-item">
              <Link to="/appointments">Turnos</Link>
            </button>
            }
            <button className="list-group-item">
              <Link to="/commentsList">Comentarios</Link>
            </button>
            <button className="list-group-item">
              <Link to="/Job">Empleo</Link>
            </button>
            <button className="list-group-item">
              <Link to="/others">Otros</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
