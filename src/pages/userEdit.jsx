import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

export function UserEdit() {
    const [formData, setFormData] = useState({
        cuit: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '', // Nuevo campo para confirmar la contraseña
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API_URL}/sentirseBien/api/v1/user/update/`);
            setFormData({
                cuit: response.data.cuit,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                email: response.data.email,
                password: '',
                confirmPassword: '', // La confirmación también se deja en blanco
            });
        } catch {
            setError('Error al cargar los datos del usuario');
        }
    };

    // Configuración de interceptores de axios
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
                    const response = await axios.post(`${API_URL}/api/token/refresh/`, { refresh: refreshToken });
                    localStorage.setItem('access_token', response.data.access);
                    return axios(originalRequest);
                } catch {
                    navigate('/login');
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return; // No continuamos con la actualización
        }

        const { confirmPassword, ...dataToUpdate } = formData; // Destructuramos para separar confirmPassword

        // Solo agregamos password si no está vacío
        if (!formData.password) {
            delete dataToUpdate.password; // Eliminamos el password si está vacío
        } else {
            dataToUpdate.password = formData.password; // Asegúrate de que la nueva contraseña se incluya
        }

        try {
            await axios.put(`${API_URL}/sentirseBien/api/v1/user/update/`, dataToUpdate);
            toast.success('Información actualizada con éxito.');
        } catch {
            setError('Hubo un error al actualizar la información.');
        }
    };

    return (
        <div className="user-edit-page" style={styles.container}>
            <h2 className="page-title">Editar Perfil</h2>
            {error && <p className="errorText">{error}</p>}
            <form className="edit-user-form" onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="cuit"
                    placeholder="CUIT"
                    value={formData.cuit}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="first_name"
                    placeholder="Nombre"
                    value={formData.first_name}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Apellido"
                    value={formData.last_name}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Nueva contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={styles.input}
                />
                <button type="submit" className="submit-button" style={styles.button}>Guardar cambios</button>
            </form>
            <ToastContainer />
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
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        color: '#28a745',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
    },
    button: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#28a745',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
    },
};