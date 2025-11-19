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

export default function About() {
  return (
    <div className="pt-20">
      <Header navigation={navigation} currentPath="/about" />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#002040] via-[#001830] to-[#003060]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="text-white/80 text-sm font-medium">🌟 LA NOSTRA STORIA</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Innovazione Cloud
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Made in Italy</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Nati dall'esperienza di Spotex SRL, trasformiamo le web agency in Cloud Solution Provider 
            attraverso tecnologie all'avanguardia e supporto italiano dedicato.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
                Da Web Agency a Cloud Pioneer
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                La nostra storia inizia nel cuore dell'innovazione digitale italiana. Come molte web agency, 
                abbiamo vissuto in prima persona le sfide del mercato tradizionale: margini in contrazione, 
                progetti one-time, difficoltà nella scalabilità.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Nel 2024, abbiamo deciso di trasformare queste sfide in opportunità. Abbiamo canalizzato 
                la nostra esperienza nello sviluppo software e nell'infrastruttura cloud per creare una 
                piattaforma che rivoluziona il modo in cui le agenzie italiane offrono servizi hosting.
              </p>
              <p className="text-lg text-gray-600">
                Oggi, <span className="font-semibold text-[#002040]">Spotex Cloud</span> non è solo un 
                provider di servizi cloud, ma un partner strategico per le agenzie che vogliono evolversi 
                e crescere nel mercato digitale italiano.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-[#002040] mb-6">La Nostra Evoluzione</h3>
              <div className="space-y-6">
                {[
                  { year: '2021', title: 'Fondazione Spotex SRL', description: 'Nascita come web agency tradizionale' },
                  { year: '2023', title: 'Svolta Cloud', description: 'Identificazione opportunità nel mercato cloud italiano' },
                  { year: '2024', title: 'Nascita Spotex Cloud', description: 'Lancio della piattaforma white-label per agenzie' },
                  { year: 'Oggi', title: 'Crescita Esponenziale', description: '+150 agenzie partner nella nostra community' }
                ].map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#002040] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{milestone.year}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
              I Nostri Valori
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I principi che guidano ogni nostra decisione e innovazione
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🚀',
                title: 'Innovazione Continua',
                description: 'Investiamo costantemente in ricerca e sviluppo per anticipare le tendenze del mercato cloud.'
              },
              {
                icon: '🤝',
                title: 'Partnership Reale',
                description: 'Consideriamo ogni agenzia un partner strategico, non solo un cliente.'
              },
              {
                icon: '🛡️',
                title: 'Affidabilità Totale',
                description: 'Garantiamo performance e sicurezza attraverso infrastrutture robuste e monitoraggio 24/7.'
              },
              {
                icon: '🇮🇹',
                title: 'Supporto Italiano',
                description: 'Offriamo supporto tecnico in italiano con team dedicato e tempi di risposta rapidi.'
              }
            ].map((value, index) => (
              <Card
                key={index}
                title={<><span className="text-[#002040] mr-2">{value.icon}</span>{value.title}</>}
                description={value.description}
                className="text-center hover:shadow-xl transition-all duration-300 bg-white"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team & Technology */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
                Tecnologia e Competenze
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Il nostro team combina <span className="font-semibold text-[#002040]">esperienza decennale</span> nello 
                sviluppo software con competenze specializzate in cloud architecture e infrastrutture scalabili.
              </p>
              <div className="space-y-4">
                {[
                  'Architetture cloud-native e microservizi',
                  'Piattaforme containerizzate (Docker, Kubernetes)',
                  'API RESTful e sistemi di automazione',
                  'Monitoring e observability avanzati',
                  'Sicurezza e compliance dei dati'
                ].map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#002040] to-[#003060] rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Perché Sceglierci</h3>
              <div className="space-y-4">
                {[
                  {
                    stat: '150+',
                    label: 'Agenzie Partner'
                  },
                  {
                    stat: '99.9%',
                    label: 'Uptime Guarantito'
                  },
                  {
                    stat: '24/7',
                    label: 'Supporto Italiano'
                  },
                  {
                    stat: '0',
                    label: 'Costi Nascosti'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-white/20 last:border-b-0">
                    <span className="text-2xl font-bold">{item.stat}</span>
                    <span className="text-white/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gradient-to-br from-[#002040] to-[#003060]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">La Nostra Mission</h3>
              <p className="text-white/80 leading-relaxed">
                Democratizzare l'accesso al cloud computing per le agenzie marketing italiane, 
                fornendo tecnologie enterprise-level attraverso piattaforme white-label semplici 
                da utilizzare e economicamente accessibili.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-2xl font-bold mb-4">La Nostra Vision</h3>
              <p className="text-white/80 leading-relaxed">
                Diventare il partner cloud di riferimento per il mercato digitale italiano, 
                guidando la trasformazione delle web agency tradizionali in moderni Cloud 
                Solution Provider competitivi a livello globale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
            Unisciti alla Nostra Vision
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Siamo sempre alla ricerca di agenzie visionarie che vogliono rivoluzionare 
            il proprio modello di business insieme a noi.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="primary" size="lg">
              <span className="mr-2">🚀</span>
              Diventa Partner
            </Button>
            <Button variant="outline" size="lg">
              <span className="mr-2">📞</span>
              Contatta il Team
            </Button>
          </div>
          
          <p className="text-gray-500 mt-8">
            <span className="mr-2">💼</span>
            Opportunità di partnership • Programmi reseller • Collaborazioni strategiche
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}