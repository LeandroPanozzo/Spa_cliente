import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export function CommentsList() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [alias, setAlias] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/`);
      setPosts(response.data);
    } catch (error) {
      setError('Error al cargar las publicaciones');
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      titulo,
      contenido,
      alias: !isAuthenticated ? alias : null,
    };

    try {
      const response = await axios.post(`${API_URL}/posts/`, postData);
      setPosts([...posts, response.data]);
      setTitulo('');
      setContenido('');
      setAlias('');
    } catch (error) {
      setError('Error al crear la publicación');
    }
  };

  const setupAxiosInterceptors = () => {
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
  };

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.pastelGreenText}>Publicaciones</h1>
      {error && <p style={styles.errorText}>{error}</p>}
      <ul style={styles.postList}>
        {posts.map(post => (
          <li key={post.id} style={styles.post}>
            <h2 style={styles.pastelPinkText}>{post.titulo}</h2>
            <p style={styles.pastelGreenText}>{post.contenido}</p>
            <h4 style={styles.pastelPinkText}>Publicado por: {post.autor || post.alias}</h4>
            <h5 style={styles.pastelGreenText}>{post.time_since_posted}</h5>
          </li>
        ))}
      </ul>

      <h2 style={styles.pastelPinkText}>Crear Publicación</h2>
      <form onSubmit={handlePostSubmit} style={styles.form}>
        <div>
          <label style={styles.pastelGreenText}>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título del post"
            style={styles.input}
            required
          />
        </div>
        <div>
          <label style={styles.pastelGreenText}>Contenido:</label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Contenido del post"
            style={styles.textarea}
            required
          />
        </div>
        {!isAuthenticated && (
          <div>
            <label>Alias:</label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Alias para postear"
              style={styles.input}
              required
            />
          </div>
        )}
        <button type="submit" style={styles.button}>Crear Publicación</button>
      </form>
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
  postList: {
    listStyleType: 'none',
    padding: '0',
  },
  post: {
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
};
