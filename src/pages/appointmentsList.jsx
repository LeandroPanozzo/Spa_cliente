import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Collapse } from 'react-collapse';
import './AppointmentsList.css'; // Asegúrate de importar el archivo CSS

const API_URL = import.meta.env.VITE_API_URL;

export function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, logout, isSecretary, isOwner, isProfessional } = useAuth();
  const navigate = useNavigate();
  const [openUsers, setOpenUsers] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');  // Redirige al usuario a la página de inicio de sesión si no está autenticado
    } else {
      fetchAppointments();
      fetchServices();
      fetchProfessionals();
    }
    document.body.style.backgroundColor = '#ffffff';
  }, [isAuthenticated, navigate]);


  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/appointments/`);
      setAppointments(response.data);
    } catch {
      setError('Error al cargar las citas');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/services/`);
      // Añadimos los precios a las opciones del select
      setServices(response.data.map(service => ({
        value: service.id,
        label: `${service.name} - $${service.price}`,  // Mostrar precio en la etiqueta
        price: service.price  // Guardar el precio en el objeto
      })));
    } catch {
      setError('Error al cargar los servicios');
    }
  };

  const fetchProfessionals = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/professionals/`);
      setProfessionals(response.data.map(professional => ({
        value: professional.id,
        label: `${professional.first_name} ${professional.last_name}` // Combina el nombre y el apellido correctamente
      })));
    } catch {
      setError('Error al cargar los profesionales');
    }
  };
  
  

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    const appointmentData = {
      professional_id: selectedProfessional?.value || null,
      services_ids: selectedServices.map(service => service.value),
      appointment_date: appointmentDate,
    };

    try {
      const response = await axios.post(`${API_URL}/sentirseBien/api/v1/appointments/`, appointmentData);
      setAppointments(prev => [...prev, response.data]);
      resetForm();
      toast.success('Cita creada con éxito!');
    } catch {
      setError('Error al crear la cita');
    }
  };

  const resetForm = () => {
    setSelectedServices([]);
    setSelectedProfessional(null);
    setAppointmentDate('');
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
      try {
        await axios.delete(`${API_URL}/sentirseBien/api/v1/appointments/${id}/`);
        setAppointments(prev => prev.filter(appointment => appointment.id !== id));
        toast.success('Cita eliminada!');
      } catch {
        setError('Error al eliminar la cita');
      }
    }
  };

  const handlePayment = (id) => {
    navigate(`/payments/${id}`);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    const selectedDate = new Date(value);
    const today = new Date();

    if (selectedDate < today.setDate(today.getDate() + 2)) {
      setError('La fecha debe ser al menos para dos dias despues de la fecha actual.');
      return;
    }

    const day = selectedDate.getDay();
    if (day === 0 || day === 6) {
      setError('Solo se pueden seleccionar citas de lunes a viernes.');
      return;
    }

    const hour = selectedDate.getHours();
    if (hour < 9 || hour > 17) {
      setError('Las citas solo pueden ser entre las 9 AM y 6 PM.');
      return;
    }

    setError('');
    setAppointmentDate(value);
  };

  const handleServiceChange = (selectedOptions) => {
    setSelectedServices(selectedOptions);
    
    // Calcular el total sumando los precios de los servicios seleccionados
    const newTotalPrice = selectedOptions.reduce((total, service) => total + Number(service.price), 0);
    setTotalPrice(newTotalPrice);
  };

  // Axios interceptors for token management
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
        } catch {
          logout();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const fullName = `${appointment.client.first_name} ${appointment.client.last_name}`;
    if (!acc[fullName]) {
      acc[fullName] = [];
    }
    acc[fullName].push(appointment);
    return acc;
  }, {});

  const groupedAppointmentsByDate = appointments
  .reduce((acc, appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);

    // Agrupar por fecha (solo año, mes y día)
    const formattedDate = appointmentDate.toISOString().split('T')[0];  // Formato YYYY-MM-DD

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(appointment);

    return acc;
  }, {});

    // Ordenar por fecha (del más antiguo al más reciente)
  const sortedGroupedAppointments = Object.keys(groupedAppointmentsByDate)
  .sort((a, b) => new Date(a) - new Date(b))  // Ordenar fechas
  .reduce((sortedAcc, date) => {
    sortedAcc[date] = groupedAppointmentsByDate[date]
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));  // Ordenar citas dentro de cada fecha por hora
    return sortedAcc;
  }, {});

  return (
    <div className="appointments-list-page">
      {/* Título de la página basado en el rol del usuario */}
      <h1 className="page-title">
        {(isOwner || isProfessional || isSecretary) ? 'Lista de Citas' : 'Mis Citas'}
      </h1>
  
      {/* Mostrar errores si los hay */}
      {error && <p className="errorText">{error}</p>}
  
      {/* Si el usuario es Secretario, Dueño o Profesional */}
      {isSecretary || isOwner || isProfessional ? (
        Object.keys(groupedAppointments).map(fullName => (
          <div key={fullName} className="client-container">
            <div className="client-card">
              <h2 
                onClick={() => setOpenUsers(prev => ({ ...prev, [fullName]: !prev[fullName] }))} 
                className="client-title"
              >
                {fullName}
              </h2>
              <Collapse isOpened={!!openUsers[fullName]}>
                <ul className="appointments-list">
                  {groupedAppointments[fullName].map(appointment => (
                    <li key={appointment.id} className="appointment-item">
<h4 className="professionalText">Profesional: {appointment.professional.last_name} {appointment.professional.first_name}</h4>
<h2 className="serviceText">{appointment.services_names.join(', ')}</h2>
                      <p className="dateText">
                        {new Date(appointment.appointment_date).toLocaleString()}
                      </p>
  
                      {appointment.payment ? (
                        <a
                          href={`${API_URL}/sentirseBien/api/v1/appointments/${appointment.id}/download_invoice/`}
                          className="pay-button"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Descargar Factura
                        </a>
                      ) : (
                        <button onClick={() => handlePayment(appointment.id)} className="pay-button">
                          Pagar
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteAppointment(appointment.id)} 
                        className="delete-button" style={{backgroundColor: 'red'}}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </Collapse>
            </div>
          </div>
        ))
      ) : (
        <>
  {/* Lista de citas del usuario */}
  {Object.keys(sortedGroupedAppointments).map(formattedDate => (
    <div key={formattedDate} className="client-container">
      <div className="client-card">
        {/* Mostrar la fecha de la cita como título */}
        <h2 
          onClick={() => setOpenUsers(prev => ({ ...prev, [formattedDate]: !prev[formattedDate] }))} 
          className="client-title"
        >
          {formattedDate}  {/* Mostrar la fecha de la cita */}
        </h2>
        <Collapse isOpened={!!openUsers[formattedDate]}>
          <ul className="appointments-list">
            {/* Mostrar citas ordenadas por hora */}
            {sortedGroupedAppointments[formattedDate].map(appointment => (
              <li key={appointment.id} className="appointment-item">
                <h4 className="professionalText">
                  Profesional: {appointment.professional.first_name} {appointment.professional.last_name}
                </h4>
                <h2 className="serviceText">
                  Servicios: {appointment.services_names.join(', ')}
                </h2>
                <p className="dateText">
                  {/* Mostrar hora en formato 24 horas sin AM/PM */}
                  {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {appointment.payment ? (
                  <a
                    href={`${API_URL}/sentirseBien/api/v1/appointments/${appointment.id}/download_invoice/`}
                    className="pay-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Descargar Factura
                  </a>
                ) : (
                  <button onClick={() => handlePayment(appointment.id)} className="pay-button">
                    Pagar
                  </button>
                )}
                <button 
                  onClick={() => handleDeleteAppointment(appointment.id)} 
                  className="delete-button" style={{ backgroundColor: 'red' }}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </Collapse>
      </div>
    </div>
  ))}

  <div className="create-appointment-page">
    <h2 className="create-appointment-title">Crear Cita</h2>
    <form onSubmit={handleAppointmentSubmit} className="create-appointment-form">
      <Select
        value={selectedProfessional}
        onChange={setSelectedProfessional}
        options={professionals}
        className="create-select-input"
        placeholder="Seleccionar Profesional"
        required
      />
      <Select
        isMulti
        value={selectedServices}
        onChange={handleServiceChange}
        options={services}
        className="create-select-input"
        placeholder="Seleccionar Servicios"
        required
      />
      <input
        type="datetime-local"
        value={appointmentDate}
        onChange={handleDateChange}
        className="create-date-input"
        required
      />
      <div className="total-price" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <h3>Total: ${totalPrice}</h3>
      </div>
      <button type="submit" className="create-submit-button">Crear Cita</button>
    </form>
    <p className="appointment-info-text">
  Puedes seleccionar citas solo para días hábiles (de lunes a viernes), con al menos 2 días de antelación, entre las 9 AM y 6 PM.
</p>
  </div>
</>
      )}
  
      
    </div>
  );
  
}  