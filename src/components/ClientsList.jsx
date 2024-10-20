import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import './ClientsList.css';

const API_URL = import.meta.env.VITE_API_URL;

export function ClientsList() {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchClients();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/clients/`);
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handlePermissionChange = async (clientId, field) => {
    try {
      const client = clients.find(client => client.id === clientId);
      const updatedClient = { ...client, [field]: !client[field] };
      await axios.put(`${API_URL}/sentirseBien/api/v1/clients/${clientId}/`, updatedClient);
      setClients(prevClients => prevClients.map(c => c.id === clientId ? updatedClient : c));
    } catch (error) {
      console.error("Error updating client:", error);
    }
  };

  const toggleClient = (clientId) => {
    setExpandedClientId((prev) => (prev === clientId ? null : clientId));
  };

  const filteredClients = clients.filter(client =>
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const owners = filteredClients.filter(client => client.is_owner);
  const professionals = filteredClients.filter(client => client.is_professional);
  const secretaries = filteredClients.filter(client => client.is_secretary);
  const regularClients = filteredClients.filter(client => !client.is_owner && !client.is_professional && !client.is_secretary);

  const getClientsToDisplay = () => {
    switch (filter) {
      case "owners":
        return owners;
      case "professionals":
        return professionals;
      case "secretaries":
        return secretaries;
      case "regular":
        return regularClients;
      default:
        return filteredClients;
    }
  };

  const getTitle = () => {
    switch (filter) {
      case "owners":
        return "Lista de Dueños";
      case "professionals":
        return "Lista de Profesionales";
      case "secretaries":
        return "Lista de Secretarias";
      case "regular":
        return "Lista de Clientes";
      default:
        return "Todos los Usuarios";
    }
  };

  return (
    <div className="clients-list-page">
      <h1 className="announcements-title">{getTitle()}</h1>

      <input
        type="text"
        placeholder="Buscar por nombre o apellido"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>Mostrar Todos</button>
        <button onClick={() => setFilter("owners")}>Dueños</button>
        <button onClick={() => setFilter("professionals")}>Profesionales</button>
        <button onClick={() => setFilter("secretaries")}>Secretarias</button>
        <button onClick={() => setFilter("regular")}>Clientes</button>
      </div>

      <div className="clients-list">
        {getClientsToDisplay().map(client => (
          <ClientRow
            key={client.id}
            client={client}
            toggleClient={toggleClient}
            expandedClientId={expandedClientId}
            handlePermissionChange={handlePermissionChange}
          />
        ))}
      </div>
    </div>
  );
}

const ClientRow = ({ client, toggleClient, expandedClientId, handlePermissionChange }) => (
  <div className="client-row">
    <div className="client-name" onClick={() => toggleClient(client.id)}>
      {client.first_name} {client.last_name} {expandedClientId === client.id ? "▲" : "▼"}
    </div>
    {expandedClientId === client.id && (
      <div className="client-details">
        <p>Username: {client.username}</p>
        <div className="permissions">
          <label>
            <input
              type="checkbox"
              checked={client.is_owner}
              onChange={() => handlePermissionChange(client.id, 'is_owner')}
            />
            Dueño
          </label>
          <label>
            <input
              type="checkbox"
              checked={client.is_professional}
              onChange={() => handlePermissionChange(client.id, 'is_professional')}
            />
            Profesional
          </label>
          <label>
            <input
              type="checkbox"
              checked={client.is_secretary}
              onChange={() => handlePermissionChange(client.id, 'is_secretary')}
            />
            Secretaria
          </label>
        </div>
      </div>
    )}
  </div>
);
