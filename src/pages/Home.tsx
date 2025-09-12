import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import { MapPin, Users, Clock, Star, CheckCircle, ArrowRight, Building, Globe, Phone, X, UserPlus, BookOpen } from 'lucide-react';

export const Home = () => {
  const [showMap, setShowMap] = useState(false);
  
  const mapSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.927527841475!2d10.17702587640448!3d36.79628796791918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3472cdcd2081%3A0x6e5339efe27057be!2s13%20Rue%20de%20Belgique%2C%20Tunis!5e0!3m2!1sfr!2stn!4v1756241843416!5m2!1sfr!2stn';

  const services = [
    {
      icon: Building,
      title: 'Espaces d\'Apprentissage',
      description: 'Salles modernes équipées conçues pour des expériences d\'enseignement et d\'apprentissage efficaces.',
      features: ['Projecteur Interactif', 'WiFi Haut Débit', 'Sièges Confortables', 'Climatisation'],
      link: '/rooms',
      buttonText: 'Découvrir nos Salles',
      gradient: 'from-green-600 to-teal-600'
    },
    {
      icon: Users,
      title: 'Enseignants Experts',
      description: 'Connectez-vous avec des éducateurs qualifiés dans plusieurs matières pour un apprentissage personnalisé.',
      features: ['12+ Enseignants Qualifiés', 'Plusieurs Matières', 'Horaires Flexibles', 'Sessions en Présentiel'],
      link: '/teachers',
      buttonText: 'Trouver des Enseignants',
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const stats = [
    { number: '12+', label: 'Enseignants Experts', icon: Users, color: 'from-purple-600 to-pink-600' },
    { number: '234h', label: 'Disponibilité Hebdomadaire', icon: Clock, color: 'from-blue-600 to-indigo-600' },
    { number: '4.9★', label: 'Note Moyenne', icon: Star, color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="text-center">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white section-padding overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-16 max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="p-6 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm">
                <Building className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-center">
              Bienvenue chez
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                SmartHub
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 text-center max-w-5xl mx-auto leading-relaxed">
              Centre éducatif premium au cœur de Tunis qui connecte des enseignants compétents avec des étudiants sérieux. 
              Nous offrons des espaces d'apprentissage modernes et une sélection rigoureuse pour une expérience d'enseignement exceptionnelle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/rooms">
                <Button size="lg" className="flex items-center space-x-3 bg-white text-gray-900 hover:bg-gray-100 px-10 py-5 text-xl rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200">
                  <Building className="w-6 h-6" />
                  <span>Découvrir nos Salles</span>
                </Button>
              </Link>
              <Link to="/teachers">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex items-center space-x-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 text-xl rounded-3xl transition-all duration-200"
                >
                  <Users className="w-6 h-6" />
                  <span>Nos Enseignants</span>
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-blue-200">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-center text-lg">Centre éducatif premium • Enseignants qualifiés • Équipements modernes</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Stats Section */}
      <section className="relative section-padding text-center bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform hover:scale-105 transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="section-padding text-center bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-center">
              Nos Services
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 text-center leading-relaxed">
              Tout ce dont vous avez besoin pour un apprentissage et un enseignement efficaces dans notre{' '}
              <span 
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer"
                onClick={() => setShowMap(true)}
              >
                centre de Tunis
              </span>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={index} 
                  className="group relative overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-10">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${service.gradient} mb-8 shadow-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-xl text-gray-600 text-center leading-relaxed mb-8">
                      {service.description}
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-4">
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                          <span className="text-lg text-gray-700 text-left">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link to={service.link}>
                      <Button size="lg" className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white px-8 py-4 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3`}>
                        <span>{service.buttonText}</span>
                        <ArrowRight className="w-6 h-6" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${service.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section className="relative section-padding text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-center">
              Prêt à Commencer
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Votre Apprentissage ?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 text-center max-w-4xl mx-auto leading-relaxed">
              Rejoignez SmartHub et accédez à nos espaces d'apprentissage professionnels et à notre réseau d'enseignants qualifiés. 
              <span className="font-semibold text-indigo-600">L'inscription est gratuite</span> et vous donne accès à toutes nos fonctionnalités.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-2">29+</div>
                <div className="text-gray-600">Enseignants Experts</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">3</div>
                <div className="text-gray-600">Salles Équipées</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">4.9★</div>
                <div className="text-gray-600">Note Moyenne</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register/student">
                <Button 
                  size="lg" 
                  className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  <UserPlus className="w-6 h-6" />
                  <span>Inscription Étudiant</span>
                </Button>
              </Link>
              <Link to="/register/teacher">
                <Button 
                  size="lg" 
                  className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  <BookOpen className="w-6 h-6" />
                  <span>Candidature Enseignant</span>
                </Button>
              </Link>
              <Link to="/learn-more">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg rounded-3xl border-2 border-gray-300 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-200">
                  En Savoir Plus
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-gray-500 mt-8">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-center text-lg">Inscription gratuite • Aucun engagement • Accès immédiat</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="relative section-padding text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="p-6 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm">
                <MapPin className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">
              Visitez Notre
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Centre de Tunis
              </span>
            </h2>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white border-opacity-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Adresse</h3>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    13, Rue de Belgique, Immeuble MAE<br/>
                    1er étage, Bureau 1.1, 1000 Tunis
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Horaires</h3>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Lundi - Samedi : 9h00 - 13h00, 15h00 - 18h00<br/>
                    Dimanche : 10h00 - 13h00
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="flex items-center space-x-3 bg-white text-gray-900 hover:bg-gray-100 px-10 py-5 text-xl rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200">
                <Phone className="w-6 h-6" />
                <span>Appelez +216 99 456 059</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex items-center space-x-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 text-xl rounded-3xl transition-all duration-200"
                onClick={() => setShowMap(true)}
              >
                <Globe className="w-6 h-6" />
                <span>Itinéraire</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 text-center">Visitez SmartHub</h3>
                <p className="text-gray-600 text-center mt-1">Centre de Tunis</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center justify-center w-10 h-10 rounded-full p-0 border-gray-300 hover:border-red-400 hover:text-red-600"
                onClick={() => setShowMap(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <div className="mb-4 text-center">
                <p className="text-lg text-gray-700 font-medium mb-2">Notre Adresse :</p>
                <p className="text-gray-600">13, Rue de Belgique, Immeuble MAE<br/>1er étage, Bureau 1.1<br/>1000 Tunis</p>
              </div>
              <GoogleMapEmbed
                mapSrc={mapSrc}
                title="Visit SmartHub in Tunis City Center"
                mapHeight="400px"
                ariaLabel="Map showing SmartHub at Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};