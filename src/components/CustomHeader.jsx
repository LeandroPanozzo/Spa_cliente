import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate
import './Header.css'; // Asegúrate de crear y enlazar un archivo CSS
import { useAuth } from './AuthContext'; // Importa el hook de autenticación
import logo from '../pages/img/logo.jpeg';

export function CustomHeader() {
  const { isAuthenticated, logout, user } = useAuth(); // Obtén el estado de autenticación y el usuario
  const navigate = useNavigate(); // Crea una instancia de navigate

  const handleLogout = () => {
    logout(); // Llama a la función de cierre de sesión
    navigate("/"); // Redirige a la página principal
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <div className="logo"> 
            Sentirse Bien
            <img src={logo} alt="Logo" />
          </div>
        </div>

        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <span className="logo">Bienvenido, {user ? user.username : 'Cargando...'}</span>
              <button onClick={handleLogout}>Cerrar sesión</button> {/* Cambiado para usar handleLogout */}
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </nav>

      {/* Sección de enlaces en un nivel más bajo */}
      <div className="section-links">
        <div className="nav-center">
          {/* Puedes agregar enlaces aquí si es necesario */}
        </div>
      </div>
    </header>
  );
}
