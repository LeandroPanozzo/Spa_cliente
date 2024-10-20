import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { setupAxiosInterceptors } from './App.jsx'
import { AuthProvider } from './components/AuthContext'; // Asegúrate de que la ruta sea correcta


setupAxiosInterceptors();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Envolver el App con AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>,
)
