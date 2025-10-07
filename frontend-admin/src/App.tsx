import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import './index.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agencies from './pages/Agencies';
import Monitoring from './pages/Monitoring';
import Incidents from './pages/Incidents';

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
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Spotex Admin</span>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="/dashboard" className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium">
                    Dashboard
                  </a>
                  <a href="/agencies" className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium">
                    Agenzie
                  </a>
                  <a href="/monitoring" className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium">
                    Monitoraggio
                  </a>
                  <a href="/incidents" className="text-gray-600 hover:text-red-600 px-3 py-2 text-sm font-medium">
                    Sistema
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
              <Route path="/agencies" element={<ProtectedRoute><Agencies /></ProtectedRoute>} />
              <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
              <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
