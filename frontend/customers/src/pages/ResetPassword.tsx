import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const primaryColor = '#002040';
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('❌ Token di reset mancante. Richiedi un nuovo link di reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('❌ Le password non corrispondono');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage('❌ La password deve essere di almeno 8 caratteri');
      setIsLoading(false);
      return;
    }

    if (!token) {
      setMessage('❌ Token di reset mancante. Richiedi un nuovo link di reset.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('✅ Password reimpostata con successo! Ora puoi accedere con la tua nuova password.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage('❌ ' + (data.message || 'Errore durante il reset della password'));
      }
    } catch (error) {
      setMessage('❌ Errore di connessione. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0: case 1: return { text: 'Molto debole', color: 'text-red-500' };
      case 2: return { text: 'Debole', color: 'text-orange-500' };
      case 3: return { text: 'Buona', color: 'text-yellow-500' };
      case 4: return { text: 'Forte', color: 'text-green-500' };
      case 5: return { text: 'Molto forte', color: 'text-green-600' };
      default: return { text: 'Debole', color: 'text-red-500' };
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = getPasswordStrengthText(passwordStrength);

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
            Reimposta la password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inserisci la tua nuova password sicura
          </p>
        </div>

        {/* Reset Password Card */}
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

          {!isSuccess && token && (
            /* Reset Password Form */
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nuova password *
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    placeholder="Almeno 8 caratteri"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600`}></i>
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Sicurezza password:</span>
                      <span className={`font-medium ${strengthInfo.color}`}>{strengthInfo.text}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength === 1 ? 'bg-red-500' :
                          passwordStrength === 2 ? 'bg-orange-500' :
                          passwordStrength === 3 ? 'bg-yellow-500' :
                          passwordStrength === 4 ? 'bg-green-500' :
                          passwordStrength === 5 ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="mt-2 text-xs text-gray-500 space-y-1">
                  <p>La password deve contenere:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li className={password.length >= 8 ? 'text-green-600' : ''}>Almeno 8 caratteri</li>
                    <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>Una lettera maiuscola</li>
                    <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>Una lettera minuscola</li>
                    <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>Un numero</li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Conferma nuova password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400 text-lg"></i>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`appearance-none block w-full px-4 py-3 pl-12 pr-12 border rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm ${
                      confirmPassword && password !== confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ripeti la password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-400 hover:text-gray-600`}></i>
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">Le password non corrispondono</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-800 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <button
                  type="submit"
                  disabled={isLoading || password !== confirmPassword || password.length < 8 || !token}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ backgroundColor: primaryColor }}
                >
                  <i className={`fas ${isLoading ? 'fa-spinner animate-spin' : 'fa-key'} mr-2`}></i>
                  {isLoading ? 'Aggiornamento...' : 'Reimposta password'}
                </button>
              </div>
            </form>
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
        <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
          <div className="flex items-center justify-center text-sm text-green-700">
            <i className="fas fa-shield-alt mr-2 text-green-500"></i>
            <span>La tua nuova password sarà crittografata e sicura</span>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-green-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}