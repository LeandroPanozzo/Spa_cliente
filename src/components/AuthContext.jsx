import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Importa la URL base de tu archivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Crear el contexto
const AuthContext = createContext();

// Proveedor de autenticación
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Estado de carga
  const [user, setUser] = useState(null); // Estado para el usuario
  const [isStaff, setIsStaff] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // Estado para verificar si es Owner
  const [isProfessional, setIsProfessional] = useState(false); // Estado para verificar si es Professional
  const [isSecretary, setIsSecretary] = useState(false); // Estado para verificar si es Secretary

  // Configura la URL base para Axios
  axios.defaults.baseURL = API_URL;

  // Función para manejar el login
  const login = async () => {
    setIsAuthenticated(true);
    await checkUserRole();
  };

  // Función para manejar el logout
  const logout = () => {
    // Remover los tokens de localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null); // Limpiar el usuario
    setIsStaff(false);
    setIsOwner(false); // Resetear isOwner al hacer logout
    setIsProfessional(false); // Resetear isProfessional al hacer logout
    setIsSecretary(false); // Resetear isSecretary al hacer logout
  };

  // Función para verificar el rol del usuario (Owner, Staff, Professional, Secretary)
  const checkUserRole = async () => {
    try {
      // Obtén el token de acceso del localStorage
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        // Decodifica el token para obtener el payload
        const decodedToken = jwtDecode(accessToken);
        const userId = decodedToken.user_id; // Asegúrate de que 'user_id' es el campo correcto en tu payload

        // Realiza la solicitud para obtener los detalles del usuario
        const response = await axios.get(`/sentirseBien/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}` // Incluye el token de acceso en los encabezados
          }
        });
        
        // Guarda el usuario en el estado
        setUser(response.data); // Guarda todos los datos del usuario, incluyendo el nombre
        setIsStaff(response.data.is_staff);
        setIsOwner(response.data.is_owner); // Verifica si el usuario es Owner
        setIsProfessional(response.data.is_professional); // Establecer is_professional
        setIsSecretary(response.data.is_secretary); // Establecer is_secretary
        console.log('User Role:', response.data);
      } else {
        throw new Error('Token no encontrado');
      }
    } catch (error) {
      console.error('Error al verificar el rol del usuario', error);
    }
  };

  // Efecto para verificar autenticación al cargar la aplicación
  useEffect(() => {
    // Verificar si hay un token de acceso en localStorage
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // Si hay un token, configurar Axios y setear la autenticación
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setIsAuthenticated(true);
      checkUserRole();
      setLoading(false); // Una vez terminada la verificación, desactivar la carga
    } else {
      setLoading(false);
    }
  }, []); // Ejecutar solo al montar el componente

  if (loading) {
    return <p>Loading...</p>; // Muestra un mensaje de carga mientras se verifica el token
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, // Agregar el usuario al contexto
      login, 
      logout, 
      isStaff, 
      isOwner, 
      isProfessional,  // Añadir al contexto
      isSecretary // Añadir al contexto
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}