import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export function ProfessionalAppointmentsList() {
  const [appointmentsByDate, setAppointmentsByDate] = useState({});
  const [error, setError] = useState('');
  const { isAuthenticated, isProfessional } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfessionalAppointments();
    } else {
      navigate('/login');
    }
    document.body.style.backgroundColor = '#ffffff';
  }, [isAuthenticated, isProfessional, navigate]);

  const fetchProfessionalAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/professional/appointments/`);
      const sortedAppointments = groupAppointmentsByDate(response.data);
      setAppointmentsByDate(sortedAppointments);
    } catch (error) {
      setError('Error al cargar las citas');
    }
  };

  // Agrupar las citas por fecha
  const groupAppointmentsByDate = (appointments) => {
    return appointments.reduce((grouped, appointment) => {
      const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
      if (!grouped[appointmentDate]) {
        grouped[appointmentDate] = [];
      }
      grouped[appointmentDate].push(appointment);
      return grouped;
    }, {});
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Interceptores de Axios
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
          const response = await axios.post(`${API_URL}/sentirseBien/api/v1/token/refresh/`, { refresh: refreshToken });
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
      <h1 style={styles.title}>Citas Profesionales</h1>
      {error && <p style={styles.errorText}>{error}</p>}
      <div>
        {Object.keys(appointmentsByDate).length > 0 ? (
          Object.keys(appointmentsByDate).map((date) => (
            <div key={date}>
              <h2 style={styles.dateHeader}>{date}</h2>
              <ul style={styles.list}>
                {appointmentsByDate[date].map((appointment) => (
                  <li key={appointment.id} style={styles.appointmentCard}>
                    <p style={styles.timeText}>Hora: {formatTime(appointment.appointment_date)}</p>
                    <p style={styles.clientText}>Cliente: {appointment.client.first_name} {appointment.client.last_name}</p>
                    <p style={styles.serviceText}>Servicios: {appointment.services_names.join(', ')}</p>
                    <p style={styles.paymentText}>
                      Estado de Pago: {appointment.payment ? 'Pagado' : 'No pagado'}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No tienes citas programadas.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '20px auto',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '20px',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  timeText: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  clientText: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  serviceText: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  paymentText: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#007bff', 
  },
  dateHeader: {
    fontSize: '24px',
    marginTop: '20px',
    fontWeight: 'bold',
    color: '#007bff',
  },
};