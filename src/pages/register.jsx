import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import { useAuth } from '../components/AuthContext'; // Importa el hook de autenticación

const API_URL = import.meta.env.VITE_API_URL;

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Obtén la función de login
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register/`, {
        username,
        email,
        password,
        confirm_password: confirmPassword
      });

      setMessage('Registro exitoso');
      console.log('Registro exitoso:', response.data);
      login(); // Marca al usuario como autenticado
      // Redirigir a la página de inicio después del registro exitoso
      navigate('/sentirseBien');
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      setMessage('Hubo un error en el registro');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Registrarse</h2>
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
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div style={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button
          type="submit"
          style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Registrarse
        </button>
      </form>
      <p style={styles.loginText}>
        ¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia sesión aquí</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    color: '#28a745', // Letra verde pastel
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
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc',
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
  // Nuevo estilo para el hover
  buttonHover: {
    backgroundColor: '#74c769', // Verde más claro al pasar el mouse
  },
  loginText: {
    marginTop: '10px',
    textAlign: 'center',
    color: '#333', // Color de texto para el mensaje
  },
  link: {
    color: '#77dd77', // Verde pastel para el enlace
    textDecoration: 'none',
  }
};
