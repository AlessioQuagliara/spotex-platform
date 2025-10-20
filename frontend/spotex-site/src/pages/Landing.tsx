import { useState } from 'react';
import { Link } from "react-router-dom";

export default function Landing() {
    const primaryColor = '#002040';
    const secondaryColor = '#d6d6d6ff';
    const [activeTab, setActiveTab] = useState('agency');

  const stats = [
    { number: '32', label: 'Agenzie Trasformate' },
    { number: '€1.2M+', label: 'Ricavi Generati' },
    { number: '45%', label: 'Margine Medio' },
    { number: '15h', label: 'Tempo Risparmiato/Settimana' }
  ];

  const features = [
    {
      icon: 'fas fa-rocket',
      title: 'Deploy in 60 Secondi',
      description: 'Server WordPress pronti prima che il cliente finisca il caffè. Automazione completa che elimina ore di lavoro tecnico.'
    },
    {
      icon: 'fas fa-tag',
      title: '100% White-Label',
      description: 'I tuoi clienti vedono solo il tuo brand. Pannelli personalizzati, fatture con il tuo logo, supporto con il tuo nome.'
    },
    {
      icon: 'fas fa-money-bill-wave',
      title: 'Fino al 50% di Margine',
      description: 'Ricavi ricorrenti che trasformano la tua rentabilità. Guadagni extra senza costi infrastrutturali.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Enterprise Security',
      description: 'Infrastruttura Tier-IV con backup automatici, SSL e protezione DDoS. Dormi sonni tranquilli.'
    }
  ];

  const testimonials = [
    {
      name: "Marco R. - WebSolutions",
      role: "Agenzia di 12 persone",
      content: "In 4 mesi con Spotex abbiamo aggiunto €12.000 di ricavi ricorrenti. Finalmente possiamo competere con le big agency.",
      before: "€2.500/mese",
      after: "€8.700/mese"
    },
    {
      name: "Laura B. - CreativeLab",
      role: "Agenzia di 8 persone",
      content: "I deploy automatici ci fanno risparmiare 20 ore a settimana. Ora ci concentriamo sulla creatività, non sui server.",
      before: "15h/settimana",
      after: "2h/settimana"
    },
    {
      name: "Andrea V. - DigitalBoost",
      role: "Agenzia di 25 persone",
      content: "Spotex ha trasformato il nostro business model. Abbiamo ricorrenti che ci permettono di pianificare la crescita.",
      before: "€18k/mese",
      after: "€42k/mese"
    }
  ];

  const faqs = [
    {
      question: "Quanto tempo ci vuole per iniziare?",
      answer: "In 24 ore hai la tua piattaforma white-label pronta. Il setup è incluso nella consulenza gratuita."
    },
    {
      question: "Quali sono i costi iniziali?",
      answer: "Zero. Nessun costo di setup. Paghi solo una percentuale sui ricavi generati attraverso la nostra piattaforma."
    },
    {
      question: "Posso usare il mio brand?",
      answer: "Assolutamente sì. Tutto è 100% white-label: dashboard, fatture, email, supporto - tutto sotto il tuo brand."
    },
    {
      question: "E se i miei clienti hanno bisogno di supporto?",
      answer: "Offriamo supporto multi-livello. I tuoi clienti ti contattano, e noi supportiamo te come partner."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Absolute Persuasion */}
      <section className="relative bg-white overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-[#002040] text-white shadow-lg">
                  <i className="fas fa-rocket mr-2"></i>
                  OLTRE 30 AGENZIE TRASFORMATE NEGLI ULTIMI 60 GIORNI
                </div>
                
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Da <span className="text-black line-through">2 Clienti/Anno</span> a</span>
                  <span className="block" style={{ color: primaryColor }}>+€50.000/Anno</span>
                  <span className="block text-xl sm:text-2xl md:text-3xl mt-4 text-gray-600">
                    con il Tuo <span className="font-bold" style={{ color: primaryColor }}>Cloud White-Label</span>
                  </span>
                </h1>

                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  <strong>Le agenzie che usano Spotex guadagnano in media €3.500/mese in più</strong> offrendo servizi cloud sotto il loro brand, 
                  <strong> senza investire in infrastruttura</strong> e <strong>senza competere sui prezzi</strong>.
                </p>

                {/* Social Proof */}
                <div className="mt-6 flex items-center text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="ml-3">
                    <strong>32 agenzie</strong> hanno già scelto Spotex - <span className="text-green-600 font-semibold">+8 questa settimana</span>
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="rounded-mdtransform hover:scale-105 transition-transform duration-200">
                    <Link
                      to="/consulenza-gratuita"
                      className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white hover:shadow-xl transition-all duration-200 md:text-lg md:px-12 bg-[#002040] hover:bg-black"
                    >
                      <i className="fas fa-rocket mr-2"></i>
                      OTTIENI LA TUA DEMO PERSONALIZZATA    
                    </Link>
                  </div>
                  <div className="rounded-md shadow-sm">
                    <Link
                      to="/storie-successo"
                      className="w-full flex items-center justify-center px-8 py-4 border-2 text-base font-medium rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 md:text-lg md:px-12"
                      style={{ color: primaryColor, borderColor: primaryColor }}
                    >
                      <i className="fas fa-chart-line mr-2"></i>
                      GUARDA LE STORIE DI SUCCESSO
                    </Link>
                  </div>
                </div>

                {/* Risk Reversal */}
                <div className="mt-4 flex items-center justify-center lg:justify-start space-x-4 text-xs text-gray-400">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-1">✅</span>
                    <span>Consulenza gratuita</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-1">✅</span>
                    <span>Setup senza costi</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-1">✅</span>
                    <span>30 giorni soddisfatti o rimborsati</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="h-56 w-full bg-[#002040] sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center p-8">
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className="fas fa-money-bill-wave text-2xl text-[#002040]"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Agenzia MediaPlus</h3>
                  <p className="text-sm text-gray-600">+€42.000/anno con Spotex</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prima Spotex:</span>
                    <span className="text-red-600 font-semibold">€1.200/mese</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dopo Spotex:</span>
                    <span className="text-green-600 font-bold">€4.700/mese</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Guadagno Extra:</span>
                      <span className="text-green-600">+€3.500/mese</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-[#002040] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Sei Stanco di <span style={{ color: primaryColor }}>Questi Problemi</span>?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Le agenzie marketing ci raccontano le stesse frustrazioni ogni giorno
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: 'fas fa-tired',
                title: 'Margini Bassi',
                description: 'Progetti una-tantum che non bastano più. Servono ricavi ricorrenti per crescere.'
              },
              {
                icon: 'fas fa-clock',
                title: 'Tempo Perso',
                description: 'Perdi ore in configurazioni server invece che su progetti creativi per i clienti.'
              },
              {
                icon: 'fas fa-brain',
                title: 'Complessità Tecnica',
                description: 'I clienti chiedono soluzioni cloud avanzate che non hai competenze per gestire.'
              },
              {
                icon: 'fas fa-tag',
                title: 'Brand Debole',
                description: 'I tuoi clienti vedono i brand dei provider invece del tuo quando accedono ai servizi.'
              }
            ].map((problem, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                   style={{ borderLeftColor: primaryColor }}>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
                  <i className={`${problem.icon} text-[#002040]`}></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-gray-600 text-sm">{problem.description}</p>
              </div>
            ))}
          </div>

          {/* Solution Bridge */}
          <div className="mt-12 text-center bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border-2" style={{ borderColor: primaryColor }}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              <span style={{ color: primaryColor }}>Spotex ha la soluzione</span> per tutti questi problemi
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Ecco come le agenzie partner stanno già risolvendo queste sfide e guadagnando fino a €50.000/anno in più
            </p>
            <Link
              to="/consulenza-gratuita"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              style={{ backgroundColor: primaryColor }}
            >
              <i className="fas fa-target mr-2"></i>
              VOGLIO ANCHE IO QUESTI RISULTATI
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Cosa <span style={{ color: primaryColor }}>Ottieni Con Spotex</span>?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tutti gli strumenti per trasformare la tua agenzia in un provider cloud di successo
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl p-6 border-t-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                   style={{ borderTopColor: primaryColor }}>
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                  <i className={`${feature.icon} text-[#002040]`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Funziona Sia per <span style={{ color: primaryColor }}>Agenzie</span> che per <span style={{ color: primaryColor }}>Aziende</span>
            </h2>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 justify-center">
                {['agency', 'business'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-[#002040] text-[#002040]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'agency' ? <><i className="fas fa-rocket mr-1"></i> Per Agenzie Marketing</> : <><i className="fas fa-building mr-1"></i> Per Aziende</>}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
              {activeTab === 'agency' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Trasforma la Tua Agenzia in un Provider Cloud</h3>
                    <ul className="space-y-4 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 text-lg mr-3">✅</span>
                        <span><strong>White-label completo:</strong> Tutto sotto il tuo brand, zero menzioni Spotex</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 text-lg mr-3">✅</span>
                        <span><strong>Margini fino al 50%:</strong> Guadagni su ogni server e servizio cloud</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 text-lg mr-3">✅</span>
                        <span><strong>Deploy automatico:</strong> Server WordPress pronti in 60 secondi</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 text-lg mr-3">✅</span>
                        <span><strong>Supporto multi-livello:</strong> Noi supportiamo te, tu supporti i tuoi clienti</span>
                      </li>
                    </ul>
                    <div className="mt-8">
                      <Link
                        to="/consulenza-gratuita"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <i className="fas fa-rocket mr-2"></i>
                        VOGLIO DIVENTARE PROVIDER CLOUD
                      </Link>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">+€3.500/mese</div>
                      <div className="text-gray-600">Guadagno medio extra per agenzia</div>
                      <div className="mt-4 text-sm text-gray-500">
                        Basato sui dati delle 32 agenzie già partner
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Servizi Cloud Gestiti per la Tua Azienda</h3>
                    <ul className="space-y-4 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 text-lg mr-3">✅</span>
                        <span><strong>Infrastruttura enterprise:</strong> Server ottimizzati per performance e sicurezza</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 text-lg mr-3">✅</span>
                        <span><strong>Supporto 24/7:</strong> Team tecnico dedicato per la tua azienda</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 text-lg mr-3">✅</span>
                        <span><strong>Monitoraggio proattivo:</strong> Identifichiamo e risolviamo problemi prima che accadano</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 text-lg mr-3">✅</span>
                        <span><strong>Backup automatici:</strong> I tuoi dati sono sempre al sicuro</span>
                      </li>
                    </ul>
                    <div className="mt-8">
                      <Link
                        to="/consulenza-gratuita"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <i className="fas fa-building mr-2"></i>
                        VOGLIO SERVIZI CLOUD PER LA MIA AZIENDA
                      </Link>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">-40% costi IT</div>
                      <div className="text-gray-600">Risparmio medio per le aziende</div>
                      <div className="mt-4 text-sm text-gray-500">
                        Rispetto alla gestione interna dell'infrastruttura
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-[#002040] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Cosa Dicono le <span style={{ color: secondaryColor }}>Agenzie Che Usano Spotex</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Non credere a noi, ma ai risultati dei nostri partner
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-2xl p-6 text-black backdrop-blur-sm transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-star text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic mb-4 text-black">{testimonial.content}</p>
                <div className="flex justify-between text-sm bg-white bg-opacity-20 rounded-lg p-3">
                  <span className="text-red-200 line-through">{testimonial.before}</span>
                  <span className="text-[#002040] font-bold">→ {testimonial.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Domande <span style={{ color: primaryColor }}>Frequenti</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tutte le risposte che cerchi prima di iniziare
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultimate CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-[#002040] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-[#002040] text-white">
            <i className="fas fa-target mr-2"></i>
            OFFERTA A TEMPO LIMITATO
          </div>
          
          <h2 className="text-4xl font-extrabold sm:text-5xl mb-6">
            Pronto a <span style={{ color: secondaryColor }}>Raddoppiare i Ricavi</span> della Tua Agenzia?
          </h2>
          
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            <strong>32 agenzie hanno già scelto Spotex questo mese.</strong> Non essere l'ultimo a perdere questa opportunità di trasformare il tuo business.
          </p>

          {/* Value Stack */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Cosa Ricevi con la Tua Consulenza Gratuita:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-gray-700">
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <span><strong>Analisi personalizzata</strong> del tuo potenziale cloud</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <span><strong>Demo 1-on-1</strong> della piattaforma white-label</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <span><strong>Business plan</strong> con proiezioni di ricavo</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✅</span>
                <span><strong>Setup gratuito</strong> se decidi di procedere</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <Link
              to="/consulenza-gratuita"
              className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 border border-transparent text-xl font-medium rounded-lg text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-200 bg-[#002040] hover:bg-black"
            >
              <i className="fas fa-rocket mr-2"></i>
              PRENOTA LA TUA CONSULENZA GRATUITA
            </Link>
          </div>
          
          {/* Urgency */}
          <div className="mt-6 space-y-2 text-gray-300 text-sm">
            <p><i className="fas fa-clock mr-1"></i> <strong>Ultimi 3 posti disponibili</strong> per il setup gratuito questo mese</p>
            <p><i className="fas fa-phone mr-1"></i> <strong>Chiamaci ora:</strong> +39 389 965 7115 - Rispondiamo in 5 minuti</p>
          </div>
        </div>
      </section>
    </div>
  );
}