import { Languages, Calculator, Laptop, BookOpen, Globe, MessageCircle, Target, Settings, TrendingUp, Star, GraduationCap, User, Award, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AdminDataStorage } from '../utils/adminDataStorage';
import type { Teacher } from '../types/admin.types';

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch teachers from backend API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const data = await AdminDataStorage.load();

        // Get only active teachers with photos, sorted by creation date (newest first)
        const activeTeachersWithPhotos = data.teachers
          .filter(t => t.status === 'active' && t.photo && t.photo.trim() !== '')
          .sort((a, b) => {
            const dateA = new Date(a.created_at || 0).getTime();
            const dateB = new Date(b.created_at || 0).getTime();
            return dateB - dateA;
          });

        setTeachers(activeTeachersWithPhotos);
        setError(null);
      } catch (err) {
        console.error('Failed to load teachers:', err);
        setError('Impossible de charger les enseignants. Vérifiez que le serveur est démarré.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Calculate years of experience from bio or use default
  const getExperience = (teacher: Teacher): string => {
    const bioMatch = teacher.bio.match(/(\d+)\s*ans/i);
    if (bioMatch) {
      return `${bioMatch[1]} ans`;
    }
    return 'Expérimenté';
  };

  // Truncate bio to exact word count for uniform card heights
  const truncateBio = (bio: string, wordLimit: number = 35): string => {
    const words = bio.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      return bio;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

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

      {/* Featured Teachers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Enseignants Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez notre équipe d'enseignants certifiés et expérimentés,
              sélectionnés pour leur expertise pédagogique et leur passion pour l'enseignement
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800 font-semibold">{error}</p>
              <p className="text-red-600 text-sm mt-2">
                Assurez-vous que le serveur backend est démarré avec: npm run dev
              </p>
            </div>
          )}

          {/* Teachers Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  {/* Teacher Photo */}
                  <div className="relative h-[512px] bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    {teacher.photo ? (
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <User className="w-16 h-16 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Active Status Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
                      ✓ Disponible
                    </div>
                  </div>

                  {/* Teacher Info */}
                  <div className="p-6">
                    {/* Name and Experience */}
                    <div className="mb-4 h-20">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {teacher.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Award className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold">{getExperience(teacher)} d'expérience</span>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div className="mb-4 h-16">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Matières enseignées
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {teacher.subjects.slice(0, 3).map((subject, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-lg shadow-sm"
                          >
                            {subject}
                          </span>
                        ))}
                        {teacher.subjects.length > 3 && (
                          <span className="inline-flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg">
                            +{teacher.subjects.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-16 h-[160px]">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Profil
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed overflow-hidden">
                        {truncateBio(teacher.bio, 65)}
                      </p>
                    </div>

                    {/* Contact Button */}
                    <button
                      onClick={() => {
                        const message = `Bonjour! Je suis intéressé(e) par les cours de ${teacher.name} (${teacher.subjects.join(', ')}). Pouvez-vous me donner plus d'informations?`;
                        window.open(`https://wa.me/21699456059?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Contacter sur WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && teachers.length === 0 && (
            <div className="text-center py-20">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Aucun enseignant disponible pour le moment</p>
            </div>
          )}
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