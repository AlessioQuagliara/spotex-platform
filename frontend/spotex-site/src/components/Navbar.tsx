import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import logo from '../assets/react.svg';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const primaryColor = '#002040';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        // Mobile dropdown handled separately
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-500 ${
        isScrolled 
          ? 'shadow-2xl border-b-2 border-gray-100' 
          : 'shadow-lg border-b border-gray-200'
      }`}
      style={{ borderBottom: `3px solid ${primaryColor}` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo e Nome Azienda */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="flex-shrink-0 font-bold text-2xl hover:opacity-80 transition-all duration-300 transform hover:scale-105"
              style={{ color: primaryColor }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <img src={logo} alt="Spotex" className="h-10 w-auto" />
              SPOTEX SRL
              </Link>
            </Link>
            <span className="hidden md:block text-sm text-gray-500 italic bg-gradient-to-r from-gray-600 to-gray-400 bg-clip-text text-transparent">
              Cloud Solutions
            </span>
          </div>

          {/* Menu Desktop - Centrale */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-12">
            <div className="flex space-x-8">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              {/* Dropdown Servizi */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 flex items-center group"
                >
                  Servizi
                  <svg 
                    className={`w-4 h-4 ml-2 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                <div 
                  className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 transform origin-top ${
                    isServicesOpen 
                      ? 'opacity-100 scale-100 translate-y-0' 
                      : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="py-3">
                    <Link 
                      to="/servizi/cloud" 
                      className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 flex items-center group"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                      Servizi Cloud
                    </Link>
                    <Link 
                      to="/servizi/cybersecurity" 
                      className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 flex items-center group"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <span className="w-2 h-2 bg-gray-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                      Cybersecurity
                    </Link>
                    <Link 
                      to="/servizi/automazione" 
                      className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 flex items-center group"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <span className="w-2 h-2 bg-gray-600 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                      Automazione
                    </Link>
                    <Link 
                      to="/servizi/managed-it" 
                      className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 flex items-center group"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <span className="w-2 h-2 bg-gray-700 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></span>
                      Managed IT
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                to="/about-us"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 relative group"
              >
                Chi Siamo
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/work-with-us"
                className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 relative group"
              >
                Carriera
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>
          </div>

          {/* Right Side - Auth & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Login e signin */}
            <div className="flex items-center space-x-4">
              <Link
                to="http://localhost:3004/login"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 flex items-center group"
              >
                <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </Link>
              <div className="h-4 w-px bg-gray-300"></div>
              <Link
                to="http://localhost:3004/signin"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 flex items-center group"
              >
                <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                signin
              </Link>
            </div>

            {/* CTA Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gray-200 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <Link
                to="/landing"
                className="relative px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.backgroundColor = '#003366';
                  target.style.boxShadow = '0 10px 25px -5px rgba(0, 32, 64, 0.4)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.backgroundColor = primaryColor;
                  target.style.boxShadow = '';
                }}
              >
                <i className="fas fa-rocket mr-2"></i>
                Inizia Ora
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-expanded="false"
            >
              <span className="sr-only">Apri menu principale</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          
          {/* Mobile Services Dropdown */}
          <div className="px-4" ref={mobileDropdownRef}>
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="w-full flex items-center justify-between px-0 py-3 text-base font-medium text-gray-700 hover:text-black transition-colors duration-200"
            >
              Servizi
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isServicesOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pl-4 space-y-2 mt-2">
                <Link 
                  to="/servizi/cloud" 
                  className="block px-4 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center group"
                  onClick={() => {
                    setIsOpen(false);
                    setIsServicesOpen(false);
                  }}
                >
                  <i className="fas fa-cloud mr-2 text-gray-400 group-hover:text-black transition-colors duration-200"></i>
                  Servizi Cloud
                </Link>
                <Link 
                  to="/servizi/cybersecurity" 
                  className="block px-4 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center group"
                  onClick={() => {
                    setIsOpen(false);
                    setIsServicesOpen(false);
                  }}
                >
                  <i className="fas fa-shield-alt mr-2 text-gray-400 group-hover:text-black transition-colors duration-200"></i>
                  Cybersecurity
                </Link>
                <Link 
                  to="/servizi/automazione" 
                  className="block px-4 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center group"
                  onClick={() => {
                    setIsOpen(false);
                    setIsServicesOpen(false);
                  }}
                >
                  <i className="fas fa-cogs mr-2 text-gray-400 group-hover:text-black transition-colors duration-200"></i>
                  Automazione
                </Link>
                <Link 
                  to="/servizi/managed-it" 
                  className="block px-4 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center group"
                  onClick={() => {
                    setIsOpen(false);
                    setIsServicesOpen(false);
                  }}
                >
                  <i className="fas fa-tools mr-2 text-gray-400 group-hover:text-black transition-colors duration-200"></i>
                  Managed IT
                </Link>
              </div>
            </div>
          </div>
          
          <Link
            to="/about-us"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Chi Siamo
          </Link>
          <Link
            to="/work-with-us"
            className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Carriera
          </Link>

          {/* Mobile Auth Links */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <Link
              to="/login"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all duration-300 mb-2"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Accedi al Account
              </div>
            </Link>
            <Link
              to="/signin"
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Crea Account
              </div>
            </Link>
          </div>

          {/* Mobile CTA */}
          <div className="pt-4">
            <Link
              to="/landing"
              className="block w-full text-center px-4 py-4 rounded-xl text-base font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-[#002040] hover:bg-black"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-rocket mr-2"></i>
              Consulenza Gratuita
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}