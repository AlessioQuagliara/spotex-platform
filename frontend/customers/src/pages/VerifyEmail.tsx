import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function VerifyEmail() {
  const primaryColor = '#002040';
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmailToken(token);
    }
  }, [token]);

  const verifyEmailToken = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('✅ Email verificata con successo! Ora puoi accedere al tuo account.');

        // Salva il token se presente
        if (data.data?.token) {
          localStorage.setItem('token', data.data.token);
          // Reindirizza alla home dopo 2 secondi
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        setMessage('❌ ' + (data.message || 'Verifica email fallita'));
      }
    } catch (error) {
      setMessage('❌ Errore durante la verifica. Riprova più tardi.');
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
            Verifica Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Stiamo verificando il tuo indirizzo email...
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-gray-200 transform hover:shadow-3xl transition-all duration-300">
          
          {/* Content */}
          <div className="text-center">
            {isLoading ? (
              <div className="space-y-6">
                {/* Animated Spinner */}
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-200 rounded-full mx-auto"></div>
                  <div className="w-20 h-20 border-4 border-t-blue-600 rounded-full animate-spin mx-auto absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Verifica in corso</h3>
                  <p className="text-gray-600 text-sm">
                    Stiamo confermando il tuo indirizzo email...
                  </p>
                </div>

                {/* Loading Dots */}
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Success/Error Icon */}
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                  isSuccess ? 'bg-green-100 animate-pulse' : 'bg-red-100 animate-shake'
                }`}>
                  <i className={`fas ${
                    isSuccess ? 'fa-check-circle text-green-600 text-4xl' : 'fa-exclamation-circle text-red-600 text-4xl'
                  }`}></i>
                </div>

                {/* Message */}
                <div className={`p-4 rounded-xl border ${
                  isSuccess 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <p className="text-sm font-medium">{message}</p>
                </div>

                {/* Additional Info */}
                <div className="text-sm text-gray-600">
                  {isSuccess ? (
                    <p>Stai per essere reindirizzato automaticamente...</p>
                  ) : (
                    <p>Il link di verifica potrebbe essere scaduto o non valido.</p>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {isSuccess ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-800 rounded-xl blur opacity-25 transition duration-1000"></div>
                        <Link
                          to="/"
                          className="relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <i className="fas fa-home mr-2"></i>
                          Vai alla Homepage
                        </Link>
                      </div>
                      <Link
                        to="/login"
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <i className="fas fa-sign-in-alt mr-2"></i>
                        Accedi Ora
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl blur opacity-25 transition duration-1000"></div>
                        <Link
                          to="/signin"
                          className="relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <i className="fas fa-user-plus mr-2"></i>
                          Registrati di Nuovo
                        </Link>
                      </div>
                      <Link
                        to="/login"
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                      >
                        <i className="fas fa-sign-in-alt mr-2"></i>
                        Torna al Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center justify-center text-sm text-blue-700">
              <i className="fas fa-question-circle mr-2 text-blue-500"></i>
              <span>
                Problemi con la verifica?{' '}
                <a 
                  href="mailto:support@spotexcloud.it" 
                  className="font-medium underline hover:text-blue-800"
                >
                  Contatta il supporto
                </a>
              </span>
            </div>
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