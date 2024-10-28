import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskPag } from './pages/taskFormPages'; 
import { AuthProvider, useAuth } from './components/AuthContext'; 
import { LayoutCustom } from './layouts/LayoutCustom'; // Layout personalizado para usuarios logueados
import { LayoutStandard } from './layouts/LayoutStandard'; // Layout estándar para usuarios no logueados
import { About } from './pages/about';
import { InicioSesion } from './pages/iniciarSesion'; 
import { Register } from './pages/register'; 
import { QueryAndResponseComponent } from './pages/consultas';
import { CommentsList } from './pages/commentsList';
import { AppointmentsList } from './pages/appointmentsList';
import { Services } from './components/services';
import { Others } from './components/Others';
import { Announcements } from './components/Announcements';
import { Job } from './components/job';
import { ClientsList } from './components/ClientsList';  
import { ClientsByDay } from './components/ClientsByDay';  
import { ClientsByProfessional } from './components/ClientsByProfessional';
import { ProfessionalAppointmentsList } from './pages/ProfessionalAppointmentsList';
import { PaymentList } from './pages/PaymentList';
import { PaymentPage } from './pages/PaymentPage';
import { ServicesList } from './pages/servicesPage'
import { UserEdit } from  './pages/userEdit'
import { ToastContainer, toast } from 'react-toastify'; // Importa ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toast

import axios from 'axios';

export const setupAxiosInterceptors = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};
setupAxiosInterceptors();

function App() {
  const { isAuthenticated } = useAuth(); // Obtenemos si está autenticado o no

  return (
    
      <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        {/* Aquí renderizamos el Layout según si está autenticado o no */}
        {isAuthenticated ? (
          <LayoutCustom>
            <Routes>
              <Route path="/" element={<Navigate to="/home-loged" />} />
              <Route path="/home-loged" element={<TaskPag />} />
              <Route path="/about" element={<About />} />
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/clients" element={<ClientsList />} />  
              <Route path="/clients-by-day" element={<ClientsByDay />} />  
              <Route path="/clients-by-professional" element={<ClientsByProfessional />} /> 
              <Route path="/payments/:appointmentId" element={<PaymentPage />} />
              <Route path="/appointments-by-professional" element={<ProfessionalAppointmentsList />} />
              <Route path="/payments-list" element={<PaymentList />} />
              <Route path="/Announcements" element={<Announcements />} />
              <Route path="/commentsList" element={<CommentsList />} />
              <Route path="/contact" element={<QueryAndResponseComponent />} />
              <Route path="/services" element={<ServicesList />} />
              <Route path="/user" element={<UserEdit />} />
              
            </Routes>
          </LayoutCustom>
        ) : (
          <LayoutStandard>
            <Routes>
              <Route path="/" element={<Navigate to="/sentirseBien" />} />
              <Route path="/sentirseBien" element={<TaskPag />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<InicioSesion />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<QueryAndResponseComponent />} />
              <Route path="/commentsList" element={<CommentsList />} />
              <Route path="/services" element={<Services />} />
              <Route path="/Others" element={<Others />} />
              <Route path="/Job" element={<Job />} />
              <Route path="/Announcements" element={<Announcements />} />
            </Routes>
          </LayoutStandard>
        )}
      </BrowserRouter>
    
  );
}

export default App;