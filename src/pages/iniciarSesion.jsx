import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import { useAuth } from '../components/AuthContext';
import { ToastContainer, toast } from 'react-toastify'; // Importa ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toast

export function InicioSesion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hover, setHover] = useState(false); // Estado para hover
  const navigate = useNavigate();
  const { login } = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL; // Accede a la URL de la API desde el archivo .env

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/sentirseBien/api/v1/token/`, {
        username,
        password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      login();

      toast.success('Sesion Iniciada!');
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Credenciales inválidas');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión');
      }
    }
  };

  // Manejo de eventos para hover
  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  return (
    
    <div style={styles.container}>
      
      <h2 style={styles.title}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        {error && <p style={styles.errorText}>{error}</p>}
        <button
          type="submit"
          style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Iniciar Sesión
        </button>
      </form>
      <p style={styles.registerText}>
        ¿No te has registrado? <Link to="/register" style={styles.link}>Regístrate aquí</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    color: '#28a745', // Letra verde pastel
    marginTop: '150px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: '#fc9ba9', // Letra rosa pastel
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxSizing: 'border-box', // Para que el padding se mantenga dentro del ancho definido
    margin: '0 auto', // Centra el campo dentro del contenedor
    maxWidth: '100%', // Asegura que el input no crezca más allá de su contenedor
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745', // Verde pastel
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Efecto de transición suave
  },
  buttonHover: {
    backgroundColor: '#5cb85c', // Verde más oscuro en hover
  },
  errorText: {
    color: 'red',
  },
  registerText: {
    marginTop: '10px',
    textAlign: 'center',
    color: '#333', // Color de texto para el mensaje
  },
  link: {
    color: '#77dd77', // Verde pastel para el enlace
    textDecoration: 'none',
  },
  title: {
    textAlign: 'center', // Alinea el título al centro
    marginBottom: '20px', // Espacio abajo para separar el título del formulario
  }
};
