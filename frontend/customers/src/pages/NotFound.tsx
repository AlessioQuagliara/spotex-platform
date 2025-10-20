import { Link } from "react-router-dom";

export default function NotFound() {
  const primaryColor = '#001f3f';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        
        {/* Logo */}
        <div className="mb-8">
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
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          
          {/* Animated 404 */}
          <div className="relative mb-8">
            <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl animate-bounce">
                <i className="fas fa-cloud text-blue-500"></i>
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pagina non trovata
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sembra che la pagina che stai cercando si sia persa nel cloud. 
            Forse è stata spostata, cancellata o non è mai esistita.
          </p>

          {/* Search Suggestion */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-200">
            <div className="flex items-center justify-center text-sm text-blue-700">
              <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
              <span>
                <strong>Suggerimento:</strong> Prova a controllare l'URL o usa la ricerca
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <i className="fas fa-home mr-2"></i>
              Torna alla Homepage
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Torna Indietro
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Forse cercavi:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/servizi/cloud" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Servizi Cloud
              </Link>
              <Link 
                to="/chi-siamo" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Chi Siamo
              </Link>
              <Link 
                to="/work-with-us" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Lavora con noi
              </Link>
              <Link 
                to="/consulenza-gratuita" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Consulenza
              </Link>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Hai bisogno di aiuto?{' '}
            <Link 
              to="/work-with-us" 
              className="font-medium hover:text-black transition-colors duration-200"
              style={{ color: primaryColor }}
            >
              Contatta il supporto
            </Link>
          </p>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-blue-100 rounded-full opacity-10 animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
}