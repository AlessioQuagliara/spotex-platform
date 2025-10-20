import { useState } from 'react';
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const primaryColor = '#002040';
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('✅ Istruzioni inviate! Controlla la tua email per il link di reset della password.');
      } else {
        setMessage('❌ ' + (data.message || 'Errore durante l\'invio delle istruzioni'));
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
            Recupera la tua password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inserisci il tuo indirizzo email e ti invieremo le istruzioni per reimpostare la password
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-gray-200 transform hover:shadow-3xl transition-all duration-300">

          {/* Message Alert */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border text-center transform transition-all duration-300 ${
              isSuccess
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800 animate-shake'
            }`}>
              <div className="flex items-center justify-center">
                <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                {message}
              </div>
            </div>
          )}

          {!isSuccess ? (
            /* Forgot Password Form */
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    placeholder="nome@agenzia.it"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Riceverai un'email con le istruzioni per reimpostare la password
                </p>
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
                  <i className={`fas ${isLoading ? 'fa-spinner animate-spin' : 'fa-paper-plane'} mr-2`}></i>
                  {isLoading ? 'Invio in corso...' : 'Invia istruzioni'}
                </button>
              </div>
            </form>
          ) : (
            /* Success Message */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-envelope text-green-600 text-2xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Controlla la tua email</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Ti abbiamo inviato un'email con le istruzioni per reimpostare la password.
                  Se non vedi l'email, controlla anche la cartella spam.
                </p>
              </div>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm font-medium hover:text-black transition-colors duration-200 flex items-center justify-center"
              style={{ color: primaryColor }}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Torna al login
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Hai bisogno di aiuto?{' '}
            <Link
              to="/support"
              className="font-medium hover:text-black transition-colors duration-200"
              style={{ color: primaryColor }}
            >
              Contatta il supporto
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
          <div className="flex items-center justify-center text-sm text-blue-700">
            <i className="fas fa-shield-alt mr-2 text-blue-500"></i>
            <span>Il link di reset è valido per 1 ora e può essere usato una sola volta</span>
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