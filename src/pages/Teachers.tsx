import { Languages, Calculator, Laptop, BookOpen, Globe, MessageCircle, Target, Settings, TrendingUp, Star, GraduationCap } from 'lucide-react';

const Teachers = () => {
  const subjects = [
    { name: 'Mathématiques', icon: Calculator, color: 'from-purple-500 to-pink-500' },
    { name: 'Physique', icon: Target, color: 'from-blue-500 to-indigo-500' },
    { name: 'Français', icon: Languages, color: 'from-green-500 to-teal-500' },
    { name: 'Anglais', icon: Globe, color: 'from-orange-500 to-red-500' },
    { name: 'Sciences de la Vie et de la Terre', icon: BookOpen, color: 'from-emerald-500 to-green-500' },
    { name: 'Arabe', icon: Settings, color: 'from-cyan-500 to-blue-500' },
    { name: 'Informatique', icon: Laptop, color: 'from-violet-500 to-purple-500' },
    { name: 'Économie & Gestion', icon: TrendingUp, color: 'from-rose-500 to-pink-500' },
    { name: 'ESP: Anglais Spécialisé', icon: Star, color: 'from-yellow-500 to-amber-500' }
  ];

  const handleWhatsAppContact = () => {
    const message = `Bonjour! Je suis intéressé(e) par les services SmartHub.`;
    window.open(`https://wa.me/21699456059?text=${encodeURIComponent(message)}`, '_blank');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Nos Enseignants
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-blue-100">
              Experts Certifiés
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Une équipe d'enseignants certifiés et expérimentés, spécialisés dans le soutien scolaire,
            la préparation aux examens et la formation professionnelle
          </p>
        </div>
      </section>

      {/* Subject Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Matières Enseignées
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-4xl mx-auto leading-relaxed">
            à tous les niveaux académiques : Primaire, Collège, Secondaire et Universitaire<br/>
            aussi bien qu'aux adultes : Développement professionnel, préparation aux concours et examens internationaux.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${subject.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <subject.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {subject.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Domaines d'Expertise */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
            Nos Domaines d'Expertise
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-4xl mx-auto">
            Notre équipe intervient dans tous les aspects de la formation académique et professionnelle
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Soutien Scolaire */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border-t-4 border-blue-500">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Soutien Scolaire</h3>
              <p className="text-gray-600 text-sm">Tous les niveaux académiques avec suivi personnalisé</p>
            </div>

            {/* Préparation aux Examens */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border-t-4 border-green-500">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Préparation aux Examens</h3>
              <p className="text-gray-600 text-sm">Bac, Concours, TOEFL, DELF et examens internationaux</p>
            </div>

            {/* Formations Adultes */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border-t-4 border-purple-500">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Formations Adultes</h3>
              <p className="text-gray-600 text-sm">Langues étrangères et développement professionnel</p>
            </div>

            {/* Formation des Formateurs */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border-t-4 border-orange-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="inline-block bg-orange-400 text-white px-2 py-1 rounded-full text-xs font-semibold mb-2">
                ⭐ NOUVEAU
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Formation des Formateurs</h3>
              <p className="text-gray-600 text-sm">Programme Digital Teacher avec IA et outils numériques</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à Commencer Votre Parcours d'Apprentissage ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contactez-nous dès maintenant pour trouver l'enseignant parfait pour vos besoins
          </p>
          <button
            onClick={handleWhatsAppContact}
            className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Contactez-nous sur WhatsApp
          </button>
        </div>
      </section>
    </div>
  );
};

export default Teachers;