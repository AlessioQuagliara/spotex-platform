import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './index.css';

// Import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Sites from './pages/Sites';
import Billing from './pages/Billing';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Spotex Agency</span>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="/dashboard" className="text-indigo-600 hover:text-indigo-900 px-3 py-2 text-sm font-medium">
                    Dashboard
                  </a>
                  <a href="/clients" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                    Clienti
                  </a>
                  <a href="/sites" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                    Siti
                  </a>
                  <a href="/billing" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                    Fatturazione
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
              <Route path="/sites" element={<ProtectedRoute><Sites /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            </Routes>
          </main>
          
        <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
