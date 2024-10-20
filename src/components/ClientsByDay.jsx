import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import './ClientsByDay.css';

const API_URL = import.meta.env.VITE_API_URL;

export function ClientsByDay() {
  const [clientsByDate, setClientsByDate] = useState({});
  const [expandedDate, setExpandedDate] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchClientsByDate();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchClientsByDate = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/clients-by-day/grouped_by_date/`);
      console.log("Clientes por fecha obtenidos:", response.data);
      setClientsByDate(response.data);
    } catch (error) {
      console.error("Error al obtener clientes por fecha:", error);
    }
  };

  const toggleDate = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="clients-by-day-page">
      <div>
        <h1 className="page-title">Clientes por Día</h1>
        <div className="clients-container">
          {Object.keys(clientsByDate).map((date) => (
            <div className="clients-day-card" key={date}>
              <h3 className="date-title" onClick={() => toggleDate(date)}>
                Fecha: {date}
              </h3>
              {expandedDate === date && (
                <div className="clients-list">
                  {clientsByDate[date].map((client, index) => (
                    <div className="client-card" key={index}>
                      <p>Cliente: {client.first_name} {client.last_name}</p>
                      <p>Servicios:</p>
                      <ul>
                        {client.services.map((service, serviceIndex) => (
                          <li key={serviceIndex}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
