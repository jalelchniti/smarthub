import { Home, Heart, Users, Lightbulb, Shield, Handshake, Building, Camera, UserCheck, Check, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OurMission = () => {
  const dualMission = [
    {
      icon: Users,
      title: "Pour les Enseignants",
      subtitle: "Votre Dignité Professionnelle",
      concept: "Un environnement premium qui valorise votre expertise",
      benefits: [
        "Espaces conçus pour rehausser votre prestige professionnel",
        "Transition vers un environnement qui reflète votre valeur",
        "Cadre moderne qui inspire le respect de vos étudiants"
      ]
    },
    {
      icon: Heart,
      title: "Pour Parents & Étudiants",
      subtitle: "Votre Sérénité & Votre Réussite",
      concept: "Un environnement premium et sécurisé pour l'excellence académique",
      benefits: [
        "Environnement sécurisé avec surveillance et conciergerie (8h-18h)",
        "Enseignants compétents dédiés à votre mission de tutorat"
      ]
    }
  ];

  const educationalMissionLevels = [
    {
      type: "Accompagnement Remédial",
      target: "Étudiants en difficulté",
      goal: "Surmonter les obstacles d'apprentissage",
      vitalIndicator: "Les nouvelles notes obtenues à l'école",
      approach: [
        "Diagnostic personnalisé des difficultés",
        "Stratégies d'apprentissage adaptées",
        "Suivi régulier des progrès scolaires"
      ]
    },
    {
      type: "Accompagnement d'Excellence",
      target: "Étudiants performants",
      goals: ["Maintenir le niveau actuel", "Atteindre l'excellence"],
      approach: [
        "Approfondissement des connaissances",
        "Développement des compétences avancées",
        "Préparation aux défis académiques futurs"
      ]
    }
  ];

  const competentTeachers = {
    message: "Enseignants sélectionnés pour leur compétence et leur engagement à accomplir leur mission de tutorat de la meilleure façon possible",
    qualities: [
      { icon: "🎓", title: "Expertise Pédagogique" },
      { icon: "❤️", title: "Engagement Personnel" },
      { icon: "📈", title: "Résultats Mesurables" }
    ]
  };

  const securityFeatures = [
    {
      feature: "Bâtiment Sécurisé",
      description: "Notre établissement fait partie d'un bâtiment sécurisé avec un accès contrôlé et des mesures de sécurité modernes",
      icon: Building
    },
    {
      feature: "Surveillance 24/7",
      description: "Système de caméras de surveillance pour assurer la sécurité et la protection de tous nos utilisateurs",
      icon: Camera
    },
    {
      feature: "Conciergerie",
      description: "Service de conciergerie disponible de 8h00 à 18h00 pour votre assistance et votre sécurité",
      icon: UserCheck
    }
  ];

  const innovativeApproach = {
    title: "Une Approche Innovante de l'Hospitalité Éducative",
    subtitle: "Au-delà de la Location d'Espace",
    concepts: [
      {
        principle: "L'Écoute Active",
        description: "Nous comprenons d'abord vos besoins avant de proposer des solutions"
      },
      {
        principle: "L'Adaptabilité",
        description: "Nos espaces s'adaptent à votre style d'enseignement unique"
      },
      {
        principle: "Le Partenariat",
        description: "Nous sommes vos partenaires dans la création d'expériences éducatives exceptionnelles"
      }
    ]
  };

  const paymentPhilosophy = {
    title: "Un Système de Paiement Centré sur Vous",
    subtitle: "Votre Vision Financière, Notre Innovation",
    philosophy: "Tout commence par vos attentes financières personnelles",
    approach: [
      {
        step: "Votre Objectif",
        description: "Vous définissez vos aspirations financières horaires et mensuelles"
      },
      {
        step: "Votre Choix",
        description: "Vous décidez du nombre d'étudiants que vous souhaitez accompagner"
      },
      {
        step: "Notre Innovation",
        description: "Nous créons un système qui respecte vos exigences tout en s'adaptant aux budgets parentaux"
      }
    ],
    principle: "Votre satisfaction financière guide notre créativité systémique"
  };

  const communityValues = [
    {
      icon: Shield,
      title: "Sécurité & Protection",
      description: "Bâtiment sécurisé avec caméras et conciergerie de 8h à 18h pour votre tranquillité d'esprit"
    },
    {
      icon: Heart,
      title: "Bienveillance Éducative",
      description: "Chaque interaction est guidée par la bienveillance envers enseignants et étudiants"
    },
    {
      icon: Lightbulb,
      title: "Innovation Continue",
      description: "Nous réinventons constamment l'expérience éducative"
    },
    {
      icon: Handshake,
      title: "Partenariat Authentique",
      description: "Nous sommes vos alliés dans la réussite éducative"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 1. Hero Section - Who We Are */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="p-6 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm">
              <Home className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Notre Mission
            <span className="block text-2xl md:text-3xl font-normal mt-2 text-blue-100">
              Centre de Formation & Tutorat Académique
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-4xl mx-auto">
            SmartHub est un centre de formation et de tutorat académique dédié à l'excellence éducative.
            Nous accompagnons étudiants, adultes et enseignants dans leur développement avec des programmes
            de qualité, du soutien scolaire à la Formation des Formateurs.
          </p>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 inline-block border border-white border-opacity-20">
            <div className="flex items-center justify-center space-x-4">
              <Heart className="w-8 h-8 text-pink-300" />
              <span className="text-xl font-semibold text-pink-300">Formation</span>
              <span className="text-lg text-blue-100">+</span>
              <span className="text-xl font-semibold text-yellow-300">Tutorat</span>
              <span className="text-lg text-blue-100">+</span>
              <span className="text-xl font-semibold text-orange-300">Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Dual Mission - Teachers & Parents/Students */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Mission à Double Service
            </h2>
            <p className="text-xl text-gray-600">
              Nous servons les enseignants ET les parents/étudiants avec la même excellence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dualMission.map((mission, index) => {
              const IconComponent = mission.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mr-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{mission.title}</h3>
                      <p className="text-lg text-blue-600 font-semibold">{mission.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 text-lg">{mission.concept}</p>

                  <div className="space-y-3">
                    {mission.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Teacher Dignity & Professional Respect */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rehausser le Respect Envers les Enseignants
            </h2>
            <p className="text-xl text-gray-600">
              Une Transition Vers la Dignité Professionnelle
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-2xl font-bold text-blue-600 mb-4">
                "Chaque enseignant mérite un environnement à la hauteur de son expertise"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <h4 className="font-bold text-red-800 mb-3">Avant</h4>
                <p className="text-gray-700">Environnements modestes et inadéquats</p>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="w-12 h-12 text-blue-600" />
              </div>

              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <h4 className="font-bold text-green-800 mb-3">Avec SmartHub</h4>
                <p className="text-gray-700">Espaces professionnels qui inspirent le respect</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-xl font-semibold text-purple-600">
                "Quand l'environnement change, la perception change"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Educational Mission Levels - Remedial + Excellence */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Niveaux de Mission Éducative
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {educationalMissionLevels.map((level, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-indigo-600 mb-4">{level.type}</h3>
                <div className="mb-6">
                  <p className="text-gray-700 mb-2"><strong>Public cible:</strong> {level.target}</p>
                  <p className="text-gray-700 mb-2">
                    <strong>Objectif:</strong> {level.goal || level.goals?.join(" & ")}
                  </p>
                  {level.vitalIndicator && (
                    <p className="text-green-600 font-semibold">
                      <strong>Indicateur vital:</strong> {level.vitalIndicator}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Notre approche:</h4>
                  {level.approach.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Competent Teachers Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Enseignants Compétents & Engagés
              </h3>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {competentTeachers.message}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {competentTeachers.qualities.map((quality, index) => (
                <div key={index} className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                  <div className="text-4xl mb-3">{quality.icon}</div>
                  <h4 className="font-bold text-gray-900">{quality.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Security & Premium Environment */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sécurité & Environnement Premium
            </h2>
            <p className="text-xl text-gray-600">
              Votre tranquillité d'esprit est notre priorité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.feature}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200 max-w-2xl mx-auto">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Tranquillité d'Esprit Garantie
              </h3>
              <p className="text-green-700 text-lg">
                Parents, soyez rassurés : vos enfants évoluent dans un environnement sécurisé
                avec surveillance professionnelle et assistance continue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Innovation in Educational Hosting */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Lightbulb className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {innovativeApproach.title}
            </h2>
            <p className="text-xl text-gray-600">
              {innovativeApproach.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {innovativeApproach.concepts.map((concept, index) => (
              <div key={index} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 shadow-lg text-center">
                <h3 className="text-2xl font-bold text-orange-600 mb-4">{concept.principle}</h3>
                <p className="text-gray-700 leading-relaxed">{concept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Flexible Payment Philosophy */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Handshake className="w-16 h-16 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {paymentPhilosophy.title}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-4">
              {paymentPhilosophy.subtitle}
            </p>
            <p className="text-lg text-gray-700">
              {paymentPhilosophy.philosophy}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {paymentPhilosophy.approach.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.step}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-xl font-bold text-purple-800">
                "{paymentPhilosophy.principle}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Community Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Valeurs Communautaires
            </h2>
            <p className="text-xl text-gray-600">
              Les principes qui guident chacune de nos actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Call to Experience */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Découvrez Notre Espace Éducatif
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Visitez SmartHub et découvrez comment nous créons des expériences éducatives
            exceptionnelles dans un environnement sécurisé et bienveillant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/formations">
              <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl">
                <Building className="w-6 h-6 mr-3" />
                Nos Formations
              </button>
            </Link>

            <a
              href="https://wa.me/21699456059?text=Bonjour,%20je%20souhaite%20en%20savoir%20plus%20sur%20vos%20programmes%20de%20formation."
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg font-semibold rounded-lg transition-all duration-300">
                <Phone className="w-6 h-6 mr-3" />
                Nous Contacter
              </button>
            </a>
          </div>

          <p className="text-sm text-blue-200">
            ✓ Visite gratuite de nos installations • ✓ Rencontre avec notre équipe • ✓ Découverte de notre approche éducative
          </p>
        </div>
      </section>
    </div>
  );
};

export default OurMission;