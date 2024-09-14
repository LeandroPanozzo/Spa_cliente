import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, isStaff, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
      fetchServices();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/`);
      setAppointments(response.data);
    } catch (error) {
      setError('Error al cargar las citas');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/services/`);
      setServices(response.data);
    } catch (error) {
      setError('Error al cargar los servicios');
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const appointmentData = {
      service_id: selectedService,
      appointment_date: appointmentDate,
    };

    try {
      const response = await axios.post(`${API_URL}/appointments/`, appointmentData);
      setAppointments([...appointments, response.data]);
      setSelectedService('');
      setAppointmentDate('');
    } catch (error) {
      setError('Error al crear la cita');
      console.log(appointmentData);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`${API_URL}/appointments/${id}/`);
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      setError('Error al eliminar la cita');
    }
  };

  const handleEditAppointment = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/appointments/${id}/`, updatedData);
      setAppointments(appointments.map(appointment => 
        appointment.id === id ? response.data : appointment
      ));
    } catch (error) {
      setError('Error al actualizar la cita');
    }
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    const selectedDate = new Date(value);
    const today = new Date();

    if (selectedDate < today.setDate(today.getDate() + 1)) {
      setError('La fecha debe ser al menos para el día siguiente.');
      return;
    }

    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      setError('Solo se pueden seleccionar citas de lunes a viernes.');
      return;
    }

    const hour = selectedDate.getHours();
    if (hour < 9 || hour > 18) {
      setError('Las citas solo pueden ser entre las 9 AM y 6 PM.');
      return;
    }

    setError('');
    setAppointmentDate(value);
  };

  // Configuración de interceptores de Axios
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
          localStorage.setItem('access_token', response.data.access);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.pastelPinkText}>{isStaff ? 'Lista de Citas' : 'Mis Citas'}</h1>
      {error && <p style={styles.errorText}>{error}</p>}
      
      {isStaff ? (
        <ul style={styles.pastelPinkText}>
          {appointments.map(appointment => (
            <li key={appointment.id} style={styles.appointment}>
              <h2>{appointment.service_name}</h2>
              <h4 style={styles.pastelGreenText}>Creado por: {appointment.user.username}</h4>
              <p>{new Date(appointment.appointment_date).toLocaleString()}</p>
              <button onClick={() => handleEditAppointment(appointment.id, { /* data to update */ })} style={styles.button}>
                Editar
              </button>
              <button onClick={() => {if (window.confirm('¿Estás seguro de que deseas borrar esta consulta?')) {handleDeleteAppointment(appointment.id)}}} style={styles.button}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <ul style={styles.pastelGreenText}>
            {appointments.map(appointment => (
              <li key={appointment.id} style={styles.appointment}>
                <h2>{appointment.service_name}</h2>
                <p style={styles.pastelPinkText}>{new Date(appointment.appointment_date).toLocaleString()}</p>
                <button onClick={() => {if (window.confirm('¿Estás seguro de que deseas borrar esta consulta?')) {handleDeleteAppointment(appointment.id)}}} style={styles.button}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <h2 style={styles.pastelPinkText}>Crear Cita</h2>
          <form onSubmit={handleAppointmentSubmit} style={styles.form}>
            <div>
              <label style={styles.pastelGreenText}>Servicio: </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={styles.input}
                required
              >
                <option value="">Selecciona un servicio</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.pastelGreenText}>Fecha de Cita: </label>
              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={handleDateChange}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Crear Cita</button>
          </form>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '10px',
  },
  appointment: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  errorText: {
    color: 'red',
  },
  pastelGreenText: {
    color: '#28a745',  // Verde pastel
  },
  pastelPinkText: {
    color: '#fc9ba9',  // Rosa pastel
  },
  pastelWhiteText: {
    color: '#ffffff',  // Rosa pastel
  },
};
