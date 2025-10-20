import { useState } from 'react';
import { Link } from "react-router-dom";

export default function ServerError() {
  const primaryColor = '#001f3f';
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleTryAgain = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          
          {/* Animated Server Error */}
          <div className="relative mb-8">
            <div className="text-8xl font-bold text-gray-300 mb-4">500</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-3xl ${isRefreshing ? 'animate-spin' : 'animate-pulse'}`}>
                <i className={`fas ${isRefreshing ? 'fa-sync-alt' : 'fa-server'} text-red-500`}></i>
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Errore del Server
          </h1>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Si è verificato un errore imprevisto sul nostro server. 
            Il nostro team tecnico è già stato avvisato e sta lavorando per risolvere il problema.
          </p>

          {/* Status Update */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <div className="flex items-center justify-center text-sm text-yellow-800">
              <i className="fas fa-exclamation-triangle mr-2 text-yellow-500"></i>
              <span>
                <strong>Stato sistema:</strong> Il nostro team sta risolvendo il problema
              </span>
            </div>
          </div>

          {/* Technical Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-gray-400 mt-1 mr-3"></i>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Cosa è successo?</h4>
                <p className="text-xs text-gray-600">
                  Il server ha riscontrato un errore interno mentre elaborava la tua richiesta. 
                  Questo è un problema temporaneo che verrà risolto al più presto.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              <i className={`fas ${isRefreshing ? 'fa-spinner animate-spin' : 'fa-redo'} mr-2`}></i>
              {isRefreshing ? 'Ricarica in corso...' : 'Ricarica Pagina'}
            </button>
            
            <button
              onClick={handleTryAgain}
              disabled={isRefreshing}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Riprova
            </button>
          </div>

          {/* Alternative Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Azioni alternative:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200"
                style={{ backgroundColor: primaryColor }}
              >
                <i className="fas fa-home mr-2"></i>
                Torna alla Home
              </Link>
              
              <a 
                href="mailto:support@spotexcloud.it" 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <i className="fas fa-envelope mr-2"></i>
                Contatta Supporto
              </a>
              
              <a 
                href="tel:+390612345678" 
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <i className="fas fa-phone mr-2"></i>
                Chiama Ora
              </a>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-800">Altri servizi funzionano normalmente</span>
              </div>
              <Link 
                to="/status" 
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Verifica Stato
              </Link>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-center text-sm text-blue-700">
              <i className="fas fa-headset mr-2 text-blue-500"></i>
              <span>
                <strong>Supporto Tecnico:</strong> Disponibile 24/7 al{' '}
                <a href="tel:+390612345678" className="font-bold hover:underline">+39 06 1234 5678</a>
              </span>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-red-100 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-red-100 rounded-full opacity-10 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-red-100 rounded-full opacity-5 animate-pulse delay-500"></div>
        </div>

        {/* Console-like debug info */}
        <div className="mt-6 text-center">
          <details className="inline-block text-left">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              Informazioni tecniche (per sviluppatori)
            </summary>
            <div className="mt-2 p-3 bg-gray-900 rounded-lg text-gray-300 text-xs font-mono max-w-md mx-auto">
              <div className="mb-1">
                <span className="text-green-400">$</span>{' '}
                <span>status-check --server-error</span>
              </div>
              <div className="text-red-400">❌ HTTP 500 - Internal Server Error</div>
              <div className="text-yellow-400">⚠️ Incident report generated</div>
              <div className="text-blue-400">ℹ️ Engineering team notified</div>
              <div className="text-green-400">✅ Automated recovery in progress</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}