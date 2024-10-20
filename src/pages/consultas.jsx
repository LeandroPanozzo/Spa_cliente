import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Collapse } from 'react-collapse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './consultas.css';

export function QueryAndResponseComponent() {
  const [queries, setQueries] = useState([]);
  const [responses, setResponses] = useState([]);
  const [newQuery, setNewQuery] = useState({ title: '', content: '' });
  const [newResponse, setNewResponse] = useState({ content: '', query: null });
  const [error, setError] = useState('');
  const [openUserId, setOpenUserId] = useState(null);
  const [openQueryId, setOpenQueryId] = useState(null);
  const { isAuthenticated, logout, isOwner, isSecretary, isProfessional } = useAuth();
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
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/sentirseBien/api/v1/token/refresh/`, { refresh: refreshToken });
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
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sentirseBien/api/v1/queries/`);
      setQueries(response.data);
    } catch (error) {
      setError('Error al cargar las consultas');
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/sentirseBien/api/v1/responses/`);
      setResponses(response.data);
    } catch (error) {
      setError('Error al cargar las respuestas');
    }
  };

  const handleNewQuerySubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/sentirseBien/api/v1/queries/`, newQuery);
      setNewQuery({ title: '', content: '' });
      fetchQueries();
      toast.success('Consulta creada!');
    } catch (error) {
      setError('Error al crear la consulta');
    }
  };

  const handleNewResponseSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/sentirseBien/api/v1/responses/`, newResponse);
      setNewResponse({ content: '', query: null });
      fetchResponses();
      toast.success('Respuesta creada!');
    } catch (error) {
      setError('Error al crear la respuesta');
    }
  };

  const handleDeleteQueries = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/sentirseBien/api/v1/queries/${id}/`);
      setQueries(queries.filter(query => query.id !== id));
      toast.success('Consulta eliminada!');
    } catch (error) {
      setError('Error al eliminar la consulta');
    }
  };

  const toggleUserCollapse = (userId) => {
    setOpenUserId(openUserId === userId ? null : userId);
  };

  const toggleQueryCollapse = (queryId) => {
    setOpenQueryId(openQueryId === queryId ? null : queryId);
  };

  if (!isAuthenticated) {
    return <p>Por favor, inicia sesión para ver y crear consultas.</p>;
  }

  const groupedQueries = queries.reduce((acc, query) => {
    const userFullName = `${query.user.first_name} ${query.user.last_name}`;
    if (!acc[userFullName]) {
      acc[userFullName] = [];
    }
    acc[userFullName].push(query);
    return acc;
  }, {});

  return (
    <div className="query-and-response-page">
      <h2 className="page-title">Consultas y Respuestas</h2>

      {/* Formulario para nueva consulta */}
      {(!isOwner && !isSecretary && !isProfessional) && (
        <form onSubmit={handleNewQuerySubmit} className="new-query-form">
          <h3 className="form-title">Nueva Consulta</h3>
          <input
            type="text"
            value={newQuery.title}
            onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
            placeholder="Título de la consulta"
            className="query-input"
            required
          />
          <textarea
            value={newQuery.content}
            onChange={(e) => setNewQuery({ ...newQuery, content: e.target.value })}
            placeholder="Contenido de la consulta"
            className="query-textarea"
            required
          />
          <button type="submit" className="submit-button">Crear Consulta</button>
        </form>
      )}

      {/* Lista de consultas agrupadas por usuario */}
      <div className="queries-container">
        {Object.keys(groupedQueries).map((userFullName) => (
          <div key={userFullName} className="user-container">
            <h3 onClick={() => toggleUserCollapse(userFullName)} className="user-name">
              {userFullName}
            </h3>
            <Collapse isOpened={openUserId === userFullName}>
              {groupedQueries[userFullName].map((queryMapped) => (
                <div key={queryMapped.id} className="query-card">
                  <h4 className="query-title">Asunto: {queryMapped.title}</h4>
                  <p className="query-info">Por: {queryMapped.user.first_name} {queryMapped.user.last_name}</p>
                  <p className="query-content">{queryMapped.content}</p>
                  <button onClick={() => handleDeleteQueries(queryMapped.id)} className="delete-button" style={{backgroundColor: 'red', borderRadius: '6px', padding: '9px 15px'}}>
                    Eliminar
                  </button>

                  <button onClick={() => toggleQueryCollapse(queryMapped.id)} className="toggle-button">
                    {openQueryId === queryMapped.id ? 'Ocultar Respuestas' : 'Mostrar Respuestas'}
                  </button>

                  <Collapse isOpened={openQueryId === queryMapped.id}>
                    <div className="responses">
                      <h4 className="responses-header">Respuestas:</h4>
                      {responses.filter(response => response.query === queryMapped.id).map((response) => (
                        <div key={response.id} className="response-card">
                          <p className="response-user">Respondido por: {response.user.first_name} {response.user.last_name}</p>
                          <p className="response-content">{response.content}</p>
                        </div>
                      ))}
                      <form onSubmit={handleNewResponseSubmit} className="response-form">
                        <textarea
                          value={newResponse.query === queryMapped.id ? newResponse.content : ''}
                          onChange={(e) => setNewResponse({ content: e.target.value, query: queryMapped.id })}
                          placeholder="Tu respuesta"
                          className="response-textarea"
                          required
                        />
                        <button type="submit" className="response-button">Responder</button>
                      </form>
                    </div>
                  </Collapse>
                </div>
              ))}
            </Collapse>
          </div>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}
      <ToastContainer />
    </div>
  );
}
