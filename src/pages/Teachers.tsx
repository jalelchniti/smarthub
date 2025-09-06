import { Star, Languages, Calculator, Laptop, Briefcase, BookOpen, Globe, MessageCircle } from 'lucide-react';

const Teachers = () => {
  const subjects = [
    { name: 'Langues', icon: Languages, color: 'from-blue-500 to-indigo-500' },
    { name: 'Mathématiques', icon: Calculator, color: 'from-green-500 to-teal-500' },
    { name: 'Informatique', icon: Laptop, color: 'from-purple-500 to-pink-500' },
    { name: 'Business', icon: Briefcase, color: 'from-orange-500 to-red-500' },
    { name: 'Littérature', icon: BookOpen, color: 'from-indigo-500 to-purple-500' },
    { name: 'Examens Globaux', icon: Globe, color: 'from-teal-500 to-blue-500' },
  ];

  const teachers = [
    {
      name: 'Dr. Amina Khalil',
      subject: 'Français & Anglais',
      experience: '8 ans',
      rating: 4.9,
      specialties: ['DELF', 'TOEFL', 'Conversation'],
      description: 'Docteure en linguistique, spécialisée dans l\'enseignement des langues étrangères.'
    },
    {
      name: 'Prof. Mohamed Triki',
      subject: 'Mathématiques',
      experience: '12 ans',
      rating: 4.8,
      specialties: ['Algèbre', 'Géométrie', 'Préparation Concours'],
      description: 'Ancien professeur universitaire, expert en méthodes pédagogiques modernes.'
    },
    {
      name: 'Ing. Sarah Ben Ali',
      subject: 'Informatique',
      experience: '6 ans',
      rating: 4.9,
      specialties: ['Programmation', 'Web Design', 'IA'],
      description: 'Ingénieure informatique et formatrice certifiée en nouvelles technologies.'
    },
    {
      name: 'Dr. Karim Mansouri',
      subject: 'Business & Management',
      experience: '10 ans',
      rating: 4.7,
      specialties: ['Leadership', 'Marketing', 'Finance'],
      description: 'Consultant en management avec une expérience internationale.'
    },
    {
      name: 'Prof. Leila Bouaziz',
      subject: 'Littérature Arabe',
      experience: '15 ans',
      rating: 4.8,
      specialties: ['Poésie', 'Histoire', 'Rhétorique'],
      description: 'Professeure agrégée, passionnée par le patrimoine littéraire arabe.'
    },
    {
      name: 'Dr. Ahmed Khedher',
      subject: 'Préparation IELTS/TOEIC',
      experience: '9 ans',
      rating: 4.9,
      specialties: ['IELTS', 'TOEIC', 'Cambridge Exams'],
      description: 'Formateur certifié pour les examens internationaux d\'anglais.'
    }
  ];

  const handleWhatsAppContact = (teacherName: string) => {
    const message = `Bonjour! Je suis intéressé(e) par les cours de ${teacherName} chez SmartHub.`;
    window.open(`https://wa.me/21699730144?text=${encodeURIComponent(message)}`, '_blank');
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
            Une équipe d'enseignants qualifiés et passionnés, prêts à vous accompagner vers l'excellence académique
          </p>
        </div>
      </section>

      {/* Subject Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Matières Enseignées
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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

      {/* Teachers Grid */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Notre Équipe Pédagogique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {teacher.name.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Teacher Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-2">
                    {teacher.subject}
                  </p>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-700 font-semibold">
                      {teacher.rating}
                    </span>
                    <span className="ml-2 text-gray-500">
                      ({teacher.experience})
                    </span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {teacher.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm text-center mb-6">
                  {teacher.description}
                </p>

                {/* Contact Button */}
                <button
                  onClick={() => handleWhatsAppContact(teacher.name)}
                  className="w-full flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contacter sur WhatsApp
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">14+</div>
              <div className="text-gray-700">Enseignants Experts</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
              <div className="text-gray-700">Note Moyenne</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-700">Taux de Réussite</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-gray-700">Matières Enseignées</div>
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
            onClick={() => handleWhatsAppContact('notre équipe')}
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