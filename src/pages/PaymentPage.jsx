import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

export function PaymentPage() {
  const { appointmentId } = useParams();
  const [creditCard, setCreditCard] = useState('');
  const [pin, setPin] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [error, setError] = useState('');
  const [totalPayment, setTotalPayment] = useState(0); // Estado para almacenar el total del pago
  const { isAuthenticated, isStaff, logout, isSecretary } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const response = await axios.get(`${API_URL}/sentirseBien/api/v1/payment-types/`);
        setPaymentTypes(response.data);
      } catch (error) {
        setError('Error al cargar los tipos de pago');
      }
    };

    const fetchAppointmentDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/sentirseBien/api/v1/appointments/${appointmentId}/`);
        // Calcular el total del pago sumando los precios de los servicios
        const total = response.data.services_prices.reduce((acc, price) => acc + parseFloat(price), 0);
        setTotalPayment(total); // Asignar el total calculado al estado
      } catch (error) {
        setError('Error al cargar los detalles de la cita');
      }
    };

    fetchPaymentTypes();
    fetchAppointmentDetails();
  }, [appointmentId]);

  const validateInputs = () => {
    const cardRegex = /^[0-9]{16}$/; // 16 dígitos
    const pinRegex = /^[0-9]{4,6}$/; // 4 a 6 dígitos

    if (!cardRegex.test(creditCard)) {
      setError('El número de tarjeta debe tener 16 dígitos y contener solo números.');
      return false;
    }

    if (!pinRegex.test(pin)) {
      setError('El PIN debe tener entre 4 y 6 dígitos y contener solo números.');
      return false;
    }

    setError(''); // Limpiar el error si las validaciones son correctas
    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return; // Si la validación falla, no proceder
    }

    try {
      await axios.post(`${API_URL}/sentirseBien/api/v1/payments/`, {
        appointment: appointmentId,
        credit_card: creditCard,
        pin: pin,
        payment_type: paymentType,
      });
      toast.success('Pago Exitoso!');
      navigate('/appointments');
    } catch (error) {
      setError('Error al procesar el pago.');
    }
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
      <h1 style={styles.title}>Completar Pago</h1>
      <form onSubmit={handlePaymentSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Número de Tarjeta</label>
          <input
            type="text"
            value={creditCard}
            onChange={(e) => setCreditCard(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Tipo de Pago</label>
          <select value={paymentType} onChange={(e) => setPaymentType(e.target.value)} required style={styles.input}>
            <option value="">Seleccione un tipo de pago</option>
            {paymentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Mostrar el total a pagar */}
        <div style={styles.totalAmountContainer}>
          <h3>Total a pagar: ${totalPayment.toFixed(2)}</h3>
        </div>

        {error && <p style={styles.errorText}>{error}</p>}
        <div style={styles.buttonContainer}>
          <button type="submit" style={styles.submitButton}>Pagar</button>
        </div>
      </form>
      <p style={styles.warningText}>Por favor, preséntese a la cita con la factura de pago.</p>
    </div>
  );
}

const styles = {
  warningText: {
    color: 'red', 
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '20px',
  },
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
    color: '#ff7f8a',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    marginTop: '20px',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '20px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '6px',
    backgroundColor: '#00be3f',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  label: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  buttonContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  totalAmountContainer: {
    textAlign: 'center',
    marginTop: '20px',
  }
};