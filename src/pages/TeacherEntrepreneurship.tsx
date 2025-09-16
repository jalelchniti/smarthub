import { Calculator, TrendingUp, Shield, Users, DollarSign, Target, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherEntrepreneurship = () => {

  const revenueExamples = [
    {
      title: "4 étudiants",
      subtitle: "4h/semaine",
      netIncome: "208 TND/mois",
      hourlyRate: "12.0 TND/h",
      description: "Protection SmartHub 35%",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "6 étudiants",
      subtitle: "4h/semaine",
      netIncome: "208 TND/mois",
      hourlyRate: "12.0 TND/h",
      description: "Protection SmartHub 2%",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "9 étudiants",
      subtitle: "4h/semaine",
      netIncome: "462 TND/mois",
      hourlyRate: "26.7 TND/h",
      description: "Groupe intermédiaire",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "15 étudiants",
      subtitle: "4h/semaine",
      netIncome: "1,079 TND/mois",
      hourlyRate: "62.3 TND/h",
      description: "Groupe complet",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const growthScenarios = [
    {
      students: "6 étudiants",
      revenue: "208 TND",
      hourlyRate: "12.0 TND/h",
      multiplier: "Minimum garanti"
    },
    {
      students: "9 étudiants",
      revenue: "462 TND",
      hourlyRate: "26.7 TND/h",
      multiplier: "2.2x minimum"
    },
    {
      students: "15 étudiants",
      revenue: "1,079 TND",
      hourlyRate: "62.3 TND/h",
      multiplier: "5.2x minimum"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="p-6 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm">
              <TrendingUp className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            L'Alternative Indépendante
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-blue-100">
              Pour les Enseignants Ambitieux
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
            Pourquoi accepter des tarifs imposés quand vous pouvez développer votre activité d'enseignement indépendante ?
            Chez SmartHub, vous fixez vos tarifs, gérez vos étudiants, et bénéficiez de notre protection minimum garantie.
          </p>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 inline-block border border-white border-opacity-20">
            <div className="flex items-center justify-center space-x-4">
              <Shield className="w-8 h-8 text-green-300" />
              <span className="text-xl font-semibold text-green-300">Minimum 12 TND/heure garanti</span>
              <span className="text-lg text-blue-100">avec protection jusqu'à 35%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Centre Standard vs SmartHub Indépendant
            </h2>
            <p className="text-xl text-gray-600">
              Étude de cas : 1 groupe, 9 étudiants, 2 séances de 2 heures par semaine.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Centre Standard */}
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
              <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">
                🏢 Centre Standard (Employé)
              </h3>

              <div className="bg-white rounded-lg p-4 mb-6 border border-red-300">
                <h4 className="font-bold text-gray-900 mb-3 text-center">Exemple Concret:</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Heures/semaine imposées</span>
                    <span className="font-medium">4h minimum</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heures/mois travaillées</span>
                    <span className="font-medium">16h/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tarif horaire fixe</span>
                    <span className="font-medium">12 TND/heure</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-bold">Salaire mensuel:</span>
                    <span className="font-bold text-red-600">192 TND/mois</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Salaire horaire:</span>
                  <span className="font-bold text-red-600">12 TND/heure fixe</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Contrôle tarifs:</span>
                  <span className="text-red-600">❌ Aucun</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Environnement:</span>
                  <span className="text-red-600">Classes surchargées</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Évolution:</span>
                  <span className="text-red-600">Augmentations rares</span>
                </div>
              </div>
            </div>

            {/* SmartHub Indépendant */}
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                🚀 SmartHub (Indépendant)
              </h3>

              <div className="bg-white rounded-lg p-4 mb-6 border border-green-300">
                <h4 className="font-bold text-gray-900 mb-3 text-center">Même Groupe - Plus d'Heures:</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>9 étudiants × 120 TND</span>
                    <span className="font-medium">1,080 TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heures/mois travaillées</span>
                    <span className="font-medium">16h/mois</span>
                  </div>
                  <div className="text-sm font-semibold text-green-700 text-center mt-3 bg-green-50 rounded-lg p-2 border border-green-200">
                    32.6 TND/heure net - Après la déduction de nos frais mensuels
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Revenus variables:</span>
                  <span className="font-bold text-green-600">Selon vos efforts</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Contrôle tarifs:</span>
                  <span className="text-green-600">✅ Total</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Environnement:</span>
                  <span className="text-green-600">Premium & confortable</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Évolution:</span>
                  <span className="text-green-600">Progressive et méritée</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Revenue Examples Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Exemples Réels du Simulateur de Revenus
            </h2>
            <p className="text-xl text-gray-600">
              Calculs réels incluant frais de salle et TVA - Protection 12 TND/heure garantie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {revenueExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${example.color} flex items-center justify-center`}>
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{example.title}</h3>
                <div className="text-sm text-gray-500 mb-4">{example.subtitle}</div>

                <div className="text-2xl font-bold text-blue-600 mb-2">{example.netIncome}</div>
                <div className="text-lg font-semibold text-green-600 mb-3">{example.hourlyRate}</div>
                <div className="text-sm text-gray-600">{example.description}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              "Votre minimum est 12 TND/heure avec notre support. Et ce n'est qu'un début !"
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/revenue-simulator">
                <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                  <Calculator className="w-6 h-6 mr-3" />
                  Tester le Simulateur de Revenus
                </button>
              </Link>
              <Link to="/register/teacher">
                <button className="inline-flex items-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                  <UserPlus className="w-6 h-6 mr-3" />
                  Rejoindre Maintenant
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Potential Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Votre Potentiel de Croissance
            </h2>
            <p className="text-xl text-gray-600">
              Avec un enseignement de qualité, développez progressivement votre activité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {growthScenarios.map((scenario, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">{scenario.students}</div>
                <div className="text-2xl font-semibold text-gray-900 mb-2">{scenario.revenue}</div>
                <div className="text-lg font-medium text-green-600 mb-2">{scenario.hourlyRate}</div>
                <div className="text-sm text-purple-600 font-semibold">{scenario.multiplier}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vous N'Êtes PAS Seul
            </h2>
            <p className="text-xl text-gray-600">
              SmartHub vous accompagne dans votre transition vers l'indépendance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Protection Financière</h3>
              <p className="text-gray-600 mb-4">
                Jusqu'à 35% de réduction sur nos services + garantie 12 TND/heure minimum
              </p>
              <div className="text-green-600 font-semibold">Transition sécurisée</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Marketing Partagé</h3>
              <p className="text-gray-600 mb-4">
                Notre réseau attire des étudiants de qualité directement vers vous
              </p>
              <div className="text-blue-600 font-semibold">Clientèle assurée</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Support Complet</h3>
              <p className="text-gray-600 mb-4">
                Vous enseignez, nous gérons infrastructure, administration, et outils
              </p>
              <div className="text-purple-600 font-semibold">Concentrez-vous sur l'enseignement</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Arguments Convaincants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">❓ Pourquoi changer ?</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Pourquoi accepter le même salaire qu'un collègue moins performant ?</li>
                  <li>• Pourquoi demander la permission pour vos vacances ?</li>
                  <li>• Pourquoi limiter vos rêves financiers ?</li>
                  <li>• Pourquoi dépendre d'un patron qui peut vous licencier ?</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">✅ Avec SmartHub :</h4>
                <ul className="space-y-2 text-green-600">
                  <li>• Vos compétences méritent une rémunération juste et évolutive</li>
                  <li>• Vos horaires = VOS décisions</li>
                  <li>• Votre valeur définie par vos étudiants, pas un RH</li>
                  <li>• Votre propre clientèle fidèle = sécurité réelle</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link to="/register/teacher">
                <button className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white text-xl font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <UserPlus className="w-8 h-8 mr-4" />
                  Commencer Mon Activité Indépendante
                </button>
              </Link>
              <p className="text-gray-600 mt-3 text-sm">
                Évaluation gratuite • Support personnalisé • Démarrage immédiat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à Découvrir une Meilleure Alternative ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez SmartHub et développez votre activité d'enseignement indépendante.
            Infrastructure professionnelle, support complet, revenus évolutifs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/revenue-simulator">
              <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                <Calculator className="w-6 h-6 mr-3" />
                Simulateur de Revenus
              </button>
            </Link>


            <Link to="/register/teacher">
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-semibold rounded-lg transition-all duration-300">
                <UserPlus className="w-6 h-6 mr-3" />
                Rejoindre SmartHub
              </button>
            </Link>
          </div>

          <p className="text-sm text-blue-200">
            ✓ Évaluation gratuite de votre profil • ✓ Support pour définir vos tarifs • ✓ Accès aux outils de gestion
          </p>
        </div>
      </section>
    </div>
  );
};

export default TeacherEntrepreneurship;