import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { 
  MapPin, Users, BookOpen, Languages, UserPlus, 
  Calculator, Laptop,
  Phone, ArrowRight,
  Settings, Target, Bookmark, Video,
  Star, TrendingUp, Globe
} from 'lucide-react';

export const LearnMore: React.FC = () => {

  const subjects = [
    { name: 'Mathématiques', teachers: 6, icon: Calculator, color: 'from-purple-500 to-pink-500' },
    { name: 'Physique', teachers: 4, icon: Target, color: 'from-blue-500 to-indigo-500' },
    { name: 'Français', teachers: 4, icon: Languages, color: 'from-green-500 to-teal-500' },
    { name: 'Anglais', teachers: 3, icon: Globe, color: 'from-orange-500 to-red-500' },
    { name: 'Sciences de la Vie et de la Terre', teachers: 4, icon: BookOpen, color: 'from-emerald-500 to-green-500' },
    { name: 'Arabe', teachers: 2, icon: Settings, color: 'from-cyan-500 to-blue-500' },
    { name: 'Informatique', teachers: 3, icon: Laptop, color: 'from-violet-500 to-purple-500' },
    { name: 'Économie & Gestion', teachers: 2, icon: TrendingUp, color: 'from-rose-500 to-pink-500' },
    { name: 'ESP: Anglais Spécialisé', teachers: 1, icon: Star, color: 'from-yellow-500 to-amber-500' }
  ];

  const steps = [
    {
      number: '01',
      title: 'Nous Contacter',
      description: 'Contactez-nous pour discuter de vos besoins et trouver l\'enseignant qui vous correspond.',
      icon: Phone
    },
    {
      number: '02',
      title: 'Vous Inscrire à un Cours',
      description: 'Finalisez votre inscription et planifiez vos sessions d\'apprentissage.',
      icon: UserPlus
    },
    {
      number: '03',
      title: 'Commencer à Apprendre',
      description: 'Rencontrez votre enseignant dans notre centre de Tunis et commencez votre parcours.',
      icon: BookOpen
    }
  ];

  return (
    <div className="text-center">
      <link rel="canonical" href="https://smarthub.com.tn/learn-more" />
      <title>En Savoir Plus - SmartHub</title>
      <meta name="description" content="Apprenez-en plus sur SmartHub, nos programmes de formation, nos enseignants qualifiés et notre centre d'apprentissage moderne au coeur de Tunis." />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white section-padding overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <Video className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-center tracking-tight leading-normal">
              Programmes de Formation
              <span className="block text-orange-300">
                SmartHub
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto text-center leading-relaxed mb-8">
              Centre de formation et de tutorat académique avec des programmes complets : soutien scolaire,
              préparation aux examens, formations professionnelles et{' '}
              <span className="font-semibold text-yellow-300">Formation des Formateurs</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="flex items-center space-x-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-10 py-5 text-xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200">
                  <UserPlus className="w-6 h-6" />
                  <span>Commencer Votre Parcours</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Subject Preview */}
      <section className="section-padding text-center bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Ce que nos enseignants vous offrent actuellement
            </h2>
            <p className="text-xl text-gray-600 text-center">
              Cours particuliers et préparation aux examens nationaux (Baccalauréat, Collège Pilote, Lycée Pilote)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            {subjects.map((subject, index) => {
              const IconComponent = subject.icon;
              return (
                <div 
                  key={index} 
                  className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-blue-200"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} mb-4 shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{subject.name}</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">{subject.teachers} enseignants disponibles</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding text-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Comment Ça Marche
            </h2>
            <p className="text-xl text-gray-600 text-center">
              Commencer est simple et direct
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative text-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{step.description}</p>
                  
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-4 w-8">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="relative section-padding text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="p-8 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm">
                <Bookmark className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">
              Prêt à Libérer Votre
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Potentiel ?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 text-center max-w-4xl mx-auto leading-relaxed">
              Rejoignez des centaines d'étudiants qui apprennent déjà avec des enseignants qualifiés chez SmartHub.
              Inscrivez-vous maintenant pour déverrouiller votre tableau de bord personnalisé et commencer à vous connecter avec des éducateurs experts.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register/student">
                <Button size="lg" className="flex items-center space-x-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-12 py-6 text-xl rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200">
                  <UserPlus className="w-8 h-8" />
                  <span>S'inscrire Maintenant - C'est Gratuit</span>
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-blue-200 mt-8">
              <MapPin className="w-6 h-6 text-yellow-400" />
              <span className="text-center text-lg">Rue de Belgique, Immeuble MAE, 1er étage, Bureau 1.1, 1000 Tunis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white section-padding text-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                <Phone className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              Vous Avez des Questions ?
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
              Notre équipe est là pour vous aider à commencer. Contactez-nous pour plus d'informations sur l'inscription, 
              les enseignants, ou le fonctionnement de notre plateforme d'apprentissage.
            </p>
            
            <div className="flex justify-center items-center">
              <Button size="lg" className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200">
                <Phone className="w-6 h-6" />
                <span>Appeler +216 99 730 144</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};