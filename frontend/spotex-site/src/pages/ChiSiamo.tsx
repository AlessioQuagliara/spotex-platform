import { Link } from "react-router-dom";

export default function ChiSiamo() {
  const primaryColor = '#002040';

  const teamMembers = [
    {
      name: "Marco Rossi",
      role: "CEO & Cloud Architect",
      description: "Ex Technical Lead in multinazionali cloud, ha guidato migrazioni per Fortune 500 companies",
      expertise: ["Cloud Architecture", "Business Strategy", "Technical Leadership"],
      achievement: "Oltre 200 infrastrutture cloud deployate"
    },
    {
      name: "Laura Bianchi",
      role: "CTO & DevOps Specialist",
      description: "15+ anni in automazione sistemi, certificata AWS Solutions Architect e Kubernetes Expert",
      expertise: ["DevOps", "API Integration", "System Automation"],
      achievement: "Ridotto i tempi di deploy da 4 ore a 60 secondi"
    },
    {
      name: "Andrea Verdi",
      role: "Head of Customer Success",
      description: "Specialista in growth strategy, ha aiutato 50+ agenzie a raddoppiare i ricavi ricorrenti",
      expertise: ["Customer Relations", "Agency Onboarding", "Growth Strategy"],
      achievement: "Oltre €2M di ricavi generati per i partner"
    }
  ];

  const milestones = [
    {
      year: "2021",
      event: "La Crisi che ci ha Cambiato",
      description: "Solo 2 clienti all'anno. Abbiamo capito che il modello web agency tradizionale era rotto.",
      icon: "fas fa-sad-tear"
    },
    {
      year: "2023",
      event: "La Scoperta dell'Oro Cloud",
      description: "Identificato il gap di mercato: CAGR 20.6% nel cloud italiano, zero soluzioni per agenzie.",
      icon: "fas fa-lightbulb"
    },
    {
      year: "2024",
      event: "La Scommessa Vincente",
      description: "Investito €80K per sviluppare la prima piattaforma cloud white-label per agenzie.",
      icon: "fas fa-bullseye"
    },
    {
      year: "2025",
      event: "Il Successo Inaspettato",
      description: "32 agenzie onboardate in 3 mesi. Fatturato moltiplicato per 8x.",
      icon: "fas fa-rocket"
    }
  ];

  const agencyResults = [
    { metric: "€3.500/mese", description: "Guadagno medio extra per agenzia" },
    { metric: "45% margine", description: "Margine medio garantito ai partner" },
    { metric: "15 ore/settimana", description: "Tempo risparmiato in gestione server" },
    { metric: "100% white-label", description: "Branding completamente personalizzato" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Riscritta con copy persuasivo */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <br />
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-gray-100 text-black">
              <i className="fas fa-bullseye mr-2"></i>
              STORIA DI SUCCESSO
            </div>
            <h1 className="text-4xl tracking-tight font-extrabold text-black sm:text-5xl md:text-6xl">
              Da <span className="text-black">2 Clienti/Anno</span> a
              <span style={{ color: primaryColor }}> Leader Cloud</span> in Italia
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              <strong>La nostra crisi è diventata la vostra opportunità.</strong> Abbiamo vissuto i vostri stessi problemi
              e creato la soluzione che avremmo voluto avere quando eravamo una web agency tradizionale.
            </p>

            {/* Social Proof Inline */}
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <i className="fas fa-check text-black mr-2"></i>
                <span><strong>32 agenzie</strong> già trasformate</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-black mr-2"></i>
                <span><strong>€1.2M+</strong> di ricavi generati</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-black mr-2"></i>
                <span><strong>100%</strong> soddisfazione clienti</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Turning Point Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
                Il Momento in cui Tutto è Cambiato
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                <strong>Eravamo dove sei tu ora.</strong> Una web agency con margini sempre più stretti, clienti sempre più esigenti,
                e la sensazione di correre senza mai arrivare da nessuna parte.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Nel 2023, mentre analizzavamo i dati del mercato, abbiamo scoperto una verità sconvolgente:
                il <strong>cloud computing italiano cresceva del 20.6% annuo</strong>, ma nessuno serviva le agenzie marketing.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Abbiamo capito che il futuro non era sviluppare un altro sito WordPress, ma
                <strong> dare alle agenzie gli strumenti per diventare provider cloud</strong> sotto il loro brand.
              </p>

              <div className="mt-8 bg-white rounded-xl p-6 border-l-4" style={{ borderLeftColor: primaryColor }}>
                <p className="text-gray-700 italic">
                  "Il giorno in cui abbiamo capito che potevamo aiutare le agenzie a guadagnare €3.500/mese in più
                  invece di competere per progetti da €2.000... è stato il giorno in cui è nato Spotex Cloud."
                </p>
                <p className="mt-2 text-sm text-gray-600">- Marco Rossi, CEO</p>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-black mb-6 text-center">La Nostra Trasformazione</h3>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full border-2 flex items-center justify-center font-bold shadow-sm text-lg"
                           style={{ borderColor: primaryColor, color: primaryColor }}>
                        <i className={milestone.icon}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold text-black">{milestone.event}</h4>
                          <span className="text-sm font-bold px-2 py-1 rounded-full bg-gray-100">
                            {milestone.year}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1 text-sm">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results for Agencies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
              I Risultati che <span style={{ color: primaryColor }}>Le Agenzie Ottengono</span> con Noi
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Non siamo solo un provider, siamo il tuo partner di crescita
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {agencyResults.map((result, index) => (
              <div key={index} className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
                  {result.metric}
                </div>
                <p className="text-gray-600 text-sm">{result.description}</p>
              </div>
            ))}
          </div>

          {/* Case Study Mini */}
          <div className="mt-12 bg-black rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Case Study: Agenzia MediaPlus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400 line-through">€1.200/mese</div>
                <div className="text-sm">Prima di Spotex</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">€5.800/mese</div>
                <div className="text-sm">Dopo 4 mesi con Spotex</div>
              </div>
            </div>
            <p className="mt-4 text-gray-300">
              "Spotex ha trasformato completamente il nostro business model. Ora abbiamo ricavi ricorrenti che ci permettono di pianificare la crescita."
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Riscritte con copy più forte */}
      <section className="py-16" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-bullseye text-3xl text-black"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">La Nostra Missione</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                <strong>Democratizzare il cloud enterprise per le agenzie marketing.</strong>
                Permettere a ogni agenzia di competere con i big player senza investire milioni in infrastruttura.
              </p>
              <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4">
                <p className="text-sm">
                  "Vogliamo che le agenzie si concentrino sulla creatività, non sulla configurazione dei server"
                </p>
              </div>
            </div>
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-eye text-3xl text-black"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">La Nostra Visione</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                <strong>Creare l'ecosistema cloud n°1 per agenzie in Europa.</strong>
                100+ agenzie partner, 5.000+ server gestiti, €10M+ di ricavi generati entro il 2027.
              </p>
              <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4">
                <p className="text-sm">
                  "Il nostro successo si misura dal successo delle agenzie che ci scelgono"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Riscritta con più autorità */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
              Il <span style={{ color: primaryColor }}>Dream Team</span> che ha Reso Tutto Possibile
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professionisti che hanno lavorato con i big player del cloud e ora mettono la loro esperienza al servizio delle agenzie
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-user-tie text-3xl text-black"></i>
                  </div>
                  <h3 className="text-xl font-bold text-black">{member.name}</h3>
                  <p className="text-lg font-semibold mt-2 mb-4" style={{ color: primaryColor }}>
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.description}
                  </p>

                  <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <p className="text-black text-xs font-semibold">
                      <i className="fas fa-trophy mr-1"></i>
                      {member.achievement}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-black mb-3">Superpoteri:</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-100 text-black rounded-full text-xs font-medium border border-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values - Riscritti con benefici concreti */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
              I <span style={{ color: primaryColor }}>Valori</span> che ci Rendono Diversi
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Non siamo solo un fornitore, siamo il tuo partner di crescita
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bolt text-2xl text-black"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Innovazione Pratica</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Non seguiamo le trends, le creiamo. Ogni feature è pensata per risolvere problemi reali delle agenzie.
              </p>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-2xl text-black"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Partnership Reale</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Il tuo successo è il nostro successo. Condividiamo know-how, strategie e opportunità di business.
              </p>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-2xl text-black"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Affidabilità Totale</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Infrastruttura enterprise con 99.9% SLA. Dormi sonni tranquilli mentre i tuoi server lavorano.
              </p>
            </div>

            <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-rocket text-2xl text-black"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-3">Crescita Scalabile</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                La tua piattaforma cresce con te. Dai primi 5 server ai 500, senza cambiare provider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ultimate CTA */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold sm:text-5xl mb-6">
            Pronto a <span className="text-gray-300">Scrivere la Tua Storia</span> di Successo?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            <strong>32 agenzie hanno già scelto di trasformare il loro business con noi.</strong>
            Non essere l'ultimo a perdere questa opportunità.
          </p>

          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-black mb-6">Cosa Ricevi Diventando Partner:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-black">
              <div className="flex items-center">
                <i className="fas fa-check text-black text-xl mr-3"></i>
                <span><strong>Setup white-label</strong> gratuito</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-black text-xl mr-3"></i>
                <span><strong>Training 1-on-1</strong> con i founder</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-black text-xl mr-3"></i>
                <span><strong>Margini garantiti</strong> fino al 50%</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-black text-xl mr-3"></i>
                <span><strong>Supporto dedicato</strong> 24/7</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <Link
              to="/landing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 border border-transparent text-xl font-medium rounded-md text-black hover:shadow-2xl transform hover:scale-105 transition-all duration-200 bg-white"
            >
              <i className="fas fa-rocket mr-2"></i>
              INIZIA LA TUA TRASFORMAZIONE
            </Link>
          </div>

          <p className="mt-6 text-gray-400 text-sm">
            <i className="fas fa-clock mr-1"></i>
            <strong>Posti limitati</strong> per il setup personalizzato con i founder
          </p>
        </div>
      </section>
    </div>
  );
}