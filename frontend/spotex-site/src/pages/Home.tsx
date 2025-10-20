import { Link } from "react-router-dom";

export default function Home() {
  const primaryColor = '#002040';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Riscritta con copy persuasivo */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-gray-100 text-black">
                  <i className="fas fa-rocket mr-2"></i>
                  <span>Oltre 30 agenzie già trasformate</span>
                </div>
                <h1 className="text-4xl tracking-tight font-extrabold text-black sm:text-5xl md:text-6xl">
                  <span className="block">Fino a <span style={{ color: primaryColor }}>€50.000/anno</span> in più</span>
                  <span className="block">con il tuo <span style={{ color: primaryColor }}>Cloud White-Label</span></span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  <strong>Le agenzie marketing che usano Spotex guadagnano in media €3.500/mese in più</strong>
                  offrendo servizi cloud sotto il loro brand, senza investire in infrastruttura o competenze tecniche.
                </p>

                {/* Social Proof */}
                <div className="mt-6 flex items-center text-sm text-gray-600">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white"></div>
                  </div>
                  <span className="ml-3">
                    <strong>32 agenzie</strong> hanno già scelto Spotex nell'ultimo mese
                  </span>
                </div>

                <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="rounded-md shadow-lg transform hover:scale-105 transition-transform duration-200">
                    <Link
                      to="/landing"
                      className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white hover:shadow-xl transition-all duration-200 md:text-lg md:px-12"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <i className="fas fa-rocket mr-2"></i>
                      Ottieni la Tua Demo Personalizzata
                    </Link>
                  </div>
                  <div className="rounded-md shadow-sm">
                    <Link
                      to="/storie-successo"
                      className="w-full flex items-center justify-center px-8 py-4 border-2 text-base font-medium rounded-md bg-white hover:bg-gray-50 transition-colors duration-200 md:text-lg md:px-12"
                      style={{ color: primaryColor, borderColor: primaryColor }}
                    >
                      <i className="fas fa-chart-line mr-2"></i>
                      Guarda le Storie di Successo
                    </Link>
                  </div>
                </div>

                {/* Risk Reversal */}
                <p className="mt-4 text-xs text-gray-500">
                  <i className="fas fa-check mr-1"></i>
                  <strong>Zero rischi</strong>: Consulenza gratuita • Setup senza costi • 30 giorni soddisfatti o rimborsati
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gray-100 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-euro-sign text-2xl text-black"></i>
                </div>
                <h3 className="text-lg font-bold text-black">Agenzia MediaSpot</h3>
                <p className="text-sm text-gray-600">+€42.000/anno con Spotex</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Prima Spotex:</span>
                  <span className="text-black">€1.200/mese</span>
                </div>
                <div className="flex justify-between">
                  <span>Dopo Spotex:</span>
                  <span className="text-black font-bold">€4.700/mese</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Guadagno Extra:</span>
                    <span className="text-black">+€3.500/mese</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points & Solutions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
              Sei Stanco di Questi Problemi?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Le agenzie marketing ci raccontano le stesse frustrazioni ogni giorno
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Pain Point 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4" style={{ borderLeftColor: primaryColor }}>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-tired text-xl text-black"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Margini Bassi</h3>
              <p className="text-gray-600 text-sm">
                "I progetti web una-tantum non bastano più. Servono ricavi ricorrenti per crescere."
              </p>
            </div>

            {/* Pain Point 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4" style={{ borderLeftColor: primaryColor }}>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-xl text-black"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Tempo Perso</h3>
              <p className="text-gray-600 text-sm">
                "Perdiamo ore in configurazioni server invece che su progetti creativi per i clienti."
              </p>
            </div>

            {/* Pain Point 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4" style={{ borderLeftColor: primaryColor }}>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-xl text-black"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Complessità Tecnica</h3>
              <p className="text-gray-600 text-sm">
                "I clienti chiedono soluzioni cloud avanzate che non abbiamo le competenze per gestire."
              </p>
            </div>

            {/* Pain Point 4 */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center border-l-4" style={{ borderLeftColor: primaryColor }}>
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-tag text-xl text-black"></i>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Brand Debole</h3>
              <p className="text-gray-600 text-sm">
                "I nostri clienti vedono i brand dei provider invece del nostro quando accedono ai servizi."
              </p>
            </div>
          </div>

          {/* Solution Bridge */}
          <div className="mt-12 text-center bg-white rounded-2xl shadow-lg p-8 border-2" style={{ borderColor: primaryColor }}>
            <h3 className="text-2xl font-bold text-black mb-4">
              <span style={{ color: primaryColor }}>Spotex ha la soluzione</span> per tutti questi problemi
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Ecco come le agenzie partner stanno già risolvendo queste sfide:
            </p>
            <Link
              to="/landing"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white hover:shadow-lg transition-all duration-200"
              style={{ backgroundColor: primaryColor }}
            >
              <i className="fas fa-bullseye mr-2"></i>
              Voglio Anche Io Questi Risultati
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition - Riscritta con benefit concreti */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
              Cosa Ottieni Con Spotex?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tutti i tool per trasformare la tua agenzia in un provider cloud di successo
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 - Riscritta con copy persuasivo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                 style={{ borderTopColor: primaryColor }}>
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-rocket text-3xl text-black"></i>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 text-center">Deploy in 60 Secondi</h3>
              <p className="text-gray-600 mb-6 text-center">
                <strong>Server WordPress pronti prima che il cliente finisca il caffè.</strong> Automazione completa che elimina ore di lavoro tecnico.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-black font-semibold">
                  <i className="fas fa-stopwatch mr-1"></i>
                  <strong>Risparmia 15+ ore/settimana</strong> di lavoro tecnico
                </p>
              </div>
            </div>

            {/* Card 2 - Riscritta con copy persuasivo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                 style={{ borderTopColor: primaryColor }}>
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-tag text-3xl text-black"></i>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 text-center">100% White-Label</h3>
              <p className="text-gray-600 mb-6 text-center">
                <strong>I tuoi clienti vedono solo il tuo brand.</strong> Pannelli personalizzati, fatture con il tuo logo, supporto con il tuo nome.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-black font-semibold">
                  <i className="fas fa-chart-line mr-1"></i>
                  <strong>Aumenta del 40%</strong> la percezione del tuo valore
                </p>
              </div>
            </div>

            {/* Card 3 - Riscritta con copy persuasivo */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                 style={{ borderTopColor: primaryColor }}>
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-euro-sign text-3xl text-black"></i>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 text-center">+€3.500/Mese Extra</h3>
              <p className="text-gray-600 mb-6 text-center">
                <strong>Fino al 50% di margine su ogni server.</strong> Ricavi ricorrenti che trasformano la tua rentabilità.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-black font-semibold">
                  <i className="fas fa-money-bill-wave mr-1"></i>
                  <strong>+€42.000/anno</strong> di ricavi aggiuntivi
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Case Studies */}
      <section className="py-16" style={{ backgroundColor: primaryColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Le Agenzie Che Usano Spotex <span className="text-gray-300">Raddoppiano i Ricavi</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Non credere a noi, ma ai risultati dei nostri partner
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 text-white backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-star text-xl text-black"></i>
                </div>
                <div>
                  <h4 className="font-bold text-black">Marco - WebSolutions</h4>
                  <p className="text-gray-300 text-sm">Agenzia di 15 persone</p>
                </div>
              </div>
              <p className="italic mb-4 text-white">
                "In 3 mesi con Spotex abbiamo aggiunto €8.200 di ricavi ricorrenti. I nostri clienti sono felici perché tutto è sotto il nostro brand."
              </p>
              <div className="flex justify-between text-sm text-white">
                <span>Prima: €2.500/mese</span>
                <span className="font-bold">Ora: €10.700/mese</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 text-white backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-rocket text-xl text-black"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white">Laura - CreativeLab</h4>
                  <p className="text-gray-300 text-sm">Agenzia di 8 persone</p>
                </div>
              </div>
              <p className="italic mb-4 text-white">
                "Finalmente possiamo competere con le big agency. I deploy automatici ci fanno risparmiare 20 ore a settimana di lavoro tecnico."
              </p>
              <div className="flex justify-between text-sm text-white">
                <span>+€4.500/mese</span>
                <span className="font-bold">Margine: 45%</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 text-white backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-trophy text-xl text-black"></i>
                </div>
                <div>
                  <h4 className="font-bold text-white">Andrea - DigitalBoost</h4>
                  <p className="text-gray-300 text-sm">Agenzia di 25 persone</p>
                </div>
              </div>
              <p className="italic mb-4 text-white">
                "Spotex ha trasformato il nostro business. Ora abbiamo un flusso di ricavi costante che ci permette di pianificare la crescita."
              </p>
              <div className="flex justify-between text-sm text-white">
                <span>Prima: €15k/mese</span>
                <span className="font-bold">Ora: €38k/mese</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultimate CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 bg-gray-800">
            <i className="fas fa-bullseye mr-2"></i>
            OFFERTA A TEMPO LIMITATO
          </div>
          <h2 className="text-4xl font-extrabold sm:text-5xl mb-6">
            Pronto a <span className="text-gray-300">Raddoppiare i Ricavi</span> della Tua Agenzia?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            <strong>32 agenzie hanno già scelto Spotex questo mese.</strong> Non essere l'ultimo a perdere questa opportunità.
          </p>

          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold text-black mb-4">Cosa Ricevi Oggi:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-black">
              <div className="flex items-center">
                <i className="fas fa-check text-black mr-3"></i>
                <span>Demo personalizzata 1-on-1</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-black mr-3"></i>
                <span>Analisi gratuita del tuo potenziale</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-black mr-3"></i>
                <span>Setup white-label incluso</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check text-black mr-3"></i>
                <span>30 giorni soddisfatti o rimborsati</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:flex sm:space-x-4 justify-center">
            <Link
              to="/landing"
              className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 border border-transparent text-xl font-medium rounded-md text-black hover:shadow-2xl transform hover:scale-105 transition-all duration-200 bg-white"
            >
              <i className="fas fa-rocket mr-2"></i>
              PRENOTA LA TUA DEMO GRATUITA
            </Link>
          </div>

          <p className="mt-6 text-gray-400 text-sm">
            <i className="fas fa-clock mr-1"></i>
            <strong>Ultimi 3 posti disponibili</strong> per il setup gratuito questo mese
          </p>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-600">Tecnologia enterprise powered by</h3>
          </div>
          <div className="flex justify-center items-center space-x-12 opacity-70">
            <div className="text-2xl font-bold text-gray-700">Kamatera</div>
            <div className="text-lg font-semibold text-gray-600">Infrastructure Partner</div>
          </div>
        </div>
      </section>
    </div>
  );
}