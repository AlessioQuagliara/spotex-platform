import { Header, NavigationItem } from './components/layout/header';
import { Footer } from './components/layout/footer';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';

const navigation: NavigationItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
];

export default function Home() {
  return (
    <div className="pt-20">
      <Header navigation={navigation} currentPath="/" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#002040] via-[#001830] to-[#003060]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="text-white/80 text-sm font-medium">🚀 NUOVA PIATTAFORMA CLOUD</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            La Tua Infrastruttura
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">White-Label</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Trasforma la tua agenzia in un <span className="font-semibold text-white">Cloud Solution Provider</span> 
            con la nostra piattaforma white-label. Margini competitivi e setup in 24 ore.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button variant="secondary" size="lg">
              <span className="mr-2">🚀</span>
              Inizia Ora
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#002040]">
              <span className="mr-2">▶️</span>
              Vedi Demo
            </Button>
          </div>

          {/* Realistic Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: '0€', label: 'Setup Iniziale' },
              { value: '24h', label: 'Attivazione' },
              { value: '35%+', label: 'Margine Medio' },
              { value: 'IT', label: 'Supporto Locale' },
            ].map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-white/60 text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
              Perché Scegliere Spotex Cloud
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La prima piattaforma cloud italiana pensata specificamente per le agenzie marketing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: '©', title: 'White-Label Completo', description: 'Il tuo branding su ogni aspetto della piattaforma. I tuoi clienti vedranno solo il tuo marchio.' },
              { icon: '⚡', title: 'Deploy Istantaneo', description: 'Server WordPress pronti in 60 secondi. API complete per l\'automazione dei processi.' },
              { icon: '📈', title: 'Margini Progressivi', description: 'Sconti crescenti basati sul volume. Guadagna dal 25% al 50% su ogni servizio.' },
            ].map((feature, index) => (
              <Card
                key={index}
                title={<><span className="text-[#002040] mr-2">{feature.icon}</span>{feature.title}</>}
                description={feature.description}
                className="text-center hover:shadow-xl transition-shadow duration-300"
              />
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-[#002040] mb-6">
                Mercato Cloud Italiano in Forte Crescita
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Il mercato cloud italiano cresce a un tasso del <span className="font-semibold text-[#002040]">20.6% annuo</span>, 
                offrendo opportunità senza precedenti per le agenzie che sanno innovare.
              </p>
              <div className="space-y-3">
                {[
                  '+12.4B€ nel 2025',
                  '+38.3B€ nel 2030', 
                  '80% agenzie usa multi-cloud'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-green-500 mr-3">✅</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h4 className="text-xl font-bold text-[#002040] mb-4">Proiezioni Realistiche</h4>
              <div className="space-y-4">
                {[
                  { label: 'Anno 1', agencies: '5-8', revenue: '50-80k€' },
                  { label: 'Anno 2', agencies: '15-25', revenue: '150-300k€' },
                  { label: 'Anno 3', agencies: '35-50', revenue: '400-700k€' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <span className="font-semibold text-gray-700">{item.label}</span>
                    <div className="text-right">
                      <div className="text-[#002040] font-bold">{item.agencies} agenzie</div>
                      <div className="text-sm text-gray-600">{item.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Market */}
      <section className="py-24 bg-gradient-to-br from-[#002040] to-[#003060]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Perfetto per la Tua Agenzia
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Se rientri in una di queste categorie, la nostra piattaforma è fatta per te
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎨', title: 'Web Agency', description: 'Sviluppi siti WordPress e cerchi ricavi ricorrenti' },
              { icon: '📢', title: 'Marketing Agency', description: 'Gestisci campagne e hai bisogno di hosting performante' },
              { icon: '🛒', title: 'E-commerce Agency', description: 'Cerchi soluzioni hosting ottimizzate per negozi online' },
              { icon: '📱', title: 'Digital Studio', description: 'Sviluppi app e progetti digitali complessi' },
            ].map((agency, index) => (
              <Card
                key={index}
                title={<><span className="text-[#002040] mr-2">{agency.icon}</span>{agency.title}</>}
                description={agency.description}
                className="bg-white/95 backdrop-blur-sm text-center hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
            Pronto a Trasformare la Tua Agenzia?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Unisciti alle agenzie innovative che stanno già guadagnando con il cloud. 
            Setup in 24 ore, zero investimento iniziale.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="primary" size="lg">
              <span className="mr-2">📅</span>
              Prenota Demo
            </Button>
            <Button variant="outline" size="lg">
              <span className="mr-2">📄</span>
              Piano Personalizzato
            </Button>
          </div>
          
          <p className="text-gray-500 mt-8">
            <span className="mr-2">🛡️</span>
            Nessun impegno • Cancellazione anytime • Supporto in italiano
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}