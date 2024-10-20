import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Importa ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toast

const API_URL = import.meta.env.VITE_API_URL;

export function CommentsList() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [alias, setAlias] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, isStaff, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    document.body.style.backgroundColor = '#ffffff'
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/posts/`);
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
      const response = await axios.post(`${API_URL}/sentirseBien/api/v1/posts/`, postData);
      setPosts([...posts, response.data]);
      setTitulo('');
      setContenido('');
      setAlias('');
      toast.success('Publicación creada!');
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
  };

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Publicaciones</h1>
      {error && <p style={styles.errorText}>{error}</p>}
      <ul style={styles.postList}>
        {posts.map(post => (
          <li key={post.id} style={styles.post}>
            <h2 style={styles.postTitle}>{post.titulo}</h2>
            <p style={styles.postContent}>{post.contenido}</p>
            <h4 style={styles.postAuthor}>Publicado por: {post.autor || post.alias}</h4>
            <h5 style={styles.postTime}>{post.time_since_posted}</h5>
          </li>
        ))}
      </ul>

      {!isStaff && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Crear Publicación</h2>
          <form onSubmit={handlePostSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Título:</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título del post"
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Contenido:</label>
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Contenido del post"
                style={styles.textarea}
                required
              />
            </div>
            {!isAuthenticated && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Alias:</label>
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
  formContainer: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  formTitle: {
    color: '#fc9ba9',
    marginBottom: '20px',
    fontSize: '1.8em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#495057',
    fontSize: '1.1em',
    fontWeight: '500',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: '1em',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ced4da',
    fontSize: '1em',
    minHeight: '120px',
    resize: 'vertical',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '1.1em',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.1s',
  },
  postList: {
    listStyleType: 'none',
    padding: '0',
    marginBottom: '40px',
  },
  post: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  postTitle: {
    color: '#fc9ba9',
    marginBottom: '10px',
    fontSize: '1.5em',
  },
  postContent: {
    color: '#495057',
    marginBottom: '15px',
    lineHeight: '1.6',
  },
  postAuthor: {
    color: '#28a745',
    marginBottom: '5px',
    fontStyle: 'italic',
  },
  postTime: {
    color: '#6c757d',
    fontSize: '0.9em',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '1.1em',
  },
};