import { Header, NavigationItem } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
];

export default function Pricing() {
  return (
    <div className="pt-20">
      <Header navigation={navigation} currentPath="/pricing" />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#002040] via-[#001830] to-[#003060]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="text-white/80 text-sm font-medium">💰 PREZZI TRASPARENTI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Piani e Prezzi
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Chiari e Semplici</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Scegli il piano perfetto per la tua agenzia. Tutti i piani includono il white-label completo 
            e il supporto tecnico italiano.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
              Scegli il Tuo Piano
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Piani flessibili che crescono insieme al tuo business. Nessun costo nascosto, nessun impegno.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                description: 'Perfetto per piccole agenzie e freelance',
                price: '€299',
                period: '/mese',
                popular: false,
                features: [
                  'Fino a 25 server',
                  '10TB banda mensile',
                  'Supporto via email',
                  'Pannello base white-label',
                  'Backup giornalieri',
                  'SSL gratuito'
                ],
                cta: 'Inizia Ora'
              },
              {
                name: 'Business',
                description: 'Ideale per agenzie in crescita',
                price: '€599',
                period: '/mese',
                popular: true,
                features: [
                  'Fino a 100 server',
                  '50TB banda mensile',
                  'Supporto prioritario',
                  'API complete',
                  'Backup orari',
                  'CDN integrato',
                  'Monitoraggio avanzato',
                  'Staging environment'
                ],
                cta: 'Più Popolare'
              },
              {
                name: 'Enterprise',
                description: 'Per grandi agenzie e corporate',
                price: '€1.299',
                period: '/mese',
                popular: false,
                features: [
                  'Server illimitati',
                  'Banda illimitata',
                  'Supporto dedicato 24/7',
                  'White-label completo',
                  'Multi-region deployment',
                  'SLA 99.9%',
                  'Account manager dedicato',
                  'Training team'
                ],
                cta: 'Contattaci'
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-white border-2 border-[#002040] shadow-2xl transform scale-105' 
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#002040] text-white px-4 py-2 rounded-full text-sm font-semibold">
                      PIÙ SCELTO
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[#002040] mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-[#002040]">{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "primary" : "outline"}
                  size="lg" 
                  className="w-full justify-center"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons & Extras */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
              Servizi Aggiuntivi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Personalizza ulteriormente la tua piattaforma con questi servizi opzionali
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🔄',
                title: 'Migrazione Assistita',
                price: '€299',
                description: 'Migriamo tutti i tuoi siti e applicazioni senza downtime'
              },
              {
                icon: '🎨',
                title: 'Branding Avanzato',
                price: '€199',
                description: 'Customizzazione completa del pannello di controllo'
              },
              {
                icon: '📚',
                title: 'Training Team',
                price: '€499',
                description: 'Formazione dedicata per il tuo team tecnico'
              },
              {
                icon: '🔧',
                title: 'Supporto Priority',
                price: '€399/mese',
                description: 'Tempo di risposta garantito 2 ore'
              }
            ].map((addon, index) => (
              <Card
                key={index}
                title={<><span className="text-[#002040] mr-2">{addon.icon}</span>{addon.title}</>}
                description={addon.description}
                className="text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="mt-4">
                  <div className="text-2xl font-bold text-[#002040]">{addon.price}</div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Aggiungi
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
              Domande Frequenti
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tutte le risposte alle domande più comuni sui nostri piani e servizi
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Posso cambiare piano in qualsiasi momento?",
                answer: "Sì, puoi upgrade o downgrade il tuo piano in qualsiasi momento. Le modifiche vengono applicate nel successivo ciclo di fatturazione."
              },
              {
                question: "C'è un impegno minimo?",
                answer: "No, tutti i piani sono senza impegno. Puoi cancellare il servizio in qualsiasi momento."
              },
              {
                question: "Il prezzo include l'IVA?",
                answer: "Sì, tutti i prezzi sono IVA inclusa al 22%."
              },
              {
                question: "Offrite sconti per pagamenti annuali?",
                answer: "Sì, offriamo il 10% di sconto per i pagamenti annuali anticipati."
              },
              {
                question: "Cosa succede se supero i limiti del mio piano?",
                answer: "Il servizio continua a funzionare normalmente. Ti addebiteremo solo l'effettivo consumo aggiuntivo al costo di €15/server extra."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-[#002040] mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-[#002040] to-[#003060]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto a Iniziare?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Unisciti a oltre 150 agenzie che già utilizzano la nostra piattaforma white-label. 
            Setup in 24 ore, zero costi di attivazione.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="secondary" size="lg">
              <span className="mr-2">🚀</span>
              Prova Gratis 14 Giorni
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#002040]">
              <span className="mr-2">📞</span>
              Parlaci Ora
            </Button>
          </div>
          
          <p className="text-white/60 mt-8">
            <span className="mr-2">🛡️</span>
            Nessuna carta di credito richiesta • Setup assistito • Supporto italiano
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}