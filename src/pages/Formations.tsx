import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  GraduationCap,
  BookOpen,
  Target,
  Globe,
  Laptop,
  Users,
  CheckCircle,
  Award,
  TrendingUp,
  Brain,
  Sparkles,
  Code,
  MessageSquare,
  Zap,
  Calendar,
  Clock,
  FileText,
  UserCheck,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const Formations = () => {
  return (
    <div className="min-h-screen">
      <link rel="canonical" href="https://smarthub.com.tn/formations" />
      <title>Programmes de Formation - SmartHub</title>
      <meta name="description" content="Découvrez nos formations complètes à SmartHub : soutien scolaire, préparation aux examens, formations pour adultes, et notre programme Digital Teacher." />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 text-white py-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <GraduationCap className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-center">
            Nos Programmes de
            <span className="block text-orange-300">Formation</span>
          </h1>

          <p className="text-xl md:text-2xl text-indigo-100 max-w-4xl mx-auto text-center leading-relaxed mb-8">
            Découvrez nos formations complètes : soutien scolaire, préparation aux examens,
            formations pour adultes, professionnelles et notre nouveau programme Digital Teacher.
          </p>
        </div>
      </section>

      {/* Section 1: Soutien Scolaire */}
      <section id="soutien-scolaire" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6">
              <BookOpen className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cours de Soutien Scolaire
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Appui scolaire personnalisé pour tous les niveaux : primaire, collège, secondaire et universitaire.
            </p>
          </div>

          {/* Niveaux académiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* Primaire */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Primaire</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Mathématiques</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Français</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Arabe</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Sciences</span>
                </li>
              </ul>
            </div>

            {/* Collège */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-500 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">Collège</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Mathématiques</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Physique-Chimie</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">SVT</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Langues (FR, EN, AR)</span>
                </li>
              </ul>
            </div>

            {/* Secondaire */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Secondaire</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Mathématiques</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Physique</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Économie & Gestion</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Informatique</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Philosophie</span>
                </li>
              </ul>
            </div>

            {/* Universitaire */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-pink-500 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">Universitaire</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Mathématiques avancées</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Statistiques</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Programmation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Matières spécialisées</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Approche pédagogique */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Notre Approche Pédagogique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-xl mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Petits Groupes</h4>
                <p className="text-gray-600">3-6 étudiants maximum pour un suivi optimal</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-xl mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Suivi Individualisé</h4>
                <p className="text-gray-600">Diagnostic personnalisé des lacunes</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-xl mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Rapports Mensuels</h4>
                <p className="text-gray-600">Suivi des progrès aux parents</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-xl mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Résultats Garantis</h4>
                <p className="text-gray-600">Amélioration mesurable</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/register/student">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200">
                <UserCheck className="w-6 h-6 mr-2" />
                S'inscrire au Soutien Scolaire
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Préparation aux Examens */}
      <section id="preparation-examens" className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-2xl mb-6">
              <Target className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Préparation aux Examens
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sessions intensives de préparation aux examens nationaux et internationaux avec examens blancs hebdomadaires.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Examens Nationaux */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-xl mr-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Examens Nationaux</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Concours 6ème année</span>
                    <p className="text-gray-600">Préparation intensive pour Collège Pilote</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Concours 9ème année</span>
                    <p className="text-gray-600">Préparation intensive pour Lycée Pilote</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Baccalauréat</span>
                    <p className="text-gray-600">Toutes sections (Maths, Sciences, Économie, Lettres)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Examens Universitaires</span>
                    <p className="text-gray-600">Préparation matières spécialisées</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Examens Internationaux */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-xl mr-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Examens Internationaux</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Anglais</span>
                    <p className="text-gray-600">TOEFL, TOEIC, IELTS, Cambridge (B2, C1, C2)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">Français</span>
                    <p className="text-gray-600">DELF, DALF, TCF (A1-C2)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">SAT / ACT</span>
                    <p className="text-gray-600">Admission universités américaines</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-900">GMAT / GRE</span>
                    <p className="text-gray-600">MBA et études supérieures</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Format des sessions */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Format des Sessions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Sessions Intensives</h4>
                <p className="text-gray-600">Bootcamps pendant vacances scolaires (2-4 semaines)</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
                <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Examens Blancs</h4>
                <p className="text-gray-600">Tests hebdomadaires en conditions réelles</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Gestion Stress</h4>
                <p className="text-gray-600">Stratégies gestion du temps et du stress</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/register/student">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200">
                <Target className="w-6 h-6 mr-2" />
                S'inscrire à la Préparation Examens
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Formations Adultes */}
      <section id="formations-adultes" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-2xl mb-6">
              <Globe className="w-12 h-12 text-purple-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Formations pour Adultes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Formations langues étrangères pour adultes avec programmes adaptés et certifications reconnues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Anglais Général */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Anglais Général</h3>
              <p className="text-gray-600 mb-4">Tous niveaux A1 à C2</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Compréhension orale</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Expression écrite</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Grammaire & vocabulaire</span>
                </li>
              </ul>
            </div>

            {/* Anglais Conversationnel */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Anglais Conversationnel</h3>
              <p className="text-gray-600 mb-4">Focus communication orale</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Conversations pratiques</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Prononciation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Confiance à l'oral</span>
                </li>
              </ul>
            </div>

            {/* Anglais des Affaires */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">Anglais des Affaires</h3>
              <p className="text-gray-600 mb-4">Professionnel et business</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Vocabulaire business</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Emails professionnels</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Présentations</span>
                </li>
              </ul>
            </div>

            {/* TOEFL/TOEIC */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Préparation TOEFL/TOEIC</h3>
              <p className="text-gray-600 mb-4">Score 80-900+</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Stratégies d'examen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Tests blancs</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Garantie score</span>
                </li>
              </ul>
            </div>

            {/* DELF */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-pink-600 mb-4">DELF Tous Niveaux</h3>
              <p className="text-gray-600 mb-4">A1, A2, B1, B2</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">4 compétences</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Simulations d'examen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Certification officielle</span>
                </li>
              </ul>
            </div>

            {/* Format & Durée */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-purple-600 mb-4">Format & Durée</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Durée: 2-6 mois</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-5 h-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Groupes: 4-8 personnes</span>
                </li>
                <li className="flex items-start">
                  <UserCheck className="w-5 h-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Cours particuliers disponibles</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-5 h-5 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Certificat de fin de formation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/register/student">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200">
                <Globe className="w-6 h-6 mr-2" />
                S'inscrire aux Formations Langues
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Formations Professionnelles */}
      <section id="formations-professionnelles" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-2xl mb-6">
              <Laptop className="w-12 h-12 text-orange-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Formations Professionnelles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Développez vos compétences digitales avec nos formations spécialisées en Web Design, Social Media et Intelligence Artificielle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Web Design & Développement */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-blue-500 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6 mx-auto">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Web Design & Développement</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">HTML5, CSS3, JavaScript</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Responsive Design & UI/UX</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">WordPress & Shopify</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Portfolio professionnel</span>
                </li>
              </ul>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">Durée:</span> 2-3 mois
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">Certification:</span> SmartHub Web Developer
                </p>
              </div>
            </div>

            {/* Social Media Management */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-purple-500 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6 mx-auto">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Social Media Management</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Stratégie de contenu</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700"><a href="https://www.facebook.com/smarthub.com.tn" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>, Instagram, <a href="https://www.linkedin.com/company/smarthubtunis" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>, TikTok</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Meta Ads & Google Ads</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Analytics & ROI</span>
                </li>
              </ul>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-purple-600">Durée:</span> 1-2 mois
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-purple-600">Certification:</span> Social Media Manager
                </p>
              </div>
            </div>

            {/* Intelligence Artificielle */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-pink-500 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-6 mx-auto">
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Intelligence Artificielle</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Introduction IA & Machine Learning</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">ChatGPT, Midjourney, DALL-E</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">IA pour productivité pro</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Automatisation No-Code</span>
                </li>
              </ul>
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-pink-600">Durée:</span> 1 mois
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-pink-600">Certification:</span> AI Power User
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/register/student">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200">
                <Laptop className="w-6 h-6 mr-2" />
                S'inscrire aux Formations Pro
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Formation des Formateurs (Premium) */}
      <section id="formation-formateurs" className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm mb-8">
              <GraduationCap className="w-16 h-16 text-orange-300" />
            </div>
            <div className="inline-block bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              ⭐ NOUVEAU PROGRAMME
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Devenez un Digital Teacher Certifié
            </h2>
            <p className="text-xl md:text-2xl text-indigo-200 max-w-4xl mx-auto leading-relaxed">
              Maîtrisez les outils numériques et l'IA pour transformer votre enseignement et propulser votre carrière pédagogique.
            </p>
          </div>

          {/* Programme Digital Teacher */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h3 className="text-3xl font-bold text-orange-300 mb-8 text-center">Programme Digital Teacher</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Outils Technopédagogiques */}
              <div>
                <div className="flex items-center mb-4">
                  <Laptop className="w-8 h-8 text-blue-300 mr-3" />
                  <h4 className="text-xl font-bold text-white">Outils Technopédagogiques</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Google Classroom, Moodle, Zoom</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Création contenu multimédia</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Tableaux blancs numériques</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Gamification (Kahoot, Quizlet)</span>
                  </li>
                </ul>
              </div>

              {/* IA pour l'Enseignement */}
              <div>
                <div className="flex items-center mb-4">
                  <Sparkles className="w-8 h-8 text-pink-300 mr-3" />
                  <h4 className="text-xl font-bold text-white">IA pour l'Enseignement</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">ChatGPT: Plans de cours & évals</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Correction automatique</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Canva AI, DALL-E (visuels)</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Différenciation pédagogique</span>
                  </li>
                </ul>
              </div>

              {/* Gestion de Classe Virtuelle */}
              <div>
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-purple-300 mr-3" />
                  <h4 className="text-xl font-bold text-white">Gestion Classe Virtuelle</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Animation sessions en ligne</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Engagement à distance</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Évaluation en ligne</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-indigo-100">Cours hybrides</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Enhancement Compétences Pédagogiques */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h3 className="text-3xl font-bold text-orange-300 mb-8 text-center">Enhancement Compétences Pédagogiques</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Brain className="w-8 h-8 text-yellow-300 mr-3" />
                  <h4 className="text-xl font-bold text-white">Techniques Modernes</h4>
                </div>
                <ul className="space-y-2 text-indigo-100">
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Pédagogie active & apprentissage par projet</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Enseignement différencié</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Neurosciences & apprentissage</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Motivation des apprenants</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-8 h-8 text-green-300 mr-3" />
                  <h4 className="text-xl font-bold text-white">Gestion & Communication</h4>
                </div>
                <ul className="space-y-2 text-indigo-100">
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Gestion de groupes difficiles</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Communication non-violente</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Gestion des conflits</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                    <span>Collaboration avec parents</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4 Spécialisations */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 mb-8">
            <h3 className="text-3xl font-bold text-orange-300 mb-8 text-center">4 Spécialisations Disponibles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-600 bg-opacity-30 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Enseignement aux Adultes</h4>
                <p className="text-indigo-200 text-sm">Andragogie</p>
              </div>
              <div className="bg-purple-600 bg-opacity-30 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Langues Étrangères</h4>
                <p className="text-indigo-200 text-sm">CECRL, TOEFL, DELF</p>
              </div>
              <div className="bg-pink-600 bg-opacity-30 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Enseignement STEM</h4>
                <p className="text-indigo-200 text-sm">Sciences, Tech, Maths</p>
              </div>
              <div className="bg-orange-600 bg-opacity-30 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-2">Coaching Académique</h4>
                <p className="text-indigo-200 text-sm">Mentorat</p>
              </div>
            </div>
          </div>

          {/* Format & Certification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Format */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-orange-300 mb-6">Format & Durée</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-300 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Intensif:</span>
                    <span className="text-indigo-200"> 2 semaines (30h)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="w-6 h-6 text-blue-300 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Étalé:</span>
                    <span className="text-indigo-200"> 2-3 mois (40h)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Calendar className="w-6 h-6 text-blue-300 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Workshops:</span>
                    <span className="text-indigo-200"> Week-end (8-16h)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <UserCheck className="w-6 h-6 text-blue-300 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Coaching:</span>
                    <span className="text-indigo-200"> Individuel (10-20h)</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Certifications & Bénéfices */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-orange-300 mb-6">Certifications & Bénéfices</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Award className="w-6 h-6 text-yellow-300 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-white">Certificat SmartHub Formation des Formateurs</span>
                </li>
                <li className="flex items-start">
                  <Award className="w-6 h-6 text-yellow-300 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-white">Badge Digital Teacher certifié</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-6 h-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-white">Augmentation tarifs horaires</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-6 h-6 text-blue-300 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-white">Réseau d'enseignants innovants</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Premium */}
          <div className="text-center">
            <Link to="/register/teacher">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-12 py-6 text-xl rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-white border-opacity-20">
                <GraduationCap className="w-8 h-8 mr-3" />
                Devenir Digital Teacher
              </Button>
            </Link>
            <p className="text-indigo-200 mt-4">
              Première session d'information gratuite
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Avantages SmartHub */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi Choisir SmartHub ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un centre de formation de qualité au cœur de Tunis avec des enseignants certifiés et des programmes adaptés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enseignants Certifiés</h3>
              <p className="text-gray-600">15+ enseignants qualifiés et expérimentés avec certifications reconnues</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Taux de Réussite 95%</h3>
              <p className="text-gray-600">Résultats prouvés avec suivi personnalisé et méthodologie efficace</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Petits Groupes</h3>
              <p className="text-gray-600">Maximum 6-8 étudiants par groupe pour un apprentissage optimal</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-6">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Emplacement Central</h3>
              <p className="text-gray-600">13 Rue de Belgique, Tunis - Facilement accessible en transport</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-6">
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Technologie Moderne</h3>
              <p className="text-gray-600">Salles équipées avec outils numériques et plateformes en ligne</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-6">
                <CheckCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certification Reconnue</h3>
              <p className="text-gray-600">Certificats et attestations valorisant votre parcours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à Commencer Votre Formation ?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12">
            Inscrivez-vous maintenant et bénéficiez de la première séance d'essai gratuite.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register/student">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-xl rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200">
                <UserCheck className="w-6 h-6 mr-2" />
                Je suis Étudiant
              </Button>
            </Link>
            <Link to="/register/teacher">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-5 text-xl rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-200">
                <GraduationCap className="w-6 h-6 mr-2" />
                Je suis Enseignant
              </Button>
            </Link>
          </div>

          <p className="text-blue-200 mt-8">
            Besoin d'informations ? Appelez-nous au <span className="font-bold">+216 99 730 144</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Formations;
