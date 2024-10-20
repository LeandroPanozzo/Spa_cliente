import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

export function ServicesList() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, isStaff, isOwner } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/services/`);
      setServices(response.data);
    } catch (error) {
      setError('Error al cargar los servicios');
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const serviceData = {
      name,
      price,
    };

    try {
      const response = await axios.post(`${API_URL}/sentirseBien/api/v1/services/`, serviceData);
      setServices([...services, response.data]);
      setName('');
      setPrice('');
      toast.success('Servicio creado!');
    } catch (error) {
      setError('Error al crear el servicio');
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`${API_URL}/sentirseBien/api/v1/services/${id}/`);
      setServices(services.filter((service) => service.id !== id));
      toast.success('Servicio eliminado!');
    } catch (error) {
      toast.error('Error al eliminar el servicio');
    }
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setName(service.name);
    setPrice(service.price);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updatedService = { name, price };
    try {
      await axios.put(`${API_URL}/sentirseBien/api/v1/services/${selectedService.id}/`, updatedService);
      setServices(services.map((service) => (service.id === selectedService.id ? updatedService : service)));
      setShowEditModal(false);
      toast.success('Servicio actualizado!');
    } catch (error) {
      setError('Error al actualizar el servicio');
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedService(null);
  };

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
          const response = await axios.post('/sentirseBien/api/v1/token/refresh/', { refresh: refreshToken });
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
      <h1 style={styles.mainTitle}>Lista de Servicios</h1>
      {error && <p style={styles.errorText}>{error}</p>}

      <ul style={styles.serviceList}>
        {services.map((service) => (
          <li key={service.id} style={styles.service}>
            <div>
              <h2 style={styles.serviceName}>{service.name}</h2>
              <p style={styles.servicePrice}>Precio: ${service.price}</p>
            </div>
            
            {isOwner && (
              <div style={styles.actions}>
                <button
                  style={styles.editButton}
                  onClick={() => handleEditClick(service)}
                >
                  Editar
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
                      handleDeleteService(service.id);
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Formulario para crear servicios */}
      {isOwner && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Crear Servicio</h2>
          <form onSubmit={handleServiceSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nombre del servicio:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del servicio"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Precio:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Precio del servicio"
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.button}>Crear Servicio</button>
          </form>
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Editar Servicio</h2>
            <form onSubmit={handleEditSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre del servicio:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del servicio"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Precio:</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Precio del servicio"
                  style={styles.input}
                  required
                />
              </div>
              <button type="submit" style={styles.button}>Guardar cambios</button>
              <button type="button" style={styles.closeButton} onClick={handleCloseModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

    
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    marginTop: '120px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  mainTitle: {
    color: '#28a745',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2.5em',
  },
  serviceList: {
    listStyleType: 'none',
    padding: '0',
    marginBottom: '40px',
  },
  service: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  serviceName: {
    color: '#fc9ba9',
    marginBottom: '10px',
    fontSize: '1.5em',
  },
  servicePrice: {
    color: '#495057',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    fontSize: '1em',
    borderRadius: '5px',
    border: '1px solid #ced4da',
  },
  button: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '1em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: '20px',
  },
  modalOverlay: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: '20px',
    fontSize: '1.5em',
  },
  closeButton: {
    marginTop: '10px',
    padding: '10px 15px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    fontSize: '1em',
    cursor: 'pointer',
  },
};