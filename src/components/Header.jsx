import { Link } from "react-router-dom";
import './Header.css'; // Asegúrate de crear y enlazar un archivo CSS
import { useAuth } from './AuthContext'; // Importa el hook de autenticación
import logo from '../pages/img/logo.jpeg';

export function Header() {
  const { isAuthenticated, logout } = useAuth(); // Obtén el estado y la función de logout

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav-left">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="links">
            <Link to="/">Home</Link>
            <Link to="/about">Sobre nosotros</Link>
          </div>
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <button onClick={logout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Registrarse</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
