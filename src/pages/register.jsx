import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { ToastContainer, toast } from 'react-toastify'; // Importa ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toast

const API_URL = import.meta.env.VITE_API_URL;

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastNmae] = useState('');
  const [cuit, setCuit] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [messages, setMessages] = useState([]); // Cambiar a un array para múltiples mensajes
  const navigate = useNavigate();
  const { login } = useAuth();
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessages([]); // Reiniciar mensajes en cada intento de registro

    if (password !== confirmPassword) {
      setMessages(['Las contraseñas no coinciden']);
      return;
    }
    if (!isValidEmail(email)) {
      setMessages(['El correo electrónico no tiene un formato válido']);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/sentirseBien/api/v1/register/`, {
        username,
        first_name,
        last_name,
        cuit,
        email,
        password,
        confirm_password: confirmPassword
      });

      setMessages(['Registro exitoso']);
      console.log('Registro exitoso:', response.data);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      toast.success('Usuario creado exitosamente!');
      login();

      // Redirigir al usuario después del registro exitoso
      navigate('/'); // Cambia esta ruta si necesitas otra
    } catch (error) {
      console.error('Error en el registro:', error.response?.data || error.message);
      
      // Manejo de errores personalizados
      if (error.response?.data) {
        const errors = error.response.data;

        // Comprobar errores de usuario y correo electrónico
        let errorMessages = [];
        if (errors.username && errors.username.length > 0) {
          errorMessages.push('El nombre de usuario ya está en uso.');
        }
        if (errors.email && errors.email.length > 0) {
          errorMessages.push('El correo electrónico ya está en uso.');
        }
        if (errors.cuit && errors.cuit.length > 0) {
          errorMessages.push('El CUIT deben ser exactamente 11 dígitos numéricos.');
        }

        // Si no hay mensajes específicos, mostrar mensaje genérico
        setMessages(errorMessages.length > 0 ? errorMessages : ['Hubo un error en el registro']);
      } else {
        setMessages(['Hubo un error en el registro']); // Mensaje genérico
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrarse</h2>
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
          <label htmlFor="first_name">Nombres:</label>
          <input
            type="text"
            id="first_name"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="last_name">Apellido:</label>
          <input
            type="text"
            id="last_name"
            value={last_name}
            onChange={(e) => setLastNmae(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="cuit">Cuit:</label>
          <input
            type="text"
            id="cuit"
            value={cuit}
            onChange={(e) => {
              const value = e.target.value;

              // Solo permite 11 números
              if (/^\d{0,11}$/.test(value)) {
                setCuit(value);
              }
            }}
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
      {messages.length > 0 && (
        <div style={styles.message}>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}
      <p style={styles.loginText}>
        ¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia sesión aquí</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '150px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    color: '#28a745',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    color: '#fc9ba9',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '5px',
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
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#74c769',
  },
  loginText: {
    marginTop: '10px',
    textAlign: 'center',
    color: '#333',
  },
  link: {
    color: '#77dd77',
    textDecoration: 'none',
  },
  message: {
    color: '#d9534f', // Color rojo para mensajes de error
    textAlign: 'center',
    marginTop: '10px',
  },
  title: {
    textAlign: 'center', // Alinea el título al centro
    marginBottom: '20px', // Espacio abajo para separar el título del formulario
  }
};
