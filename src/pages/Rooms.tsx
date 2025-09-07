import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import GoogleMapEmbed from '../components/GoogleMapEmbed';
import { MapPin, Users, Clock, Wifi, Monitor, Building, CheckCircle, Calendar, X, MessageCircle } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  capacity: number;
  hourlyRate: number;
  peakHourlyRate: number;
  amenities: string[];
  description: string;
  features: { icon: React.ComponentType<{ className?: string }>; text: string }[];
  pricing: { capacity: string; rate: number }[];
  availability: string;
  image: string;
}

export const Rooms: React.FC = () => {
  const [showMap, setShowMap] = useState(false);
  
  const mapSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.927527841475!2d10.17702587640448!3d36.79628796791918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3472cdcd2081%3A0x6e5339efe27057be!2s13%20Rue%20de%20Belgique%2C%20Tunis!5e0!3m2!1sfr!2stn!4v1756241843416!5m2!1sfr!2stn';

  // Static room data
  const rooms: Room[] = [
    {
      id: '1',
      name: 'Salle 1',
      capacity: 15,
      hourlyRate: 30,
      peakHourlyRate: 40,
      amenities: ['WiFi Haut Débit', 'Climatisation', 'Éclairage LED', 'Tableau Interactif'],
      description: 'Salle d\'apprentissage spacieuse équipée d\'un projecteur interactif, parfaite pour le tutorat privé, les cours en petits groupes, l\'apprentissage des langues, les matières académiques et la formation professionnelle dans notre centre de Tunis.',
      features: [
        { icon: Users, text: 'Jusqu\'à 15 personnes' },
        { icon: Monitor, text: 'Projecteur Interactif' },
        { icon: Wifi, text: 'WiFi Haut Débit' },
        { icon: Clock, text: '78 heures/semaine' }
      ],
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 20 },
        { capacity: '2-6 personnes', rate: 25 },
        { capacity: '7-9 personnes', rate: 30 },
        { capacity: '10-15 personnes', rate: 35 }
      ],
      availability: '78 hours/week',
      image: '/images/room-1.jpg'
    },
    {
      id: '2',
      name: 'Salle 2',
      capacity: 9,
      hourlyRate: 15,
      peakHourlyRate: 20,
      amenities: ['WiFi Haut Débit', 'Climatisation', 'Éclairage LED', 'Système Audio'],
      description: 'Salle d\'apprentissage intime équipée d\'un tableau blanc, parfaite pour le tutorat privé, les cours en petits groupes, l\'apprentissage des langues, les matières académiques et la formation professionnelle dans notre centre de Tunis.',
      features: [
        { icon: Users, text: 'Jusqu\'à 9 personnes' },
        { icon: Monitor, text: 'Tableau Blanc' },
        { icon: Wifi, text: 'WiFi Haut Débit' },
        { icon: Clock, text: '78 heures/semaine' }
      ],
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 15 },
        { capacity: '2-7 personnes', rate: 20 },
        { capacity: '8-9 personnes', rate: 25 }
      ],
      availability: '78 hours/week',
      image: '/images/room-2.jpg'
    },
    {
      id: '3',
      name: 'Salle 3',
      capacity: 9,
      hourlyRate: 15,
      peakHourlyRate: 20,
      amenities: ['WiFi Haut Débit', 'Climatisation', 'Éclairage LED', 'Système Audio'],
      description: 'Salle d\'apprentissage intime équipée d\'un tableau blanc, parfaite pour le tutorat privé, les cours en petits groupes, l\'apprentissage des langues, les matières académiques et la formation professionnelle dans notre centre de Tunis.',
      features: [
        { icon: Users, text: 'Jusqu\'à 9 personnes' },
        { icon: Monitor, text: 'Tableau Blanc' },
        { icon: Wifi, text: 'WiFi Haut Débit' },
        { icon: Clock, text: '78 heures/semaine' }
      ],
      pricing: [
        { capacity: 'Individuel (1 apprenant)', rate: 15 },
        { capacity: '2-7 personnes', rate: 20 },
        { capacity: '8-9 personnes', rate: 25 }
      ],
      availability: '78 hours/week',
      image: '/images/room-3.jpg'
    }
  ];

  return (
    <div className="text-center">
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-green-900 via-teal-800 to-blue-900 text-white section-padding overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <Building className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-center tracking-tight leading-normal">
              Espaces d'Apprentissage
              <span className="block text-orange-300">
                Professionnels
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto text-center leading-relaxed">
              Découvrez nos <span className="font-semibold text-yellow-300">salles entièrement équipées</span> au centre de Tunis. 
              Des installations modernes conçues pour des expériences d'enseignement et d'apprentissage efficaces.
            </p>
            <div 
              className="flex items-center justify-center space-x-2 text-green-200 mt-8 cursor-pointer hover:text-yellow-300 transition-colors duration-200"
              onClick={() => setShowMap(true)}
            >
              <MapPin className="w-6 h-6 text-yellow-400" />
              <span className="text-center text-lg underline">Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-10 mb-20 text-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="text-center">
                  <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                    234
                  </div>
                  <div className="text-xl font-semibold text-gray-700 mb-2">Heures par Semaine</div>
                  <div className="text-gray-600">Disponibilité totale</div>
                </div>
                
                <div className="text-center">
                  <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
                    15-35
                  </div>
                  <div className="text-xl font-semibold text-gray-700 mb-2">TND/Heure</div>
                  <div className="text-gray-600">Tarification flexible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Rooms Grid */}
      <section className="section-padding text-center bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Nos Espaces d'Apprentissage
            </h2>
            <p className="text-xl text-gray-600 text-center">
              Découvrez nos salles modernes et équipées pour vos besoins éducatifs
            </p>
          </div>
          
          {/* Rooms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center items-stretch">
            {rooms.map((room) => (
              <div 
                key={room.id} 
                className="group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative p-8 flex flex-col h-full">
                  {/* Room Image */}
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6 relative overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-400/10"></div>
                  </div>

                  {/* Room Info */}
                  <div className="text-center flex-1 flex flex-col">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center group-hover:text-green-600 transition-colors">{room.name}</h3>
                    <p className="text-gray-600 mb-6 text-center leading-relaxed">{room.description}</p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                      {room.features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                          <div key={index} className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-gray-50 group-hover:bg-green-50 transition-colors">
                            <IconComponent className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700 text-center">{feature.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Amenities */}
                    <div className="mb-6 text-center">
                      <h4 className="font-bold text-gray-900 mb-4 text-center text-lg">Équipements</h4>
                      <div className="space-y-3">
                        {room.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center justify-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 text-center">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Availability */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-6 text-center border border-green-100">
                      <h4 className="font-bold text-gray-900 mb-4 text-center text-lg">Tarification</h4>
                      <div className="space-y-3 mb-6">
                        {room.pricing.map((tier, index) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-white/50">
                            <span className="text-sm font-medium text-gray-700 text-center">{tier.capacity}</span>
                            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">{tier.rate} TND/heure</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-center border-t border-green-200 pt-4">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <Clock className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-bold text-gray-700 text-center">{room.availability}</span>
                        </div>
                        <div className="text-xs text-gray-500 text-center">disponible par semaine</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Enhanced Design */}
      <section className="bg-gradient-to-br from-gray-900 to-green-900 text-white section-padding text-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <Calendar className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
              Intéressé par Nos Espaces ?
            </h2>
            <p className="text-xl text-green-100 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
              Contactez-nous pour plus d'informations sur la disponibilité et les modalités de nos espaces d'apprentissage 
              dans notre centre de Tunis. Installations professionnelles pour vos besoins éducatifs.
            </p>
            
            <div className="flex justify-center">
              <a 
                href="https://wa.me/21699730144?text=Bonjour! Je suis intéressé par vos espaces d'apprentissage à SmartHub. Pourriez-vous me fournir plus d'informations sur la disponibilité et les tarifs?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6" />
                  Appelez-nous directement ou sur WhatsApp : +216 99 730 144
                </Button>
              </a>
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
                <h3 className="text-2xl font-bold text-gray-900 text-center">Visitez Nos Salles</h3>
                <p className="text-gray-600 text-center mt-1">Espaces d'Apprentissage Professionnels</p>
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
                <p className="text-gray-600">Rue de Belgique, Immeuble MAE<br/>1er étage, Bureau 1.1<br/>1000 Tunis</p>
              </div>
              <GoogleMapEmbed
                mapSrc={mapSrc}
                title="Visit our Professional Learning Spaces in Tunis City Center"
                mapHeight="400px"
                ariaLabel="Map showing our rooms at Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};