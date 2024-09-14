import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

export function QueryAndResponseComponent() {
  const [queries, setQueries] = useState([]);
  const [responses, setResponses] = useState([]);
  const [newQuery, setNewQuery] = useState({ title: '', content: '' });
  const [newResponse, setNewResponse] = useState({ content: '', query: null });
  const [error, setError] = useState('');
  const { isAuthenticated, isStaff, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchQueries();
      fetchResponses();
    }
  }, [isAuthenticated, navigate]);

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, { refresh: refreshToken });
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

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/queries/`);
      setQueries(response.data);
    } catch (error) {
      setError('Error al cargar las consultas');
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/responses/`);
      setResponses(response.data);
    } catch (error) {
      setError('Error al cargar las respuestas');
    }
  };

  const handleNewQuerySubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/queries/`, newQuery);
      setNewQuery({ title: '', content: '' });
      fetchQueries();
    } catch (error) {
      setError('Error al crear la consulta');
    }
  };

  const handleNewResponseSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/responses/`, newResponse);
      setNewResponse({ content: '', query: null });
      fetchQueries();
    } catch (error) {
      setError('Error al crear la respuesta');
    }
  };

  const handleDeleteQueries = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/queries/${id}/`);
      setQueries(queries.filter(query => query.id !== id));
    } catch (error) {
      setError('Error al eliminar la consulta');
    }
  };

  if (!isAuthenticated) {
    return <p>Por favor, inicia sesión para ver y crear consultas.</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.pastelPinkText}>Consultas y Respuestas</h2>
      
      {/* Formulario para nueva consulta */}
      {!isStaff && <form onSubmit={handleNewQuerySubmit} style={styles.form}>
        <h3 style={styles.pastelGreenText}>Nueva Consulta</h3>
        <input
          type="text"
          value={newQuery.title}
          onChange={(e) => setNewQuery({...newQuery, title: e.target.value})}
          placeholder="Título de la consulta"
          style={styles.input}
          required
        />
        <textarea
          value={newQuery.content}
          onChange={(e) => setNewQuery({...newQuery, content: e.target.value})}
          placeholder="Contenido de la consulta"
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.button}>Crear Consulta</button>
      </form>}

      {/* Lista de consultas */}
      <div style={styles.queryList}>
        <h3 style={styles.pastelGreenText}>{isStaff ? 'Consultas Existentes: ' : 'Mis Consultas'}</h3>
        {queries.map((queryMapped) => (
          <div key={queryMapped.id} style={styles.query}>
            <h4 style={styles.pastelGreenText}>Asunto: {queryMapped.title}</h4> {/* titulo */}
            <p style={styles.pastelPinkText}>Por: {queryMapped.user.username}</p> {/* autor */}
            <p style={styles.pastelGreenText}>{queryMapped.content}</p> {/* contenido*/}
            <button onClick={() => {if (window.confirm('¿Estás seguro de que deseas borrar esta consulta?')) {handleDeleteQueries(queryMapped.id)}}} style={styles.button}>
              Eliminar
            </button>
            
            {/* Respuestas */}
            <div style={styles.responses}>
              <h4 style={styles.pastelPinkText}>Respuestas:</h4>
              {queryMapped.responses.map((response) => (
                <div key={response.id} style={styles.response}>
                  <p style={styles.pastelGreenText}>{response.content}</p>
                  <p style={styles.pastelWhiteText}>Respondido por: {response.user.username}</p>
                </div>
              ))}
            </div>

            {/* Formulario para nueva respuesta */}
            <form onSubmit={handleNewResponseSubmit} style={styles.form}>
              <textarea
                value={newResponse.query === queryMapped.id ? newResponse.content : ''}
                onChange={(e) => setNewResponse({content: e.target.value, query: queryMapped.id})}
                placeholder="Tu respuesta"
                style={styles.textarea}
                required
              />
              <button type="submit" style={styles.button}>Responder</button>
            </form>
          </div>
        ))}
      </div>

      {error && <p style={styles.errorText}>{error}</p>}
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
  textarea: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minHeight: '100px',
  },
  button: {
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
  queryList: {
    marginTop: '20px',
  },
  query: {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  responses: {
    marginTop: '10px',
    paddingLeft: '20px',
  },
  errorText: {
    color: 'red',
  },
  response: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#eccacf',
    borderRadius: '4px',
  },
  pastelGreenText: {
    color: '#28a745',  // Verde pastel
  },
  pastelPinkText: {
    color: '#fc9ba9',  // Rosa pastel
  },
  pastelWhiteText: {
    color: '#ffffff',  // Blanco pastel
  },
};
