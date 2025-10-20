import { Link } from "react-router-dom";
import logo from '../assets/logo_react-2.svg';

export function Footer() {
  const primaryColor = '#002040';
  const secondaryColor = '#d6d6d6ff';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white" style={{ borderTop: `3px solid ${primaryColor}` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="flex items-center space-x-2">
                <img src={logo} alt="Spotex" className="h-10 w-auto" />
              </Link>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Leader nei servizi cloud innovativi per trasformare il tuo business digitale. 
              Soluzioni scalabili, sicure e performanti per le tue esigenze.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Servizi Cloud */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: secondaryColor }}>Servizi Cloud</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/servizi/cloud-public" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Cloud Pubblico
                </Link>
              </li>
              <li>
                <Link to="/servizi/cloud-private" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Cloud Privato
                </Link>
              </li>
              <li>
                <Link to="/servizi/cloud-ibrido" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Cloud Ibrido
                </Link>
              </li>
              <li>
                <Link to="/servizi/migration" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Migrazione Cloud
                </Link>
              </li>
              <li>
                <Link to="/servizi/backup" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Backup & Recovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Cybersecurity */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: secondaryColor }}>Sicurezza</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/servizi/cybersecurity" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Protezione Dati
                </Link>
              </li>
              <li>
                <Link to="/servizi/compliance" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Compliance
                </Link>
              </li>
              <li>
                <Link to="/servizi/monitoring" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Monitoring 24/7
                </Link>
              </li>
              <li>
                <Link to="/servizi/consulting" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Consulenza Security
                </Link>
              </li>
              <li>
                <Link to="/servizi/gdpr" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>

          {/* work-with-us */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: secondaryColor }}>work-with-us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Via Dei Gelsi 3, 22020 Faloppio CO</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>+39 389 965 7115</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>info@spotexsrl.it</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © {currentYear} Spotex SRL. Tutti i diritti riservati.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/cookie" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Cookie Policy
            </Link>
            <Link to="/termini" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Termini e Condizioni
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 p-6 rounded-lg text-center" style={{ backgroundColor: 'rgba(0, 31, 63, 0.1)' }}>
          <h4 className="text-lg font-semibold mb-2">Pronto per la trasformazione cloud?</h4>
          <p className="text-gray-400 text-sm mb-4">Contattaci per una consulenza gratuita e senza impegno</p>
          <Link
            to="/landing"
            className="inline-flex items-center px-6 py-3 rounded-md text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            Richiedi Consulenza
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}