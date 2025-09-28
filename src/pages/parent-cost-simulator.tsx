import { useState, useEffect } from 'react';
import { Calculator, Users, Clock, DollarSign, BookOpen, CheckCircle, AlertTriangle, Building, Heart } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const ParentCostCalculator = () => {
  const [formData, setFormData] = useState({
    teacherHourlyRate: 15,
    sessionHours: 2,
    sessionsPerWeek: 2,
    groupSize: 6,
    roomPreference: '2'
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Room data matching ELMAOUIA's facilities
  const rooms = {
    '1': {
      name: 'Salle Premium (15 places)',
      capacity: 15,
      equipment: 'Projecteur Interactif, Climatisation, WiFi Premium',
      pricing: [
        { min: 1, max: 1, rate: 20 },
        { min: 2, max: 6, rate: 25 },
        { min: 7, max: 9, rate: 30 },
        { min: 10, max: 15, rate: 35 }
      ]
    },
    '2': {
      name: 'Salle Standard (9 places)',
      capacity: 9,
      equipment: 'Tableau Blanc, Climatisation, WiFi',
      pricing: [
        { min: 1, max: 1, rate: 15 },
        { min: 2, max: 7, rate: 20 },
        { min: 8, max: 9, rate: 25 }
      ]
    },
    '3': {
      name: 'Salle Standard (9 places)',
      capacity: 9,
      equipment: 'Tableau Blanc, Climatisation, WiFi',
      pricing: [
        { min: 1, max: 1, rate: 15 },
        { min: 2, max: 7, rate: 20 },
        { min: 8, max: 9, rate: 25 }
      ]
    }
  };

  // Get room rate based on group size
  const getRoomRate = (roomId: string, groupSize: number) => {
    const room = rooms[roomId as keyof typeof rooms];
    if (!room) return 0;
    
    const tier = room.pricing.find((p: any) => groupSize >= p.min && groupSize <= p.max);
    return tier ? tier.rate : 0;
  };

  // Calculate parent costs
  const calculateParentCosts = () => {
    const { teacherHourlyRate, sessionHours, sessionsPerWeek, groupSize, roomPreference } = formData;
    
    const selectedRoom = rooms[roomPreference as keyof typeof rooms];
    if (groupSize > selectedRoom.capacity) {
      return { error: `Capacité dépassée! La ${selectedRoom.name} ne peut accueillir que ${selectedRoom.capacity} étudiants.` };
    }

    // Basic calculations
    const weeklyHours = sessionHours * sessionsPerWeek;
    const monthlyHours = weeklyHours * 4;
    const roomRateHTVA = getRoomRate(roomPreference, groupSize);
    
    // Teacher income calculation
    const monthlyTeacherIncome = teacherHourlyRate * monthlyHours;
    
    // Room costs (with VAT)
    const monthlyRoomCostHTVA = roomRateHTVA * monthlyHours;
    const monthlyRoomCostTTC = monthlyRoomCostHTVA * 1.19;
    
    // Total monthly cost to be shared among students
    const totalMonthlyCost = monthlyTeacherIncome + monthlyRoomCostTTC;
    
    // Cost per student per month
    const costPerStudentMonthly = totalMonthlyCost / groupSize;
    
    // Cost per student per session
    const sessionsPerMonth = sessionsPerWeek * 4;
    const costPerStudentSession = costPerStudentMonthly / sessionsPerMonth;
    
    // Cost per student per hour
    const costPerStudentHour = costPerStudentMonthly / monthlyHours;

    // Protection analysis (if teacher rate is below 12 TND/hour)
    let protectionApplied = false;
    let discountPercentage = 0;
    let discountAmount = 0;
    let finalRoomCost = monthlyRoomCostTTC;
    let finalCostPerStudent = costPerStudentMonthly;

    if (teacherHourlyRate < 12) {
      const targetTeacherIncome = 12 * monthlyHours;
      const requiredRoomCost = (totalMonthlyCost - targetTeacherIncome);
      const maxDiscount = monthlyRoomCostTTC * 0.35;
      
      if ((monthlyRoomCostTTC - requiredRoomCost) <= maxDiscount) {
        protectionApplied = true;
        discountAmount = monthlyRoomCostTTC - requiredRoomCost;
        discountPercentage = (discountAmount / monthlyRoomCostTTC) * 100;
        finalRoomCost = requiredRoomCost;
        
        const adjustedTotalCost = targetTeacherIncome + finalRoomCost;
        finalCostPerStudent = adjustedTotalCost / groupSize;
      }
    }

    return {
      teacherHourlyRate,
      monthlyTeacherIncome,
      roomRateHTVA,
      monthlyRoomCostHTVA,
      monthlyRoomCostTTC,
      totalMonthlyCost,
      costPerStudentMonthly,
      costPerStudentSession,
      costPerStudentHour,
      monthlyHours,
      weeklyHours,
      sessionsPerMonth,
      selectedRoom,
      protectionApplied,
      discountPercentage,
      discountAmount,
      finalRoomCost,
      finalCostPerStudent: protectionApplied ? finalCostPerStudent : costPerStudentMonthly
    };
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} TND`;
  };

  // Handle form changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate results when form changes
  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const calculation = calculateParentCosts();
      setResults(calculation);
      setIsCalculating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <main className="max-w-6xl mx-auto p-6">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Simulateur de Coûts pour Parents</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez combien vous paierez mensuellement selon le tarif horaire choisi par votre enseignant.
            Transparence totale dans notre écosystème éducatif.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Paramètres du Cours</h2>
          </div>

          <div className="space-y-6">
            {/* Teacher Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Tarif Horaire de l'Enseignant
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="1"
                  value={formData.teacherHourlyRate}
                  onChange={(e) => handleInputChange('teacherHourlyRate', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold min-w-[80px] text-center">
                  {formData.teacherHourlyRate} TND/h
                </span>
              </div>
              {formData.teacherHourlyRate < 12 && (
                <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  Protection ELMAOUIA activée (minimum 12 TND/h garanti)
                </p>
              )}
            </div>

            {/* Session Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Durée par Séance
              </label>
              <select
                value={formData.sessionHours}
                onChange={(e) => handleInputChange('sessionHours', parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 heure</option>
                <option value={1.5}>1h30</option>
                <option value={2}>2 heures</option>
                <option value={2.5}>2h30</option>
                <option value={3}>3 heures</option>
              </select>
            </div>

            {/* Sessions per Week */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Séances par Semaine
              </label>
              <select
                value={formData.sessionsPerWeek}
                onChange={(e) => handleInputChange('sessionsPerWeek', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 séance</option>
                <option value={2}>2 séances</option>
                <option value={3}>3 séances</option>
                <option value={4}>4 séances</option>
              </select>
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Taille du Groupe
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max={rooms[formData.roomPreference as keyof typeof rooms].capacity}
                  value={formData.groupSize}
                  onChange={(e) => handleInputChange('groupSize', parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-semibold min-w-[60px] text-center">
                  {formData.groupSize}
                </span>
              </div>
            </div>

            {/* Room Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Choix de Salle
              </label>
              <select
                value={formData.roomPreference}
                onChange={(e) => handleInputChange('roomPreference', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(rooms).map(([id, room]) => (
                  <option key={id} value={id}>
                    {room.name} - {room.equipment}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">Coût pour les Parents</h2>
          </div>

          {isCalculating ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : results?.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{results.error}</span>
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Main Cost Display */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Coût Mensuel par Étudiant</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {formatCurrency(results.finalCostPerStudent)}
                </div>
                <p className="text-sm text-gray-600">
                  Pour {results.monthlyHours}h de cours par mois ({results.sessionsPerMonth} séances)
                </p>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Répartition des Coûts</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Honoraires enseignant</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(results.monthlyTeacherIncome / results.groupSize)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Frais de salle (part/étudiant)</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(results.finalRoomCost / results.groupSize)}
                    </span>
                  </div>

                  {results.protectionApplied && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-green-600 flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        Réduction ELMAOUIA
                      </span>
                      <span className="font-semibold text-green-600">
                        -{formatCurrency(results.discountAmount / results.groupSize)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-3 bg-white rounded-lg px-3">
                    <span className="font-semibold text-gray-800">Total par étudiant</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(results.finalCostPerStudent)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Cost Breakdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-blue-800 mb-1">Par Séance</h4>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(results.finalCostPerStudent / results.sessionsPerMonth)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-purple-800 mb-1">Par Heure</h4>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(results.finalCostPerStudent / results.monthlyHours)}
                  </p>
                </div>
              </div>

              {/* Room Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Détails de la Salle</h4>
                <p className="text-sm text-gray-600 mb-1">{results.selectedRoom.name}</p>
                <p className="text-xs text-gray-500">{results.selectedRoom.equipment}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Tarif salle: {formatCurrency(results.roomRateHTVA)}/heure (HT)
                </p>
              </div>

              {/* Teacher Protection Info */}
              {results.protectionApplied && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Protection Enseignant Activée</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    ELMAOUIA garantit un minimum de 12 TND/heure à votre enseignant en appliquant 
                    une réduction de {results.discountPercentage.toFixed(1)}% sur les frais de salle.
                  </p>
                </div>
              )}

              {/* Call to Action */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-blue-800 mb-2">Prêt à Commencer?</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Contactez ELMAOUIA pour réserver votre place dans ce groupe d'apprentissage.
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Réserver Maintenant
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      </main>
      <Footer />
    </div>
  );
};

export default ParentCostCalculator;