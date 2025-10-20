import { useState } from 'react';
import { Link } from "react-router-dom";

export default function SignIn() {
  const primaryColor = '#002040';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'COMPANY' as 'COMPANY' | 'AGENCY'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Registrazione completata! Controlla la tua email per verificare l\'account.');
        // Reset form
        setFormData({ email: '', password: '', name: '', role: 'COMPANY' });
      } else {
        setMessage('❌ ' + (data.message || 'Errore durante la registrazione'));
      }
    } catch (error) {
      setMessage('❌ Errore di connessione. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center space-x-3">
              <span 
                className="text-3xl font-bold"
                style={{ color: primaryColor }}
              >
                SPOTEX
              </span>
              <span className="text-sm text-gray-500 italic">
                Cloud
              </span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Crea il tuo account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Oppure{' '}
            <Link 
              to="/login" 
              className="font-medium hover:text-black transition-colors duration-200"
              style={{ color: primaryColor }}
            >
              accedi al tuo account esistente
            </Link>
          </p>
        </div>

        {/* SignIn Card */}
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-gray-200 transform hover:shadow-3xl transition-all duration-300">
          
          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border text-center transform transition-all duration-300 ${
              message.startsWith('✅') 
                ? 'bg-green-50 border-green-200 text-green-800 animate-pulse' 
                : 'bg-red-50 border-red-200 text-red-800 animate-shake'
            }`}>
              <div className="flex items-center justify-center">
                <i className={`fas ${message.startsWith('✅') ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                {message}
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user text-gray-400 text-lg"></i>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Mario Rossi"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email professionale *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400 text-lg"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="nome@agenzia.it"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400 text-lg"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  placeholder="Minimo 6 caratteri"
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600 transition-colors duration-200`}></i>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                La password deve contenere almeno 6 caratteri
              </p>
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo Account *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-briefcase text-gray-400 text-lg"></i>
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                >
                  <option value="COMPANY">Cliente (Azienda)</option>
                  <option value="AGENCY">Agenzia Partner</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              
              {/* Role Description */}
              <div className="mt-2 text-xs text-gray-500">
                {formData.role === 'COMPANY' ? (
                  <span>Perfetto per aziende che cercano servizi cloud gestiti</span>
                ) : (
                  <span>Ideale per agenzie che vogliono offrire servizi white-label</span>
                )}
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
                <div>
                  <p className="text-sm text-blue-700">
                    Creando un account, accetti i nostri{' '}
                    <Link to="/termini" className="font-medium underline">Termini di Servizio</Link>{' '}
                    e la{' '}
                    <Link to="/privacy" className="font-medium underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ backgroundColor: primaryColor }}
              >
                <i className={`fas ${isLoading ? 'fa-spinner animate-spin' : 'fa-user-plus'} mr-2`}></i>
                {isLoading ? 'Registrazione in corso...' : 'Crea il tuo account'}
              </button>
            </div>
          </form>

          {/* Social Registration Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Oppure registrati con</span>
              </div>
            </div>

            {/* Social Registration Buttons */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              >
                <i className="fab fa-google text-red-500 text-lg"></i>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              >
                <i className="fab fa-microsoft text-blue-500 text-lg"></i>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
              >
                <i className="fab fa-github text-gray-700 text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Hai già un account?{' '}
            <Link 
              to="/login" 
              className="font-medium hover:text-black transition-colors duration-200"
              style={{ color: primaryColor }}
            >
              Accedi qui
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
          <div className="flex items-center justify-center text-sm text-blue-700">
            <i className="fas fa-shield-alt mr-2 text-blue-500"></i>
            <span>I tuoi dati sono protetti e crittografati</span>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}