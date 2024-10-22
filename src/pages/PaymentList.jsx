import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Decimal from 'decimal.js';
import logo from '../assets/bigLogoSPA.png';

const API_URL = import.meta.env.VITE_API_URL;

export function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPayments();
    } else {
      navigate('/login');
    }
    document.body.style.backgroundColor = '#ffffff';
  }, [isAuthenticated, navigate]);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_URL}/sentirseBien/api/v1/payments-list/`, {
        params: { start_date: startDate, end_date: endDate },
      });
      setPayments(response.data);
    } catch (error) {
      setError('Error al cargar los pagos');
    }
  };

  // Agrupar pagos por tipo de pago
  const groupPaymentsByType = () => {
    return payments.reduce((acc, payment) => {
      const type = payment.payment_type;
      if (!acc[type]) {
        acc[type] = {
          total: new Decimal(0),
          count: 0,
        };
      }
      acc[type].total = acc[type].total.plus(new Decimal(payment.total_payment));
      acc[type].count += 1;
      return acc;
    }, {});
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

  // Descargar PDF
  const downloadPDF = async () => {
    const doc = await generatePDF();
    doc.save(`ganancias-${startDate}-a-${endDate}.pdf`);
  };

  // Generar PDF
  // Generar PDF
const generatePDF = async () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  try {
    const logoBase64 = await convertImageToBase64(logo);
    const logoWidth = 70;
    const logoHeight = 30;
    const xPosLogo = (pageWidth - logoWidth) / 2;

    doc.addImage(logoBase64, 'PNG', xPosLogo, 10, logoWidth, logoHeight);

    const title = 'Informe de Ganancias por Tipo de Pago';
    const titleX = (pageWidth - doc.getTextWidth(title)) / 2;
    doc.text(title, titleX, 50);

    // Mostrar las fechas de filtro
    const filterText = `Desde: ${startDate} Hasta: ${endDate}`;
    const filterTextX = (pageWidth - doc.getTextWidth(filterText)) / 2;
    doc.text(filterText, filterTextX, 60); // Ajustar la posición y el tamaño

    const groupedPayments = groupPaymentsByType();
    const tableData = Object.keys(groupedPayments).map((type) => [
      type,
      groupedPayments[type].count,
      groupedPayments[type].total.toFixed(2),
    ]);

    // Ajustar startY para evitar sobreposición con el filtro
    const tableStartY = 70; // Definir un espacio suficiente después del texto de fechas

    doc.autoTable({
      head: [['Tipo de Pago', 'Número de Pagos', 'Total Ganado']],
      body: tableData,
      startY: tableStartY, // Ajustar la posición de la tabla
    });

    return doc; // Devolver el objeto jsPDF
  } catch (error) {
    console.error('Error al agregar el logo al PDF:', error);
  }
};

  // Imprimir PDF
  const printPDF = async () => {
    const doc = await generatePDF(); // Generar el PDF
    const pdfOutput = doc.output('blob'); // Obtener el PDF como un Blob
    const pdfUrl = URL.createObjectURL(pdfOutput); // Crear un URL del Blob
  
    const printWindow = window.open(pdfUrl); // Abrir una nueva ventana
  
    printWindow.onload = () => {
      printWindow.print(); // Imprimir el contenido cuando la ventana esté cargada
    };
  
    // Cerrar la ventana después de un breve retraso para permitir que se imprima
    printWindow.onafterprint = () => {
      printWindow.close(); // Cerrar la ventana después de imprimir
    };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lista de Pagos</h1>
      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.filterContainer}>
        <label style={styles.label}>Fecha Inicio:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={styles.input}
        />
        <label style={styles.label}>Fecha Fin:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchPayments} style={styles.button}>Filtrar</button>
      </div>

      <div>
        {payments.length > 0 ? (
          <div>
            <ul style={styles.list}>
              {payments.map((payment) => (
                <li key={payment.id} style={styles.paymentCard}>
                  <p style={styles.text}>Cliente: {payment.client_first_name} {payment.client_last_name}</p>
                  <p style={styles.text}>Total Pagado: {payment.total_payment}</p>
                  <p style={styles.text}>Tipo de Pago: {payment.payment_type}</p>
                  <p style={styles.text}>Fecha de Pago: {new Date(payment.payment_date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>

            {/* Botón para descargar PDF */}
            <button onClick={downloadPDF} style={styles.downloadButton}>
              Descargar Informe de Ganancias
            </button>

            {/* Botón para imprimir PDF */}
            <button onClick={printPDF} style={styles.downloadButton}>
              Imprimir Informe de Ganancias
            </button>
          </div>
        ) : (
          <p>No se encontraron pagos en las fechas seleccionadas.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '20px auto',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '20px',
    color: '#ff7f8a', // Green color for the title
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  label: {
    fontWeight: 'bold',
    color: '#4ea74e', // Green color for labels
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #4ea74e', // Green border for inputs
    borderRadius: '5px',
    outline: 'none',
  },
  button: {
    padding: '10px',
    backgroundColor: '#4ea74e', // Green background for buttons
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s', // Smooth transition for hover effect
  },
  buttonHover: {
    backgroundColor: '#3c8d4c', // Darker green on hover
  },
  list: {
    listStyleType: 'none',
    paddingLeft: 0,
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  text: {
    fontSize: '18px',
    marginBottom: '10px',
    color: '#333', // Darker text for better readability
  },
  downloadButton: {
    padding: '12px 20px',
    backgroundColor: '#4ea74e', // Light pink for download buttons
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    display: 'block',
    width: '100%',
    textAlign: 'center',
    transition: 'background-color 0.3s', // Smooth transition for hover effect
  },
  downloadButtonHover: {
    backgroundColor: '#e66776', // Darker pink on hover
  },
};