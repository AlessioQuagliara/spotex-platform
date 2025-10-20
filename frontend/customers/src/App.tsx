// Libreria React per le rotte

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import dei componenti delle pagine

import { LayoutAgency } from './components/LayoutAgency';
import { LayoutCompany } from './components/LayoutCompany';

// Import del context di autenticazione

import { AuthProvider, useAuth } from './context/AuthContext';

// Import delle pagine

import Login from './pages/Login';
import SignIn from './pages/SignIn';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AgencyDashboard from './pages/agency/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';
import ServerError from './pages/ServerError';

// Import degli stili

import './App.css'

// Layout wrapper per agency
function AgencyLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LayoutAgency>
      {children}
    </LayoutAgency>
  );
}

// Layout wrapper per company
function CompanyLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LayoutCompany>
      {children}
    </LayoutCompany>
  );
}

// Componente per determinare quale layout usare basato sul ruolo
function RoleBasedRoutes() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Caricamento...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'AGENCY') {
    return (
      <Routes>
        <Route path="/" element={<AgencyLayoutWrapper><AgencyDashboard /></AgencyLayoutWrapper>} />
        <Route path="/clienti" element={<AgencyLayoutWrapper><div>Clienti Agency</div></AgencyLayoutWrapper>} />
        <Route path="/wordpress" element={<AgencyLayoutWrapper><div>WordPress Agency</div></AgencyLayoutWrapper>} />
        <Route path="/webapp" element={<AgencyLayoutWrapper><div>Web App Agency</div></AgencyLayoutWrapper>} />
        <Route path="/tickets" element={<AgencyLayoutWrapper><div>Ticket Agency</div></AgencyLayoutWrapper>} />
        <Route path="/analytics" element={<AgencyLayoutWrapper><div>Analytics Agency</div></AgencyLayoutWrapper>} />
        <Route path="/automation" element={<AgencyLayoutWrapper><div>Automazione Agency</div></AgencyLayoutWrapper>} />
        <Route path="/security" element={<AgencyLayoutWrapper><div>Sicurezza Agency</div></AgencyLayoutWrapper>} />
        <Route path="/billing" element={<AgencyLayoutWrapper><div>Fatturazione Agency</div></AgencyLayoutWrapper>} />
        <Route path="/settings" element={<AgencyLayoutWrapper><div>Impostazioni Agency</div></AgencyLayoutWrapper>} />
        <Route path="/docs" element={<AgencyLayoutWrapper><div>Documentazione Agency</div></AgencyLayoutWrapper>} />
      </Routes>
    );
  }

  if (user?.role === 'COMPANY') {
    return (
      <Routes>
        <Route path="/" element={<CompanyLayoutWrapper><CompanyDashboard /></CompanyLayoutWrapper>} />
        <Route path="/projects" element={<CompanyLayoutWrapper><div>I Miei Progetti</div></CompanyLayoutWrapper>} />
        <Route path="/services" element={<CompanyLayoutWrapper><div>Servizi Richiesti</div></CompanyLayoutWrapper>} />
        <Route path="/billing" element={<CompanyLayoutWrapper><div>Fatturazione Company</div></CompanyLayoutWrapper>} />
        <Route path="/support" element={<CompanyLayoutWrapper><div>Supporto Company</div></CompanyLayoutWrapper>} />
        <Route path="/settings" element={<CompanyLayoutWrapper><div>Impostazioni Company</div></CompanyLayoutWrapper>} />
        <Route path="/docs" element={<CompanyLayoutWrapper><div>Documentazione Company</div></CompanyLayoutWrapper>} />
      </Routes>
    );
  }

  return <Navigate to="/login" replace />;
}

// Funzione principale dell'applicazione

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotte pubbliche */}
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Rotte autenticate */}
          <Route path="/*" element={<RoleBasedRoutes />} />

          {/* Error pages */}
          <Route path="/server-error" element={<ServerError />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
