import { useState } from 'react';
import { Link } from "react-router-dom";

export default function LavoraConNoi() {
  const primaryColor = '#002040';
  const [activeDepartment, setActiveDepartment] = useState('tech');

  const departments = [
    {
      id: 'tech',
      name: 'Tecnologia & Cloud',
      icon: 'server',
      color: 'from-blue-500 to-blue-700',
      jobs: ['Cloud Architect', 'DevOps Engineer', 'Full Stack Developer', 'SRE Engineer'],
      description: 'Costruisci la prossima generazione di piattaforme cloud'
    },
    {
      id: 'sales',
      name: 'Sales & Business',
      icon: 'chart-line',
      color: 'from-green-500 to-green-700',
      jobs: ['Account Executive', 'Sales Manager', 'Business Developer', 'Partner Manager'],
      description: 'Trasforma il mercato cloud italiano'
    },
    {
      id: 'marketing',
      name: 'Marketing & Growth',
      icon: 'rocket',
      color: 'from-purple-500 to-purple-700',
      jobs: ['Growth Marketer', 'Content Strategist', 'Digital Marketing Specialist', 'SEO Manager'],
      description: 'Racconta la rivoluzione cloud alle agenzie'
    },
    {
      id: 'customer',
      name: 'Customer Success',
      icon: 'star',
      color: 'from-orange-500 to-orange-700',
      jobs: ['Customer Success Manager', 'Technical Support', 'Onboarding Specialist', 'Solution Architect'],
      description: 'Guida le agenzie verso il successo cloud'
    }
  ];

  const benefits = [
    {
      icon: 'money-bill-wave',
      title: 'Competitive Salary',
      description: 'Retribuzione competitiva + bonus performance'
    },
    {
      icon: 'home',
      title: 'Smart Working',
      description: 'Lavora da dove vuoi con flessibilità totale'
    },
    {
      icon: 'graduation-cap',
      title: 'Formazione Continua',
      description: 'Budget formazione e certificazioni cloud'
    },
    {
      icon: 'chart-line',
      title: 'Equity Option',
      description: 'Partecipa al successo dell\'azienda'
    },
    {
      icon: 'umbrella-beach',
      title: 'Welfare Aziendale',
      description: 'Pacchetto benefit personalizzabile'
    },
    {
      icon: 'lightbulb',
      title: 'Innovazione',
      description: 'Lavora con le tecnologie più avanzate'
    }
  ];

  const teamHighlights = [
    {
      metric: '3x',
      description: 'Crescita anno su anno'
    },
    {
      metric: '50+',
      description: 'Server gestiti'
    },
    {
      metric: '32',
      description: 'Agenzie partner'
    },
    {
      metric: '€1.2M+',
      description: 'Ricavi generati'
    }
  ];

  const openPositions = [
    {
      title: 'Senior Cloud Architect',
      department: 'tech',
      type: 'Full-time',
      location: 'Como / Remoto',
      experience: 'Senior',
      description: 'Progetta e implementa architetture cloud scalabili per le nostre agenzie partner'
    },
    {
      title: 'DevOps Engineer',
      department: 'tech',
      type: 'Full-time',
      location: 'Como / Remoto',
      experience: 'Mid-Senior',
      description: 'Automatizza e ottimizza i processi di deployment e monitoring'
    },
    {
      title: 'Account Executive',
      department: 'sales',
      type: 'Full-time',
      location: 'Como',
      experience: 'Mid-Senior',
      description: 'Aiuta le agenzie marketing a trasformare il loro business con il cloud'
    },
    {
      title: 'Growth Marketer',
      department: 'marketing',
      type: 'Full-time',
      location: 'Como / Remoto',
      experience: 'Mid-Level',
      description: 'Guida le strategie di acquisizione e conversione per il mercato B2B'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <br />
      <section className="relative bg-white pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Lavora nella <span style={{ color: primaryColor }}>Rivoluzione Cloud</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Unisciti al team che sta trasformando il modo in cui le agenzie marketing 
              offrono servizi cloud in Italia. Costruiamo il futuro insieme.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/careers/positions"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                <i className="fas fa-briefcase mr-3"></i>
                Vedi le Posizioni Aperte
              </Link>
              <a
                href="#why-join"
                className="inline-flex items-center px-8 py-4 border-2 text-lg font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                <i className="fas fa-info-circle mr-3"></i>
                Scopri di Più
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {teamHighlights.map((stat, index) => (
              <div key={index} className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-white mb-2">{stat.metric}</div>
                <div className="text-gray-300 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section id="why-join" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Perché <span style={{ color: primaryColor }}>Unirsi a Noi</span>?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Non siamo solo un'azienda tech. Siamo una rivoluzione nel mercato cloud italiano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <i className={`fas fa-${benefit.icon} text-blue-600 text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              I Nostri <span style={{ color: primaryColor }}>Team</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Scegli il team che più si adatta alle tue competenze e passioni
            </p>
          </div>

          {/* Department Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setActiveDepartment(dept.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeDepartment === dept.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`fas fa-${dept.icon} mr-2`}></i>
                    {dept.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Department Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className={`${activeDepartment === dept.id ? 'block' : 'hidden'}`}
              >
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-6">
                    <i className={`fas fa-${dept.icon} text-blue-600 text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{dept.name}</h3>
                    <p className="text-gray-600 text-lg">{dept.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dept.jobs.map((job, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">{job}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span>Como / Remoto</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Posizioni <span style={{ color: primaryColor }}>Aperte</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Unisciti al nostro team in crescita
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    <p className="text-gray-600 mb-4">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <i className="fas fa-building mr-2"></i>
                        <span>{position.department}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-2"></i>
                        <span>{position.type}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-chart-line mr-2"></i>
                        <span>{position.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <button
                      className="w-full lg:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <i className="fas fa-paper-plane mr-2"></i>
                      Candidati
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Match Position */}
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <i className="fas fa-handshake text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Non trovi la posizione giusta?</h3>
              <p className="text-gray-600 mb-4">
                Siamo sempre alla ricerca di talenti. Inviaci comunque il tuo CV!
              </p>
              <button
                className="inline-flex items-center justify-center px-6 py-3 border-2 text-base font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                style={{ color: primaryColor, borderColor: primaryColor }}
              >
                <i className="fas fa-envelope mr-2"></i>
                Invia Candidatura Spontanea
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold sm:text-5xl mb-6">
            Pronto a <span style={{ color: '#60A5FA' }}>Rivoluzionare</span> il Cloud Italiano?
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Unisciti al team che sta trasformando il modo in cui le agenzie marketing 
            offrono servizi cloud. Costruiamo il futuro insieme.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <Link
              to="/careers/apply"
              className="inline-flex items-center justify-center px-12 py-5 border border-transparent text-xl font-medium rounded-lg text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600"
            >
              <i className="fas fa-paper-plane mr-3"></i>
              INVIACI IL TUO CV
            </Link>
            <a
              href="mailto:careers@spotexcloud.it"
              className="inline-flex items-center justify-center px-12 py-5 border-2 border-white text-xl font-medium rounded-lg text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              <i className="fas fa-envelope mr-3"></i>
              SCRIVICI
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}