import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext"; 
import './ClientsByProfessional.css';
import jsPDF from "jspdf";
import "jspdf-autotable";  
import logo from '../assets/bigLogoSPA.png'; 

const API_URL = import.meta.env.VITE_API_URL;

export function ClientsByProfessional() {
  const [clientsByProfessional, setClientsByProfessional] = useState({});
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedProfessional, setExpandedProfessional] = useState(null);  
  const navigate = useNavigate();
  const { isAuthenticated, isProfessional, user } = useAuth(); // Asegúrate de tener el usuario en el contexto

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfessionals();
      fetchClientsByProfessional();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchProfessionals = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/professionals/`);
      setProfessionals(response.data);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    }
  };

  const fetchClientsByProfessional = async () => {
    try {
      const professionalId = isProfessional ? user.id : selectedProfessional; // Usar el ID del usuario si es profesional
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/clients-by-professional/`, {
        params: {
          professional_id: professionalId,
          start_date: startDate,
          end_date: endDate
        }
      });
      setClientsByProfessional(response.data);
    } catch (error) {
      console.error("Error fetching clients by professional:", error);
    }
  };

  const handleProfessionalChange = (event) => {
    setSelectedProfessional(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const toggleProfessional = (professional) => {
    setExpandedProfessional((prev) => (prev === professional ? null : professional));
  };

  const convertImageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    try {
      const logoBase64 = await convertImageToBase64(logo);
      const logoWidth = 70;
      const logoHeight = 30;
      const xPosLogo = (pageWidth - logoWidth) / 2;

      doc.addImage(logoBase64, 'PNG', xPosLogo, 10, logoWidth, logoHeight);

      let currentY = 10 + logoHeight + 10; 

      const title = "Clientes por Profesional";
      const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
      doc.text(title, titleX, currentY); 
      currentY += 10;

      const startDateText = `Fecha de inicio: ${startDate || 'No definida'}`;
      const startDateX = (pageWidth - doc.getTextWidth(startDateText)) / 2;
      doc.text(startDateText, startDateX, currentY);
      currentY += 10;

      const endDateText = `Fecha de fin: ${endDate || 'No definida'}`;
      const endDateX = (pageWidth - doc.getTextWidth(endDateText)) / 2;
      doc.text(endDateText, endDateX, currentY);
      currentY += 10;

      Object.keys(clientsByProfessional).forEach((professional) => {
        const appointments = clientsByProfessional[professional];

        if (currentY + 20 > doc.internal.pageSize.height) {
          doc.addPage();
          currentY = 10; 
        }

        doc.text(`Profesional: ${professional}`, 10, currentY);
        currentY += 10;

        const rows = appointments.map((appointment) => [
          appointment.client_first_name,
          appointment.client_last_name,
          appointment.appointment_date,
          appointment.services.join(', ')
        ]);

        doc.autoTable({
          head: [['Nombre', 'Apellido', 'Fecha de Cita', 'Servicios']],
          body: rows,
          startY: currentY,
          theme: 'striped',
        });

        currentY = doc.previousAutoTable.finalY + 10;
      });

      return doc; 
    } catch (error) {
      console.error('Error al agregar el logo al PDF:', error);
    }
  };

  const downloadPDF = async () => {
    const doc = await generatePDF();
    doc.save("clientes_por_profesional.pdf");
  };

  const printPDF = async () => {
    const doc = await generatePDF();
    const pdfOutput = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfOutput);
    
    const printWindow = window.open(pdfUrl);

    printWindow.onload = () => {
      printWindow.print();
    };

    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };

  return (
    <div className="clients-by-professional-page">
      <h1 className="page-title">Clientes por Profesional</h1>
      <div className="button-group"></div>
      <div className="filters">
        <label className="filter-label">Selecciona un profesional:</label>
        {isProfessional ? (
          <select className="filter-select" value={user.id} disabled>
            <option value={user.id}>
              {user.first_name} {user.last_name}
            </option>
          </select>
        ) : (
          <select className="filter-select" value={selectedProfessional} onChange={handleProfessionalChange}>
            <option value="">Todos</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.first_name} {professional.last_name}
              </option>
            ))}
          </select>
        )}

        <label className="filter-label">Fecha de inicio:</label>
        <input className="filter-input" type="date" value={startDate} onChange={handleStartDateChange} />

        <label className="filter-label">Fecha de fin:</label>
        <input className="filter-input" type="date" value={endDate} onChange={handleEndDateChange} />

        <div className="button-group">
          <button className="filter-button" onClick={fetchClientsByProfessional}>Filtrar </button>
          <button className="filter-button" onClick={downloadPDF}>Descargar PDF</button>
          <button className="filter-button" onClick={printPDF}>Imprimir PDF</button>
        </div>
      </div>

      <div className="professionals-container">
        {Object.keys(clientsByProfessional).map((professional) => (
          <div className="professional-card" key={professional}>
            <h2 className="professional-title" onClick={() => toggleProfessional(professional)}>
              {professional}
              {expandedProfessional === professional ? " ▲" : " ▼"}
            </h2>
            {expandedProfessional === professional && (
              <ul className="appointments-list">
                {clientsByProfessional[professional].map((appointment, index) => (
                  <li className="appointment-item" key={index}>
                    Cliente: {appointment.client_first_name} {appointment.client_last_name}
                    <br />
                    Fecha y Hora: {appointment.appointment_date}
                    <br />
                    Servicios: {appointment.services.join(', ')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}