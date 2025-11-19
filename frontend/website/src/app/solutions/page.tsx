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

export default function Solutions() {
  return (
    <div className="pt-20">
      <Header navigation={navigation} currentPath="/solutions" />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#002040] via-[#001830] to-[#003060]">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="text-white/80 text-sm font-medium">🏗️ SOLUZIONI PERSONALIZZATE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Soluzioni Cloud
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">per Ogni Esigenza</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Dallo sviluppo WordPress alle applicazioni enterprise, abbiamo la soluzione 
            perfetta per far crescere il tuo business nel cloud.
          </p>
        </div>
      </section>

      {/* Main Solutions */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
              Le Nostre Soluzioni
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Piattaforme specializzate progettate per massimizzare l'efficienza e i margini della tua agenzia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: '🌐',
                title: 'Web Agency Platform',
                description: 'Soluzione completa per agenzie web con focus su WordPress e siti istituzionali',
                features: ['Deploy WordPress 1-click', 'Staging environment', 'Backup automatici', 'CDN integrato'],
                price: 'Da €299/mese'
              },
              {
                icon: '🛒',
                title: 'E-commerce Cloud',
                description: 'Infrastruttura ottimizzata per negozi online e piattaforme e-commerce',
                features: ['SSL wildcard', 'Database ottimizzati', 'Monitoraggio performance', 'Scaling automatico'],
                price: 'Da €499/mese'
              },
              {
                icon: '📱',
                title: 'App Hosting Platform',
                description: 'Piattaforma per applicazioni web moderne e progressive web apps',
                features: ['Node.js & Python support', 'Container ready', 'CI/CD integration', 'Real-time monitoring'],
                price: 'Da €399/mese'
              },
              {
                icon: '🏢',
                title: 'Enterprise Solutions',
                description: 'Infrastruttura enterprise per clienti corporate e progetti complessi',
                features: ['Multi-region deployment', 'SLA 99.9%', 'Supporto dedicato', 'Security advanced'],
                price: 'Personalizzato'
              },
              {
                icon: '🔧',
                title: 'API & Automazione',
                description: 'Piattaforma API-first per integrazioni e automazione dei processi',
                features: ['REST API complete', 'Webhook system', 'Documentazione automatica', 'Rate limiting'],
                price: 'Da €199/mese'
              },
              {
                icon: '🚀',
                title: 'Startup Program',
                description: 'Soluzioni dedicate per startup in fase di crescita e scale-up',
                features: ['Prezzi scalabili', 'Mentorship tech', 'Crediti cloud', 'Community access'],
                price: 'Da €149/mese'
              }
            ].map((solution, index) => (
              <Card
                key={index}
                title={<><span className="text-[#002040] mr-2">{solution.icon}</span>{solution.title}</>}
                description={solution.description}
                className="hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-[#002040]/20"
              >
                <div className="mt-6 space-y-3">
                  {solution.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-[#002040]">{solution.price}</span>
                    <Button variant="primary" size="sm">
                      Scopri di più
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
              Caratteristiche Avanzate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologie all'avanguardia per garantire performance, sicurezza e scalabilità
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Performance',
                features: ['SSD NVMe storage', 'HTTP/3 support', 'Global CDN', 'Caching avanzato']
              },
              {
                icon: '🛡️',
                title: 'Sicurezza',
                features: ['Firewall WAF', 'DDoS protection', 'SSL automatico', 'ISO 27001 compliant']
              },
              {
                icon: '📊',
                title: 'Monitoring',
                features: ['Real-time analytics', 'Alert personalizzati', 'Log centralizzati', 'Performance metrics']
              },
              {
                icon: '🔗',
                title: 'Integrazione',
                features: ['API RESTful', 'Webhook system', 'CI/CD native', 'Multi-provider support']
              }
            ].map((feature, index) => (
              <Card
                key={index}
                title={<><span className="text-[#002040] mr-2">{feature.icon}</span>{feature.title}</>}
                description=""
                className="text-center bg-white"
              >
                <ul className="mt-4 space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002040] mb-6">
              Tecnologie Supportate
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Supportiamo tutti i framework e le tecnologie moderne più popolari
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
            {[
              { name: 'WordPress', icon: '📝' },
              { name: 'React', icon: '⚛️' },
              { name: 'Node.js', icon: '🟢' },
              { name: 'Python', icon: '🐍' },
              { name: 'PHP', icon: '🐘' },
              { name: 'Docker', icon: '🐳' },
              { name: 'MySQL', icon: '🗄️' },
              { name: 'MongoDB', icon: '🍃' },
              { name: 'Redis', icon: '🔴' },
              { name: 'Next.js', icon: '▲' },
              { name: 'Vue.js', icon: '🟩' },
              { name: 'Laravel', icon: '🔶' }
            ].map((tech, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow duration-300">
                <span className="text-3xl mb-3">{tech.icon}</span>
                <span className="font-semibold text-gray-800">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#002040] to-[#003060]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trova la Soluzione Perfetta
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            I nostri esperti ti aiuteranno a scegliere la piattaforma ideale per le tue esigenze specifiche
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button variant="secondary" size="lg">
              <span className="mr-2">📞</span>
              Consulenza Gratuita
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-[#002040]">
              <span className="mr-2">📋</span>
              Confronta Soluzioni
            </Button>
          </div>
          
          <p className="text-white/60 mt-8">
            <span className="mr-2">⚡</span>
            Setup in 24 ore • Migrazione assistita • Supporto tecnico dedicato
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}