// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TaskPag } from './pages/taskFormPages'; 
import { Navigator } from "./components/navigator";
import { Header } from "./components/Header";
import { About } from './pages/about';
import { InicioSesion } from './pages/iniciarSesion'; 
import { Register } from './pages/register'; 
import { AuthProvider } from './components/AuthContext'; 
import { QueryAndResponseComponent } from './pages/consultas';
import { Footer } from './components/Footer'; // Importa el Footer
import { CommentsList } from './pages/commentsList'
import { AppointmentsList } from './pages/appointmentsList';
import { Services } from './components/services';
import { Others } from './components/Others';
import { Announcements } from './components/Announcements';
import { Job } from './components/job';

import axios from 'axios';

export const setupAxiosInterceptors = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

setupAxiosInterceptors();

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header/>
        <Navigator/>
        <Routes>
          <Route path="/" element={<Navigate to = "/sentirseBien"/>}/>
          <Route path="/sentirseBien" element={<TaskPag/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/login" element={<InicioSesion/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/contact" element={<QueryAndResponseComponent/>} />
          <Route path="/commentsList" element={< CommentsList/>} />
          <Route path="/appointments" element={< AppointmentsList/>} />
          <Route path="/services" element={<Services />} />
          <Route path="/Others" element={<Others />} />
          <Route path="/Job" element={<Job />} />
          <Route path="/Announcements" element={<Announcements />} />
        </Routes>
        <Footer/> 
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
